// Lead notification + durable persistence — SERVER ONLY (imports the Mongo store and
// node:fs, and reads secrets via lib/env). Never import this from a "use client" module.
//
// Delivery model (in order):
//   1. Persist to MongoDB Atlas FIRST — the production system of record. A stored lead
//      survives any notification failure.
//   2. Email the owner via a provider-agnostic webhook (primary notification AND the
//      emergency fallback record when MongoDB is down).
//   3. Optionally send a short Telegram alert (secondary), if configured.
//   4. Patch the stored lead's notificationStatus (best-effort; never flips acceptance).
//
// Acceptance rule (the route's honest client signal):
//   accepted = mongo.status === "ok" || email.status === "ok"
// Telegram is NEVER an acceptance signal. A best-effort local file (dev only) is NEVER
// an acceptance signal in production either — see writeDevCopy.
import { mkdir, writeFile } from "node:fs/promises";
import { join, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { env } from "./env";
import { formatLeadSummary, toStoredLead, type Lead } from "./leads";
import { storeLead, updateNotificationStatus } from "./leadStore";

export interface DeliveryResult {
  /** True once the lead is durably accepted (MongoDB stored OR owner email delivered). */
  accepted: boolean;
  /** Per-channel outcomes for operator observability (no PII). */
  channels: {
    store: ChannelOutcome;
    email: ChannelOutcome;
    telegram: ChannelOutcome;
  };
}

type ChannelOutcome =
  | { status: "ok" }
  | { status: "skipped"; reason: string }
  | { status: "error"; reason: string };

/** Map an email/telegram outcome to the stored ChannelStatus. */
function channelStatus(o: ChannelOutcome): "ok" | "error" | "skipped" {
  return o.status;
}

/**
 * DEV-ONLY local copy of the lead, used ONLY when MONGODB_URI is unset (local dev / e2e
 * against a real local disk — never Vercel, where the URI is always configured). On a
 * real disk this is genuinely durable, so it is a legitimate acceptance signal IN DEV.
 * It can NEVER make PRODUCTION return success because production always has MONGODB_URI
 * set, so this branch is never reached there. On a read-only FS the write fails → error.
 */
async function writeDevCopy(lead: Lead): Promise<ChannelOutcome> {
  const dir = env.leadStoreDir;
  const primary = isAbsolute(dir) ? dir : join(process.cwd(), dir);
  const candidates = primary === join(tmpdir(), "ml-leads") ? [primary] : [primary, join(tmpdir(), "ml-leads")];
  const base = `${lead.receivedAt.slice(0, 10)}_${lead.id}`;
  const body = JSON.stringify(toStoredLead(lead), null, 2);
  let reason = "no writable dev store dir";
  for (const d of candidates) {
    try {
      await mkdir(d, { recursive: true });
      for (let attempt = 0; attempt < 5; attempt++) {
        const name = attempt === 0 ? base : `${base}-${attempt}`;
        try {
          await writeFile(join(d, `${name}.json`), body, { encoding: "utf8", flag: "wx" });
          return { status: "ok" };
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code === "EEXIST") continue; // id collision → suffix
          throw err; // dir-level failure (read-only FS) → next candidate
        }
      }
    } catch {
      reason = "dev store write failed";
    }
  }
  return { status: "error", reason };
}

/**
 * Persist to the durable store. PRODUCTION authority is MongoDB Atlas. Only when
 * MONGODB_URI is unset (local dev / e2e) do we fall back to a real local-disk copy as
 * the store record — a path production never takes because the URI is always set there.
 */
async function persist(lead: Lead): Promise<ChannelOutcome> {
  if (!env.mongodbUri) return writeDevCopy(lead);
  const outcome = await storeLead(toStoredLead(lead));
  if (outcome.status === "ok") return { status: "ok" };
  return { status: "error", reason: outcome.reason };
}

/** POST {to, subject, text} to the provider-agnostic email webhook. */
async function emailOwner(lead: Lead): Promise<ChannelOutcome> {
  const url = env.leadEmailWebhookUrl;
  if (!url) return { status: "skipped", reason: "LEAD_EMAIL_WEBHOOK_URL not set" };
  try {
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (env.leadEmailWebhookToken) headers.authorization = `Bearer ${env.leadEmailWebhookToken}`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        to: env.leadNotifyEmail,
        subject: `New booking inquiry — ${lead.id} — ${lead.eventType}`,
        text: formatLeadSummary(lead),
      }),
      // Don't hang the request if the provider is slow.
      signal: AbortSignal.timeout(8000),
    });
    // A provider error body may echo PII — record the status only, never the body.
    if (!res.ok) return { status: "error", reason: `email webhook HTTP ${res.status}` };
    return { status: "ok" };
  } catch (err) {
    return { status: "error", reason: errText(err) };
  }
}

/** Optional short Telegram alert (secondary). Skipped unless both env vars set. No PII:
 *  only the inquiry id, event type, date, and city — never name/phone/email/notes. */
async function telegramAlert(lead: Lead): Promise<ChannelOutcome> {
  const token = env.telegramBotToken;
  const chatId = env.telegramChatId;
  if (!token || !chatId) return { status: "skipped", reason: "Telegram not configured" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: [
          "🎭 New booking inquiry",
          "",
          `ID: ${lead.id}`,
          `Type: ${lead.eventType}`,
          `Date: ${lead.date}`,
          `City: ${lead.city}`,
          "",
          `Full details are in email (${env.leadNotifyEmail}).`,
        ].join("\n"),
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: "error", reason: `telegram HTTP ${res.status}` };
    return { status: "ok" };
  } catch (err) {
    return { status: "error", reason: errText(err) };
  }
}

/**
 * Persist + notify. The lead is ACCEPTED when it is durably stored in MongoDB OR the
 * owner email was delivered (the emergency fallback record). MongoDB is the primary
 * recovery store; when it is down, a delivered email is an acceptable record so a real
 * inquiry is never rejected. Only when BOTH fail do we reject (honestly). Email/Telegram
 * are attempted regardless and their outcomes returned for logging. After delivery, the
 * stored lead's notificationStatus is patched best-effort (a failed patch never changes
 * acceptance). This never throws — the caller inspects `accepted` to respond honestly.
 */
export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const store = await persist(lead);
  const [email, telegram] = await Promise.all([emailOwner(lead), telegramAlert(lead)]);
  const accepted = store.status === "ok" || email.status === "ok";

  // Patch notification statuses on the stored lead — only when it actually landed in
  // MongoDB (not the dev-file path, which has no document to update). Best-effort: a
  // failure here is observability only and never affects `accepted` — already durable.
  if (store.status === "ok" && env.mongodbUri) {
    await updateNotificationStatus(
      lead.id,
      {
        email: channelStatus(email),
        telegram: channelStatus(telegram),
        lastAttemptAt: new Date().toISOString(),
      },
      new Date().toISOString(),
    ).catch(() => {
      /* swallow — observability only, never a user-facing failure */
    });
  }

  return { accepted, channels: { store, email, telegram } };
}

function errText(err: unknown): string {
  if (err instanceof Error) return err.name === "AbortError" || err.name === "TimeoutError" ? "timeout" : err.name;
  return "unknown error";
}
