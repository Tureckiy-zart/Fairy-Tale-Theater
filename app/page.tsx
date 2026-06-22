// Home (/) — the full §4.1 block stack (SITE_STRUCTURE_AND_BLOCKS.md), assembled from
// the shell + Home blocks, all on placeholders. Order is verbatim from §4.1:
// Hero → TrustStrip → FormatExplainer → ServiceLineCards → Featured shows → B2B teaser
// → B2C teaser → PersonaIntro → Gallery teaser → How it works + areas → BookingCTABand
// + LeadForm → SiteFooter (the last via SiteShell). Server component; metadata via
// lib/seo (noindex pre-launch).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { LeadForm } from "@/components/shell/LeadForm";
import { Hero } from "@/components/blocks/Hero";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { FormatExplainer } from "@/components/blocks/FormatExplainer";
import { ServiceLineCards } from "@/components/blocks/ServiceLineCards";
import { FeaturedShows } from "@/components/blocks/FeaturedShows";
import { B2BTeaser } from "@/components/blocks/B2BTeaser";
import { B2CTeaser } from "@/components/blocks/B2CTeaser";
import { PersonaIntro } from "@/components/blocks/PersonaIntro";
import { GalleryTeaser } from "@/components/blocks/GalleryTeaser";
import { HowItWorksAreas } from "@/components/blocks/HowItWorksAreas";

export const metadata: Metadata = buildMetadata({
  title: "Live children's theater that comes to you",
  description:
    "Professional live-costumed children's fairy-tale theater for LA preschools, schools and parties — 30+ years, ages 2–10. Book Miss Lana.",
  path: "/",
  noindex: true,
});

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <TrustStrip />
      <FormatExplainer />
      <ServiceLineCards />
      <FeaturedShows />
      <B2BTeaser />
      <B2CTeaser />
      <PersonaIntro />
      <GalleryTeaser />
      <HowItWorksAreas />
      <BookingCTABand />
      <LeadForm
        id="book"
        eyebrow="Get started"
        heading="Book Miss Lana"
        sub="Tell us about your event and we'll get back to you. Demo form — no message is sent yet."
      />
    </SiteShell>
  );
}
