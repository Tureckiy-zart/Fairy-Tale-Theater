// Birthdays (/birthdays) — B2C landing, SITE_STRUCTURE_AND_BLOCKS.md §4.3. Block
// order: hero ("a magical party without the hassle") → what's included → popular party
// shows (→ /shows) → "from $350" → how to book → FAQ (Accordion + FAQPage) → LeadForm
// + BookingCTABand. Birthday Parties line accent = coral (§12). "A real theater show,
// not just an entertainer" is real positioning (02_POSITIONING); copy is temporary.
// Photos render the marked placeholder treatment (Phase 4 [ASSET]). NO surcharge
// amounts (distance "on request"). Server component; metadata via lib/seo (noindex).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import type { QA } from "@/lib/seo";
import {
  Breadcrumb,
  Button,
  Container,
  Section,
  SectionHeader,
  Tag,
} from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { LeadForm } from "@/components/shell/LeadForm";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { ShowCardGrid } from "@/components/blocks/ShowCardGrid";
import { FaqSection } from "@/components/blocks/FaqSection";
import { FEATURED_SHOWS } from "@/lib/shows";

export const metadata: Metadata = buildMetadata({
  title: "Birthday Parties",
  description:
    "A real costumed fairy-tale show for the birthday child — magic that comes to your home or venue, no hassle. Professional troupe, interactive play, ages 2–10. From $350.",
  path: "/birthdays",
  noindex: true,
});

const INCLUDED = [
  "A ~30-minute costumed fairy-tale play, chosen by you",
  "Interactive play the kids join in on (e.g. a bubble show)",
  "A professional troupe, with costumes, props and sound",
  "35–50 minutes of show, for ages 2–10",
  "We come to your home or venue — you just bring the cake",
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "1", title: "Pick a show & date", body: "Choose a fairy tale and tell us when the party is. Temporary copy." },
  { n: "2", title: "Send a request", body: "Share your details — we'll confirm availability and a quote." },
  { n: "3", title: "We bring the magic", body: "We arrive, set up, and put on the whole show. You enjoy the party." },
];

const FAQ: QA[] = [
  {
    question: "Where can you perform?",
    answer:
      "At your home, a park or a party venue — indoors, or outside with some shade. We just need a bit of space and power nearby.",
  },
  {
    question: "How long is the party show?",
    answer:
      "35–50 minutes: a costumed fairy-tale play plus interactive play the kids join in on.",
  },
  {
    question: "What ages is it best for?",
    answer: "Ages 2–10. We adapt the show to the birthday child and their guests.",
  },
  {
    question: "What's included?",
    answer:
      "A professional troupe, costumes, props, sound and interactive play (like a bubble show). You just bring the cake.",
  },
  {
    question: "How much does it cost, and how do we book?",
    answer:
      "From $350, by number of children; distance beyond our base area is quoted on request. Send a request with your date, or give us a call, and we'll confirm availability.",
  },
];

export default function BirthdaysPage() {
  return (
    <SiteShell activeHref="/birthdays">
      {/* Hero — a magical party without the hassle */}
      <Container className="pb-12 pt-10 md:pb-16 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Birthday Parties", href: "/birthdays" },
          ]}
          className="mb-6"
        />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Tag accent="coral" tone="accent" className="mb-3">
              For families &amp; birthdays
            </Tag>
            <SectionHeader
              as="h1"
              accent="coral"
              title="A magical party — without the hassle"
              subtitle="A real costumed theater show for the birthday child, brought to your home or venue. Not just an entertainer — a whole performance the kids join in on. Temporary copy."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking">Book a birthday show</Button>
              <Button href="/shows" variant="secondary">
                Browse the shows
              </Button>
            </div>
          </div>
          <div className="flex aspect-4/3 items-center justify-center rounded-2xl border border-border-soft bg-coral/10 p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <p className="font-display text-2xl text-coral-text">Birthday party photo</p>
              <Tag accent="coral" tone="accent">
                Photo — pending
              </Tag>
            </div>
          </div>
        </div>
      </Container>

      {/* What's included */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              as="h2"
              accent="coral"
              eyebrow="What's included"
              marker={<SparkStar size={16} />}
              title="Everything but the cake"
              subtitle="A turnkey show that comes to you. From $350."
            />
          </div>
          <ul className="flex flex-col gap-3">
            {INCLUDED.map((x) => (
              <li key={x} className="flex items-start gap-2 text-ink">
                <span className="mt-1 shrink-0">
                  <SparkStar size={16} />
                </span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Popular party shows → /shows */}
      <Section>
        <SectionHeader
          as="h2"
          eyebrow="Crowd-pleasers"
          marker={<SparkStar size={16} />}
          title="Popular party shows"
          subtitle="A few favourites for birthdays — browse all eight to find the perfect tale."
        />
        <div className="mt-10">
          <ShowCardGrid shows={FEATURED_SHOWS} />
        </div>
        <div className="mt-8">
          <Button href="/shows" variant="secondary">
            See all shows
          </Button>
        </div>
      </Section>

      {/* How to book */}
      <Section tone="surface">
        <SectionHeader
          as="h2"
          accent="coral"
          eyebrow="How to book"
          marker={<SparkStar size={16} />}
          title="Three steps to the party"
          subtitle="From first message to curtain. From $350; distance quoted on request."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex h-full flex-col gap-3 rounded-lg border border-border-soft bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-coral/15 font-display text-xl text-coral-text">
                {s.n}
              </span>
              <h3 className="font-display text-xl text-forest-800">{s.title}</h3>
              <p className="text-ink">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <FaqSection items={FAQ} eyebrow="For parents" title="Birthday party questions, answered" />

      {/* Lead capture */}
      <LeadForm
        eyebrow="Book a party"
        heading="Plan a magical birthday"
        sub="Tell us the date, ages and how many children — we'll confirm availability and a quote. Demo form — no message is sent yet."
      />
      <BookingCTABand
        heading="Ready to book the party?"
        sub="A real theater show for the birthday child, from $350. Send a request or give us a call."
      />
    </SiteShell>
  );
}
