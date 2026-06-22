import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StubPage } from "@/components/shell/StubPage";

export const metadata: Metadata = buildMetadata({
  title: "Birthday Parties",
  description:
    "A real theater show for the birthday child — magic that comes to you, no hassle. Full Birthdays landing coming in a later build.",
  path: "/birthdays",
  noindex: true,
});

export default function BirthdaysPage() {
  return (
    <StubPage
      title="Birthday Parties"
      path="/birthdays"
      activeHref="/birthdays"
      blurb="A real theater show for the birthday child — magic that comes to you."
      phaseNote="Phase 2 builds the full Birthdays landing (what's included, popular party shows, how to book). For now, send a request with your date and we'll take it from there."
    />
  );
}
