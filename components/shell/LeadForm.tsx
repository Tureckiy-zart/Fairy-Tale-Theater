"use client";
// LeadForm — the primary lead-capture form (the #1 conversion block — SITE_STRUCTURE
// §4.7/§5). Built from the Field + Button primitives plus a token-matched native
// <select> for the event type (composed, NOT a forked primitive). Client-side
// validation + an on-screen confirmation state only — there is NO backend yet
// (email/CRM is a later phase; the success panel says so). Spec: DESIGN_SYSTEM §11
// (form states: helper/error/success; colour never the sole signal) + §13 (a11y).
import { useRef, useState } from "react";
import { CheckCircle, Lightbulb, WarningCircle } from "phosphor-react";
import { Button, Field, SectionHeader } from "@/components/ui";
import { cx } from "@/components/ui/cx";
import { SparkStar } from "@/components/brand/Glyphs";
import { PHONES } from "@/lib/site";

type Errors = Partial<Record<string, string>>;

const EVENT_TYPES = ["Preschool / daycare", "School assembly", "Birthday party", "Private party / event"];

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const get = (k: string) => String(data.get(k) ?? "").trim();
  if (!get("name")) errors.name = "Please tell us your name.";
  if (!get("phone")) errors.phone = "Add a phone number so we can call you back.";
  const email = get("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please check the email address.";
  if (!get("type")) errors.type = "Pick the kind of event.";
  if (!get("date")) errors.date = "Please add a date so we can check availability.";
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

function SuccessPanel({ headingId }: { headingId: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-success bg-success-bg p-8 text-center">
      <CheckCircle size={48} weight="duotone" aria-hidden className="mx-auto text-success" />
      <h2 id={headingId} className="mt-3 font-display text-3xl text-forest-800">
        Request received — thank you!
      </h2>
      <p className="mt-3 font-semibold text-success-text">
        This is a demo form — no message is sent yet (the email/CRM backend comes in a later phase).
      </p>
      <p className="mt-2 text-ink-soft">In the meantime, you can reach us directly:</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {PHONES.map((p) => (
          <a
            key={p.tel}
            href={`tel:${p.tel}`}
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
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const headingId = `${id}-heading`;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate(new FormData(e.currentTarget));
    setErrors(next);
    const keys = Object.keys(next);
    if (keys.length > 0) {
      formRef.current?.querySelector<HTMLElement>(`[name="${keys[0]}"]`)?.focus();
      return;
    }
    setSubmitted(true);
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <section id={id} aria-labelledby={headingId} className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        {submitted ? (
          <SuccessPanel headingId={headingId} />
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
              <Field label="Full name" name="name" required error={errors.name} autoComplete="name" placeholder="e.g. Alex Rivera" />
              <Field label="Phone" name="phone" type="tel" required error={errors.phone} autoComplete="tel" placeholder="(213) 555-0142" />
              <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" helper="Optional — we'll mostly call." placeholder="you@example.com" />
              <SelectField label="Event type" name="type" required error={errors.type} options={EVENT_TYPES} />
              <Field label="Event date" name="date" type="date" required error={errors.date} />
              <Field label="Start time" name="time" type="time" helper="Optional." />
              <Field label="City / area" name="city" required error={errors.city} autoComplete="address-level2" placeholder="e.g. Pasadena" />
              <Field label="Number of children" name="count" type="number" min={1} inputMode="numeric" error={errors.count} helper="Optional — it helps us price the show." />
              <Field label="Preferred show" name="show" helper="Optional — if you have one in mind." className="sm:col-span-2" />
              <Field label="Anything else?" name="notes" multiline rows={4} helper="Tell us about your event — venue, ages, timing…" className="sm:col-span-2" />

              <div className="flex flex-col gap-3 sm:col-span-2">
                {hasErrors ? (
                  <p className="flex items-start gap-1.5 text-sm text-error-text">
                    <WarningCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
                    <span>Please fix the highlighted fields below.</span>
                  </p>
                ) : null}
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  className="sm:w-auto"
                  leadingIcon={
                    <span data-icon="duotone-brand">
                      <Lightbulb size={20} weight="duotone" />
                    </span>
                  }
                >
                  Request a booking
                </Button>
                <p className="text-sm text-ink-soft">
                  Demo only — this form doesn&rsquo;t send anything yet. Required fields are marked
                  &ldquo;(required)&rdquo;.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
