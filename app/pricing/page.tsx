// Pricing (/pricing) — SITE_STRUCTURE_AND_BLOCKS.md §4.4. Public pricing is limited to
// "from $350" + what shapes a custom quote + travel by custom quote + packages by
// segment + CTA. NO audience-size price tiers, tables, calculators, or fixed travel
// surcharges (locked commercial constraint; OWNER_ANSWERS_DECISION_RECORD.md §1/§2).
// Server component; metadata via lib/seo.
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  ACCENT_BORDER_TOP,
  ACCENT_TEXT,
  Button,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui";
import type { Accent } from "@/components/ui/accent";
import { cx } from "@/components/ui/cx";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { QUOTE_FACTORS, FACTS } from "@/lib/site";

const INCLUDED = [
  "A ~30-minute costumed fairy-tale play",
  "Then ~30 minutes of games, dancing and bubbles the kids join in on",
  "A professional troupe, with costumes, props and our own sound",
  `About an hour in total, for ${FACTS.ages.toLowerCase()}`,
  "We travel to your venue — no hall of your own needed",
];

const PACKAGES: { title: string; accent: Accent; blurb: string }[] = [
  { title: "Preschools & schools", accent: "sage", blurb: "Assembly-ready, values-driven shows priced by group size." },
  { title: "Birthday parties", accent: "coral", blurb: "A real theater show for the birthday child, at home or a venue." },
  { title: "Characters & friends", accent: "berry", blurb: "Costumed characters who come to visit the kids." },
];

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    `Simple, transparent pricing for Miss Lana's Fairy-Tale Theatre — ${FACTS.priceFrom}. Every event gets a custom quote; travel beyond the greater Los Angeles area is quoted by distance. Serving LA and beyond.`,
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <SiteShell>
      <PageHero
        current={{ name: "Pricing", href: "/pricing" }}
        containerClassName="pt-10 md:pt-14"
        eyebrow="Pricing"
        marker={<SparkStar size={16} />}
        title={FACTS.priceFromCap}
        subtitle={`Every event is a little different, so we give you one clear price up front. Shows start ${FACTS.priceFrom}, and we confirm your custom quote when you book.`}
      />

      {/* From $350 + what shapes a custom quote (no audience-size tiers — owner rule) */}
      <Section>
        <div className="flex flex-col gap-6 rounded-2xl border border-border-soft bg-white p-6 md:flex-row md:items-center md:gap-10 md:p-8">
          <div className="shrink-0">
            <p className="font-display text-4xl text-forest-700 md:text-5xl">{FACTS.priceFromCap}</p>
            <p className="mt-1 text-sm text-ink-soft">Confirmed with your booking</p>
          </div>
          <div className="flex-1">
            <p className="mb-3 text-ink">A few things shape your quote:</p>
            <ul className="flex flex-col gap-2">
              {QUOTE_FACTORS.map((f) => (
                <li key={f} className="flex items-start gap-2 text-ink">
                  <span className="mt-1 shrink-0">
                    <SparkStar size={16} />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* What's included + travel (greater LA free; farther quoted by distance — no $) */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader as="h2" title="What's included" />
            <ul className="mt-6 flex flex-col gap-3">
              {INCLUDED.map((x) => (
                <li key={x} className="flex items-start gap-2 text-ink">
                  <span className="mt-1 shrink-0">
                    <SparkStar size={16} />
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-border-soft bg-cream p-6 md:p-8">
            <SectionHeader as="h2" title="Travel" />
            <p className="text-ink">
              We travel <strong>free across the greater Los Angeles and Orange County area</strong>.
              Farther locations are <strong>quoted individually by distance</strong>.
            </p>
            <p className="text-ink-soft">
              We also travel to San Diego, Sacramento and San Jose — we&rsquo;ll confirm travel
              with your quote.
            </p>
          </div>
        </div>
      </Section>

      {/* Packages by segment */}
      <Section>
        <SectionHeader
          eyebrow="Packages"
          marker={<SparkStar size={16} />}
          title="By who it's for"
          subtitle={`Every package starts ${FACTS.priceFrom}.`}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.title}
              className={cx(
                "flex h-full flex-col gap-3 rounded-lg border border-border-soft bg-white p-6 shadow-sm",
                ACCENT_BORDER_TOP[p.accent],
              )}
            >
              <h3 className="font-display text-xl text-forest-800">{p.title}</h3>
              <p className={cx("font-display text-2xl", ACCENT_TEXT[p.accent])}>{FACTS.priceFromCap}</p>
              <p className="flex-1 text-ink">{p.blurb}</p>
              <Button href="/booking" variant="secondary" size="sm">
                Get a quote
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <BookingCTABand
        heading="Ready for a quote?"
        sub="Send your group size and date — we'll confirm pricing and availability."
      />
    </SiteShell>
  );
}
