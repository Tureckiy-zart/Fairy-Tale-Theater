"use client";
// BookingCTABand — the repeating "Book Miss Lana" band near the bottom of pages
// (conversion architecture: lead capture everywhere — SITE_STRUCTURE §3/§5). Forest
// panel, white text (≥9:1), a static glow accent + lantern (§6 duotone), the primary
// CTA → /booking, and click-to-call. The glow is decorative and NOT animated (band
// can sit over the fold on short pages — §10.4).
import { Lightbulb } from "phosphor-react";
import { Button } from "@/components/ui";
import { BOOK_CTA, PHONES } from "@/lib/site";

export function BookingCTABand({
  heading = "Ready to book Miss Lana?",
  sub = "Tell us about your event and we'll bring the story to you. Placeholder copy.",
}: {
  heading?: string;
  sub?: string;
}) {
  return (
    <section aria-labelledby="cta-band-heading" className="px-4 py-12 md:px-6 md:py-16">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl bg-forest-800 px-6 py-10 text-center shadow-lg md:px-12 md:py-14">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-pill"
          style={{ background: "radial-gradient(closest-side, rgba(234,174,53,0.30), transparent)" }}
        />
        <span data-icon="duotone-brand" className="inline-flex text-glow-200">
          <Lightbulb size={40} weight="duotone" aria-hidden />
        </span>
        <h2 id="cta-band-heading" className="mt-3 font-display text-3xl text-white sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-forest-100">{sub}</p>

        <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            href={BOOK_CTA.href}
            size="lg"
            leadingIcon={
              <span data-icon="duotone-brand">
                <Lightbulb size={20} weight="duotone" />
              </span>
            }
          >
            {BOOK_CTA.label}
          </Button>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-forest-100">
            <span>or call</span>
            {PHONES.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className="font-body font-bold text-white underline underline-offset-4 hover:text-glow-200"
              >
                {p.display}
              </a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
