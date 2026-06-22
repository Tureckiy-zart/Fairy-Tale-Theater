"use client";

// Components (§11) — the LIVING gallery. These render the real, production
// primitives from components/ui/* (no hand-rolled forks): change a primitive and
// this section changes with it. The booking layout is presentational only — the
// Field primitive carries no submit/backend logic (that is a page concern).
import { Lightbulb, UsersThree, CalendarBlank } from "phosphor-react";
import { Button, Field, Card } from "@/components/ui";
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

function CardsShowcase() {
  return (
    <>
      <SubHead>Card — show cards</SubHead>
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
      <Note>
        Media is a placeholder — real photography is gated on the asset/trademark step (§9, §15). Cards
        equalise height via the grid and lift to shadow-md on hover.
      </Note>
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
      <NavNote />
    </Section>
  );
}
