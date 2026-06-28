// POST /api/lead — production booking-inquiry endpoint. SERVER ONLY.
//
// Pipeline: honeypot → rate-limit → server-side validation → build normalized lead
// → durably persist + notify owner → honest JSON response. The client shows success
// ONLY when this returns { ok: true } (i.e. the lead was durably accepted). A
// validation, abuse, or persistence failure NEVER returns ok:true.
//
// No secrets, PII, or free-text bodies are logged. Provider failures are logged with
// the inquiry id only, so the operator can recover from the durable store.
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { buildLead, makeInquiryId, sanitizeSubmissionId, validateLead, type RawLead } from "@/lib/leads";
import { deliverLead } from "@/lib/notify";
import { env } from "@/lib/env";

// Node runtime (the durable store uses the mongodb driver + node:crypto). Never cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Tiny in-memory token bucket (per-IP). Best-effort abuse control without a
// dependency; pairs with the honeypot. For multi-instance deploys, front with a
// provider/edge rate limiter — documented in the runbook.
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > env.leadRateLimitPerMinute;
}

// Best-effort client IP for the per-IP limiter. The FIRST X-Forwarded-For entry is
// client-controlled and trivially spoofable (rotate it → fresh bucket every request),
// so we trust the LAST entry — appended by the nearest reverse proxy — by default, or
// an explicit platform header when configured (LEAD_TRUSTED_IP_HEADER). For hard
// limits, front this with an edge/WAF limiter (security/SECURITY.md).
function clientIp(req: Request): string {
  const trusted = env.leadTrustedIpHeader;
  if (trusted) {
    const v = req.headers.get(trusted);
    if (v) return v.split(",")[0]!.trim();
  }
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1]!;
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request): Promise<NextResponse> {
  // Parse defensively — reject non-JSON / oversized bodies.
  let body: RawLead;
  try {
    const text = await req.text();
    if (text.length > 16_000) return json({ ok: false, error: "Message too large." }, 413);
    body = JSON.parse(text) as RawLead;
    if (typeof body !== "object" || body === null) throw new Error("not an object");
  } catch {
    return json({ ok: false, error: "We couldn't read that — please try again." }, 400);
  }

  // Honeypot: a hidden field real users never fill. Silently accept-looking to bots
  // but do nothing (return ok WITHOUT persisting/notifying — no inbox spam, no
  // information leak). This is the one place ok:true means "we ignored you".
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return json({ ok: true, id: "ML-IGNORED" }, 200);
  }

  if (rateLimited(clientIp(req))) {
    return json({ ok: false, error: "Too many requests — please try again in a minute." }, 429);
  }

  const result = validateLead(body);
  if (!result.ok) {
    return json({ ok: false, error: "Please check the highlighted fields.", fields: result.errors }, 422);
  }

  // Idempotency: trust the client-sent submissionId (a crypto.randomUUID() reused
  // across retries of the SAME submission) so a double-click/retry maps to one stored
  // lead via the unique index. If it's absent or malformed, mint a server-side fallback
  // so a missing id never blocks a valid lead — idempotency just degrades to per-request.
  const submissionId = sanitizeSubmissionId(body.submissionId) ?? randomUUID();
  const lead = buildLead(body, makeInquiryId(Math.random), submissionId, new Date().toISOString());

  let delivery;
  try {
    delivery = await deliverLead(lead);
  } catch {
    // deliverLead is designed not to throw, but stay safe: never fake success.
    console.error(`[lead] ${lead.id} delivery threw unexpectedly`);
    return json({ ok: false, error: "Something went wrong on our side — please try again or call us." }, 502);
  }

  if (!delivery.accepted) {
    // Neither the durable store nor the email landed → we cannot guarantee recovery → be honest.
    console.error(
      `[lead] ${lead.id} NOT accepted — store=${stringifyOutcome(delivery.channels.store)} email=${stringifyOutcome(delivery.channels.email)}`,
    );
    return json({ ok: false, error: "We couldn't save your request — please try again or call us." }, 502);
  }

  // Accepted (stored and/or emailed). Log any channel that didn't succeed (id only,
  // no PII) so failures are observable — e.g. accepted-via-email on a read-only store.
  if (delivery.channels.store.status !== "ok") {
    console.warn(`[lead] ${lead.id} accepted via email; store=${stringifyOutcome(delivery.channels.store)}`);
  }
  if (delivery.channels.email.status !== "ok") {
    console.warn(`[lead] ${lead.id} stored; email=${stringifyOutcome(delivery.channels.email)}`);
  }
  if (delivery.channels.telegram.status === "error") {
    console.warn(`[lead] ${lead.id} telegram=${stringifyOutcome(delivery.channels.telegram)}`);
  }

  return json({ ok: true, id: lead.id }, 200);
}

function json(payload: Record<string, unknown>, status: number): NextResponse {
  return NextResponse.json(payload, { status });
}

function stringifyOutcome(o: { status: string; reason?: string }): string {
  return o.reason ? `${o.status}(${o.reason})` : o.status;
}
