// Unit tests for lib/turnstile.verifyTurnstile — the booking-form bot check. Hermetic:
// the siteverify HTTP call is mocked and TURNSTILE_SECRET_KEY is driven per test. Asserts
// the policy: skip when unconfigured, reject a missing/failed token, fail-open on a
// provider/network error, and the exact siteverify request shape.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { verifyTurnstile } from "@/lib/turnstile";

beforeEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY;
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.TURNSTILE_SECRET_KEY;
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("verifyTurnstile", () => {
  it("skips (ok) when no secret is configured — dev / e2e / no keys", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await verifyTurnstile("any-token", "1.2.3.4");
    expect(res.ok).toBe(true);
    expect((res as { skipped?: boolean }).skipped).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing token when enforced, with no network call", async () => {
    process.env.TURNSTILE_SECRET_KEY = "sec";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyTurnstile(undefined)).toEqual({ ok: false, reason: "missing-token" });
    expect(await verifyTurnstile("   ")).toEqual({ ok: false, reason: "missing-token" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("accepts when siteverify returns success:true", async () => {
    process.env.TURNSTILE_SECRET_KEY = "sec";
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ success: true })));
    expect((await verifyTurnstile("tok")).ok).toBe(true);
  });

  it("rejects when siteverify returns success:false", async () => {
    process.env.TURNSTILE_SECRET_KEY = "sec";
    vi.stubGlobal("fetch", vi.fn(async () => jsonResponse({ success: false })));
    expect(await verifyTurnstile("tok")).toEqual({ ok: false, reason: "failed" });
  });

  it("fails OPEN on a provider non-200 (Cloudflare outage must not drop a real customer)", async () => {
    process.env.TURNSTILE_SECRET_KEY = "sec";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad gateway", { status: 502 })));
    expect((await verifyTurnstile("tok")).ok).toBe(true);
  });

  it("fails OPEN on a network/timeout error", async () => {
    process.env.TURNSTILE_SECRET_KEY = "sec";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network");
      }),
    );
    expect((await verifyTurnstile("tok")).ok).toBe(true);
  });

  it("posts secret + response (+ remoteip) to siteverify", async () => {
    process.env.TURNSTILE_SECRET_KEY = "sec-xyz";
    const fetchMock = vi.fn(async (_url: string | URL, _init?: RequestInit) =>
      jsonResponse({ success: true }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await verifyTurnstile("tok-123", "9.9.9.9");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toContain("siteverify");
    const body = String((init as RequestInit).body);
    expect(body).toContain("secret=sec-xyz");
    expect(body).toContain("response=tok-123");
    expect(body).toContain("remoteip=9.9.9.9");
  });

  it("omits remoteip when it is unknown", async () => {
    process.env.TURNSTILE_SECRET_KEY = "sec";
    const fetchMock = vi.fn(async (_url: string | URL, _init?: RequestInit) =>
      jsonResponse({ success: true }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await verifyTurnstile("tok", "unknown");
    const body = String((fetchMock.mock.calls[0]![1] as RequestInit).body);
    expect(body).not.toContain("remoteip");
  });
});
