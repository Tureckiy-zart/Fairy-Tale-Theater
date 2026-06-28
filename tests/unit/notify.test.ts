// Unit tests for lib/notify.deliverLead — the delivery ORCHESTRATION layer. The
// MongoDB store (lib/leadStore) is mocked so these tests are hermetic and assert the
// acceptance matrix (Mongo × Email × Telegram → accepted?) and the no-PII contract,
// without a real database or network. The store module itself is tested in isolation
// in leadStore.test.ts. Each test resets modules, sets env, and mocks global fetch.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Lead } from "@/lib/leads";
import type { StoreOutcome } from "@/lib/leadStore";

// --- Mock the durable store. storeLead/updateNotificationStatus are stubbed per test
// via the mutable refs below, so we can drive every branch of the acceptance matrix.
const storeLeadResult = { value: { status: "ok", duplicate: false, id: "ML-ABCDE" } as StoreOutcome };
const updateCalls: unknown[][] = [];
vi.mock("@/lib/leadStore", () => ({
  storeLead: vi.fn(async () => storeLeadResult.value),
  updateNotificationStatus: vi.fn(async (...args: unknown[]) => {
    updateCalls.push(args);
    return { status: "ok", duplicate: false, id: "ML-ABCDE" } as StoreOutcome;
  }),
}));

function fixtureLead(): Lead {
  return {
    id: "ML-ABCDE",
    submissionId: "sub-0123456789abcdef",
    receivedAt: "2026-06-28T12:00:00.000Z",
    name: "Jane Doe",
    phone: "(310) 555-0142",
    email: "jane@example.com",
    eventType: "Birthday party",
    date: "2026-12-01",
    time: null,
    city: "Los Angeles",
    childCount: 12,
    show: null,
    notes: "Please call after 5pm",
    source: { path: "/booking", utmSource: null, utmMedium: null, utmCampaign: null },
  };
}

/** Import a fresh copy of lib/notify after env/mocks are configured. */
async function importNotify() {
  vi.resetModules();
  return await import("@/lib/notify");
}

beforeEach(() => {
  vi.resetModules();
  updateCalls.length = 0;
  storeLeadResult.value = { status: "ok", duplicate: false, id: "ML-ABCDE" };
  // Baseline: Mongo configured, no email webhook, no telegram.
  process.env.MONGODB_URI = "mongodb://mock";
  delete process.env.LEAD_EMAIL_WEBHOOK_URL;
  delete process.env.LEAD_EMAIL_WEBHOOK_TOKEN;
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  delete process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.MONGODB_URI;
  delete process.env.LEAD_EMAIL_WEBHOOK_URL;
  delete process.env.LEAD_EMAIL_WEBHOOK_TOKEN;
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  delete process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN;
});

/** Configure email/telegram/sheets env and a fetch mock that routes by URL. */
function stubFetch(opts: {
  emailStatus?: number | "timeout";
  telegramStatus?: number | "timeout";
  sheetsStatus?: number | "timeout";
}) {
  const fetchMock = vi.fn(async (url: string | URL, _init?: RequestInit) => {
    const u = String(url);
    const isSheets = u.includes("sheets.test");
    const which = u.includes("api.telegram.org")
      ? opts.telegramStatus
      : isSheets
        ? opts.sheetsStatus
        : opts.emailStatus;
    if (which === "timeout") throw Object.assign(new Error("timed out"), { name: "TimeoutError" });
    const status = which ?? 200;
    // The Sheets adapter now asserts a JSON {ok:true} body, not just the HTTP status,
    // so a 2xx Sheets response must carry the contract body to count as success.
    if (isSheets && status >= 200 && status < 300) {
      return new Response(JSON.stringify({ ok: true, duplicate: false }), {
        status,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(null, { status });
  });
  vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
  return fetchMock;
}

describe("deliverLead acceptance matrix", () => {
  it("mongo ok, email skipped, telegram skipped → accepted", async () => {
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(true);
    expect(r.channels.store.status).toBe("ok");
    expect(r.channels.email.status).toBe("skipped");
    expect(r.channels.telegram.status).toBe("skipped");
    expect(r.channels.sheets.status).toBe("skipped");
  });

  it("mongo ok, email error, telegram error → accepted (store carries it)", async () => {
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    stubFetch({ emailStatus: 500, telegramStatus: 400 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(true);
    expect(r.channels.store.status).toBe("ok");
    expect(r.channels.email.status).toBe("error");
    expect(r.channels.telegram.status).toBe("error");
  });

  it("mongo error, email ok → accepted (email is the fallback record)", async () => {
    storeLeadResult.value = { status: "error", reason: "atlas unreachable" };
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    stubFetch({ emailStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(true);
    expect(r.channels.store.status).toBe("error");
    expect(r.channels.email.status).toBe("ok");
  });

  it("mongo error, email error → rejected (honest failure)", async () => {
    storeLeadResult.value = { status: "error", reason: "atlas unreachable" };
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    stubFetch({ emailStatus: 500 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(false);
    expect(r.channels.store.status).toBe("error");
    expect(r.channels.email.status).toBe("error");
  });

  it("mongo error, email skipped, telegram ok → rejected (telegram is never acceptance)", async () => {
    storeLeadResult.value = { status: "error", reason: "atlas unreachable" };
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    stubFetch({ telegramStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(false);
    expect(r.channels.telegram.status).toBe("ok");
  });

  it("mongo error, email error, telegram error → rejected", async () => {
    storeLeadResult.value = { status: "error", reason: "auth failed" };
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    stubFetch({ emailStatus: 500, telegramStatus: 401 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(false);
  });
});

describe("deliverLead provider classification", () => {
  it("email timeout is recorded as error", async () => {
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    stubFetch({ emailStatus: "timeout" });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.channels.email.status).toBe("error");
    if (r.channels.email.status === "error") expect(r.channels.email.reason).toBe("timeout");
  });

  it("telegram HTTP 400 is recognized as failure but does not reject the lead", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    stubFetch({ telegramStatus: 400 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(true); // store still ok
    expect(r.channels.telegram.status).toBe("error");
    if (r.channels.telegram.status === "error") expect(r.channels.telegram.reason).toContain("400");
  });
});

describe("deliverLead Google Sheets channel", () => {
  it("is skipped when GOOGLE_SHEETS_WEBHOOK_URL is unset", async () => {
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.channels.sheets.status).toBe("skipped");
  });

  it("appends the lead row and reports ok when the webhook succeeds", async () => {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN = "shh";
    const fetchMock = stubFetch({ sheetsStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.channels.sheets.status).toBe("ok");
    // The POST body carries the flat row + the shared-secret token.
    const call = fetchMock.mock.calls.find(([u]) => String(u).includes("sheets.test"));
    expect(call).toBeTruthy();
    const body = JSON.parse((call![1] as RequestInit).body as string);
    expect(body.token).toBe("shh");
    expect(body.lead.id).toBe("ML-ABCDE");
    expect(body.lead.name).toBe("Jane Doe");
    expect(body.lead.childCount).toBe("12"); // sheet cells are strings
    expect(body.lead.submissionId).toBe("sub-0123456789abcdef");
  });

  it("records an error but never rejects the lead when the webhook fails", async () => {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    stubFetch({ sheetsStatus: 500 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(true); // store still ok
    expect(r.channels.sheets.status).toBe("error");
  });
});

describe("deliverLead notification-status persistence", () => {
  it("patches notificationStatus when the lead was stored", async () => {
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    stubFetch({ emailStatus: 200 });
    const { deliverLead } = await importNotify();
    await deliverLead(fixtureLead());
    expect(updateCalls.length).toBe(1);
    const [id, status] = updateCalls[0] as [string, { email: string; telegram: string; sheets: string }];
    expect(id).toBe("ML-ABCDE");
    expect(status.email).toBe("ok");
    expect(status.telegram).toBe("skipped");
    expect(status.sheets).toBe("skipped");
  });

  it("does NOT patch notificationStatus when the store failed (nothing to patch)", async () => {
    storeLeadResult.value = { status: "error", reason: "atlas unreachable" };
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    stubFetch({ emailStatus: 200 });
    const { deliverLead } = await importNotify();
    await deliverLead(fixtureLead());
    expect(updateCalls.length).toBe(0);
  });
});

describe("deliverLead acceptance matrix — Telegram/Sheets never accept", () => {
  it("mongo error, email error, telegram ok, sheets ok → rejected", async () => {
    storeLeadResult.value = { status: "error", reason: "atlas unreachable" };
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    stubFetch({ emailStatus: 500, telegramStatus: 200, sheetsStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(false);
    expect(r.channels.telegram.status).toBe("ok");
    expect(r.channels.sheets.status).toBe("ok");
  });

  it("mongo error, email skipped, telegram ok, sheets ok → rejected", async () => {
    storeLeadResult.value = { status: "error", reason: "atlas unreachable" };
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    stubFetch({ telegramStatus: 200, sheetsStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(false);
  });

  it("mongo ok, telegram error, sheets error → still accepted", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    stubFetch({ telegramStatus: 500, sheetsStatus: 500 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(true);
    expect(r.channels.telegram.status).toBe("error");
    expect(r.channels.sheets.status).toBe("error");
  });
});

describe("deliverLead idempotency / duplicate suppression", () => {
  const telegramCalls = (m: ReturnType<typeof stubFetch>) =>
    m.mock.calls.filter(([u]) => String(u).includes("api.telegram.org")).length;
  const sheetsCalls = (m: ReturnType<typeof stubFetch>) =>
    m.mock.calls.filter(([u]) => String(u).includes("sheets.test")).length;

  it("adopts a store-regenerated id everywhere (response, Sheets row, status patch)", async () => {
    // Simulate an id collision the store resolved by regenerating to a new id.
    storeLeadResult.value = { status: "ok", duplicate: false, id: "ML-NEW99" };
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    const fetchMock = stubFetch({ sheetsStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead()); // submitted id is ML-ABCDE
    // The DeliveryResult carries the actually-stored id, NOT the original.
    expect(r.id).toBe("ML-NEW99");
    expect(r.accepted).toBe(true);
    // The Sheets row uses the adopted id.
    const call = fetchMock.mock.calls.find(([u]) => String(u).includes("sheets.test"));
    const body = JSON.parse((call![1] as RequestInit).body as string);
    expect(body.lead.id).toBe("ML-NEW99");
    // The notification-status patch targets the adopted id.
    expect(updateCalls.length).toBe(1);
    expect((updateCalls[0] as [string])[0]).toBe("ML-NEW99");
  });

  it("fresh insert: Telegram and Sheets are each called exactly once", async () => {
    storeLeadResult.value = { status: "ok", duplicate: false, id: "ML-ABCDE" };
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    const fetchMock = stubFetch({ telegramStatus: 200, sheetsStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.channels.telegram.status).toBe("ok");
    expect(r.channels.sheets.status).toBe("ok");
    expect(telegramCalls(fetchMock)).toBe(1);
    expect(sheetsCalls(fetchMock)).toBe(1);
  });

  it("duplicate submissionId: Telegram, Sheets and email are NOT called, status still ok", async () => {
    storeLeadResult.value = { status: "ok", duplicate: true, id: "ML-ABCDE" };
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    const fetchMock = stubFetch({ telegramStatus: 200, sheetsStatus: 200, emailStatus: 200 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.accepted).toBe(true); // already durable in MongoDB
    expect(r.channels.store.status).toBe("ok");
    expect(r.channels.telegram.status).toBe("skipped");
    expect(r.channels.sheets.status).toBe("skipped");
    expect(r.channels.email.status).toBe("skipped");
    expect(fetchMock).not.toHaveBeenCalled();
    // The first submission already wrote its statuses — we must not re-patch them.
    expect(updateCalls.length).toBe(0);
  });

  it("two different submissionIds each deliver once (Telegram & Sheets called twice total)", async () => {
    storeLeadResult.value = { status: "ok", duplicate: false, id: "ML-ABCDE" };
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    const fetchMock = stubFetch({ telegramStatus: 200, sheetsStatus: 200 });
    const { deliverLead } = await importNotify();
    await deliverLead({ ...fixtureLead(), submissionId: "sub-aaaaaaaaaaaa" });
    await deliverLead({ ...fixtureLead(), submissionId: "sub-bbbbbbbbbbbb" });
    expect(telegramCalls(fetchMock)).toBe(2);
    expect(sheetsCalls(fetchMock)).toBe(2);
  });
});

describe("appendToSheet hardening (Sheets channel via deliverLead)", () => {
  function stubSheets(resp: { status?: number; body?: string | null; throwAs?: "timeout" | "network" }) {
    const fetchMock = vi.fn(async () => {
      if (resp.throwAs === "timeout") throw Object.assign(new Error("timed out"), { name: "TimeoutError" });
      if (resp.throwAs === "network") throw new TypeError("fetch failed");
      const body = resp.body === undefined ? JSON.stringify({ ok: true, duplicate: false }) : resp.body;
      return new Response(body, { status: resp.status ?? 200, headers: { "content-type": "application/json" } });
    });
    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);
    return fetchMock;
  }

  async function sheetsOutcome(resp: Parameters<typeof stubSheets>[0]) {
    process.env.GOOGLE_SHEETS_WEBHOOK_URL = "https://sheets.test/append";
    stubSheets(resp);
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    return r.channels.sheets;
  }

  it("env absent → skipped", async () => {
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    expect(r.channels.sheets.status).toBe("skipped");
  });

  it("HTTP 200 + ok:true → ok", async () => {
    expect((await sheetsOutcome({ body: JSON.stringify({ ok: true, duplicate: false }) })).status).toBe("ok");
  });

  it("HTTP 200 + ok:true,duplicate:true → ok (idempotent append)", async () => {
    expect((await sheetsOutcome({ body: JSON.stringify({ ok: true, duplicate: true }) })).status).toBe("ok");
  });

  it("HTTP 401 → error", async () => {
    expect((await sheetsOutcome({ status: 401, body: null })).status).toBe("error");
  });

  it("HTTP 403 → error", async () => {
    expect((await sheetsOutcome({ status: 403, body: null })).status).toBe("error");
  });

  it("HTTP 500 → error", async () => {
    expect((await sheetsOutcome({ status: 500, body: null })).status).toBe("error");
  });

  it("HTTP 200 + ok:false → error", async () => {
    expect((await sheetsOutcome({ body: JSON.stringify({ ok: false, errorCode: "INVALID_TOKEN" }) })).status).toBe(
      "error",
    );
  });

  it("malformed JSON → error", async () => {
    expect((await sheetsOutcome({ body: "not json <html>" })).status).toBe("error");
  });

  it("timeout → error", async () => {
    expect((await sheetsOutcome({ throwAs: "timeout" })).status).toBe("error");
  });

  it("network rejection → error", async () => {
    expect((await sheetsOutcome({ throwAs: "network" })).status).toBe("error");
  });

  it("never leaks PII, the token, or the webhook host into the sheets outcome", async () => {
    process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN = "super-secret-token";
    const out = await sheetsOutcome({
      status: 500,
      body: JSON.stringify({ ok: false, lead: "Jane Doe (310) 555-0142 jane@example.com" }),
    });
    const blob = JSON.stringify(out);
    expect(blob).not.toContain("Jane Doe");
    expect(blob).not.toContain("555-0142");
    expect(blob).not.toContain("super-secret-token");
    expect(blob).not.toContain("sheets.test");
  });
});

describe("deliverLead PII safety", () => {
  it("never leaks customer fields into channel reasons", async () => {
    storeLeadResult.value = { status: "error", reason: "atlas unreachable" };
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    process.env.TELEGRAM_BOT_TOKEN = "t";
    process.env.TELEGRAM_CHAT_ID = "c";
    stubFetch({ emailStatus: 500, telegramStatus: 500 });
    const { deliverLead } = await importNotify();
    const r = await deliverLead(fixtureLead());
    const blob = JSON.stringify(r);
    expect(blob).not.toContain("Jane Doe");
    expect(blob).not.toContain("(310) 555-0142");
    expect(blob).not.toContain("jane@example.com");
    expect(blob).not.toContain("Please call after 5pm");
  });
});
