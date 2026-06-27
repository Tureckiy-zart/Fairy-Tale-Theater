"use client";
// LeadForm — the primary lead-capture form (the #1 conversion block — SITE_STRUCTURE
// §4.7/§5). Built from the Field + Button primitives plus a token-matched native
// <select> for the event type. PRODUCTION pipeline: the form POSTs to /api/lead,
// which server-validates, persists a durable record, and notifies the owner. The
// success panel renders ONLY after the server confirms acceptance (never a fake
// success). Spec: DESIGN_SYSTEM §11 (form states) + §13 (a11y).
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { Button, Field, SectionHeader } from "@/components/ui";
import { cx } from "@/components/ui/cx";
import { Lantern, SparkStar } from "@/components/brand/Glyphs";
import { PHONES } from "@/lib/site";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EVENT_TYPES = ["Preschool / daycare", "School assembly", "Birthday party", "Private party / event"];

// Client-side validation is a UX nicety; the server (lib/leads.validateLead) is the
// authoritative gate and re-checks everything.
function validate(data: FormData): Errors {
  const errors: Errors = {};
  const get = (k: string) => String(data.get(k) ?? "").trim();
  if (!get("name")) errors.name = "Please tell us your name.";
  if (!get("phone")) errors.phone = "Add a phone number so we can call you back.";
  const email = get("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please check the email address.";
  if (!get("type")) errors.type = "Pick the kind of event.";
  const date = get("date");
  if (!date) errors.date = "Please add a date so we can check availability.";
  else if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(date))
    errors.date = "Use the mm/dd/yyyy format (e.g. 12/01/2026).";
  if (!get("city")) errors.city = "Which city or area are you in?";
  const count = get("count");
  if (count && (!/^\d+$/.test(count) || Number(count) < 1)) errors.count = "Enter the number of children.";
  return errors;
}

/** Token-matched native select (mirrors the Field look — §11). Colour never alone. */
function SelectField({
  label,
  name,
  options,
  required,
  error,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  error?: string;
}) {
  const id = `lead-${name}`;
  const descId = `${id}-desc`;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1.5 font-body text-sm font-semibold text-ink">
        {label}
        {required ? <span className="font-normal text-ink-soft"> (required)</span> : null}
      </label>
      <select
        id={id}
        name={name}
        defaultValue=""
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? descId : undefined}
        className={cx(
          "min-h-12 w-full rounded-md border-[1.5px] border-border-strong bg-white px-4 py-3 font-body text-base text-ink",
          "focus-visible:border-forest-600",
          error && "border-error",
        )}
      >
        <option value="" disabled>
          Choose one…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error ? (
        <p id={descId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm text-error-text">
          <WarningCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

function SuccessPanel({ headingId, id }: { headingId: string; id: string | null }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-success bg-success-bg p-8 text-center">
      <CheckCircle size={48} weight="duotone" aria-hidden className="mx-auto text-success" />
      <h2 id={headingId} className="mt-3 font-display text-3xl text-forest-800">
        Request received — thank you!
      </h2>
      <p className="mt-3 font-semibold text-success-text">
        Miss Lana will reply by text, email, or WhatsApp within 1–2 business days.
      </p>
      {id ? (
        <p className="mt-2 text-sm text-ink-soft">
          Your reference is <span className="font-semibold text-ink">{id}</span>.
        </p>
      ) : null}
      <p className="mt-2 text-ink-soft">Prefer to talk now? Call us:</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {PHONES.map((p) => (
          <a
            key={p.tel}
            href={`tel:${p.tel}`}
            onClick={() => track("phone_click")}
            className="inline-flex items-center gap-2 rounded-pill border-[1.5px] border-forest-600 px-5 py-2 font-body font-bold text-forest-700 hover:bg-forest-50"
          >
            {p.display}
          </a>
        ))}
      </div>
    </div>
  );
}

export function LeadForm({
  id = "book",
  eyebrow,
  heading,
  sub,
}: {
  id?: string;
  eyebrow?: string;
  heading?: string;
  sub?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);
  const [dateValue, setDateValue] = useState("");
  const headingId = `${id}-heading`;

  // US-format masked date (mm/dd/yyyy) — deterministic regardless of browser locale,
  // no date library. Digits only, slashes auto-inserted.
  function onDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = e.target.value.replace(/\D/g, "").slice(0, 8);
    setDateValue(
      d.length > 4
        ? `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
        : d.length > 2
          ? `${d.slice(0, 2)}/${d.slice(2)}`
          : d,
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const next = validate(fd);
    setErrors(next);
    const keys = Object.keys(next);
    if (keys.length > 0) {
      formRef.current?.querySelector<HTMLElement>(`[name="${keys[0]}"]`)?.focus();
      return;
    }

    // Build a JSON payload from the form + source attribution (no PII in attribution).
    const payload: Record<string, string> = {};
    for (const [k, v] of fd.entries()) if (typeof v === "string") payload[k] = v;
    payload.sourcePath = pathname ?? "/booking";
    // Read UTM from the URL at submit time (client-only) — avoids forcing the page
    // into a Suspense/CSR bailout that useSearchParams would require.
    const qs = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    payload.utmSource = qs?.get("utm_source") ?? "";
    payload.utmMedium = qs?.get("utm_medium") ?? "";
    payload.utmCampaign = qs?.get("utm_campaign") ?? "";

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        id?: string;
        error?: string;
        fields?: Record<string, string>;
      };

      if (res.ok && data.ok) {
        setRefId(data.id ?? null);
        setStatus("success");
        track("lead_success", { eventType: payload.type, path: payload.sourcePath });
        return;
      }

      // Server rejected — show the real reason; map any field errors back.
      if (data.fields) setErrors(data.fields);
      setServerError(data.error ?? "Something went wrong — please try again or call us.");
      setStatus("error");
      track("lead_error", { path: payload.sourcePath });
    } catch {
      // Network failure — recoverable, never a false success.
      setServerError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
      track("lead_error", { path: payload.sourcePath });
    }
  }

  const hasErrors = Object.keys(errors).length > 0;
  const submitting = status === "submitting";

  return (
    <section id={id} aria-labelledby={headingId} className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        {status === "success" ? (
          <SuccessPanel headingId={headingId} id={refId} />
        ) : (
          <>
            {heading ? (
              <SectionHeader
                eyebrow={eyebrow}
                title={heading}
                subtitle={sub}
                marker={eyebrow ? <SparkStar size={16} /> : undefined}
                className="mb-8"
              />
            ) : null}

            <form ref={formRef} noValidate onSubmit={onSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Honeypot — visually hidden, off the tab order. Bots fill it; humans don't. */}
              <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="lead-company">Company (leave blank)</label>
                <input id="lead-company" type="text" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <Field label="Full name" name="name" required error={errors.name} autoComplete="name" placeholder="e.g. Alex Rivera" />
              <Field label="Phone" name="phone" type="tel" required error={errors.phone} autoComplete="tel" placeholder="(213) 555-0142" />
              <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" helper="Optional — we'll mostly call." placeholder="you@example.com" />
              <SelectField label="Event type" name="type" required error={errors.type} options={EVENT_TYPES} />
              <Field
                label="Event date"
                name="date"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="mm/dd/yyyy"
                value={dateValue}
                onChange={onDateChange}
                required
                error={errors.date}
                helper="mm/dd/yyyy"
              />
              <Field label="Start time" name="time" type="time" helper="Optional." />
              <Field label="City / area" name="city" required error={errors.city} autoComplete="address-level2" placeholder="e.g. Pasadena" />
              <Field label="Number of children" name="count" type="number" min={1} inputMode="numeric" error={errors.count} helper="Optional — it helps us plan the show." />
              <Field label="Preferred show" name="show" helper="Optional — if you have one in mind." className="sm:col-span-2" />
              <Field label="Anything else?" name="notes" multiline rows={4} helper="Tell us about your event — venue, ages, timing…" className="sm:col-span-2" />

              <div className="flex flex-col gap-3 sm:col-span-2">
                {hasErrors ? (
                  <p className="flex items-start gap-1.5 text-sm text-error-text">
                    <WarningCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
                    <span>Please fix the highlighted fields below.</span>
                  </p>
                ) : null}
                {status === "error" && serverError ? (
                  <p role="alert" className="flex items-start gap-1.5 text-sm text-error-text">
                    <WarningCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
                    <span>{serverError}</span>
                  </p>
                ) : null}
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  className="sm:w-auto"
                  disabled={submitting}
                  aria-busy={submitting || undefined}
                  leadingIcon={<Lantern size={20} className="text-glow-200" />}
                >
                  {submitting ? "Sending…" : status === "error" ? "Try again" : "Request a booking"}
                </Button>
                <p className="text-sm text-ink-soft">
                  We&rsquo;ll reply by text, email, or WhatsApp within 1–2 business days. Required
                  fields are marked &ldquo;(required)&rdquo;.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
