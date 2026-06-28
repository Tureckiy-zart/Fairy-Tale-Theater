"use client";
// HowItWorksAreas — Home block #10 (SITE_STRUCTURE §4.1): three simple steps +
// the real touring geography + the "from $350" price face → /pricing. Los Angeles
// is the base, while farther California travel is available by request and confirmed
// in the custom quote; no unapproved blanket free-travel promise is made.
import { NumberCircleOne, NumberCircleTwo, NumberCircleThree, MapPin } from "@phosphor-icons/react";
import { Button, FeatureCard, Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";
import { AREAS, FACTS } from "@/lib/site";

const STEPS = [
  { icon: NumberCircleOne, title: "Choose a show", body: "Pick a fairy tale and a date." },
  { icon: NumberCircleTwo, title: "Send a request", body: "Tell us about the event and how you'd like us to reply." },
  { icon: NumberCircleThree, title: "We come to you", body: "We bring the whole show to your venue." },
];

export function HowItWorksAreas() {
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="How it works"
        marker={<SparkStar size={16} />}
        title="Three steps to a show"
        subtitle="From first message to curtain."
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
          <p className="mt-2 max-w-xl text-ink-soft">
            Based in {AREAS.base}; serving {AREAS.region} and traveling to {AREAS.travel.join(", ")}
            {" "}and other California locations by request. Travel details are confirmed in your quote.
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
