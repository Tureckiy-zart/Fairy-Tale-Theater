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
 * validateLead first. `id` and `receivedAt` are injected so this stays pure
 * (the route supplies them; tests can supply fixed values).
 */
export function buildLead(raw: RawLead, id: string, receivedAt: string): Lead {
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
