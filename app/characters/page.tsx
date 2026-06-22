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
      blurb="Costumed characters who come to visit the kids — the quality of a real theater troupe."    />
  );
}
