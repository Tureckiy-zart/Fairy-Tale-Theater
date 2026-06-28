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
import type { StoredLead, NotificationStatus } from "./leads";

const DB_NAME = "misslana";
const COLLECTION = "leads";

/** Outcome of a durable write. `duplicate` distinguishes a fresh insert from an
 *  idempotent retry of the same submissionId — both are an accepted lead. */
export type StoreOutcome =
  | { status: "ok"; duplicate: boolean }
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

// --- Public API -------------------------------------------------------------

/**
 * Insert a lead. Insert-only: a duplicate submissionId (double-click/retry of the SAME
 * submission) is treated as an idempotent success, never a second lead. Never throws —
 * returns a structured outcome the caller maps to the acceptance decision.
 */
export async function storeLead(lead: StoredLead): Promise<StoreOutcome> {
  try {
    const client = await getClient();
    await ensureIndexes(client);
    await collection(client).insertOne({ ...lead });
    return { status: "ok", duplicate: false };
  } catch (err) {
    if (isDuplicateKey(err)) return { status: "ok", duplicate: true };
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
    return { status: "ok", duplicate: false };
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
