import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StubPage } from "@/components/shell/StubPage";

export const metadata: Metadata = buildMetadata({
  title: "Characters & Friends",
  description:
    "Costumed characters who come to visit the kids — the quality of a theater troupe, not a one-off animator. Coming in a later build.",
  path: "/characters",
  noindex: true,
});

export default function CharactersPage() {
  return (
    <StubPage
      title="Miss Lana & Friends"
      path="/characters"
      activeHref="/characters"
      blurb="Costumed characters who come to visit the kids — the quality of a real theater troupe."
      phaseNote="Phase 3 builds the Characters line (how the characters visit, and how they differ from generic animators). For now, ask us which characters can come to your event."
    />
  );
}
