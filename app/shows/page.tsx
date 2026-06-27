// Shows hub (/shows) — SITE_STRUCTURE_AND_BLOCKS.md §4.2. The SEO hub for the
// repertoire: SectionHeader + intro → ShowCardGrid (all 8 shows, each linking to its
// own indexable /shows/{slug} page) → BookingCTABand. Titles/slugs/themes are canonical
// (lib/shows); synopses are final copy; photos render the marked placeholder
// treatment (assets gated — Phase 4 [ASSET]). NO format filter (owner-gated — non-goal).
// Server component; metadata via lib/seo (noindex pre-launch).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb, Container, Section, SectionHeader } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { ShowCardGrid } from "@/components/blocks/ShowCardGrid";
import { SHOWS } from "@/lib/shows";

export const metadata: Metadata = buildMetadata({
  title: "Shows",
  description:
    "The repertoire of Miss Lana's Fairy-Tale Theatre — eight kind, timeless fairy tales for ages 2–10. A real costumed show plus interactive play, brought to your venue across LA and beyond.",
  path: "/shows",
});

export default function ShowsPage() {
  return (
    <SiteShell activeHref="/shows">
      <Container className="pt-10 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Shows", href: "/shows" },
          ]}
          className="mb-6"
        />
        <SectionHeader
          as="h1"
          eyebrow="The repertoire"
          marker={<SparkStar size={16} />}
          title="Eight kind fairy tales to choose from"
          subtitle="Every Miss Lana production begins with a familiar fairy-tale feeling and grows into a live, shared adventure. Some stories are playful, some are tender, and a few hold a little suspense — but each returns to what children understand most deeply: friendship, courage, kindness, and helping one another. About an hour, for ages 2–10."
        />
      </Container>

      <Section>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-ink-soft">Tap a show to read the story, its theme, and how to book it.</p>
        </div>
        <ShowCardGrid shows={SHOWS} />
      </Section>

      <BookingCTABand
        heading="Found one they'll love?"
        sub="Tell us the show and your date — we'll confirm availability and pricing from $350."
      />
    </SiteShell>
  );
}
