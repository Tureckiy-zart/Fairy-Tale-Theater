// Home (/) — the full §4.1 block stack (SITE_STRUCTURE_AND_BLOCKS.md), assembled from
// the shell + Home blocks, on final copy. Order is verbatim from §4.1:
// Hero → TrustStrip → FormatExplainer → ServiceLineCards → Featured shows → B2B teaser
// → B2C teaser → PersonaIntro → Gallery teaser → How it works + areas → BookingCTABand
// + LeadForm → SiteFooter (the last via SiteShell). Server component; metadata via
// lib/seo.
import type { Metadata } from "next";
import { buildMetadata, organizationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui";
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
  title: "Live theater that comes to you",
  description:
    "Professional live-costumed children's fairy-tale theater for LA preschools, schools and parties — 30+ years, ages 2–10. Book a show.",
  path: "/",
});

export default function HomePage() {
  return (
    <SiteShell>
      {/* Org identity (PerformingGroup + LocalBusiness, service-area, no address). */}
      <JsonLd data={organizationSchema()} />
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
        heading="Book a show"
        sub="Tell us about your event and we'll reply within 1–2 business days."
      />
    </SiteShell>
  );
}
