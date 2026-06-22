import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StubPage } from "@/components/shell/StubPage";

export const metadata: Metadata = buildMetadata({
  title: "Shows",
  description:
    "The repertoire of Miss Lana's Fairy-Tale Theater — kind, timeless fairy tales for ages 2–10. Full shows hub coming in a later build.",
  path: "/shows",
  noindex: true,
});

export default function ShowsPage() {
  return (
    <StubPage
      title="Shows"
      path="/shows"
      activeHref="/shows"
      blurb="Our repertoire of eight kind fairy tales — a hub linking to a page for each show."
      phaseNote="Phase 2 builds the shows hub and an indexable page for each of the 8 shows. For now, browse the featured shows on the home page, or send a booking request and we'll recommend one."
    />
  );
}
