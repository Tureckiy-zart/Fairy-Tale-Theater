// Planning Your Event (/planning-your-event) — the single, friendly home for the
// shared venue + logistics details, so Home and the marketing pages stay light and
// story-led (BUILD_MISS_LANA_EVENT_PLANNING_FAQ_001; SITE_STRUCTURE §4 FAQAccordion).
// Progressive disclosure: grouped accordions, all closed on load (no wall of text).
// Only CONFIRMED facts (OWNER_ANSWERS_DECISION_RECORD §1) are shown; recommended is
// kept distinct from required; unresolved policy (cancellation/deposit/refund) is
// softened to "confirmed when you book" — never a hard public policy (§4). One
// combined FAQPage schema is emitted from exactly the visible questions.
// Server component (renders the client Accordion islands).
import type { Metadata } from "next";
import { buildMetadata, faqSchema, type QA } from "@/lib/seo";
import {
  Accordion,
  Button,
  JsonLd,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { FACTS } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Planning Your Event",
  description:
    "A friendly guide to hosting Miss Lana's Fairy-Tale Theatre — the space we need, indoor and outdoor setups, sound, parking, photos and more. We bring everything and come to you.",
  path: "/planning-your-event",
});

// Grouped, confirmed-only Q/A (OWNER_ANSWERS_DECISION_RECORD §1). "Recommended" vs
// "required" is kept explicit. Each group renders its own accordion; the schema is
// built once from the union below so visible content and FAQPage never drift.
const SPACE: QA[] = [
  {
    question: "How much space do you need?",
    answer:
      "A flat, clear area of about 20 m² (≈215 sq ft) is plenty — roughly the size of a small living room. It's a recommendation, not a strict rule; if you're unsure about your space, tell us and we'll help you plan.",
  },
  {
    question: "How long do you need to set up and pack down?",
    answer:
      "About 15–20 minutes to set up before the show, and about the same to pack down afterwards. We bring and handle everything ourselves.",
  },
  {
    question: "What do we need to provide?",
    answer:
      "Just the space and an audience. We bring our costumes, sets, props and our own sound — you don't need a stage.",
  },
];

const VENUE: QA[] = [
  {
    question: "Can you perform indoors and outdoors?",
    answer:
      "Both. Indoors is always reliable; outdoors works beautifully on a flat, shaded, wind-free spot. Our set uses a cloth backdrop, so for rain or strong wind we recommend having an indoor backup ready.",
  },
  {
    question: "Do you need a power outlet?",
    answer:
      "Usually not — we bring our own sound. If your event has any special power needs, just mention it when you book and we'll confirm the details.",
  },
];

const ACCESS: QA[] = [
  {
    question: "What about parking and access?",
    answer:
      "Parking is normally arranged by the host. If your venue only has paid parking, that cost may be passed on — we'll always confirm anything like this with you in advance.",
  },
  {
    question: "Can you visit homes, schools, parks and restaurants?",
    answer:
      "Yes — homes, classrooms, parks, party venues and restaurants all work. We're a touring troupe and come to you; there's no public theatre to travel to.",
  },
];

const PHOTOS: QA[] = [
  {
    question: "Can we take photos and video?",
    answer:
      "Of course — parents, teachers and organizers are welcome to take their own photos and video throughout. Our performers focus on the show and generally don't photograph children themselves.",
  },
];

const SCHEDULING: QA[] = [
  {
    question: "Can you do more than one performance in a visit?",
    answer:
      "Yes — we can arrange consecutive performances on the same visit, for example one per age group at a school. The show is warmest for a smaller audience, so tell us your group sizes and we'll suggest a schedule.",
  },
  {
    question: "How do bookings, changes and dates work?",
    answer:
      `Tell us your date, place and group size and we'll confirm availability. The finer details — timing, any changes, and your custom quote (${FACTS.priceFrom}) — are confirmed with you when you book.`,
  },
];

// Single FAQPage from exactly the questions rendered below (no drift, no duplicate
// schema). Order matches the visible groups top-to-bottom.
const ALL_QA: QA[] = [...SPACE, ...VENUE, ...ACCESS, ...PHOTOS, ...SCHEDULING];

const GROUPS: { eyebrow: string; title: string; items: QA[]; tone?: "surface" }[] = [
  { eyebrow: "Space & setup", title: "The space we need", items: SPACE },
  { eyebrow: "Indoors & outdoors", title: "Where we can perform", items: VENUE, tone: "surface" },
  { eyebrow: "Parking & access", title: "Getting to you", items: ACCESS },
  { eyebrow: "Photos", title: "Capturing the day", items: PHOTOS, tone: "surface" },
  { eyebrow: "Scheduling & booking", title: "Timing and booking", items: SCHEDULING },
];

export default function PlanningYourEventPage() {
  return (
    <SiteShell activeHref="/planning-your-event">
      {/* One combined FAQPage from the exact visible questions. */}
      <JsonLd data={faqSchema(ALL_QA)} />

      {/* Friendly intro + one booking CTA above the accordions */}
      <PageHero
        current={{ name: "Planning Your Event", href: "/planning-your-event" }}
        containerClassName="pb-8 pt-10 md:pt-14"
        eyebrow="Planning your event"
        title="Easy to host — we bring everything"
        subtitle="A friendly guide to having Miss Lana's Fairy-Tale Theatre at your event. We're a touring troupe, so we come to you and handle the whole show — here's what helps it go smoothly."
      >
        <div className="mt-7">
          <Button href="/booking">Book a show</Button>
        </div>
      </PageHero>

      {/* Grouped progressive disclosure — all panels closed on load */}
      {GROUPS.map((g) => (
        <Section key={g.eyebrow} tone={g.tone}>
          <SectionHeader
            as="h2"
            eyebrow={g.eyebrow}
            marker={<SparkStar size={16} />}
            title={g.title}
          />
          <Accordion className="mt-8 max-w-3xl" items={g.items} />
        </Section>
      ))}

      <BookingCTABand
        heading="Ready to plan your event?"
        sub={`Tell us your date, place and group size — we'll confirm availability and a quote ${FACTS.priceFrom}.`}
      />
    </SiteShell>
  );
}
