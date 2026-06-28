// Unit tests for the pure lead contract (lib/leads): validation, normalization,
// the internal inquiry id, and the owner-notification summary. No env, no I/O.
import { describe, it, expect } from "vitest";
import {
  validateLead,
  buildLead,
  makeInquiryId,
  sanitizeSubmissionId,
  toStoredLead,
  formatLeadSummary,
  formatLeadTelegram,
  toSheetRow,
  type RawLead,
  type Lead,
} from "@/lib/leads";

// A minimal payload that passes validateLead — individual tests override fields.
function validRaw(overrides: RawLead = {}): RawLead {
  return {
    name: "Jane Doe",
    phone: "(310) 555-0142",
    type: "Birthday party",
    date: "12/01/2026",
    city: "Los Angeles",
    ...overrides,
  };
}

describe("validateLead", () => {
  it("accepts a valid payload", () => {
    const res = validateLead(validRaw());
    expect(res.ok).toBe(true);
    expect(res.errors).toEqual({});
  });

  it("flags a missing name", () => {
    const res = validateLead(validRaw({ name: "" }));
    expect(res.ok).toBe(false);
    expect(res.errors.name).toBeTruthy();
  });

  it("flags a missing phone", () => {
    const res = validateLead(validRaw({ phone: "" }));
    expect(res.ok).toBe(false);
    expect(res.errors.phone).toBeTruthy();
  });

  it("flags a missing event type", () => {
    const res = validateLead(validRaw({ type: "" }));
    expect(res.ok).toBe(false);
    expect(res.errors.type).toBeTruthy();
  });

  it("flags a missing date", () => {
    const res = validateLead(validRaw({ date: "" }));
    expect(res.ok).toBe(false);
    expect(res.errors.date).toBeTruthy();
  });

  it("flags a missing city", () => {
    const res = validateLead(validRaw({ city: "" }));
    expect(res.ok).toBe(false);
    expect(res.errors.city).toBeTruthy();
  });

  it("flags a phone with fewer than 7 digits", () => {
    const res = validateLead(validRaw({ phone: "123-456" })); // 6 digits
    expect(res.ok).toBe(false);
    expect(res.errors.phone).toBeTruthy();
  });

  it("flags a malformed email", () => {
    const res = validateLead(validRaw({ email: "not-an-email" }));
    expect(res.ok).toBe(false);
    expect(res.errors.email).toBeTruthy();
  });

  it("accepts a well-formed email", () => {
    const res = validateLead(validRaw({ email: "jane@example.com" }));
    expect(res.ok).toBe(true);
  });

  it("flags an event type outside the allow-list", () => {
    const res = validateLead(validRaw({ type: "Wedding" }));
    expect(res.ok).toBe(false);
    expect(res.errors.type).toBeTruthy();
  });

  it("flags a date not in mm/dd/yyyy format", () => {
    const res = validateLead(validRaw({ date: "2026-12-01" }));
    expect(res.ok).toBe(false);
    expect(res.errors.date).toBeTruthy();
  });

  it("flags a non-numeric count", () => {
    const res = validateLead(validRaw({ count: "lots" }));
    expect(res.ok).toBe(false);
    expect(res.errors.count).toBeTruthy();
  });

  it("flags a count below 1", () => {
    const res = validateLead(validRaw({ count: "0" }));
    expect(res.ok).toBe(false);
    expect(res.errors.count).toBeTruthy();
  });

  it("accepts an empty count (optional field)", () => {
    const res = validateLead(validRaw({ count: "" }));
    expect(res.ok).toBe(true);
    expect(res.errors.count).toBeUndefined();
  });

  it("accepts a valid numeric count", () => {
    const res = validateLead(validRaw({ count: "25" }));
    expect(res.ok).toBe(true);
  });
});

describe("buildLead", () => {
  const ID = "ML-ABCDE";
  const SID = "sub-0123456789abcdef";
  const AT = "2026-06-28T12:00:00.000Z";

  it("trims fields and collapses internal whitespace", () => {
    const lead = buildLead(
      validRaw({ name: "  Jane   Doe  ", city: "  Los   Angeles " }),
      ID,
      SID,
      AT,
    );
    expect(lead.name).toBe("Jane Doe");
    expect(lead.city).toBe("Los Angeles");
  });

  it("length-caps overly long fields", () => {
    const longName = "x".repeat(500);
    const lead = buildLead(validRaw({ name: longName }), ID, SID, AT);
    expect(lead.name.length).toBe(120); // MAX.name
  });

  it("normalizes mm/dd/yyyy to ISO yyyy-mm-dd", () => {
    const lead = buildLead(validRaw({ date: "12/01/2026" }), ID, SID, AT);
    expect(lead.date).toBe("2026-12-01");
  });

  it("passes a non-US date through unchanged", () => {
    const lead = buildLead(validRaw({ date: "next Friday" }), ID, SID, AT);
    expect(lead.date).toBe("next Friday");
  });

  it("parses childCount from a numeric string", () => {
    const lead = buildLead(validRaw({ count: "12" }), ID, SID, AT);
    expect(lead.childCount).toBe(12);
  });

  it("sets childCount null when count is empty", () => {
    const lead = buildLead(validRaw({ count: "" }), ID, SID, AT);
    expect(lead.childCount).toBeNull();
  });

  it("sets email null when empty", () => {
    const lead = buildLead(validRaw({ email: "" }), ID, SID, AT);
    expect(lead.email).toBeNull();
  });

  it("keeps a provided email", () => {
    const lead = buildLead(validRaw({ email: "jane@example.com" }), ID, SID, AT);
    expect(lead.email).toBe("jane@example.com");
  });

  it("defaults source.path to /booking when absent", () => {
    const lead = buildLead(validRaw(), ID, SID, AT);
    expect(lead.source.path).toBe("/booking");
  });

  it("uses a provided source path", () => {
    const lead = buildLead(validRaw({ sourcePath: "/birthdays" }), ID, SID, AT);
    expect(lead.source.path).toBe("/birthdays");
  });

  it("sets utm fields null when absent", () => {
    const lead = buildLead(validRaw(), ID, SID, AT);
    expect(lead.source.utmSource).toBeNull();
    expect(lead.source.utmMedium).toBeNull();
    expect(lead.source.utmCampaign).toBeNull();
  });

  it("passes through provided utm fields", () => {
    const lead = buildLead(
      validRaw({ utmSource: "google", utmMedium: "cpc", utmCampaign: "spring" }),
      ID,
      SID,
      AT,
    );
    expect(lead.source.utmSource).toBe("google");
    expect(lead.source.utmMedium).toBe("cpc");
    expect(lead.source.utmCampaign).toBe("spring");
  });

  it("carries the injected id, submissionId and receivedAt verbatim", () => {
    const lead = buildLead(validRaw(), ID, SID, AT);
    expect(lead.id).toBe(ID);
    expect(lead.submissionId).toBe(SID);
    expect(lead.receivedAt).toBe(AT);
  });
});

describe("makeInquiryId", () => {
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const RE = /^ML-[A-Z2-9]{5}$/;

  it("is deterministic for a fixed rand", () => {
    const id = makeInquiryId(() => 0);
    // rand() === 0 → floor(0 * len) === 0 → first alphabet char, five times.
    expect(id).toBe(`ML-${ALPHABET[0]!.repeat(5)}`);
    expect(id).toBe("ML-AAAAA");
  });

  it("matches the id format for several seeded rands", () => {
    const seeds = [() => 0, () => 0.5, () => 0.999999, () => 0.25, () => 0.75];
    for (const rand of seeds) {
      expect(makeInquiryId(rand)).toMatch(RE);
    }
  });

  it("only uses characters from the unambiguous alphabet", () => {
    // Sweep deterministic rands across [0,1) and confirm every emitted char is legal.
    for (let i = 0; i < ALPHABET.length; i++) {
      const r = i / ALPHABET.length;
      const id = makeInquiryId(() => r);
      const body = id.slice(3); // strip "ML-"
      for (const ch of body) expect(ALPHABET).toContain(ch);
    }
  });
});

describe("formatLeadSummary", () => {
  function buildSummaryLead(overrides: Partial<Lead> = {}): Lead {
    const base = buildLead(
      validRaw({ email: "jane@example.com", count: "12" }),
      "ML-ABCDE",
      "sub-0123456789abcdef",
      "2026-06-28T12:00:00.000Z",
    );
    return { ...base, ...overrides };
  }

  it("includes the id, name, and phone", () => {
    const summary = formatLeadSummary(buildSummaryLead());
    expect(summary).toContain("ML-ABCDE");
    expect(summary).toContain("Jane Doe");
    expect(summary).toContain("(310) 555-0142");
  });

  it("renders an em-dash for absent optional fields", () => {
    const summary = formatLeadSummary(
      buildSummaryLead({
        email: null,
        childCount: null,
        show: null,
        notes: null,
      }),
    );
    expect(summary).toContain("Email:       —");
    expect(summary).toContain("Children:    —");
    expect(summary).toContain("Show:        —");
    // The notes section falls back to a lone em-dash on its own line.
    expect(summary).toContain("\n—");
  });

  it("is plain text with no HTML/markdown markup", () => {
    const summary = formatLeadSummary(buildSummaryLead({ notes: "Please call after 5pm" }));
    expect(summary).not.toMatch(/[<>]/);
    // No markdown emphasis/heading/link syntax.
    expect(summary).not.toMatch(/\*\*|^#|\[[^\]]*\]\(/m);
  });
});

describe("formatLeadTelegram", () => {
  function buildTgLead(overrides: Partial<Lead> = {}): Lead {
    const base = buildLead(
      validRaw({ email: "jane@example.com", count: "12", show: "The Little Mermaid", notes: "Call after 5pm" }),
      "ML-ABCDE",
      "sub-0123456789abcdef",
      "2026-06-28T12:00:00.000Z",
    );
    return { ...base, ...overrides };
  }

  it("includes every field the visitor filled", () => {
    const msg = formatLeadTelegram(buildTgLead());
    expect(msg).toContain("ML-ABCDE");
    expect(msg).toContain("Jane Doe");
    expect(msg).toContain("(310) 555-0142");
    expect(msg).toContain("jane@example.com");
    expect(msg).toContain("Birthday party");
    expect(msg).toContain("Los Angeles");
    expect(msg).toContain("The Little Mermaid");
    expect(msg).toContain("Call after 5pm");
    expect(msg).toContain("12");
  });

  it("omits absent optional fields entirely (no empty rows)", () => {
    const msg = formatLeadTelegram(buildTgLead({ email: null, show: null, notes: null, childCount: null }));
    expect(msg).not.toContain("Email");
    expect(msg).not.toContain("Show");
    expect(msg).not.toContain("Notes");
    expect(msg).not.toContain("Children");
    // Required fields still present.
    expect(msg).toContain("Jane Doe");
  });
});

describe("toSheetRow", () => {
  function buildRowLead(overrides: Partial<Lead> = {}): Lead {
    const base = buildLead(
      validRaw({ email: "jane@example.com", count: "12" }),
      "ML-ABCDE",
      "sub-0123456789abcdef",
      "2026-06-28T12:00:00.000Z",
    );
    return { ...base, ...overrides };
  }

  it("flattens the lead into stable columns", () => {
    const row = toSheetRow(buildRowLead());
    expect(row.id).toBe("ML-ABCDE");
    expect(row.name).toBe("Jane Doe");
    expect(row.email).toBe("jane@example.com");
    expect(row.childCount).toBe(12);
    expect(row.eventType).toBe("Birthday party");
  });

  it("uses empty strings (not null) for absent optional fields", () => {
    const row = toSheetRow(buildRowLead({ email: null, time: null, show: null, notes: null, childCount: null }));
    expect(row.email).toBe("");
    expect(row.time).toBe("");
    expect(row.show).toBe("");
    expect(row.notes).toBe("");
    expect(row.childCount).toBe("");
  });
});

describe("sanitizeSubmissionId", () => {
  it("accepts a crypto.randomUUID-shaped value", () => {
    const uuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    expect(sanitizeSubmissionId(uuid)).toBe(uuid);
  });

  it("rejects a non-string", () => {
    expect(sanitizeSubmissionId(undefined)).toBeNull();
    expect(sanitizeSubmissionId(123)).toBeNull();
    expect(sanitizeSubmissionId(null)).toBeNull();
  });

  it("rejects a too-short value", () => {
    expect(sanitizeSubmissionId("abc")).toBeNull(); // < 8 chars after cleaning
  });

  it("strips disallowed characters and caps length", () => {
    const dirty = "  ab cd<script>".padEnd(200, "x");
    const clean = sanitizeSubmissionId(dirty);
    expect(clean).not.toBeNull();
    expect(clean!.length).toBeLessThanOrEqual(100);
    expect(clean).not.toMatch(/[<> ]/);
  });

  it("returns null when cleaning leaves too few characters", () => {
    expect(sanitizeSubmissionId("<<< >>>")).toBeNull();
  });
});

describe("toStoredLead", () => {
  function lead(overrides: Partial<Lead> = {}): Lead {
    const base = buildLead(
      validRaw({ email: "jane@example.com", count: "12" }),
      "ML-ABCDE",
      "sub-0123456789abcdef",
      "2026-06-28T12:00:00.000Z",
    );
    return { ...base, ...overrides };
  }

  it("starts status new, updatedAt = receivedAt, notifications pending", () => {
    const doc = toStoredLead(lead());
    expect(doc.status).toBe("new");
    expect(doc.updatedAt).toBe(doc.receivedAt);
    expect(doc.notificationStatus).toEqual({ email: "pending", telegram: "pending", sheets: "pending" });
  });

  it("carries id and submissionId", () => {
    const doc = toStoredLead(lead());
    expect(doc.id).toBe("ML-ABCDE");
    expect(doc.submissionId).toBe("sub-0123456789abcdef");
  });

  it("omits null/empty optional fields rather than storing null", () => {
    const doc = toStoredLead(lead({ email: null, time: null, show: null, notes: null, childCount: null }));
    expect(doc.email).toBeUndefined();
    expect(doc.time).toBeUndefined();
    expect(doc.show).toBeUndefined();
    expect(doc.notes).toBeUndefined();
    expect(doc.childCount).toBeUndefined();
    expect("email" in doc ? doc.email : undefined).toBeUndefined();
  });

  it("does not store IP, user-agent, or geo (no such keys exist)", () => {
    const doc = toStoredLead(lead());
    expect(doc).not.toHaveProperty("ip");
    expect(doc).not.toHaveProperty("userAgent");
    expect(doc).not.toHaveProperty("geo");
  });

  it("keeps provided optional fields", () => {
    const doc = toStoredLead(lead({ email: "jane@example.com", childCount: 12 }));
    expect(doc.email).toBe("jane@example.com");
    expect(doc.childCount).toBe(12);
  });
});
