"use client";
// FormatExplainer — Home block #3 (SITE_STRUCTURE §4.1): what it is, and the
// differentiator — "a real theater show, not a one-off animator". The format is a
// real fact (~30-min costumed play + interactive play e.g. bubbles, 35–50 min total,
// ages 2–10 — PROJECT_BRIEF). Copy is final. Phosphor Duotone (§6),
// scroll-reveal below the fold (§10).
import { MaskHappy, Drop, Clock, UsersThree } from "@phosphor-icons/react";
import { Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";
import { FACTS } from "@/lib/site";

const POINTS = [
  {
    icon: MaskHappy,
    title: "A costumed fairy-tale play",
    body: "About 30 minutes of real, costumed storytelling — a kind story with heart.",
  },
  {
    icon: Drop,
    title: "Interactive play with the kids",
    body: "Then the children join in (like a bubble show), so everyone is part of the magic.",
  },
  {
    icon: Clock,
    title: `${FACTS.showLength} in total`,
    body: "Long enough to delight, short enough for little ones.",
  },
  {
    icon: UsersThree,
    title: FACTS.ages,
    body: "Tuned for young audiences, performed by a professional troupe.",
  },
];

export function FormatExplainer() {
  return (
    <Section>
      <SectionHeader
        eyebrow="What it is"
        marker={<SparkStar size={16} />}
        title={
          <>
            A real theater show — <span className="text-forest-600">not a one-off animator.</span>
          </>
        }
        subtitle="Costumed actors bring a kind fairy tale to life, then play along with the children. Here's what makes it special."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delayMs={i * 75}>
            <div className="flex h-full flex-col gap-3 rounded-lg border border-border-soft bg-white p-6 shadow-sm">
              <span data-icon="duotone-brand" className="text-forest-700">
                <Icon size={32} weight="duotone" aria-hidden />
              </span>
              <h3 className="font-display text-xl text-forest-800">{title}</h3>
              <p className="text-ink">{body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
