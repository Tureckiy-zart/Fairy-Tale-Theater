// API-level e2e for POST /api/lead — exercises the production route end to end
// (honeypot → rate limit → validation → build → persist/notify) without a browser,
// via Playwright's `request` fixture. Lead writes go to test-results/.leads-e2e
// (the webServer env in playwright.config.ts), kept out of the real store.
import { test, expect, type APIRequestContext } from "@playwright/test";

const ENDPOINT = "/api/lead";
const ID_RE = /^ML-[A-Z2-9]{5}$/;

// A valid inquiry payload — individual tests override fields.
function validLead(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: "Jane Doe",
    phone: "(310) 555-0142",
    type: "Birthday party",
    date: "12/01/2026",
    city: "Los Angeles",
    ...overrides,
  };
}

test("honeypot: a filled company field is silently ignored", async ({ request }) => {
  const res = await request.post(ENDPOINT, { data: validLead({ company: "x" }) });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.ok).toBe(true);
  expect(json.id).toBe("ML-IGNORED");
});

test("valid lead is accepted with an inquiry id", async ({ request }) => {
  const res = await request.post(ENDPOINT, { data: validLead() });
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.ok).toBe(true);
  expect(json.id).toMatch(ID_RE);
});

test("repeated same submissionId stays safe/idempotent (both ok)", async ({ request }) => {
  // The DB unique index dedups to ONE record (covered in leadStore.test.ts). At the API
  // contract level a double-submit of the same submissionId must both return ok, never
  // an error — the visitor never sees a failure for a retry of an accepted submission.
  const submissionId = `e2e-dup-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const first = await request.post(ENDPOINT, { data: validLead({ submissionId }) });
  const second = await request.post(ENDPOINT, { data: validLead({ submissionId }) });
  expect(first.status()).toBe(200);
  expect(second.status()).toBe(200);
  expect((await first.json()).ok).toBe(true);
  expect((await second.json()).ok).toBe(true);
});

test("different submissionIds are two distinct legitimate inquiries", async ({ request }) => {
  const a = await request.post(ENDPOINT, { data: validLead({ submissionId: `e2e-a-${Date.now().toString(36)}` }) });
  const b = await request.post(ENDPOINT, { data: validLead({ submissionId: `e2e-b-${Date.now().toString(36)}` }) });
  expect((await a.json()).ok).toBe(true);
  expect((await b.json()).ok).toBe(true);
});

test("missing required fields → 422 with field errors", async ({ request }) => {
  const res = await request.post(ENDPOINT, { data: { name: "Jane Doe" } });
  expect(res.status()).toBe(422);
  const json = await res.json();
  expect(json.ok).toBe(false);
  expect(json.fields).toBeTruthy();
});

test("non-JSON body → 400", async ({ request }) => {
  const res = await request.post(ENDPOINT, {
    headers: { "content-type": "application/json" },
    data: "this is not json",
  });
  expect(res.status()).toBe(400);
  const json = await res.json();
  expect(json.ok).toBe(false);
});

test("oversized body → 413", async ({ request }) => {
  const res = await request.post(ENDPOINT, {
    data: validLead({ notes: "x".repeat(16_001) }),
  });
  expect(res.status()).toBe(413);
  const json = await res.json();
  expect(json.ok).toBe(false);
});

test("rate limit: a burst beyond the per-IP limit yields at least one 429", async ({ playwright }) => {
  // Pin a dedicated, unique source IP via X-Forwarded-For so this burst gets its OWN
  // limiter bucket (isolated from the rest of the parallel suite) and we can drive it
  // past the configured limit deterministically. The e2e server runs with a raised
  // limit (LEAD_RATE_LIMIT_PER_MINUTE=50, see playwright.config.ts); we exceed it.
  const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
  const ctx: APIRequestContext = await playwright.request.newContext({
    baseURL: "http://localhost:3000",
    extraHTTPHeaders: { "x-forwarded-for": ip },
  });
  try {
    const statuses: number[] = [];
    for (let i = 0; i < 60; i++) {
      const res = await ctx.post(ENDPOINT, { data: validLead() });
      statuses.push(res.status());
    }
    // Beyond the limit, further requests in the same 60 s window are throttled.
    const throttled = statuses.filter((s) => s === 429).length;
    expect(throttled).toBeGreaterThanOrEqual(1);
  } finally {
    await ctx.dispose();
  }
});
