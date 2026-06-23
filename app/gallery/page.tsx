// Gallery (/gallery) — SITE_STRUCTURE_AND_BLOCKS.md §4.5. Block order: SectionHeader +
// intro → GalleryGrid scaffold (warm masonry, categories Shows/Troupe/Children/Backstage,
// embedded muted+captioned video) → BookingCTABand. Media comes from lib/gallery.ts and
// renders the marked "pending" placeholder treatment until real graded assets land
// (Phase 4 [ASSET]) — NO scraping. Server component; metadata via lib/seo (noindex
// pre-launch). Breadcrumb emits BreadcrumbList JSON-LD.
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb, Container, SectionHeader, Tag } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { GalleryGrid } from "@/components/blocks/GalleryGrid";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Warm photos and video from real performances of Miss Lana's Fairy-Tale Theater — our shows, the troupe, delighted children and behind the scenes. Photos and video coming soon.",
  path: "/gallery",
  noindex: true,
});

export default function GalleryPage() {
  return (
    <SiteShell activeHref="/gallery">
      <Container className="pb-8 pt-10 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Gallery", href: "/gallery" },
          ]}
          className="mb-6"
        />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            as="h1"
            eyebrow="Real moments"
            marker={<SparkStar size={18} />}
            title="From our shows"
            subtitle="Warm photos and video from real performances — our shows, the troupe, delighted children and a peek behind the scenes. We're gathering the gallery now; placeholders below show where each will live."
          />
          <Tag>Photos &amp; video — pending</Tag>
        </div>
      </Container>

      <GalleryGrid />

      <BookingCTABand
        heading="Want to see it live?"
        sub="Bring Miss Lana's Fairy-Tale Theater to your event — send a request or give us a call."
      />
    </SiteShell>
  );
}
