// Birthdays (/birthdays) — B2C landing, SITE_STRUCTURE_AND_BLOCKS.md §4.3. Block
// order: hero ("a magical party without the hassle") → what's included → popular party
// shows (→ /shows) → "from $350" → how to book → FAQ (Accordion + FAQPage) → LeadForm
// + BookingCTABand. Birthday Parties line accent = coral (§12). "A real theater show,
// not just an entertainer" is real positioning (02_POSITIONING); copy is final.
// Photos render the marked placeholder treatment (Phase 4 [ASSET]). Travel: free across
// the greater LA area, quoted by distance beyond — NO dollar amounts. metadata via lib/seo (noindex).
import type { Metadata } from "next";
import Image from "next/image";
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
  "About an hour of show, for ages 2–10",
  "We come to your home or venue — you just bring the cake",
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "1", title: "Pick a show & date", body: "Choose a fairy tale and tell us when the party is." },
  { n: "2", title: "Send a request", body: "Share your details — we'll confirm availability and a quote." },
  { n: "3", title: "We bring the magic", body: "We arrive, set up, and put on the whole show. You enjoy the party." },
];

// The birthday child's special moments — worded as availability, never mandatory
// (OWNER_ANSWERS_DECISION_RECORD §1: birthday personalization). The child can join in
// "if they'd like"; touches happen "to suit" the child and show.
const BIRTHDAY_MOMENTS: { title: string; body: string }[] = [
  {
    title: "Greeted by name",
    body: "We welcome the birthday child by name and, if they'd like, they can take a little role in the story.",
  },
  {
    title: "A song & a special finale",
    body: "A “Happy Birthday” song and a special finale greeting, to suit how shy or excited they're feeling.",
  },
  {
    title: "A little gift to keep",
    body: "The birthday child usually gets a small gift — a soft toy and balloons — to remember the day.",
  },
  {
    title: "Add a favourite character",
    body: "You can also add a favourite costumed character to come and say hello, subject to availability.",
  },
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
      "About an hour: a ~30-minute costumed fairy-tale play, then ~30 minutes of games, dancing and bubbles the kids join in on.",
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
      "From $350; we confirm your custom quote when you book. Travel is free across the greater Los Angeles area and quoted by distance beyond that. Send a request with your date, or give us a call, and we'll confirm availability.",
  },
];

export default function BirthdaysPage() {
  return (
    <SiteShell activeHref="/birthdays">
      {/* Hero — a magical party without the hassle */}
      <Container className="pb-12 pt-10 md:flex md:min-h-[calc(100svh-4rem)] md:flex-col md:pb-16 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Birthday Parties", href: "/birthdays" },
          ]}
          className="mb-6"
        />
        <div className="grid items-center gap-10 md:my-auto lg:grid-cols-2">
          <div>
            <Tag accent="coral" tone="accent" className="mb-3">
              For families &amp; birthdays
            </Tag>
            <SectionHeader
              as="h1"
              accent="coral"
              title="A magical party — without the hassle"
              subtitle="A real costumed theater show for the birthday child, brought to your home or venue. Not just an entertainer — a whole performance the kids join in on."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking">Book a birthday show</Button>
              <Button href="/shows" variant="secondary">
                Browse the shows
              </Button>
            </div>
          </div>
          {/* Birthday party photo — operator-supplied. */}
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border-soft shadow-md">
            <Image
              src="/images/birthday-party.jpg"
              alt="A princess-costumed performer playing with a little girl at an outdoor birthday party."
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
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
            <p className="mt-4 text-sm text-ink-soft">
              Wondering about space, setup or the weather?{" "}
              <a href="/planning-your-event" className="font-semibold text-forest-700 underline-offset-4 hover:underline">
                See planning your event
              </a>
              .
            </p>
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

      {/* The birthday child's special moments (availability-worded — never mandatory) */}
      <Section>
        <SectionHeader
          accent="coral"
          eyebrow="For the birthday child"
          marker={<SparkStar size={16} />}
          title="Their moment to shine"
          subtitle="The day is built around the birthday child — they take part as much or as little as they'd like."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {BIRTHDAY_MOMENTS.map((m) => (
            <div
              key={m.title}
              className="flex h-full flex-col gap-2 rounded-lg border border-border-soft bg-white p-6 shadow-sm"
            >
              <h3 className="font-display text-xl text-forest-800">{m.title}</h3>
              <p className="text-ink">{m.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-prose text-ink-soft">
          Families and guests are welcome to take their own photos throughout the party.
        </p>
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
          subtitle="From first message to curtain. From $350; travel across greater LA is free, beyond quoted by distance."
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
        sub="Tell us the date, ages and how many children — we'll confirm availability and a quote within 1–2 business days."
      />
      <BookingCTABand
        heading="Ready to book the party?"
        sub="A real theater show for the birthday child, from $350. Send a request or give us a call."
      />
    </SiteShell>
  );
}
