// Cloudflare Turnstile verification — SERVER ONLY (reads the secret via lib/env).
//
// Bot check for the booking form. Policy:
//   - SECRET UNSET  → skipped (dev / e2e / a deploy without keys). The form still works;
//     the honeypot + per-IP limiter + per-contact daily cap remain in force.
//   - SECRET SET, token MISSING/empty → rejected (a real widget always sends a token; a
//     bot that skips it is exactly what we want to stop).
//   - SECRET SET, token PRESENT → verified against siteverify. success:false → rejected.
//   - Provider/network error or non-200 → FAIL-OPEN (allow). Cloudflare being unreachable
//     must never drop a real customer; the other guards still apply.
//
// No secrets or tokens are logged.
import { env } from "./env";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; reason: "missing-token" | "failed" };

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = env.turnstileSecretKey;
  if (!secret) return { ok: true, skipped: true }; // not configured → off

  if (!token || token.trim() === "") return { ok: false, reason: "missing-token" };

  try {
    const params = new URLSearchParams();
    params.set("secret", secret);
    params.set("response", token);
    if (remoteIp && remoteIp !== "unknown") params.set("remoteip", remoteIp);

    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: true, skipped: true }; // provider error → fail-open

    const data = (await res.json()) as { success?: boolean };
    return data.success ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: true, skipped: true }; // network/timeout → fail-open
  }
}
