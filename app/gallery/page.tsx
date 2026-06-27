// Gallery (/gallery) — SITE_STRUCTURE_AND_BLOCKS.md §4.5. Block order: SectionHeader +
// intro → GalleryGrid scaffold (warm masonry, categories Shows/Troupe/Children/Backstage,
// embedded muted+captioned video) → BookingCTABand. Media comes from lib/gallery.ts and
// renders the operator-supplied, content-sorted photos from lib/gallery.ts. Server
// component; metadata via lib/seo (noindex pre-launch). Breadcrumb emits BreadcrumbList.
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb, Container, SectionHeader } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { GalleryGrid } from "@/components/blocks/GalleryGrid";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Warm photos from real performances of Miss Lana's Fairy-Tale Theatre — our shows, the troupe and the delighted children who watch them.",
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
        <SectionHeader
          as="h1"
          eyebrow="Real moments"
          marker={<SparkStar size={18} />}
          title="From our shows"
          subtitle="Warm photos from our real performances — the shows on stage, the troupe in costume, and the delighted children who watch them."
        />
      </Container>

      <GalleryGrid />

      <BookingCTABand
        heading="Want to see it live?"
        sub="Bring Miss Lana's Fairy-Tale Theatre to your event — send a request or give us a call."
      />
    </SiteShell>
  );
}
