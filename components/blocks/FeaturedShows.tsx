"use client";
// FeaturedShows — Home block #5 (SITE_STRUCTURE §4.1): a few cards from the
// 8-show repertoire → /shows. Built from the Card primitive (media 3:2 + meta +
// text link). Titles & photos are PLACEHOLDERS (real titles are owner-pending —
// 01_CONTENT_INVENTORY; assets gated — §15), marked with a Tag. Facts (ages, length)
// are real (lib/site). Scroll-reveal below the fold (§10).
import { UsersThree, Clock } from "phosphor-react";
import { Button, Card, Section, SectionHeader, Tag } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";
import { FACTS, PLACEHOLDER_SHOWS } from "@/lib/site";

export function FeaturedShows() {
  return (
    <Section tone="surface">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="From the repertoire"
          marker={<SparkStar size={16} />}
          title="Featured shows"
          subtitle="Eight kind fairy tales in the repertoire — a few favourites below. Placeholder titles & photos."
        />
        <Tag>Placeholder titles</Tag>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLACEHOLDER_SHOWS.map((show, i) => (
          <Reveal key={show.title} delayMs={i * 75}>
            <Card
              title={show.title}
              blurb={show.blurb}
              href="/shows"
              ctaLabel="See this show"
              meta={[
                { icon: UsersThree, label: FACTS.ages },
                { icon: Clock, label: FACTS.showLength },
              ]}
            />
          </Reveal>
        ))}
      </div>
      <div className="mt-8">
        <Button href="/shows" variant="secondary">
          See all shows
        </Button>
      </div>
    </Section>
  );
}
