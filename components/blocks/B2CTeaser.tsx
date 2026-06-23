"use client";
// B2CTeaser — Home block #7 (SITE_STRUCTURE §4.1): the families/birthdays path
// (a magical party without the hassle) → /birthdays. Birthday Parties line accent =
// coral (§12). Copy is final; "a real theater show, not just an entertainer" is
// real positioning (02_POSITIONING §5). On desktop the media sits left (alternation).
import { Sparkle } from "@phosphor-icons/react";
import { Button, Section, SectionHeader, Tag } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

export function B2CTeaser() {
  return (
    <Section tone="surface">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
            <SectionHeader
              accent="coral"
              eyebrow="For families & birthdays"
              title="A magical party — without the hassle"
              subtitle="A real theater show, brought to your home or venue."
            />
            <p className="mt-5 flex items-start gap-2 text-ink">
              <Sparkle size={22} weight="duotone" aria-hidden className="mt-0.5 shrink-0 text-coral" />
              <span>
                Costumed actors, a kind story, and interactive play the kids join in on — not just an
                entertainer.
              </span>
            </p>
            <div className="mt-7">
              <Button href="/birthdays" variant="secondary">
                Explore birthday parties
              </Button>
            </div>
          </div>
        </Reveal>
        <Reveal delayMs={75}>
          <div className="flex aspect-4/3 items-center justify-center rounded-2xl border border-border-soft bg-coral/10 p-6 text-center lg:order-first">
            <div className="flex flex-col items-center gap-3">
              <p className="font-display text-2xl text-coral-text">Birthday party photo</p>
              <Tag accent="coral" tone="accent">
                Asset pending
              </Tag>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
