// Lead notification + durable persistence — SERVER ONLY (imports node:fs and reads
// secrets via lib/env). Never import this from a "use client" module.
//
// Delivery model (in order):
//   1. Persist a durable record to disk FIRST — the recovery guarantee. Even if
//      every provider is down/unconfigured, a valid lead is never silently lost.
//   2. Email the owner via a provider-agnostic webhook (primary notification).
//   3. Optionally send a short Telegram alert (secondary), if configured.
//
// The route uses `accepted` to decide the honest client response: a lead is
// ACCEPTED once it is durably persisted. Provider delivery is reported separately
// so the owner/operator can see failures (logged, no PII beyond the id) without the
// visitor ever seeing a false success — or a false failure for a recorded lead.
import { mkdir, writeFile } from "node:fs/promises";
import { join, isAbsolute } from "node:path";
import { tmpdir } from "node:os";
import { env } from "./env";
import { formatLeadSummary, type Lead } from "./leads";

export interface DeliveryResult {
  /** True once the lead is durably persisted (the acceptance signal). */
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

/**
 * Candidate store directories, in priority order. The configured/default dir is
 * primary; a temp dir is the fallback so a read-only/serverless app filesystem
 * (where `.leads` at cwd can't be written) still gets a best-effort local record.
 * On such hosts the durable record of last resort is the owner email (see deliverLead).
 */
function storeDirs(): string[] {
  const dir = env.leadStoreDir;
  const primary = isAbsolute(dir) ? dir : join(process.cwd(), dir);
  const fallback = join(tmpdir(), "ml-leads");
  return primary === fallback ? [primary] : [primary, fallback];
}

/**
 * Write the lead as one immutable JSON file per inquiry (flag "wx" = never overwrite).
 * Tries each candidate dir in order; within a dir, retries with a short suffix on the
 * astronomically rare id collision so a valid lead is never rejected for a name clash.
 * Returns ok/error (never throws).
 */
async function persist(lead: Lead): Promise<ChannelOutcome> {
  const base = `${lead.receivedAt.slice(0, 10)}_${lead.id}`;
  const body = JSON.stringify(lead, null, 2);
  let lastReason = "no writable store dir";
  for (const dir of storeDirs()) {
    try {
      await mkdir(dir, { recursive: true });
      for (let attempt = 0; attempt < 5; attempt++) {
        const name = attempt === 0 ? base : `${base}-${attempt}`;
        try {
          await writeFile(join(dir, `${name}.json`), body, { encoding: "utf8", flag: "wx" });
          return { status: "ok" };
        } catch (err) {
          if ((err as NodeJS.ErrnoException).code === "EEXIST") continue; // collision → next suffix
          throw err; // dir-level failure (e.g. read-only FS) → try next dir
        }
      }
      lastReason = "could not allocate a unique store file";
    } catch (err) {
      lastReason = errText(err);
    }
  }
  return { status: "error", reason: lastReason };
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
        subject: `New booking inquiry — ${lead.id} (${lead.eventType})`,
        text: formatLeadSummary(lead),
      }),
      // Don't hang the request if the provider is slow.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { status: "error", reason: `email webhook HTTP ${res.status}` };
    return { status: "ok" };
  } catch (err) {
    return { status: "error", reason: errText(err) };
  }
}

/** Optional short Telegram alert (secondary). Skipped unless both env vars set. */
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
        text: `🎭 New inquiry ${lead.id}: ${lead.eventType} on ${lead.date} in ${lead.city}. Check ${env.leadNotifyEmail}.`,
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
 * Persist + notify. The lead is ACCEPTED when it is durably stored OR the owner email
 * was delivered. The disk store is the primary recovery record; on a read-only/
 * serverless host where it can't be written, a delivered email is an acceptable record
 * so a real inquiry is never rejected. Only when BOTH fail do we reject (honestly).
 * Email/Telegram are attempted regardless and their outcomes are returned for logging.
 * This never throws — the caller inspects `accepted` to respond honestly.
 */
export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const store = await persist(lead);
  const [email, telegram] = await Promise.all([emailOwner(lead), telegramAlert(lead)]);
  const accepted = store.status === "ok" || email.status === "ok";
  return { accepted, channels: { store, email, telegram } };
}

function errText(err: unknown): string {
  if (err instanceof Error) return err.name === "AbortError" ? "timeout" : err.message;
  return "unknown error";
}
