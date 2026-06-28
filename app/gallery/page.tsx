// Gallery (/gallery) — SITE_STRUCTURE_AND_BLOCKS.md §4.5. Block order: SectionHeader +
// intro → GalleryGrid scaffold (warm masonry, categories Shows/Troupe/Children/Backstage,
// embedded muted+captioned video) → BookingCTABand. Media comes from lib/gallery.ts and
// renders the operator-supplied, content-sorted photos from lib/gallery.ts. Server
// component; metadata via lib/seo. Breadcrumb emits BreadcrumbList.
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { GalleryGrid } from "@/components/blocks/GalleryGrid";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Warm photos from real performances of Miss Lana's Fairy-Tale Theatre — our shows, the troupe and the delighted children who watch them.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <SiteShell activeHref="/gallery">
      <PageHero
        current={{ name: "Gallery", href: "/gallery" }}
        containerClassName="pb-8 pt-10 md:pt-14"
        eyebrow="Real moments"
        title="From our shows"
        subtitle="Warm photos from our real performances — the shows on stage, the troupe in costume, and the delighted children who watch them."
      />

      <GalleryGrid />

      <BookingCTABand
        heading="Want to see it live?"
        sub="Bring Miss Lana's Fairy-Tale Theatre to your event — send a request or give us a call."
      />
    </SiteShell>
  );
}
