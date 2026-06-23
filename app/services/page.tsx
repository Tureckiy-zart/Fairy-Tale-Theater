// Services overview (/services) — the umbrella that gathers the four Miss Lana lines
// (SITE_STRUCTURE_AND_BLOCKS.md §4.3 + BRAND.md). Block order: hero SectionHeader +
// intro → the four service-line cards (Fairy-Tale Theater / School Shows / Birthday
// Parties / & Friends), each with a blurb + CTA to its own page, on its per-line accent
// (§12) → BookingCTABand. Composed from primitives (Card service-line mode) + lib/site
// (SERVICE_LINES). "One troupe, four ways to book" is the real umbrella positioning
// (BRAND.md); copy is final. Server component; metadata via lib/seo (noindex).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb, Card, Container, Section, SectionHeader } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { SERVICE_LINES, FACTS } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "One professional troupe, four ways to book: live fairy-tale theater, school shows, birthday parties and costumed characters who come to visit. Ages 2–10, across Los Angeles. From $350.",
  path: "/services",
  noindex: true,
});

export default function ServicesPage() {
  return (
    <SiteShell activeHref="/services">
      {/* Hero / umbrella intro */}
      <Container className="pb-10 pt-10 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Services", href: "/services" },
          ]}
          className="mb-6"
        />
        <SectionHeader
          as="h1"
          eyebrow="One troupe, four ways to book"
          marker={<SparkStar size={18} />}
          title="The same theater, shaped to your day"
          subtitle="Miss Lana's Fairy-Tale Theater is one professional troupe — and we shape the same warm, live theater to fit your day. Here are the four ways we come to you."
        />
      </Container>

      {/* The four service lines → their pages */}
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {SERVICE_LINES.map((line) => (
            <Card
              key={line.key}
              title={line.title}
              tag={line.tag}
              accent={line.accent}
              blurb={line.blurb}
              cta={{ label: "Explore", href: line.href, variant: "secondary" }}
              mediaSrc={line.media}
              mediaAlt={line.mediaAlt}
              mediaSizes="(min-width: 640px) 50vw, 100vw"
            />
          ))}
        </div>
        <p className="mt-8 max-w-prose text-ink-soft">
          Every line is the same professional troupe and the same kind stories — a real
          performance for ages 2–10, {FACTS.priceFrom}. Free within 30 miles of Los Angeles;
          beyond that, travel is quoted by distance.
        </p>
      </Section>

      {/* Trust */}
      <TrustStrip />

      <BookingCTABand
        heading="Not sure which fits?"
        sub="Tell us about your event and we'll help you pick the right show — send a request or give us a call."
      />
    </SiteShell>
  );
}
