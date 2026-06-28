// Lead contract — the single source of truth for the inquiry payload, server-side
// validation/normalization, the internal inquiry id, and the human-readable event
// summary. Pure, dependency-free, and fully unit-testable (no env, no I/O here).
// Used by app/api/lead/route.ts. Privacy-minimal: we never require child names;
// the only free text is an optional "notes" field the visitor chooses to write.
//
// IMPORTANT: client-side validation in LeadForm is a UX nicety; THIS is the
// authoritative gate. The server re-validates and normalizes every field.

/** Raw, untrusted string map as received from the form POST (all values strings). */
export type RawLead = Record<string, unknown>;

/** A validated, normalized lead ready to notify + persist. */
export interface Lead {
  /** Internal inquiry id (e.g. "ML-7F3K2"). Safe to show the visitor + owner. */
  id: string;
  /**
   * Client-generated submission identifier (one per form attempt). The browser
   * reuses it across automatic retries of the SAME submission so a double-click or
   * network retry never creates a second lead; the durable store enforces this with a
   * unique index on submissionId. A fresh, completed submission gets a fresh value.
   * Always a non-empty server-trusted string (the route falls back to a random id if
   * the client omits it), so idempotency degrades gracefully but never crashes.
   */
  submissionId: string;
  /** ISO timestamp the server accepted the lead. */
  receivedAt: string;
  name: string;
  phone: string;
  email: string | null;
  eventType: string;
  /** Normalized to ISO yyyy-mm-dd when parseable, else the raw trimmed string. */
  date: string;
  time: string | null;
  city: string;
  childCount: number | null;
  show: string | null;
  notes: string | null;
  /** Source attribution — page the form was on + UTM (no PII). */
  source: LeadSource;
}

export interface LeadSource {
  /** Site-relative path the inquiry came from (e.g. "/birthdays"). */
  path: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
}

export interface ValidationResult {
  ok: boolean;
  /** Field-keyed messages (same keys the client uses) when ok === false. */
  errors: Record<string, string>;
}

const EVENT_TYPES = [
  "Preschool / daycare",
  "School assembly",
  "Birthday party",
  "Private party / event",
];

const MAX = { name: 120, phone: 40, email: 160, city: 120, show: 120, notes: 2000, utm: 120 } as const;

function str(raw: RawLead, key: string): string {
  const v = raw[key];
  return typeof v === "string" ? v.trim() : "";
}

/** Collapse whitespace and hard-cap length (defence against payload abuse). */
function clean(s: string, max: number): string {
  return s.replace(/\s+/g, " ").trim().slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const US_DATE_RE = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/;

/** Validate the raw payload. Mirrors the client rules but is authoritative. */
export function validateLead(raw: RawLead): ValidationResult {
  const errors: Record<string, string> = {};

  const name = str(raw, "name");
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length > MAX.name) errors.name = "That name is too long.";

  const phone = str(raw, "phone");
  // Lenient: require some digits, allow +()- spaces. We call back, so format is loose.
  if (!phone) errors.phone = "Add a phone number so we can call you back.";
  else if ((phone.match(/\d/g) ?? []).length < 7) errors.phone = "Please check the phone number.";

  const email = str(raw, "email");
  if (email && !EMAIL_RE.test(email)) errors.email = "Please check the email address.";

  const type = str(raw, "type");
  if (!type) errors.type = "Pick the kind of event.";
  else if (!EVENT_TYPES.includes(type)) errors.type = "Pick the kind of event.";

  const date = str(raw, "date");
  if (!date) errors.date = "Please add a date so we can check availability.";
  else if (!US_DATE_RE.test(date)) errors.date = "Use the mm/dd/yyyy format (e.g. 12/01/2026).";

  const city = str(raw, "city");
  if (!city) errors.city = "Which city or area are you in?";

  const count = str(raw, "count");
  if (count && (!/^\d{1,4}$/.test(count) || Number(count) < 1)) {
    errors.count = "Enter the number of children.";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

/** Convert "mm/dd/yyyy" → "yyyy-mm-dd"; pass through anything else (already validated). */
function normalizeDate(usDate: string): string {
  const m = US_DATE_RE.exec(usDate);
  if (!m) return usDate;
  const [, mm, dd, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Build a normalized Lead from a validated raw payload. Caller MUST have run
 * validateLead first. `id`, `submissionId` and `receivedAt` are injected so this
 * stays pure (the route supplies them; tests can supply fixed values).
 */
export function buildLead(raw: RawLead, id: string, submissionId: string, receivedAt: string): Lead {
  const email = clean(str(raw, "email"), MAX.email);
  const time = clean(str(raw, "time"), 16);
  const count = str(raw, "count");
  const show = clean(str(raw, "show"), MAX.show);
  const notes = clean(str(raw, "notes"), MAX.notes);

  const utm = (k: string): string | null => {
    const v = clean(str(raw, k), MAX.utm);
    return v || null;
  };

  return {
    id,
    submissionId,
    receivedAt,
    name: clean(str(raw, "name"), MAX.name),
    phone: clean(str(raw, "phone"), MAX.phone),
    email: email || null,
    eventType: str(raw, "type"),
    date: normalizeDate(str(raw, "date")),
    time: time || null,
    city: clean(str(raw, "city"), MAX.city),
    childCount: /^\d{1,4}$/.test(count) ? Number(count) : null,
    show: show || null,
    notes: notes || null,
    source: {
      path: clean(str(raw, "sourcePath"), MAX.utm) || "/booking",
      utmSource: utm("utmSource"),
      utmMedium: utm("utmMedium"),
      utmCampaign: utm("utmCampaign"),
    },
  };
}

/** Short, URL-safe internal inquiry id. `rand` is injected for testability. */
export function makeInquiryId(rand: () => number): string {
  const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let out = "";
  for (let i = 0; i < 5; i++) out += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return `ML-${out}`;
}

/**
 * Validate + normalize the client-supplied submission id. The browser sends a
 * `crypto.randomUUID()` (reused across retries of one submission). We accept any
 * reasonable opaque token but bound it and strip control/whitespace, so a hostile
 * client can't smuggle a huge or malformed value into the unique index. Returns null
 * when the input is unusable; the route then mints a server-side fallback so a missing
 * submissionId never blocks a valid lead (idempotency simply degrades to per-request).
 */
export function sanitizeSubmissionId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().replace(/[^\w.:-]/g, "").slice(0, 100);
  return v.length >= 8 ? v : null;
}

/**
 * Telegram alert body — the FULL inquiry, owner-facing. Unlike the old short alert,
 * this carries every field the visitor filled so the owner (Svitlana) can act straight
 * from the chat without opening the database or email: she has no DB access and needs
 * none. Sent only to the owner's private bot/chat (a closed channel), so the full
 * contact details stay inside the owner's own notification surface. Empty optional
 * fields are omitted (no noisy em-dashes). Plain text — no markup, no secrets.
 */
export function formatLeadTelegram(lead: Lead): string {
  const rows: Array<[string, string | null]> = [
    ["🆔 ID", lead.id],
    ["📋 Type", lead.eventType],
    ["📅 Date", `${lead.date}${lead.time ? ` at ${lead.time}` : ""}`],
    ["📍 City", lead.city],
    ["👤 Name", lead.name],
    ["📞 Phone", lead.phone],
    ["✉️ Email", lead.email],
    ["🧒 Children", lead.childCount != null ? String(lead.childCount) : null],
    ["🎭 Show", lead.show],
    ["📝 Notes", lead.notes],
  ];
  const lines = ["🎭 New booking inquiry", ""];
  for (const [label, value] of rows) if (value) lines.push(`${label}: ${value}`);

  const utm = [lead.source.utmSource, lead.source.utmMedium, lead.source.utmCampaign]
    .filter(Boolean)
    .join(" / ");
  lines.push("", `🔗 Source: ${lead.source.path}${utm ? ` (${utm})` : ""}`);
  lines.push(`🕒 Received: ${lead.receivedAt}`);
  return lines.join("\n");
}

/**
 * Flat, stable-column projection of a lead for the Google Sheets webhook (one row per
 * inquiry). Order here defines the spreadsheet column order; absent optional values are
 * empty strings (not null) so cells stay blank rather than reading "null". Keep this in
 * sync with the header row in the Apps Script (docs/operations/LEAD_PIPELINE_RUNBOOK.md).
 */
export function toSheetRow(lead: Lead): Record<string, string | number> {
  return {
    receivedAt: lead.receivedAt,
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? "",
    eventType: lead.eventType,
    date: lead.date,
    time: lead.time ?? "",
    city: lead.city,
    childCount: lead.childCount ?? "",
    show: lead.show ?? "",
    notes: lead.notes ?? "",
    sourcePath: lead.source.path,
    utmSource: lead.source.utmSource ?? "",
    utmMedium: lead.source.utmMedium ?? "",
    utmCampaign: lead.source.utmCampaign ?? "",
  };
}

/** Human-readable owner notification body (plain text — no secrets, no markup). */
export function formatLeadSummary(lead: Lead): string {
  const lines = [
    `New booking inquiry — ${lead.id}`,
    ``,
    `Name:        ${lead.name}`,
    `Phone:       ${lead.phone}`,
    `Email:       ${lead.email ?? "—"}`,
    `Event type:  ${lead.eventType}`,
    `Date:        ${lead.date}${lead.time ? ` at ${lead.time}` : ""}`,
    `City / area: ${lead.city}`,
    `Children:    ${lead.childCount ?? "—"}`,
    `Show:        ${lead.show ?? "—"}`,
    ``,
    `Notes:`,
    lead.notes ? lead.notes : "—",
    ``,
    `Source:      ${lead.source.path}`,
    `UTM:         ${[lead.source.utmSource, lead.source.utmMedium, lead.source.utmCampaign]
      .filter(Boolean)
      .join(" / ") || "—"}`,
    `Received:    ${lead.receivedAt}`,
  ];
  return lines.join("\n");
}

// --- Durable store document (MongoDB) ---------------------------------------
// The shape persisted to MongoDB Atlas. Derived only from the validated Lead plus
// pipeline lifecycle metadata. PRIVACY: we store ONLY validated customer fields with
// a business reason — never IP, user-agent, geo, raw request bodies, or provider
// tokens/responses (those would add risk with no operational value). See the plan §C1.

/** Booking lifecycle. Starts `new`; an operator advances it out of band. */
export type LeadStatus = "new" | "contacted" | "booked" | "declined" | "spam";

/** Per-channel notification result recorded alongside the lead (no PII). */
export type ChannelStatus = "pending" | "ok" | "error" | "skipped";

export interface NotificationStatus {
  email: ChannelStatus;
  telegram: ChannelStatus;
  /** Google Sheets append outcome (optional secondary channel). */
  sheets?: ChannelStatus;
  /** ISO timestamp of the last notification attempt, once attempted. */
  lastAttemptAt?: string;
}

/** The document stored in MongoDB. `_id` is left to MongoDB; `id` is our inquiry id. */
export interface StoredLead {
  id: string;
  submissionId: string;

  receivedAt: string;
  updatedAt: string;
  status: LeadStatus;

  name: string;
  phone: string;
  email?: string;
  eventType: string;
  date: string;
  time?: string;
  city: string;
  childCount?: number;
  show?: string;
  notes?: string;

  source: {
    path?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };

  notificationStatus: NotificationStatus;
}

/** Drop null/empty optional fields so the stored document stays minimal. */
function pick<T>(v: T | null | undefined): T | undefined {
  return v === null || v === undefined || v === "" ? undefined : v;
}

/**
 * Project a validated Lead into the durable document. `updatedAt` initially equals
 * `receivedAt`; `status` starts `new`; notifications start `pending` and are patched
 * after delivery. Optional customer fields are omitted (not stored as null).
 */
export function toStoredLead(lead: Lead): StoredLead {
  return {
    id: lead.id,
    submissionId: lead.submissionId,
    receivedAt: lead.receivedAt,
    updatedAt: lead.receivedAt,
    status: "new",
    name: lead.name,
    phone: lead.phone,
    email: pick(lead.email),
    eventType: lead.eventType,
    date: lead.date,
    time: pick(lead.time),
    city: lead.city,
    childCount: pick(lead.childCount),
    show: pick(lead.show),
    notes: pick(lead.notes),
    source: {
      path: pick(lead.source.path),
      utmSource: pick(lead.source.utmSource),
      utmMedium: pick(lead.source.utmMedium),
      utmCampaign: pick(lead.source.utmCampaign),
    },
    notificationStatus: { email: "pending", telegram: "pending", sheets: "pending" },
  };
}
