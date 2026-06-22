import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StubPage } from "@/components/shell/StubPage";

export const metadata: Metadata = buildMetadata({
  title: "School Shows",
  description:
    "Assembly-ready, values-driven theater for preschools, Montessori and schools across LA. Full School Shows landing coming in a later build.",
  path: "/school-shows",
  noindex: true,
});

export default function SchoolShowsPage() {
  return (
    <StubPage
      title="School Shows"
      path="/school-shows"
      activeHref="/school-shows"
      blurb="Assembly-ready, values-driven theater for preschools, Montessori and schools."
      phaseNote="Phase 2 builds the full School Shows landing (the offer, what your school gets, FAQ and a lead form). For now, send a request and we'll tailor a show to your school."
    />
  );
}
