// School Shows (/school-shows) — B2B landing, SITE_STRUCTURE_AND_BLOCKS.md §4.3.
// Block order: hero → offer (values/SEL, professional troupe, turnkey,
// age-appropriate, from $350) → FAQ → TrustStrip → LeadForm + BookingCTABand.
// School Shows line accent = sage (§12). Travel outside the regular Los Angeles
// service area is confirmed in the custom quote; no fixed surcharge or free radius.
import type { Metadata } from "next";
import Image from "next/image";
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
import { env } from "@/lib/env";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { FaqSection } from "@/components/blocks/FaqSection";
import { AREAS, FACTS } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "School Shows",
  description:
    `Assembly-ready, values-driven live theater for preschools, Montessori and schools across Los Angeles, Southern California and farther California locations by request — a professional troupe, kind SEL themes, turnkey setup, ${FACTS.ages.toLowerCase()}. ${FACTS.priceFromCap}.`,
  path: "/school-shows",
});

const OFFER: { title: string; body: string }[] = [
  {
    title: "Kind values & SEL",
    body: "Through the choices the characters make, children see friendship in action, notice where selfishness leads, and discover how courage, patience, and helping one another can change a story.",
  },
  {
    title: "A professional troupe",
    body: `Trained actors led by ${FACTS.experience} of stagecraft, with costumes, props and a fully staged performance shaped for young audiences.`,
  },
  {
    title: "Turnkey & assembly-ready",
    body: "We bring the whole show to your classroom, gym or multipurpose room. Quick setup and pack-down; you provide the space.",
  },
  {
    title: "Age-appropriate, 2–10",
    body: "We tailor energy, language and length to your group — gentle for the littlest, lively for the older classes.",
  },
  {
    title: "Flexible scheduling",
    body: "We can perform back-to-back shows on the same visit for separate age groups, so each class sees a show suited to them.",
  },
  {
    title: "Best in smaller groups",
    body: "The show is warmest and most interactive for a smaller audience — tell us your class or assembly size and we'll recommend the right setup.",
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
      `Each show runs about an hour (a ~30-minute play plus ~30 minutes of interactive play) and is designed for ${FACTS.ages.toLowerCase()}. We adapt the energy and language to the group.`,
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
    question: "Can you perform for different age groups in one visit?",
    answer:
      "Yes — we can put on consecutive shows on the same visit so each age group sees a performance pitched for them. The show works best for a smaller audience; tell us your group sizes and we'll suggest the right schedule.",
  },
  {
    question: "How far do you travel, and what does it cost?",
    answer:
      `We're based in ${AREAS.base}, serve ${AREAS.region}, and travel to ${AREAS.travel.join(", ")} and other California locations by request. Pricing starts ${FACTS.priceFrom}; your custom quote confirms any travel cost before you book.`,
  },
];

export default function SchoolShowsPage() {
  return (
    <SiteShell activeHref="/school-shows">
      {/* Hero */}
      <Container className="pb-12 pt-10 md:flex md:min-h-[calc(100svh-4rem)] md:flex-col md:pb-16 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "School Shows", href: "/school-shows" },
          ]}
          className="mb-6"
        />
        <div className="grid items-center gap-10 md:my-auto lg:grid-cols-2">
          <div>
            <Tag accent="sage" tone="accent" className="mb-3">
              For preschools &amp; schools
            </Tag>
            <SectionHeader
              as="h1"
              accent="sage"
              title="Theater your school can say yes to"
              subtitle="Professional, values-driven live shows that fit a school day — assembly-ready, age-appropriate and easy to budget."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking">Request a school show</Button>
              <Button href="/shows" variant="secondary">
                Browse the shows
              </Button>
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border-soft shadow-md">
            <Image
              src="/images/school-assembly.jpg"
              alt="A costumed performer on a small stage during a live show for a room full of seated preschoolers."
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
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
          subtitle={`Everything a director needs to say yes — from values to logistics. ${FACTS.priceFromCap}.`}
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
          <p className="max-w-xl text-ink">
            Transparent pricing makes it easy to budget — every show starts{" "}
            <span className="font-display text-2xl capitalize text-forest-700">{FACTS.priceFrom}</span>,
            with a custom quote on booking. Tell us the city or area and the quote will include any travel cost.
          </p>
          <Button href="/pricing" variant="secondary">
            See pricing
          </Button>
        </div>
      </Section>

      <FaqSection
        items={FAQ}
        eyebrow="For directors"
        title="School show questions, answered"
      />

      <Container className="pb-2">
        <p className="text-sm text-ink-soft">
          Need the practical details — space, setup and scheduling?{" "}
          <a href="/planning-your-event" className="font-semibold text-forest-700 underline-offset-4 hover:underline">
            See planning your event
          </a>
          .
        </p>
      </Container>

      <TrustStrip />

      <LeadForm
        eyebrow="Request a show"
        heading="Bring Miss Lana to your school"
        sub="Tell us your school, group size, date and city — we'll check availability and send a quote within 1–2 business days."
        turnstileSiteKey={env.turnstileSiteKey}
      />
      <BookingCTABand
        heading="Ready to book a school show?"
        sub={`Assembly-ready theater for ${FACTS.ages.toLowerCase()}, ${FACTS.priceFrom}. Send a request and choose how you'd like us to reply.`}
      />
    </SiteShell>
  );
}
