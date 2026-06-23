// Pricing (/pricing) — SITE_STRUCTURE_AND_BLOCKS.md §4.4. The "by number of children"
// logic + what's included + distance rule (free within 30 miles of LA, quoted by
// distance beyond — NO dollar amounts) + packages by segment + CTA. Public price face
// is "from $350" (table floor = $350). Server component; metadata via lib/seo (noindex).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  ACCENT_BORDER_TOP,
  ACCENT_TEXT,
  Breadcrumb,
  Button,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui";
import type { Accent } from "@/components/ui/accent";
import { cx } from "@/components/ui/cx";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { PRICING_TIERS } from "@/lib/site";

const INCLUDED = [
  "A ~30-minute costumed fairy-tale play",
  "Interactive play with the kids (e.g. a bubble show)",
  "A professional troupe, with costumes and props",
  "35–50 minutes in total, for ages 2–10",
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
    "Simple, transparent pricing for Miss Lana's Fairy-Tale Theater — from $350, by number of children. Travel is free within 30 miles of LA, quoted by distance beyond. Serving LA and beyond.",
  path: "/pricing",
  noindex: true,
});

export default function PricingPage() {
  return (
    <SiteShell>
      <Container className="pt-10 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Pricing", href: "/pricing" },
          ]}
          className="mb-6"
        />
        <SectionHeader
          as="h1"
          eyebrow="Pricing"
          marker={<SparkStar size={16} />}
          title="Simple pricing, by group size"
          subtitle="Transparent, market pricing — from $350. Amounts scale with the number of children; travel is quoted by distance."
        />
      </Container>

      {/* By number of children */}
      <Section>
        <div className="overflow-hidden rounded-2xl border border-border-soft">
          <table className="w-full text-left">
            <caption className="sr-only">Approximate price by number of children</caption>
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="px-5 py-3 font-body text-sm font-bold uppercase tracking-[0.06em] text-ink">
                  Group size
                </th>
                <th scope="col" className="px-5 py-3 font-body text-sm font-bold uppercase tracking-[0.06em] text-ink">
                  From
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {PRICING_TIERS.map((t) => (
                <tr key={t.group} className="bg-white">
                  <td className="px-5 py-4 text-ink">{t.group}</td>
                  <td className="px-5 py-4 font-body font-bold text-forest-700">{t.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          Approximate, by number of children; the final quote is confirmed on booking. Figures
          follow the owner&rsquo;s pricing logic.
        </p>
      </Section>

      {/* What's included + distance rule (free within 30 miles, quoted by distance beyond) */}
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
            <SectionHeader as="h2" title="Distance" />
            <p className="text-ink">
              We travel <strong>free within 30 miles of Los Angeles</strong>. Beyond that, travel is{" "}
              <strong>quoted individually by distance</strong>.
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
          subtitle="Every package starts from $350."
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
              <p className={cx("font-display text-2xl", ACCENT_TEXT[p.accent])}>From $350</p>
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
