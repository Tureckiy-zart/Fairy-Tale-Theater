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
import { buildLead, makeInquiryId, validateLead, type RawLead } from "@/lib/leads";
import { deliverLead } from "@/lib/notify";

// Node runtime (the durable store uses node:fs). Never statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Tiny in-memory token bucket (per-IP). Best-effort abuse control without a
// dependency; pairs with the honeypot. For multi-instance deploys, front with a
// provider/edge rate limiter — documented in the runbook.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded.
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
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

  const lead = buildLead(body, makeInquiryId(Math.random), new Date().toISOString());

  let delivery;
  try {
    delivery = await deliverLead(lead);
  } catch {
    // deliverLead is designed not to throw, but stay safe: never fake success.
    console.error(`[lead] ${lead.id} delivery threw unexpectedly`);
    return json({ ok: false, error: "Something went wrong on our side — please try again or call us." }, 502);
  }

  if (!delivery.accepted) {
    // The durable store failed → we cannot guarantee recovery → be honest.
    console.error(`[lead] ${lead.id} NOT accepted — store=${stringifyOutcome(delivery.channels.store)}`);
    return json({ ok: false, error: "We couldn't save your request — please try again or call us." }, 502);
  }

  // Accepted. Log provider outcomes (id only, no PII) so failures are observable.
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
