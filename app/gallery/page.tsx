import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StubPage } from "@/components/shell/StubPage";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description:
    "Warm photos and video from real performances of Miss Lana's Fairy-Tale Theater. Gallery coming once the owner's assets arrive.",
  path: "/gallery",
  noindex: true,
});

export default function GalleryPage() {
  return (
    <StubPage
      title="Gallery"
      path="/gallery"
      blurb="Warm photos and video from real performances."
      phaseNote="Phase 3 fills the gallery once the owner's photos and video arrive. For now, see the teaser on the home page."
    />
  );
}
