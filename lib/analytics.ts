// Minimal, no-op-safe analytics layer for lead-related events. Client-safe (no
// secrets, no server imports). PRIVACY RULE: event payloads carry NO personal data
// — never a name, email, phone, address, comment, or any child information. Only
// the event type, the (non-PII) event_type label, and source path/UTM are allowed.
//
// This is intentionally a thin shim: if a real analytics tool is wired later
// (window.dataLayer / a provider), `track` forwards to it; otherwise it is a safe
// no-op. No broad analytics is implemented here — only the events this task needs.

export type LeadEvent =
  | "lead_success"
  | "lead_error"
  | "phone_click"
  | "sms_click"
  | "whatsapp_click"
  | "email_click";

/** Allow-listed, non-PII fields only. Anything else is dropped. */
export interface LeadEventProps {
  /** Marketing event_type label (e.g. "Birthday party") — NOT a person. */
  eventType?: string;
  /** Site-relative source path. */
  path?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const ALLOWED: (keyof LeadEventProps)[] = [
  "eventType",
  "path",
  "utmSource",
  "utmMedium",
  "utmCampaign",
];

/** Strip the payload down to the allow-list so no PII can ever leak through. */
function sanitize(props?: LeadEventProps): Record<string, string> {
  const out: Record<string, string> = {};
  if (!props) return out;
  for (const k of ALLOWED) {
    const v = props[k];
    if (typeof v === "string" && v) out[k] = v.slice(0, 120);
  }
  return out;
}

interface DataLayerWindow {
  dataLayer?: { push: (e: Record<string, unknown>) => void };
}

/** Emit a lead event. Safe no-op if no analytics sink is present. Never throws. */
export function track(event: LeadEvent, props?: LeadEventProps): void {
  try {
    if (typeof window === "undefined") return;
    const dl = (window as DataLayerWindow).dataLayer;
    if (dl && typeof dl.push === "function") {
      dl.push({ event, ...sanitize(props) });
    }
  } catch {
    // analytics must never break the UX
  }
}
