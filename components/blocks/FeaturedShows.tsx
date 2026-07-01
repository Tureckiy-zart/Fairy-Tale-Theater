// FeaturedShows — Home block #5 (SITE_STRUCTURE §4.1): a few cards from the 8-show
// repertoire → /shows and each → /shows/{slug}. Built from the shared ShowCardGrid
// over the real, canonical titles (lib/shows — FEATURED_SHOWS). Synopses are final
// copy; photos render the marked placeholder treatment (assets gated — §15 / Phase 4).
// Scroll-reveal below the fold (§10).
import { Button, Section, SectionHeader } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { ShowCardGrid } from "@/components/blocks/ShowCardGrid";
import { FEATURED_SHOWS } from "@/lib/shows";

export function FeaturedShows() {
  return (
    <Section tone="surface">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="From the repertoire"
          marker={<SparkStar size={16} />}
          title="Featured shows"
          subtitle="Eight kind fairy tales in the repertoire — a few favourites below."
        />
      </div>
      <div className="mt-10">
        <ShowCardGrid shows={FEATURED_SHOWS} columnsClassName="sm:grid-cols-2 lg:grid-cols-4" />
      </div>
      <div className="mt-8">
        <Button href="/shows" variant="secondary">
          See all shows
        </Button>
      </div>
    </Section>
  );
}
