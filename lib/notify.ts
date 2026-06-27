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

function storeDir(): string {
  const dir = env.leadStoreDir;
  return isAbsolute(dir) ? dir : join(process.cwd(), dir);
}

/** Write the lead as one JSON file per inquiry. Returns ok/error (never throws). */
async function persist(lead: Lead): Promise<ChannelOutcome> {
  try {
    const dir = storeDir();
    await mkdir(dir, { recursive: true });
    const file = join(dir, `${lead.receivedAt.slice(0, 10)}_${lead.id}.json`);
    await writeFile(file, JSON.stringify(lead, null, 2), { encoding: "utf8", flag: "wx" });
    return { status: "ok" };
  } catch (err) {
    return { status: "error", reason: errText(err) };
  }
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
 * Persist + notify. The lead is ACCEPTED iff it is durably stored. Email/Telegram
 * are attempted regardless and their outcomes are returned for logging. This never
 * throws — the caller inspects `accepted` to respond honestly.
 */
export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const store = await persist(lead);
  const [email, telegram] = await Promise.all([emailOwner(lead), telegramAlert(lead)]);
  return { accepted: store.status === "ok", channels: { store, email, telegram } };
}

function errText(err: unknown): string {
  if (err instanceof Error) return err.name === "AbortError" ? "timeout" : err.message;
  return "unknown error";
}
