"use client";

// Components (§11) — the LIVING gallery. These render the real, production
// primitives from components/ui/* (no hand-rolled forks): change a primitive and
// this section changes with it. The booking layout is presentational only — the
// Field primitive carries no submit/backend logic (that is a page concern).
import { Lightbulb, UsersThree, CalendarBlank, Sparkle } from "phosphor-react";
import {
  Button,
  Field,
  Card,
  Tag,
  Accordion,
  Breadcrumb,
  SectionHeader as UISectionHeader,
} from "@/components/ui";
import { Section, SubHead, Note } from "./primitives";

/* ------------------------------------------------------------------- CTAs -- */

const lanternIcon = (size: number) => (
  <span data-icon="duotone-brand">
    <Lightbulb size={size} weight="duotone" />
  </span>
);

function ButtonsShowcase() {
  return (
    <>
      <SubHead>Button — variants</SubHead>
      <div className="flex flex-wrap items-center gap-4">
        <Button leadingIcon={lanternIcon(20)}>Book Miss Lana</Button>
        <Button variant="secondary">See the shows</Button>
        <Button variant="tertiary">Learn more</Button>
      </div>

      <SubHead>Sizes &amp; states</SubHead>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
        <Button variant="secondary" href="#components">
          As a link
        </Button>
      </div>
      <Note>
        Primary = forest-600 + white (5.87:1) → hover forest-700 + scale 1.02 + shadow-glow; active
        .97; light-halo focus on green fills; disabled forest-300 + ink-muted. White is never on gold.
      </Note>
    </>
  );
}

/* ------------------------------------------------------------------ fields -- */

function FieldsShowcase() {
  return (
    <>
      <SubHead>Field — states</SubHead>
      <div className="grid max-w-2xl grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" placeholder="e.g. Alex Rivera" helper="So we know who to greet." />
        <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
        <Field
          label="Event date"
          name="date"
          error="Please add a date so we can check availability."
          placeholder="MM / DD / YYYY"
        />
        <Field label="Phone" name="phone" type="tel" success="Looks good — we'll call to confirm." defaultValue="(323) 555-0142" />
      </div>
      <div className="mt-5 max-w-2xl">
        <Field
          label="Tell us about your event"
          name="about"
          multiline
          rows={4}
          helper="How many children, where, which show…"
        />
        <div className="mt-5">
          <Button leadingIcon={lanternIcon(20)}>Request a booking</Button>
        </div>
      </div>
      <Note>
        Always-visible label; “(required)” is spelled out. Each error/success pairs an inline Phosphor
        icon with the message (colour is never the sole signal, §3.2/§13); linked via aria-describedby.
      </Note>
    </>
  );
}

/* ------------------------------------------------------------------- cards -- */

const SHOWS: { title: string; blurb: string }[] = [
  {
    title: "The Lantern & the Little Fox",
    blurb: "A gentle tale about sharing your light — placeholder blurb for layout review only.",
  },
  {
    title: "The Forest Friends' Feast",
    blurb: "Woodland friends learn that the best feast is the one everyone helps to make together.",
  },
  {
    title: "Brave Little Hedgehog",
    blurb:
      "A shy hedgehog discovers that being kind takes more courage than being loud — and that is its own quiet kind of magic.",
  },
];

const SERVICE_LINES = [
  { accent: "forest", tag: "Fairy-Tale Theater", title: "The flagship live show", blurb: "A real costumed performance — story, characters, a touch of magic.", cta: "See the shows" },
  { accent: "coral", tag: "Birthday Parties", title: "Parties that feel like a show", blurb: "The theater comes to your celebration, not a single animator.", cta: "Birthday shows" },
  { accent: "sage", tag: "School Shows", title: "Assembly-ready, values-first", blurb: "SEL-friendly, age-appropriate, turnkey for daycares and schools.", cta: "For schools" },
  { accent: "berry", tag: "& Friends", title: "Costumed characters visit", blurb: "Beloved friends drop by — theatrical quality, not generic.", cta: "Meet the friends" },
] as const;

function CardsShowcase() {
  return (
    <>
      <SubHead>Card — show cards (text link)</SubHead>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SHOWS.map((show) => (
          <Card
            key={show.title}
            title={show.title}
            href="#components"
            blurb={show.blurb}
            meta={[
              { icon: UsersThree, label: "Ages 2–10" },
              { icon: CalendarBlank, label: "~40 min" },
            ]}
          />
        ))}
      </div>

      <SubHead>Card — service lines (Button CTA + accent + tag)</SubHead>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICE_LINES.map((line) => (
          <Card
            key={line.tag}
            accent={line.accent}
            tag={line.tag}
            title={line.title}
            blurb={line.blurb}
            cta={{ label: line.cta, href: "#components", variant: line.accent === "forest" ? "primary" : "secondary" }}
          />
        ))}
      </div>
      <Note>
        Media is a placeholder — real photography is gated on the asset/trademark step (§9, §15). Cards
        equalise height via the grid and lift to shadow-md on hover. The service-line row shows the
        optional Button CTA, the §12 line accent (top border + tag tint), and the tag.
      </Note>
    </>
  );
}

/* ------------------------------------------------------------- tags / FAQ -- */

function TagsShowcase() {
  return (
    <>
      <SubHead>Tag — format / line chips</SubHead>
      <div className="flex flex-wrap items-center gap-3">
        <Tag>New show</Tag>
        <Tag accent="coral" tone="accent">Birthday Parties</Tag>
        <Tag accent="sage" tone="accent">School Shows</Tag>
        <Tag accent="berry" tone="solid">&amp; Friends</Tag>
        <Tag icon={<Sparkle size={14} weight="duotone" />}>Featured</Tag>
      </div>
      <Note>One pill, three tones (neutral · accent text · solid fill). White text sits only on the line fill, never on gold (§3.2).</Note>
    </>
  );
}

const FAQ = [
  { question: "Do you travel to our venue?", answer: <p>Yes — we&rsquo;re a touring theater across Los Angeles, with trips to San Diego, Sacramento, and San Jose.</p> },
  { question: "How long is a show?", answer: <p>A costumed performance runs ~30 minutes, plus interactive play — about 35–50 minutes total.</p> },
  { question: "What ages is it for?", answer: <p>Designed for children roughly 2–10, and tuned for the room (daycare, preschool, school assembly, or a birthday).</p> },
];

function AccordionShowcase() {
  return (
    <>
      <SubHead>Accordion — FAQ</SubHead>
      <div className="max-w-2xl">
        <Accordion items={FAQ} defaultOpen={0} />
      </div>
      <Note>
        Each row is a real button toggling an aria-controlled region; the panel shows/hides instantly
        (no layout animation, §10.4) — only the chevron rotates (motion-safe). Pair with faqSchema() for FAQPage.
      </Note>
    </>
  );
}

/* ------------------------------------------------ breadcrumb / sectionhead -- */

function NavigationShowcase() {
  return (
    <>
      <SubHead>Breadcrumb</SubHead>
      <Breadcrumb
        noSchema
        items={[
          { name: "Home", href: "#components" },
          { name: "Shows", href: "#components" },
          { name: "The Gingerbread Man", href: "#components" },
        ]}
      />
      <Note>
        Trail + BreadcrumbList JSON-LD in one primitive (here JSON-LD is suppressed for the preview).
        The last crumb is the current page (aria-current, not a link).
      </Note>

      <SubHead>SectionHeader</SubHead>
      <UISectionHeader
        eyebrow="Repertoire"
        title="Eight shows to choose from"
        subtitle="Each a real costumed performance — pick the tale, we bring the theater."
        marker={<span data-icon="duotone-brand"><Sparkle size={16} weight="duotone" /></span>}
      />
      <Note>Eyebrow (amber glow-700, the only amber-text token) + Fraunces clamp heading + subtitle. Pair with Container/Section for page bands.</Note>
    </>
  );
}

/* --------------------------------------------------------------------- nav -- */

function NavNote() {
  return (
    <>
      <SubHead>Nav</SubHead>
      <ul className="max-w-prose list-disc space-y-2 pl-5 text-ink">
        <li>The sticky header at the top of this page is the live Nav primitive.</li>
        <li>Scroll: it goes transparent → cream + shadow-sm. The first Tab stop is “Skip to content”.</li>
        <li>
          Narrow the viewport (&lt; 768px): the burger appears. Open it, Tab — focus is trapped in the
          drawer; <kbd className="rounded-xs border border-border-strong px-1 text-xs">Esc</kbd> closes
          it and returns focus to the burger.
        </li>
        <li>The active link carries a 2px glow-400 underline and aria-current=&quot;page&quot;.</li>
      </ul>
    </>
  );
}

export function ComponentsSection() {
  return (
    <Section
      id="components"
      index={7}
      title="Components"
      lead="The live gallery — these are the real components/ui primitives (Button, Field, Card, Nav) the marketing pages will be built from, straight from §11."
    >
      <ButtonsShowcase />
      <FieldsShowcase />
      <CardsShowcase />
      <TagsShowcase />
      <AccordionShowcase />
      <NavigationShowcase />
      <NavNote />
    </Section>
  );
}
