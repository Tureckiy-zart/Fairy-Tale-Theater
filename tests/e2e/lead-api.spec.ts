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

test("rate limit: rapid posts from one context yield at least one 429", async ({ playwright }) => {
  // Use a dedicated request context so the X-Forwarded-For / source IP is stable
  // across the burst and this test doesn't consume another test's budget.
  const ctx: APIRequestContext = await playwright.request.newContext({
    baseURL: "http://localhost:3000",
  });
  try {
    const statuses: number[] = [];
    for (let i = 0; i < 8; i++) {
      const res = await ctx.post(ENDPOINT, { data: validLead() });
      statuses.push(res.status());
    }
    // The limiter is 5/60s per IP; on the single-instance dev server the 6th+
    // request in a fresh window should be throttled.
    const accepted = statuses.filter((s) => s === 200).length;
    const throttled = statuses.filter((s) => s === 429).length;
    expect(throttled).toBeGreaterThanOrEqual(1);
    expect(accepted).toBeLessThanOrEqual(5);
  } finally {
    await ctx.dispose();
  }
});
