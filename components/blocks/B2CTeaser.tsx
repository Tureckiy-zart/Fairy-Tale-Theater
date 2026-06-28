"use client";
// B2CTeaser — Home block #7 (SITE_STRUCTURE §4.1): the families/birthdays path
// (a magical party without the hassle) → /birthdays. Birthday Parties line accent =
// coral (§12). Copy is final; "a real theater show, not just an entertainer" is
// real positioning (02_POSITIONING §5). On desktop the media sits left (alternation).
import Image from "next/image";
import { Sparkle } from "@phosphor-icons/react";
import { Button, Section, SectionHeader } from "@/components/ui";
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
                Costumed actors, a kind story, and interactive play the children are part of — a real
                show, brought to your celebration.
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
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border-soft bg-coral/10 lg:order-first">
            <Image
              src="/images/gallery/children/host-dancing-with-girl.jpg"
              alt="A costumed performer spins and dances with a giggling girl at an indoor party."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}