// Birthdays (/birthdays) — B2C landing, SITE_STRUCTURE_AND_BLOCKS.md §4.3. Block
// order: hero → what's included → popular party shows → from $350 → how to book →
// FAQ → LeadForm + BookingCTABand. Birthday Parties line accent = coral (§12).
// Travel is confirmed in each custom quote; no fixed surcharge or blanket free radius.
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
import { AREAS, FACTS } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Birthday Parties",
  description:
    `A real costumed fairy-tale show for the birthday child — magic that comes to your home or venue, no hassle. Professional troupe, interactive play, ${FACTS.ages.toLowerCase()}. ${FACTS.priceFromCap}. Serving Southern California and farther California locations by request.`,
  path: "/birthdays",
});

const INCLUDED = [
  "A ~30-minute costumed fairy-tale play, chosen by you",
  "Interactive play the kids join in on (e.g. a bubble show)",
  "A professional troupe, with costumes, props and sound",
  `About an hour of show, for ${FACTS.ages.toLowerCase()}`,
  "We come to your home or venue — you just bring the cake",
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "1", title: "Pick a show & date", body: "Choose a fairy tale and tell us when the party is." },
  { n: "2", title: "Send a request", body: "Share your details and choose the best way for us to reply." },
  { n: "3", title: "We bring the magic", body: "We arrive, set up, and put on the whole show. You enjoy the party." },
];

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
    answer: `${FACTS.ages}. We adapt the show to the birthday child and their guests.`,
  },
  {
    question: "What's included?",
    answer:
      "A professional troupe, costumes, props, sound and interactive play (like a bubble show). You just bring the cake.",
  },
  {
    question: "How much does it cost, and how do we book?",
    answer:
      `${FACTS.priceFromCap}; we confirm your custom quote when you book. We're based in ${AREAS.base}, serve ${AREAS.region}, and travel farther across California by request. Send your date and city, choose how you'd like us to reply, and we'll confirm availability and any travel cost.`,
  },
];

export default function BirthdaysPage() {
  return (
    <SiteShell activeHref="/birthdays">
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
              subtitle="A real costumed theater show for the birthday child, brought to your home or venue — a whole performance the children are part of, from the first scene to the finale."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking">Book a birthday show</Button>
              <Button href="/shows" variant="secondary">
                Browse the shows
              </Button>
            </div>
          </div>
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

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader
              as="h2"
              accent="coral"
              eyebrow="What's included"
              marker={<SparkStar size={16} />}
              title="Everything but the cake"
              subtitle={`A turnkey show that comes to you. ${FACTS.priceFromCap}.`}
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

      <Section tone="surface">
        <SectionHeader
          as="h2"
          accent="coral"
          eyebrow="How to book"
          marker={<SparkStar size={16} />}
          title="Three steps to the party"
          subtitle={`From first message to curtain. ${FACTS.priceFromCap}; your quote confirms any travel cost before you book.`}
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

      <FaqSection items={FAQ} eyebrow="For parents" title="Birthday party questions, answered" />

      <LeadForm
        eyebrow="Book a party"
        heading="Plan a magical birthday"
        sub="Tell us the date, ages, number of children and city — we'll confirm availability and a quote within 1–2 business days."
      />
      <BookingCTABand
        heading="Ready to book the party?"
        sub={`A real theater show for the birthday child, ${FACTS.priceFrom}. Send a request and choose how you'd like us to reply.`}
      />
    </SiteShell>
  );
}
