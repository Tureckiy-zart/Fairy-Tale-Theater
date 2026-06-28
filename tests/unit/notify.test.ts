// Unit tests for lib/notify.deliverLead — durable persistence + webhook email.
// Hermetic + parallel-safe: each test gets a UNIQUE LEAD_STORE_DIR under the OS
// temp dir, mocks global fetch, and resets modules so lib/env re-reads the env
// before lib/notify is (re-)imported.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdir, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Lead } from "@/lib/leads";

// Track temp dirs created per test so we can clean them in afterEach.
const tempDirs: string[] = [];

/** A fresh, unique store dir derived from the test name + randomness. */
async function freshStoreDir(label: string): Promise<string> {
  const slug = label.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const dir = join(tmpdir(), `ml-notify-test-${slug}-${suffix}`);
  await mkdir(dir, { recursive: true });
  tempDirs.push(dir);
  return dir;
}

function fixtureLead(): Lead {
  return {
    id: "ML-ABCDE",
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
    notes: null,
    source: { path: "/booking", utmSource: null, utmMedium: null, utmCampaign: null },
  };
}

/** Import a fresh copy of lib/notify after env/modules are configured. */
async function importNotify() {
  vi.resetModules();
  return await import("@/lib/notify");
}

beforeEach(() => {
  vi.resetModules();
  // Start each test from a known env baseline (no webhook, no telegram).
  delete process.env.LEAD_EMAIL_WEBHOOK_URL;
  delete process.env.LEAD_EMAIL_WEBHOOK_TOKEN;
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
});

afterEach(async () => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete process.env.LEAD_STORE_DIR;
  delete process.env.LEAD_EMAIL_WEBHOOK_URL;
  delete process.env.LEAD_EMAIL_WEBHOOK_TOKEN;
  while (tempDirs.length) {
    const dir = tempDirs.pop()!;
    await rm(dir, { recursive: true, force: true });
  }
});

describe("deliverLead", () => {
  it("accepts via store when no webhook is configured", async () => {
    const dir = await freshStoreDir("store-only");
    process.env.LEAD_STORE_DIR = dir;
    // No LEAD_EMAIL_WEBHOOK_URL → email is skipped. fetch should not be called.
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { deliverLead } = await importNotify();
    const result = await deliverLead(fixtureLead());

    expect(result.accepted).toBe(true);
    expect(result.channels.store.status).toBe("ok");
    expect(result.channels.email.status).toBe("skipped");
    expect(fetchMock).not.toHaveBeenCalled();

    // A JSON record was written to the store dir.
    const files = await readdir(dir);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^2026-06-28_ML-ABCDE\.json$/);
  });

  it("reports email ok when the webhook returns 200", async () => {
    const dir = await freshStoreDir("webhook-ok");
    process.env.LEAD_STORE_DIR = dir;
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const { deliverLead } = await importNotify();
    const result = await deliverLead(fixtureLead());

    expect(result.accepted).toBe(true);
    expect(result.channels.store.status).toBe("ok");
    expect(result.channels.email.status).toBe("ok");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://example.test/email");
    expect(init?.method).toBe("POST");
  });

  it("reports email error but stays accepted (store ok) on a 500 webhook", async () => {
    const dir = await freshStoreDir("webhook-500");
    process.env.LEAD_STORE_DIR = dir;
    process.env.LEAD_EMAIL_WEBHOOK_URL = "https://example.test/email";
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(null, { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const { deliverLead } = await importNotify();
    const result = await deliverLead(fixtureLead());

    // Store succeeded → accepted true regardless of the failed webhook.
    expect(result.accepted).toBe(true);
    expect(result.channels.store.status).toBe("ok");
    expect(result.channels.email.status).toBe("error");
    if (result.channels.email.status === "error") {
      expect(result.channels.email.reason).toContain("500");
    }

    // The durable record still landed on disk.
    const files = await readdir(dir);
    expect(files).toHaveLength(1);
  });
});
