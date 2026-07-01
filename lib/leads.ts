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

// --- Contact keys (durable per-contact daily cap) ---------------------------
/**
 * Normalized phone key for the per-contact daily cap. Digits only; for a US number we
 * keep the LAST 10 so "(310) 555-0142", "310-555-0142" and "+1 310 555 0142" all map to
 * the same key. Returns "" only when the phone had no digits (validateLead already
 * requires ≥7, so that never happens in the live pipeline). Pure + deterministic.
 */
export function phoneKey(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/** Normalized email key (trimmed + lowercased) for the per-contact daily cap, or null. */
export function emailKey(email: string | null | undefined): string | null {
  const e = (email ?? "").trim().toLowerCase();
  return e || null;
}

// --- Owner-facing date/time normalization (pure, deterministic) -------------
// The owner reads these in Telegram/Sheets, never a raw ISO blob. Two rules:
//   1. The customer's EVENT date is a calendar day — it must NEVER shift across a
//      timezone. We format "yyyy-mm-dd" from its literal parts (no Date/UTC parse),
//      so August 10 stays August 10 everywhere on Earth.
//   2. The RECEIVED instant is a real point in time — we render it in the owner's
//      wall-clock zone (America/Los_Angeles) with a PST/PDT label, while MongoDB
//      keeps the canonical UTC ISO. Both are derived here so tests pin the behavior.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/** "13:05" → "1:05 PM"; "09:30" → "9:30 AM". Non-HH:MM input passes through. */
function formatTime12h(time: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return time.trim(); // unknown free-text time — show as the visitor typed it
  const h = Number(m[1]);
  const min = m[2]!;
  if (h > 23 || Number(min) > 59) return time.trim();
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${min} ${period}`;
}

/**
 * Owner-facing event date. A normalized "yyyy-mm-dd" becomes "August 10, 2026"
 * (the SAME calendar day, no UTC shift) with an optional " at 11:25 AM". A
 * non-ISO passthrough date (e.g. "next Friday") is shown verbatim with its time.
 */
export function formatEventDate(date: string, time: string | null): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = time ? formatTime12h(time) : null;
  if (!m) return t ? `${date} at ${t}` : date; // free-text date, keep as-is
  const month = MONTHS[Number(m[2]) - 1] ?? m[2];
  const day = Number(m[3]); // strip any leading zero
  const base = `${month} ${day}, ${m[1]}`;
  return t ? `${base} at ${t}` : base;
}

/**
 * Owner-facing received time, in America/Los_Angeles with a PST/PDT label, e.g.
 * "June 28, 2026 at 11:25 AM PDT". Built from Intl parts so the wording and the
 * DST-correct zone abbreviation are deterministic. The canonical UTC ISO stays in
 * MongoDB; this is purely a human-readable projection. Invalid input passes through.
 */
export function formatReceivedLosAngeles(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(d);
  const p: Record<string, string> = {};
  for (const part of parts) p[part.type] = part.value;
  return `${p.month} ${p.day}, ${p.year} at ${p.hour}:${p.minute} ${p.dayPeriod} ${p.timeZoneName}`;
}

// --- Telegram formatter -----------------------------------------------------
/**
 * Safe internal cap, comfortably below the Telegram Bot API hard limit of 4096
 * characters. We never approach the wire limit; only the owner-facing Notes field
 * is ever trimmed to stay under it.
 */
export const TELEGRAM_SAFE_LIMIT = 3900;

/** Appended to a trimmed Notes so the owner knows the full text lives elsewhere. */
export const TELEGRAM_TRUNCATION_MARKER =
  "[truncated — full text is stored in MongoDB and Google Sheets]";

/**
 * Telegram alert body — the FULL inquiry, owner-facing. Carries every field the
 * visitor filled so the owner (Svitlana) can act straight from the chat without the
 * database or email. Sent only to the owner's private bot/chat (a closed channel),
 * so the full contact details stay inside the owner's own notification surface.
 *
 * Deterministic and side-effect-free. Plain text — NO parse_mode — so customer text
 * containing Markdown/HTML metacharacters (* _ < > & ` ~ [ ] etc.), emoji, Cyrillic
 * or newlines can never break the message or be interpreted as markup. Empty optional
 * fields are omitted entirely (no noisy em-dashes). The message is guaranteed to stay
 * under TELEGRAM_SAFE_LIMIT: if it would exceed it, ONLY Notes is trimmed (with an
 * explicit marker) — the id, name, phone, email, date, city and type are never cut,
 * and the lead's own `notes` field is left untouched (the full text stays in the store).
 */
export function formatLeadTelegram(lead: Lead): string {
  const eventDate = formatEventDate(lead.date, lead.time);
  const received = formatReceivedLosAngeles(lead.receivedAt);

  const build = (notes: string | null): string => {
    const lines = ["🎭 New booking inquiry", ""];
    const primary: Array<[string, string | null]> = [
      ["🆔 ID", lead.id],
      ["📋 Type", lead.eventType],
      ["📅 Date and time", eventDate],
      ["📍 City", lead.city],
      ["👤 Name", lead.name],
      ["📞 Phone", lead.phone],
      ["✉️ Email", lead.email],
      ["🧒 Children", lead.childCount != null ? String(lead.childCount) : null],
      ["🎭 Show", lead.show],
      ["📝 Notes", notes],
    ];
    for (const [label, value] of primary) if (value) lines.push(`${label}: ${value}`);

    const attribution: Array<[string, string | null]> = [
      ["🔗 Source", lead.source.path],
      ["📣 UTM Source", lead.source.utmSource],
      ["📣 UTM Medium", lead.source.utmMedium],
      ["📣 UTM Campaign", lead.source.utmCampaign],
      ["🕒 Received", received],
    ];
    lines.push("");
    for (const [label, value] of attribution) if (value) lines.push(`${label}: ${value}`);
    return lines.join("\n");
  };

  const full = build(lead.notes);
  if (full.length <= TELEGRAM_SAFE_LIMIT) return full;

  // Over the safe limit — trim ONLY Notes by exactly the overflow plus the marker, so
  // the result lands at the limit and every other field is preserved intact.
  const notes = lead.notes ?? "";
  const overflow = full.length - TELEGRAM_SAFE_LIMIT;
  const keep = Math.max(0, notes.length - overflow - TELEGRAM_TRUNCATION_MARKER.length - 1);
  const trimmed = `${notes.slice(0, keep).trimEnd()} ${TELEGRAM_TRUNCATION_MARKER}`.trimStart();
  return build(trimmed);
}

// --- Google Sheets row ------------------------------------------------------
/**
 * Fixed, ordered Google Sheets column contract. The header row (row 1) of the sheet
 * MUST be exactly these names in this order, and the Apps Script maps each posted row
 * by these keys. Changing the order is a breaking change to the spreadsheet — append,
 * never reorder. Keep in sync with the Apps Script in LEAD_PIPELINE_RUNBOOK.md.
 */
export const GOOGLE_SHEETS_COLUMNS = [
  "submissionId",
  "id",
  "receivedAtUtc",
  "receivedAtLosAngeles",
  "status",
  "eventType",
  "eventDate",
  "eventTime",
  "city",
  "name",
  "phone",
  "email",
  "childCount",
  "show",
  "notes",
  "sourcePath",
  "utmSource",
  "utmMedium",
  "utmCampaign",
] as const;

export type SheetColumn = (typeof GOOGLE_SHEETS_COLUMNS)[number];

/**
 * Neutralize a spreadsheet formula-injection vector. Any cell whose first non-space
 * character is one of = + - @ is prefixed with a single quote so Sheets/Excel treat it
 * as literal text instead of evaluating it (e.g. "=IMPORTXML(...)", "+44…", "-12", "@x").
 * Phone numbers like "+44123456789" therefore stay text, never a formula or number.
 */
function neutralizeFormula(value: string): string {
  const firstNonSpace = value.trimStart()[0];
  if (firstNonSpace && "=+-@".includes(firstNonSpace)) return `'${value}`;
  return value;
}

/**
 * Flat, stable-column projection of a lead for the Google Sheets webhook (one row per
 * inquiry). Always returns every GOOGLE_SHEETS_COLUMNS key (a stable cell count that
 * matches the header), with null/undefined collapsed to "" and every value rendered as
 * a string with formula injection neutralized — so customer text can never become a
 * live spreadsheet formula and phone numbers stay text. The FULL notes are stored here
 * (never trimmed); receivedAtUtc is the canonical ISO, receivedAtLosAngeles the
 * human-readable mirror. `status` is "new" at submission time.
 */
export function toSheetRow(lead: Lead): Record<SheetColumn, string> {
  const cell = (v: string | number | null | undefined): string =>
    v === null || v === undefined || v === "" ? "" : neutralizeFormula(String(v));

  return {
    submissionId: cell(lead.submissionId),
    id: cell(lead.id),
    receivedAtUtc: cell(lead.receivedAt),
    receivedAtLosAngeles: cell(formatReceivedLosAngeles(lead.receivedAt)),
    status: "new",
    eventType: cell(lead.eventType),
    eventDate: cell(lead.date),
    eventTime: cell(lead.time),
    city: cell(lead.city),
    name: cell(lead.name),
    phone: cell(lead.phone),
    email: cell(lead.email),
    childCount: cell(lead.childCount),
    show: cell(lead.show),
    notes: cell(lead.notes),
    sourcePath: cell(lead.source.path),
    utmSource: cell(lead.source.utmSource),
    utmMedium: cell(lead.source.utmMedium),
    utmCampaign: cell(lead.source.utmCampaign),
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
  /** Normalized phone key (digits, last 10) — indexed for the per-contact daily cap. */
  phoneKey: string;
  /** Normalized email key (lowercased) — indexed for the per-contact daily cap. */
  emailKey?: string;
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
    phoneKey: phoneKey(lead.phone),
    emailKey: pick(emailKey(lead.email)),
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
