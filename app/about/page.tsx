import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StubPage } from "@/components/shell/StubPage";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Miss Lana's Fairy-Tale Theater — a professional troupe with 30+ years of experience, bringing kind, values-driven fairy tales to life. About page coming in a later build.",
  path: "/about",
  noindex: true,
});

export default function AboutPage() {
  return (
    <StubPage
      title="About"
      path="/about"
      activeHref="/about"
      blurb="Our mission, the troupe, and 30+ years of kind, values-driven theater."    />
  );
}
