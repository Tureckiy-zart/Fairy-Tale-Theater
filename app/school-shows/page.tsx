// School Shows (/school-shows) — B2B landing, SITE_STRUCTURE_AND_BLOCKS.md §4.3.
// Block order: hero → offer ("what your school gets": values/SEL, professional troupe,
// turnkey, age-appropriate, from $350) → FAQ (Accordion + FAQPage) → TrustStrip →
// LeadForm + BookingCTABand. School Shows line accent = sage (§12). Differentiators are
// real positioning (02_POSITIONING); copy is temporary, refined before launch. Photos
// render the marked placeholder treatment (Phase 4 [ASSET]). NO surcharge amounts
// (distance "on request"). Server component; metadata via lib/seo (noindex pre-launch).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { QA } from "@/lib/seo";
import {
  ACCENT_BORDER_TOP,
  Breadcrumb,
  Button,
  Container,
  Section,
  SectionHeader,
  Tag,
} from "@/components/ui";
import { cx } from "@/components/ui/cx";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { LeadForm } from "@/components/shell/LeadForm";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { FaqSection } from "@/components/blocks/FaqSection";
import { FACTS } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "School Shows",
  description:
    "Assembly-ready, values-driven live theater for preschools, Montessori and schools across LA — a professional troupe, kind SEL themes, turnkey setup, ages 2–10. From $350.",
  path: "/school-shows",
  noindex: true,
});

const OFFER: { title: string; body: string }[] = [
  {
    title: "Kind values & SEL",
    body: "Every story carries social-emotional themes — friendship, courage, helping each other — that fit your curriculum. Temporary copy.",
  },
  {
    title: "A professional troupe",
    body: "Trained actors with 30+ years of stagecraft — costumes, props and real performance, not a single party entertainer.",
  },
  {
    title: "Turnkey & assembly-ready",
    body: "We bring the whole show to your classroom, gym or multipurpose room. Quick setup and pack-down; you provide the space.",
  },
  {
    title: "Age-appropriate, 2–10",
    body: "We tailor energy, language and length to your group — gentle for the littlest, lively for the older classes.",
  },
];

const FAQ: QA[] = [
  {
    question: "Where do you perform?",
    answer:
      "We bring everything to you — your classroom, gym or multipurpose room. We just need a clear floor space and access to power.",
  },
  {
    question: "How long is a show, and what ages is it for?",
    answer:
      "Each show runs 35–50 minutes (a ~30-minute play plus interactive play) and is designed for ages 2–10. We adapt the energy and language to the group.",
  },
  {
    question: "What do we need to provide?",
    answer:
      "Just the space and an audience. We bring costumes, props, sound and the whole performance, and handle setup and pack-down.",
  },
  {
    question: "Do the shows support our values and curriculum?",
    answer:
      "Yes — every story is built around kind, social-emotional themes like friendship, courage and helping one another.",
  },
  {
    question: "How far do you travel, and what does it cost?",
    answer:
      "We're based in Los Angeles and travel to San Diego, Sacramento and San Jose. Pricing starts from $350 by group size; distance is quoted on request.",
  },
];

export default function SchoolShowsPage() {
  return (
    <SiteShell activeHref="/school-shows">
      {/* Hero */}
      <Container className="pb-12 pt-10 md:pb-16 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "School Shows", href: "/school-shows" },
          ]}
          className="mb-6"
        />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Tag accent="sage" tone="accent" className="mb-3">
              For preschools &amp; schools
            </Tag>
            <SectionHeader
              as="h1"
              accent="sage"
              title="Theater your school can say yes to"
              subtitle="Professional, values-driven live shows that fit a school day — assembly-ready, age-appropriate and easy to budget. Temporary copy."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking">Request a school show</Button>
              <Button href="/shows" variant="secondary">
                Browse the shows
              </Button>
            </div>
          </div>
          <div className="flex aspect-4/3 items-center justify-center rounded-2xl border border-border-soft bg-sage/10 p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <p className="font-display text-2xl text-sage-text">Assembly / classroom photo</p>
              <Tag accent="sage" tone="accent">
                Photo — pending
              </Tag>
            </div>
          </div>
        </div>
      </Container>

      {/* Offer — what your school gets */}
      <Section tone="surface">
        <SectionHeader
          as="h2"
          accent="sage"
          eyebrow="What your school gets"
          marker={<SparkStar size={16} />}
          title="Built for a school day"
          subtitle="Everything a director needs to say yes — from values to logistics. From $350."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {OFFER.map((o) => (
            <div
              key={o.title}
              className={cx(
                "flex h-full flex-col gap-2 rounded-lg border border-border-soft bg-white p-6 shadow-sm",
                ACCENT_BORDER_TOP.sage,
              )}
            >
              <h3 className="font-display text-xl text-forest-800">{o.title}</h3>
              <p className="text-ink">{o.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border-soft bg-cream p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <p className="max-w-md text-ink">
            Transparent pricing by group size makes it easy to budget — every show starts{" "}
            <span className="font-display text-2xl capitalize text-forest-700">{FACTS.priceFrom}</span>.
            Distance is quoted on request.
          </p>
          <Button href="/pricing" variant="secondary">
            See pricing
          </Button>
        </div>
      </Section>

      {/* FAQ */}
      <FaqSection
        items={FAQ}
        eyebrow="For directors"
        title="School show questions, answered"
      />

      {/* Trust */}
      <TrustStrip />

      {/* Lead capture */}
      <LeadForm
        eyebrow="Request a show"
        heading="Bring Miss Lana to your school"
        sub="Tell us your school, group size and a date — we'll check availability and send a quote. Demo form — no message is sent yet."
      />
      <BookingCTABand
        heading="Ready to book a school show?"
        sub="Assembly-ready theater for ages 2–10, from $350. Send a request or give us a call."
      />
    </SiteShell>
  );
}
