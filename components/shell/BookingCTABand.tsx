// BookingCTABand — the repeating "Book a show" band near the bottom of pages
// (conversion architecture: lead capture everywhere — SITE_STRUCTURE §3/§5). Forest
// panel, white text (≥9:1), a static glow accent + the brand Lantern glyph (the "light"
// signature — §2/§7.2), the primary CTA → /booking, and click-to-call. The glow is
// decorative and NOT animated (band can sit over the fold on short pages — §10.4).
import { Button } from "@/components/ui";
import { Lantern } from "@/components/brand/Glyphs";
import { BOOK_CTA, PHONES } from "@/lib/site";

export function BookingCTABand({
  heading = "Ready to book your show?",
  sub = "Tell us about your event and we'll bring the story to you.",
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
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--color-glow-400) 30%, transparent), transparent)" }}
        />
        <Lantern size={44} className="inline-block text-glow-200" />
        <h2 id="cta-band-heading" className="mt-3 font-display text-3xl text-white sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-forest-100">{sub}</p>

        <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            href={BOOK_CTA.href}
            size="lg"
            leadingIcon={<Lantern size={20} className="text-glow-200" />}
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
