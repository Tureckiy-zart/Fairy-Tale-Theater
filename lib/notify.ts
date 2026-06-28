// Lead notification + durable persistence — SERVER ONLY (imports the Mongo store and
// node:fs, and reads secrets via lib/env). Never import this from a "use client" module.
//
// Delivery model (in order):
//   1. Persist to MongoDB Atlas FIRST — the production system of record. A stored lead
//      survives any notification failure.
//   2. Email the owner via a provider-agnostic webhook (primary notification AND the
//      emergency fallback record when MongoDB is down).
//   3. Optionally send a FULL Telegram alert (secondary), if configured — every field
//      the visitor filled, so the owner can act from the chat without DB access.
//   4. Optionally append the lead as a row to a Google Sheet (secondary cloud record),
//      if configured — a browsable cloud log for the owner.
//   5. Patch the stored lead's notificationStatus (best-effort; never flips acceptance).
//
// Acceptance rule (the route's honest client signal):
//   accepted = mongo.status === "ok" || email.status === "ok"
// Telegram and Google Sheets are NEVER acceptance signals. A best-effort local file (dev
// only) is NEVER an acceptance signal in production either — see writeDevCopy.
import { mkdir, writeFile } from "node:fs/promises";
import { join, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { env } from "./env";
import { formatLeadSummary, formatLeadTelegram, toSheetRow, toStoredLead, type Lead } from "./leads";
import { storeLead, updateNotificationStatus } from "./leadStore";

export interface DeliveryResult {
  /** True once the lead is durably accepted (MongoDB stored OR owner email delivered). */
  accepted: boolean;
  /** Per-channel outcomes for operator observability (no PII). */
  channels: {
    store: ChannelOutcome;
    email: ChannelOutcome;
    telegram: ChannelOutcome;
    sheets: ChannelOutcome;
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
 * `duplicate` is true only for an idempotent retry of the SAME submissionId already in
 * MongoDB; the orchestrator uses it to suppress a second round of secondary deliveries.
 */
async function persist(lead: Lead): Promise<{ outcome: ChannelOutcome; duplicate: boolean }> {
  if (!env.mongodbUri) return { outcome: await writeDevCopy(lead), duplicate: false };
  const outcome = await storeLead(toStoredLead(lead));
  if (outcome.status === "ok") return { outcome: { status: "ok" }, duplicate: outcome.duplicate };
  return { outcome: { status: "error", reason: outcome.reason }, duplicate: false };
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

/**
 * Optional FULL Telegram alert (secondary). Skipped unless both env vars set. Sends every
 * field the visitor filled (id, type, date, time, city, name, phone, email, children,
 * show, notes, source) so the owner can act straight from the chat — she has no DB access
 * and needs none. This goes ONLY to the owner's private bot/chat (a closed channel), so
 * the contact details never leave the owner's own notification surface. PII still never
 * enters logs or the DeliveryResult — only the HTTP status is recorded.
 */
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
        text: formatLeadTelegram(lead),
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
 * Optional Google Sheets append (secondary cloud record). Skipped unless the webhook URL
 * is set. POSTs the flat lead row to a deployed Apps Script Web App (or any endpoint that
 * accepts {token?, lead}) which appends one spreadsheet row — a browsable cloud log for
 * the owner. NEVER an acceptance signal. Apps Script web apps answer with a 302 to
 * script.googleusercontent.com, so follow redirects.
 *
 * Success is asserted in DEPTH, not just by HTTP status: the response must be 2xx AND
 * parse as JSON AND carry `ok === true`. A non-2xx, an `ok:false`, malformed JSON, a
 * timeout, an abort or a network rejection all map to "error" so a silently-rejected
 * append (e.g. bad token) is never mistaken for success. A server-side `duplicate:true`
 * (the Apps Script deduped by submissionId) is an idempotent "ok". No PII, no webhook
 * URL, no token, and no response body is ever logged — only the coarse status.
 */
async function appendToSheet(lead: Lead): Promise<ChannelOutcome> {
  const url = env.leadSheetsWebhookUrl;
  if (!url) return { status: "skipped", reason: "Google Sheets not configured" };
  try {
    const body: Record<string, unknown> = { lead: toSheetRow(lead) };
    if (env.leadSheetsWebhookToken) body.token = env.leadSheetsWebhookToken;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: "error", reason: `sheets HTTP ${res.status}` };
    let parsed: { ok?: unknown; duplicate?: unknown };
    try {
      parsed = (await res.json()) as { ok?: unknown; duplicate?: unknown };
    } catch {
      // 2xx but the body wasn't the JSON contract — treat as a failed append.
      return { status: "error", reason: "sheets malformed response" };
    }
    if (parsed?.ok !== true) return { status: "error", reason: "sheets rejected" };
    return { status: "ok" }; // includes duplicate:true — an idempotent, accepted append
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
  const { outcome: store, duplicate } = await persist(lead);

  // Idempotent retry of the SAME submissionId: the original submission already created
  // the one MongoDB document AND fired every secondary channel. Re-sending now would
  // produce a duplicate Telegram message, a duplicate Sheet row and a duplicate email,
  // so we suppress all of them and return a safe success — the lead is already durable
  // (store.status === "ok"), and we never re-patch the first submission's statuses.
  if (store.status === "ok" && duplicate) {
    const skipped: ChannelOutcome = { status: "skipped", reason: "duplicate submission" };
    return { accepted: true, channels: { store, email: skipped, telegram: skipped, sheets: skipped } };
  }

  const [email, telegram, sheets] = await Promise.all([
    emailOwner(lead),
    telegramAlert(lead),
    appendToSheet(lead),
  ]);
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
        sheets: channelStatus(sheets),
        lastAttemptAt: new Date().toISOString(),
      },
      new Date().toISOString(),
    ).catch(() => {
      /* swallow — observability only, never a user-facing failure */
    });
  }

  return { accepted, channels: { store, email, telegram, sheets } };
}

function errText(err: unknown): string {
  if (err instanceof Error) return err.name === "AbortError" || err.name === "TimeoutError" ? "timeout" : err.name;
  return "unknown error";
}
