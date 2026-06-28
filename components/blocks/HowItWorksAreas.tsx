"use client";
// HowItWorksAreas — Home block #10 (SITE_STRUCTURE §4.1): three simple steps +
// areas served + the "from $350" price face → /pricing. Real facts: areas (LA +
// San Diego/Sacramento/San Jose) and "from $350" (lib/site); travel is free across
// the greater LA area and quoted by distance beyond — never a dollar amount (owner rule). Phosphor (§6).
import { NumberCircleOne, NumberCircleTwo, NumberCircleThree, MapPin } from "@phosphor-icons/react";
import { Button, FeatureCard, Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";
import { AREAS, FACTS } from "@/lib/site";

const STEPS = [
  { icon: NumberCircleOne, title: "Choose a show", body: "Pick a fairy tale and a date." },
  { icon: NumberCircleTwo, title: "Book in a minute", body: "Send a quick request, or give us a call." },
  { icon: NumberCircleThree, title: "We come to you", body: "We bring the whole show to your venue." },
];

export function HowItWorksAreas() {
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="How it works"
        marker={<SparkStar size={16} />}
        title="Three steps to a show"
        subtitle="From first call to curtain."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delayMs={i * 75}>
            <FeatureCard icon={<Icon size={36} weight="duotone" aria-hidden />} title={title}>
              {body}
            </FeatureCard>
          </Reveal>
        ))}
      </div>

      {/* Areas + price face */}
      <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-border-soft bg-cream p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl text-forest-800">
            <MapPin size={24} weight="duotone" aria-hidden className="text-forest-600" />
            Where we go
          </p>
          <p className="mt-2 max-w-md text-ink-soft">
            Based in {AREAS.base}; we travel to {AREAS.travel.join(", ")}. Free across the
            greater LA area; beyond that, travel is quoted by distance.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <p className="font-display text-3xl text-forest-700 capitalize">{FACTS.priceFrom}</p>
          <Button href="/pricing" variant="secondary">
            See pricing
          </Button>
        </div>
      </div>
    </Section>
  );
}