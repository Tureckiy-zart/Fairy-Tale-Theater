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
  formatEventDate,
  formatReceivedLosAngeles,
  toSheetRow,
  GOOGLE_SHEETS_COLUMNS,
  TELEGRAM_SAFE_LIMIT,
  TELEGRAM_TRUNCATION_MARKER,
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

describe("formatEventDate", () => {
  it("renders a normalized ISO date as a human month-day-year (same calendar day)", () => {
    expect(formatEventDate("2026-08-10", null)).toBe("August 10, 2026");
  });

  it("never shifts the calendar day regardless of host timezone", () => {
    // A naive `new Date('2026-08-10')` parses as UTC midnight and can render as Aug 9
    // in negative-offset zones. We format from the literal parts, so the day is stable.
    const original = process.env.TZ;
    try {
      for (const tz of ["UTC", "America/Los_Angeles", "Pacific/Kiritimati", "Etc/GMT+12"]) {
        process.env.TZ = tz;
        expect(formatEventDate("2026-08-10", null)).toBe("August 10, 2026");
      }
    } finally {
      process.env.TZ = original;
    }
  });

  it("appends a 12-hour time when present", () => {
    expect(formatEventDate("2026-08-10", "11:25")).toBe("August 10, 2026 at 11:25 AM");
    expect(formatEventDate("2026-08-10", "14:30")).toBe("August 10, 2026 at 2:30 PM");
    expect(formatEventDate("2026-08-10", "00:05")).toBe("August 10, 2026 at 12:05 AM");
  });

  it("passes a non-ISO date through unchanged (with its time)", () => {
    expect(formatEventDate("next Friday", null)).toBe("next Friday");
    expect(formatEventDate("next Friday", "morning")).toBe("next Friday at morning");
  });
});

describe("formatReceivedLosAngeles", () => {
  it("renders the received instant in America/Los_Angeles, human-readable", () => {
    // 2026-06-28T18:25 UTC → 11:25 AM PDT (summer, daylight time).
    const out = formatReceivedLosAngeles("2026-06-28T18:25:31.849Z");
    expect(out).toBe("June 28, 2026 at 11:25 AM PDT");
  });

  it("labels standard time as PST in winter (DST handled correctly)", () => {
    // 2026-01-15T19:00 UTC → 11:00 AM PST (winter, standard time).
    const out = formatReceivedLosAngeles("2026-01-15T19:00:00.000Z");
    expect(out).toContain("PST");
    expect(out).toContain("January 15, 2026");
    expect(out).not.toContain("PDT");
  });

  it("passes an unparseable input through unchanged", () => {
    expect(formatReceivedLosAngeles("not-a-date")).toBe("not-a-date");
  });
});

describe("formatLeadTelegram", () => {
  function buildTgLead(overrides: Partial<Lead> = {}): Lead {
    const base = buildLead(
      validRaw({
        email: "jane@example.com",
        count: "12",
        show: "The Little Mermaid",
        notes: "Call after 5pm",
        date: "08/10/2026",
        time: "11:25",
        utmSource: "google",
        utmMedium: "cpc",
        utmCampaign: "spring",
      }),
      "ML-ABCDE",
      "sub-0123456789abcdef",
      "2026-06-28T18:25:31.849Z",
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
    expect(msg).toContain("UTM Source: google");
  });

  it("only the required fields show when optionals are empty", () => {
    const msg = formatLeadTelegram(
      buildTgLead({
        email: null,
        show: null,
        notes: null,
        childCount: null,
        time: null,
        source: { path: "/booking", utmSource: null, utmMedium: null, utmCampaign: null },
      }),
    );
    expect(msg).toContain("ID: ML-ABCDE");
    expect(msg).toContain("Type: Birthday party");
    expect(msg).toContain("City: Los Angeles");
    expect(msg).toContain("Name: Jane Doe");
    expect(msg).toContain("Phone: (310) 555-0142");
    expect(msg).toContain("Received:");
  });

  it("omits absent optional fields entirely (no empty rows)", () => {
    const msg = formatLeadTelegram(
      buildTgLead({
        email: null,
        show: null,
        notes: null,
        childCount: null,
        source: { path: "/booking", utmSource: null, utmMedium: null, utmCampaign: null },
      }),
    );
    expect(msg).not.toContain("Email");
    expect(msg).not.toContain("Show");
    expect(msg).not.toContain("Notes");
    expect(msg).not.toContain("Children");
    expect(msg).not.toContain("UTM Source");
    expect(msg).not.toContain("UTM Medium");
    expect(msg).not.toContain("UTM Campaign");
    // No "label: " followed immediately by a newline (i.e. no empty values).
    expect(msg).not.toMatch(/: *\n/);
  });

  it("renders the event date without shifting the calendar day, with a 12h time", () => {
    const msg = formatLeadTelegram(buildTgLead());
    expect(msg).toContain("Date and time: August 10, 2026 at 11:25 AM");
    expect(msg).not.toContain("2026-08-10");
  });

  it("renders the received time in America/Los_Angeles (PDT in summer)", () => {
    const msg = formatLeadTelegram(buildTgLead());
    expect(msg).toContain("Received: June 28, 2026 at 11:25 AM PDT");
    // The raw UTC ISO is never shown to the owner.
    expect(msg).not.toContain("2026-06-28T18:25:31.849Z");
  });

  it("carries customer special characters verbatim without breaking (plain text)", () => {
    const wild = "* _ < > & ` ~ [ ] ( ) # + - = | { } . ! 🎭 Привет\nсемья café";
    const msg = formatLeadTelegram(buildTgLead({ notes: wild, name: "O'Brien <test> & co" }));
    expect(msg).toContain(wild);
    expect(msg).toContain("O'Brien <test> & co");
    // It must still serialize cleanly into a JSON request body.
    expect(() => JSON.parse(JSON.stringify({ text: msg }))).not.toThrow();
  });

  it("stays under the safe limit and marks a very long Notes as truncated", () => {
    const huge = "lorem ipsum ".repeat(2000); // ~24k chars, far over the limit
    const lead = buildTgLead({ notes: huge });
    const msg = formatLeadTelegram(lead);
    expect(msg.length).toBeLessThanOrEqual(TELEGRAM_SAFE_LIMIT);
    expect(msg.length).toBeLessThan(4096); // Telegram Bot API hard limit
    expect(msg).toContain(TELEGRAM_TRUNCATION_MARKER);
    // Non-truncatable fields survive intact.
    expect(msg).toContain("ID: ML-ABCDE");
    expect(msg).toContain("Phone: (310) 555-0142");
    expect(msg).toContain("jane@example.com");
    // The source Lead's notes are NOT mutated — full text is kept for the store.
    expect(lead.notes).toBe(huge);
  });
});

describe("toSheetRow", () => {
  function buildRowLead(overrides: Partial<Lead> = {}): Lead {
    const base = buildLead(
      validRaw({ email: "jane@example.com", count: "12", time: "11:25" }),
      "ML-ABCDE",
      "sub-0123456789abcdef",
      "2026-06-28T18:25:31.849Z",
    );
    return { ...base, ...overrides };
  }

  it("returns exactly the fixed columns in the fixed order", () => {
    const row = toSheetRow(buildRowLead());
    expect(Object.keys(row)).toEqual([...GOOGLE_SHEETS_COLUMNS]);
  });

  it("header and row have the same length", () => {
    const row = toSheetRow(buildRowLead());
    expect(Object.keys(row).length).toBe(GOOGLE_SHEETS_COLUMNS.length);
  });

  it("flattens the lead into stable columns (all strings)", () => {
    const row = toSheetRow(buildRowLead());
    expect(row.submissionId).toBe("sub-0123456789abcdef");
    expect(row.id).toBe("ML-ABCDE");
    expect(row.name).toBe("Jane Doe");
    expect(row.email).toBe("jane@example.com");
    expect(row.childCount).toBe("12");
    expect(row.eventType).toBe("Birthday party");
    expect(row.status).toBe("new");
    expect(row.receivedAtUtc).toBe("2026-06-28T18:25:31.849Z");
    expect(row.receivedAtLosAngeles).toBe("June 28, 2026 at 11:25 AM PDT");
    for (const v of Object.values(row)) expect(typeof v).toBe("string");
  });

  it("uses empty strings (not null) for absent optional fields", () => {
    const row = toSheetRow(buildRowLead({ email: null, time: null, show: null, notes: null, childCount: null }));
    expect(row.email).toBe("");
    expect(row.eventTime).toBe("");
    expect(row.show).toBe("");
    expect(row.notes).toBe("");
    expect(row.childCount).toBe("");
  });

  it("keeps a phone number as text (never a formula or number)", () => {
    const row = toSheetRow(buildRowLead({ phone: "+44123456789" }));
    expect(row.phone).toBe("'+44123456789");
  });

  it("neutralizes spreadsheet formula-injection in customer fields", () => {
    expect(toSheetRow(buildRowLead({ show: '=IMPORTXML("https://example.com")' })).show).toBe(
      '\'=IMPORTXML("https://example.com")',
    );
    expect(toSheetRow(buildRowLead({ notes: "=HYPERLINK(1,2)" })).notes).toBe("'=HYPERLINK(1,2)");
    expect(toSheetRow(buildRowLead({ notes: "+12345" })).notes).toBe("'+12345");
    expect(toSheetRow(buildRowLead({ notes: "-12345" })).notes).toBe("'-12345");
    expect(toSheetRow(buildRowLead({ notes: "@mention" })).notes).toBe("'@mention");
  });

  it("leaves a benign value untouched", () => {
    expect(toSheetRow(buildRowLead({ notes: "Please call after 5pm" })).notes).toBe("Please call after 5pm");
  });

  it("stores the FULL notes (never truncated) and the submissionId", () => {
    const long = "x".repeat(1900);
    const row = toSheetRow(buildRowLead({ notes: long }));
    expect(row.notes).toBe(long);
    expect(row.submissionId).toBe("sub-0123456789abcdef");
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
