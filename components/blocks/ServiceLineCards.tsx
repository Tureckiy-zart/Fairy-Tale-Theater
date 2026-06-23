"use client";
// ServiceLineCards — Home block #4 (SITE_STRUCTURE §4.1): the 4 service lines under
// the Miss Lana umbrella (BRAND.md), each with its per-section accent (DESIGN_SYSTEM
// §12). Built from the Card primitive's service-line mode (accent top-border + tinted
// tag), so the lines differ only by a thin accent — one system, no re-skins. Each
// card links to its line/landing. Media placeholders are gated assets (§15).
import { Card, Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";
import { SERVICE_LINES } from "@/lib/site";

export function ServiceLineCards() {
  return (
    <Section>
      <SectionHeader
        eyebrow="One troupe, four ways to book"
        marker={<SparkStar size={16} />}
        title="Pick the format that fits your day"
        subtitle="The same professional theater, shaped to fit your event."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICE_LINES.map((line, i) => (
          <Reveal key={line.key} delayMs={i * 75}>
            <Card
              title={line.title}
              tag={line.tag}
              accent={line.accent}
              blurb={line.blurb}
              href={line.href}
              ctaLabel="Explore"
              mediaSrc={line.media}
              mediaAlt={line.mediaAlt}
              mediaSizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
