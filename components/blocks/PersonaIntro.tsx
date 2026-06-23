"use client";
// PersonaIntro — Home block #8 (SITE_STRUCTURE §4.1): a warm first-person intro from
// Miss Lana → /about. Persona-lead brand (BRAND.md). The portrait is a real photo of
// Miss Lana (the director) supplied by the operator — placeholder direction pending
// final graded assets; the first-person voice is the canon direction (DESIGN_SYSTEM §8).
// The quiet Ukrainian theatrical backstory lives on /about, never as a slogan.
import Image from "next/image";
import { Button, Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";

export function PersonaIntro() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Miss Lana — real portrait (operator-supplied); final graded asset pending. */}
        <Reveal>
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-border-soft shadow-md">
            <Image
              src="/images/miss-lana-portrait.jpg"
              alt="Miss Lana, the theater's host and storyteller — a warm smiling portrait."
              fill
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover object-top"
            />
          </div>
        </Reveal>

        {/* First-person intro */}
        <Reveal delayMs={75}>
          <div>
            <SectionHeader
              eyebrow="Meet Miss Lana"
              marker={<SparkStar size={16} />}
              title="&ldquo;I&rsquo;ll bring the story to you.&rdquo;"
              subtitle="Our warm host and storyteller."
            />
            <p className="mt-5 max-w-prose text-ink">
              {/* 🔴 TEMPORARY mini-story — the owner will supply Miss Lana's personal line
                  (BUILD_MISS_LANA_COPY_FIXES_001). Do NOT invent a bio; keep this warm
                  first-person placeholder until it lands. */}
              Hi, I&rsquo;m Miss Lana. With 30+ years of theater behind me and a professional troupe
              at my side, we bring kind, timeless fairy tales to life — costumes, characters and a
              little light — right where your children are.
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
