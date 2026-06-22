"use client";
// PersonaIntro — Home block #8 (SITE_STRUCTURE §4.1): a warm first-person intro from
// Miss Lana → /about. Persona-lead brand (BRAND.md). The portrait is a PLACEHOLDER
// (final Miss Lana character is gated on trademark-clearance — §8/§15), marked with a
// Tag; the first-person voice is the canon direction (DESIGN_SYSTEM §8). The quiet
// Ukrainian theatrical backstory lives on /about, never as a slogan (no Slavic coding).
import { UserCircle } from "phosphor-react";
import { Button, Section, SectionHeader, Tag } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";

export function PersonaIntro() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Placeholder portrait — final character pending (§15). */}
        <Reveal>
          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl border border-border-soft bg-linear-to-br from-glow-50 to-surface">
            <div className="flex flex-col items-center gap-3 text-center">
              <span data-icon="duotone-brand" className="text-forest-700">
                <UserCircle size={96} weight="duotone" aria-hidden />
              </span>
              <p className="font-display text-xl text-forest-700">Miss Lana — portrait</p>
              <Tag>Character pending</Tag>
            </div>
          </div>
        </Reveal>

        {/* First-person intro */}
        <Reveal delayMs={75}>
          <div>
            <SectionHeader
              eyebrow="Meet Miss Lana"
              marker={<SparkStar size={16} />}
              title="&ldquo;I&rsquo;ll bring the story to you.&rdquo;"
              subtitle="Our warm host and storyteller. Placeholder copy."
            />
            <p className="mt-5 max-w-prose text-ink">
              {/* PLACEHOLDER first-person copy — final wording in a later phase. */}
              Hi, I&rsquo;m Miss Lana. With a professional troupe and 30+ years of theater behind us,
              we bring kind, timeless fairy tales to life — costumes, characters and a little light —
              right where your children are.
            </p>
            <div className="mt-7">
              <Button href="/about" variant="secondary">
                About the theater
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
