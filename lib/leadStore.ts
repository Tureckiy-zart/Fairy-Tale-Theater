// Durable lead store — MongoDB Atlas. SERVER ONLY (imports the mongodb driver and
// reads MONGODB_URI via lib/env). Never import this from a "use client" module.
//
// This is the production system of record for booking inquiries. Design goals:
//   1. ONE connection per serverless instance, cached on globalThis and reused across
//      requests/invocations (a fresh MongoClient per request exhausts Atlas pool
//      limits under load and adds cold-start latency on every call).
//   2. SELF-HEALING: a connection that fails to open is never cached as poison — the
//      rejected promise is cleared and the half-open client closed best-effort, so the
//      NEXT request reconnects instead of inheriting a dead client forever.
//   3. INSERT-ONLY + IDEMPOTENT: a unique index on submissionId means a double-click or
//      retry of the same submission yields one document; the duplicate is reported as
//      an idempotent success, not a second lead or an error.
//   4. NO PII IN LOGS: failures surface a short, field-free reason. We never log the
//      lead, the connection string, customer fields, or driver error payloads verbatim.
import { MongoClient, type Collection, type Db } from "mongodb";
import { env } from "./env";
import { makeInquiryId, type StoredLead, type NotificationStatus } from "./leads";

const DB_NAME = "misslana";
const COLLECTION = "leads";

/** How many times to regenerate a colliding inquiry id before giving up. With a 31^5
 *  id space an actual collision is astronomically rare, so a handful of retries makes a
 *  second collision effectively impossible while bounding the work. */
const MAX_ID_RETRIES = 5;

/** Outcome of a durable write. On success `id` is the id ACTUALLY stored (it may differ
 *  from the submitted id if a random-id collision forced a regenerate+retry), so the
 *  caller can keep notifications and the visitor-facing id in sync with the DB.
 *  `duplicate` is true ONLY for an idempotent retry of the same submissionId — never for
 *  a regenerated id collision (that is a fresh lead and must still notify). */
export type StoreOutcome =
  | { status: "ok"; duplicate: boolean; id: string }
  | { status: "error"; reason: string };

// --- Cached connection ------------------------------------------------------
// Cache the CONNECTING PROMISE (not the resolved client) so concurrent first
// requests share one connect, and a rejected attempt can be detected and cleared.
type GlobalWithMongo = typeof globalThis & {
  __mlMongo?: { client: MongoClient; promise: Promise<MongoClient> } | undefined;
};
const g = globalThis as GlobalWithMongo;

/**
 * Resolve a connected client, creating + caching one on first use. A failed connect
 * clears the cache (and closes the half-open client) so the next call retries cleanly
 * instead of reusing a poisoned promise. Throws on failure — callers wrap in try/catch.
 */
async function getClient(): Promise<MongoClient> {
  const uri = env.mongodbUri;
  if (!uri) throw new Error("MONGODB_URI not set");

  const cached = g.__mlMongo;
  if (cached) {
    try {
      return await cached.promise;
    } catch {
      // The cached connect rejected — drop it so we don't reuse a dead client, and
      // best-effort close anything half-open before reconnecting below.
      if (g.__mlMongo === cached) g.__mlMongo = undefined;
      try {
        await cached.client.close();
      } catch {
        /* already closed / never opened — ignore */
      }
    }
  }

  const client = new MongoClient(uri, {
    // Fail fast instead of hanging a serverless request when Atlas is unreachable.
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  const promise = client.connect();
  g.__mlMongo = { client, promise };
  try {
    return await promise;
  } catch (err) {
    // First connect failed — clear the cache so the next request reconnects.
    if (g.__mlMongo?.promise === promise) g.__mlMongo = undefined;
    try {
      await client.close();
    } catch {
      /* ignore */
    }
    throw err;
  }
}

function db(client: MongoClient): Db {
  return client.db(DB_NAME);
}

function collection(client: MongoClient): Collection<StoredLead> {
  return db(client).collection<StoredLead>(COLLECTION);
}

// --- Index management -------------------------------------------------------
// Ensure indexes once per process. createIndexes is idempotent (no-op if present),
// but we still guard with a flag so we don't issue it on every request.
let indexesEnsured = false;
async function ensureIndexes(client: MongoClient): Promise<void> {
  if (indexesEnsured) return;
  await collection(client).createIndexes([
    { key: { id: 1 }, name: "id_unique", unique: true },
    { key: { submissionId: 1 }, name: "submissionId_unique", unique: true },
    { key: { receivedAt: -1 }, name: "receivedAt_desc" },
    { key: { status: 1 }, name: "status_asc" },
  ]);
  indexesEnsured = true;
}

/** True for a MongoDB duplicate-key error (E11000), however the driver wraps it. */
function isDuplicateKey(err: unknown): boolean {
  const code = (err as { code?: number })?.code;
  if (code === 11000) return true;
  return err instanceof Error && /E11000|duplicate key/i.test(err.message);
}

/**
 * Which unique index a duplicate-key error came from. We must NOT assume every E11000 is
 * a submissionId retry: a fresh lead whose random `id` collides with an unrelated stored
 * lead is a DIFFERENT case (regenerate + retry, never suppress delivery). Prefer the
 * structured `keyPattern`/`keyValue` the driver attaches; fall back to the index name in
 * the message. submissionId is checked first so "submissionId_unique" never matches "id".
 */
function duplicateKeyField(err: unknown): "submissionId" | "id" | "other" {
  const e = err as { keyPattern?: Record<string, unknown>; keyValue?: Record<string, unknown> };
  const keys = [
    ...(e?.keyPattern ? Object.keys(e.keyPattern) : []),
    ...(e?.keyValue ? Object.keys(e.keyValue) : []),
  ];
  if (keys.includes("submissionId")) return "submissionId";
  if (keys.includes("id")) return "id";
  const msg = err instanceof Error ? err.message : "";
  if (/submissionId_unique|index:\s*submissionId/i.test(msg)) return "submissionId";
  if (/\bid_unique\b|index:\s*id_/i.test(msg)) return "id";
  return "other";
}

/** Default colliding-id regenerator (overridable in tests). */
function defaultRegenerateId(): string {
  return makeInquiryId(Math.random);
}

// --- Public API -------------------------------------------------------------

/**
 * Insert a lead. Insert-only, with two DISTINCT duplicate-key cases handled separately:
 *   - duplicate **submissionId** → a double-click/retry of the SAME submission → idempotent
 *     success (`duplicate: true`); the caller suppresses a second round of notifications.
 *   - duplicate **id** → a FRESH lead whose random ML-id happened to collide with an
 *     unrelated stored lead → we regenerate the id and retry so the lead is actually stored
 *     and still notified (`duplicate: false`, with the new `id`). It is NEVER reported as an
 *     idempotent success, which previously dropped the lead AND skipped fallback delivery.
 * An unknown unique index, or exhausted id retries, surfaces as an error (so the caller's
 * email fallback still runs) rather than a false success. Never throws.
 */
export async function storeLead(
  lead: StoredLead,
  regenerateId: () => string = defaultRegenerateId,
): Promise<StoreOutcome> {
  try {
    const client = await getClient();
    await ensureIndexes(client);
    const coll = collection(client);

    let doc: StoredLead = { ...lead };
    for (let attempt = 0; attempt <= MAX_ID_RETRIES; attempt++) {
      try {
        await coll.insertOne({ ...doc });
        return { status: "ok", duplicate: false, id: doc.id };
      } catch (err) {
        if (!isDuplicateKey(err)) throw err;
        const field = duplicateKeyField(err);
        if (field === "submissionId") {
          // Same submission already stored — idempotent; the original already notified.
          return { status: "ok", duplicate: true, id: doc.id };
        }
        if (field === "id" && attempt < MAX_ID_RETRIES) {
          // Random-id collision on a genuinely new lead — mint a new id and retry.
          doc = { ...doc, id: regenerateId() };
          continue;
        }
        // id retries exhausted, or a duplicate on some other unique index: do not pretend
        // this is an idempotent success (that would silently drop the lead).
        return { status: "error", reason: field === "id" ? "id collision" : "duplicate key" };
      }
    }
    // Loop always returns; this satisfies the type checker.
    return { status: "error", reason: "id collision" };
  } catch (err) {
    return { status: "error", reason: storeReason(err) };
  }
}

/**
 * Patch the notification statuses on an already-stored lead. Best-effort: a failure
 * here must NOT flip an accepted lead to a user-facing failure (the lead is already
 * durable) — the caller logs the id only and moves on. Updates only notificationStatus
 * + updatedAt; never touches the original customer fields.
 */
export async function updateNotificationStatus(
  id: string,
  notificationStatus: NotificationStatus,
  updatedAt: string,
): Promise<StoreOutcome> {
  try {
    const client = await getClient();
    await collection(client).updateOne(
      { id },
      { $set: { notificationStatus, updatedAt } },
    );
    return { status: "ok", duplicate: false, id };
  } catch (err) {
    return { status: "error", reason: storeReason(err) };
  }
}

/** A short, PII-free reason for logs. Driver messages can embed query fragments, so we
 *  map to coarse categories rather than echoing the raw message. */
function storeReason(err: unknown): string {
  if (err instanceof Error) {
    if (err.name === "MongoServerSelectionError") return "atlas unreachable";
    if (err.message === "MONGODB_URI not set") return "MONGODB_URI not set";
    if (/timed out|ETIMEDOUT|timeout/i.test(err.message)) return "timeout";
    if (/authentication|auth failed|bad auth/i.test(err.message)) return "auth failed";
    return err.name || "mongo error";
  }
  return "unknown error";
}

/**
 * Test-only: reset the cached client + index flag so each test starts cold. Never
 * called in production code paths. Closes any open client best-effort.
 */
export async function __resetForTests(): Promise<void> {
  indexesEnsured = false;
  const cached = g.__mlMongo;
  g.__mlMongo = undefined;
  if (cached) {
    try {
      await cached.client.close();
    } catch {
      /* ignore */
    }
  }
}
