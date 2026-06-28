// Unit tests for lib/leadStore — the MongoDB durable store, in ISOLATION. The mongodb
// driver is mocked: a fake MongoClient lets us drive connect success/failure, insert
// success/duplicate-key, and index creation, and assert the cached-connection self-heal
// (a rejected connect is cleared so the next call reconnects). No real database.
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { StoredLead } from "@/lib/leads";

// --- Mutable test controls for the fake driver ------------------------------
const ctl = {
  connectError: null as Error | null,
  insertError: null as (Error & { code?: number }) | null,
  insertCalls: 0,
  createIndexesCalls: 0,
  closeCalls: 0,
  lastIndexes: null as unknown,
};

function resetCtl() {
  ctl.connectError = null;
  ctl.insertError = null;
  ctl.insertCalls = 0;
  ctl.createIndexesCalls = 0;
  ctl.closeCalls = 0;
  ctl.lastIndexes = null;
}

// A minimal fake MongoClient covering exactly the surface lib/leadStore uses.
class FakeMongoClient {
  uri: string;
  constructor(uri: string) {
    this.uri = uri;
  }
  async connect() {
    if (ctl.connectError) throw ctl.connectError;
    return this;
  }
  async close() {
    ctl.closeCalls++;
  }
  db() {
    return {
      collection: () => ({
        createIndexes: async (indexes: unknown) => {
          ctl.createIndexesCalls++;
          ctl.lastIndexes = indexes;
          return ["ok"];
        },
        insertOne: async () => {
          ctl.insertCalls++;
          if (ctl.insertError) throw ctl.insertError;
          return { acknowledged: true, insertedId: "x" };
        },
        updateOne: async () => ({ acknowledged: true, matchedCount: 1 }),
      }),
    };
  }
}

vi.mock("mongodb", () => ({
  MongoClient: FakeMongoClient,
}));

function fixtureStored(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "ML-ABCDE",
    submissionId: "sub-0123456789abcdef",
    receivedAt: "2026-06-28T12:00:00.000Z",
    updatedAt: "2026-06-28T12:00:00.000Z",
    status: "new",
    name: "Jane Doe",
    phone: "(310) 555-0142",
    email: "jane@example.com",
    eventType: "Birthday party",
    date: "2026-12-01",
    city: "Los Angeles",
    childCount: 12,
    source: { path: "/booking" },
    notificationStatus: { email: "pending", telegram: "pending" },
    ...overrides,
  };
}

async function importStore() {
  vi.resetModules();
  return await import("@/lib/leadStore");
}

beforeEach(() => {
  resetCtl();
  process.env.MONGODB_URI = "mongodb://mock/db";
});

afterEach(async () => {
  // Reset the module-level cached client between tests so each starts cold.
  try {
    const store = await import("@/lib/leadStore");
    await store.__resetForTests();
  } catch {
    /* module not yet imported — fine */
  }
  delete process.env.MONGODB_URI;
  vi.restoreAllMocks();
});

describe("storeLead", () => {
  it("inserts a fresh lead → ok, duplicate false", async () => {
    const { storeLead } = await importStore();
    const r = await storeLead(fixtureStored());
    expect(r).toEqual({ status: "ok", duplicate: false });
    expect(ctl.insertCalls).toBe(1);
  });

  it("ensures indexes including the submissionId unique index", async () => {
    const { storeLead } = await importStore();
    await storeLead(fixtureStored());
    expect(ctl.createIndexesCalls).toBe(1);
    const indexes = ctl.lastIndexes as Array<{ key: Record<string, number>; unique?: boolean }>;
    const sub = indexes.find((i) => "submissionId" in i.key);
    expect(sub?.unique).toBe(true);
    const idIdx = indexes.find((i) => "id" in i.key);
    expect(idIdx?.unique).toBe(true);
    // No unique index on email or phone (legitimate repeat customers).
    expect(indexes.find((i) => "email" in i.key)).toBeUndefined();
    expect(indexes.find((i) => "phone" in i.key)).toBeUndefined();
  });

  it("treats a duplicate submissionId (E11000) as an idempotent success", async () => {
    const { storeLead } = await importStore();
    ctl.insertError = Object.assign(new Error("E11000 duplicate key error"), { code: 11000 });
    const r = await storeLead(fixtureStored());
    expect(r).toEqual({ status: "ok", duplicate: true });
  });

  it("two different submissions both insert (no email/phone uniqueness)", async () => {
    const { storeLead } = await importStore();
    const a = await storeLead(fixtureStored({ id: "ML-AAAAA", submissionId: "sub-aaaaaaaaaaaa" }));
    const b = await storeLead(fixtureStored({ id: "ML-BBBBB", submissionId: "sub-bbbbbbbbbbbb" }));
    expect(a.status).toBe("ok");
    expect(b.status).toBe("ok");
    expect(ctl.insertCalls).toBe(2);
  });

  it("returns a clean error when MONGODB_URI is missing", async () => {
    delete process.env.MONGODB_URI;
    const { storeLead } = await importStore();
    const r = await storeLead(fixtureStored());
    expect(r.status).toBe("error");
    if (r.status === "error") expect(r.reason).toBe("MONGODB_URI not set");
  });

  it("returns a clean error on a connection failure (no PII)", async () => {
    const { storeLead } = await importStore();
    ctl.connectError = Object.assign(new Error("getaddrinfo ETIMEDOUT cluster.mongodb.net"), {
      name: "MongoServerSelectionError",
    });
    const r = await storeLead(fixtureStored());
    expect(r.status).toBe("error");
    if (r.status === "error") {
      expect(r.reason).toBe("atlas unreachable");
      // No host/PII echoed.
      expect(r.reason).not.toContain("mongodb.net");
    }
  });

  it("self-heals: a failed connect is cleared so the next call reconnects and succeeds", async () => {
    const { storeLead } = await importStore();
    ctl.connectError = Object.assign(new Error("boom"), { name: "MongoServerSelectionError" });
    const first = await storeLead(fixtureStored());
    expect(first.status).toBe("error");
    // Recover: next attempt connects cleanly.
    ctl.connectError = null;
    const second = await storeLead(fixtureStored());
    expect(second.status).toBe("ok");
    expect(ctl.insertCalls).toBe(1); // only the successful attempt inserted
  });

  it("never includes customer PII in an error reason", async () => {
    const { storeLead } = await importStore();
    ctl.insertError = Object.assign(new Error("write failed for Jane Doe (310) 555-0142"), {});
    const r = await storeLead(fixtureStored());
    expect(r.status).toBe("error");
    if (r.status === "error") {
      expect(r.reason).not.toContain("Jane Doe");
      expect(r.reason).not.toContain("555-0142");
    }
  });
});

describe("updateNotificationStatus", () => {
  it("returns ok on a successful patch", async () => {
    const { updateNotificationStatus } = await importStore();
    const r = await updateNotificationStatus(
      "ML-ABCDE",
      { email: "ok", telegram: "error", lastAttemptAt: "2026-06-28T12:00:01.000Z" },
      "2026-06-28T12:00:01.000Z",
    );
    expect(r.status).toBe("ok");
  });

  it("returns a clean error when MONGODB_URI is missing", async () => {
    delete process.env.MONGODB_URI;
    const { updateNotificationStatus } = await importStore();
    const r = await updateNotificationStatus("ML-ABCDE", { email: "ok", telegram: "ok" }, "2026-06-28T12:00:01.000Z");
    expect(r.status).toBe("error");
  });
});
