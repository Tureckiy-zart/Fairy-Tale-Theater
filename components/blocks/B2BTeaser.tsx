"use client";
// B2BTeaser — Home block #6 (SITE_STRUCTURE §4.1): the schools/preschools path
// (values/SEL, professionalism, turnkey) → /school-shows. School Shows line accent =
// sage (§12). Copy is final; the differentiators (turnkey, troupe, ages 2–10,
// transparent pricing) are real positioning (02_POSITIONING §5). Phosphor Duotone (§6).
import Image from "next/image";
import { CheckCircle } from "@phosphor-icons/react";
import { Button, Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";

const POINTS = [
  "Assembly-ready and turnkey — we bring the whole show to you.",
  "Kind values and SEL themes woven into every story.",
  "A professional troupe, age-appropriate for 2–10.",
  "Transparent pricing by group size — easy to budget.",
];

export function B2BTeaser() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
            <SectionHeader
              accent="sage"
              eyebrow="For preschools & schools"
              title="Theater your director can say yes to"
              subtitle="Assembly-ready, values-driven shows that fit a school day — and we bring everything."
            />
            <ul className="mt-6 flex flex-col gap-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2 text-ink">
                  <CheckCircle size={22} weight="duotone" aria-hidden className="mt-0.5 shrink-0 text-sage" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <Button href="/school-shows" variant="secondary">
                Explore school shows
              </Button>
            </div>
          </div>
        </Reveal>
        <Reveal delayMs={75}>
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border-soft bg-sage/10">
            <Image
              src="/images/gallery/children/host-with-seated-children.jpg"
              alt="A costumed performer engages a room of seated children watching attentively."
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
