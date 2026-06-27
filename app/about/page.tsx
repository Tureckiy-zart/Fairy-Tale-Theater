// About (/about) — SITE_STRUCTURE_AND_BLOCKS.md §4.6. Block order: mission (theater as
// magic) → 30+ years → the troupe (4 artists + roles, canonical from 01_CONTENT) →
// quiet warm backstory → PersonaIntro (Miss Lana, first person) → values → CTA.
//
// GATES:
//   • Heritage: owner-APPROVED to name the Ukrainian roots explicitly, once, in the
//     backstory paragraph below (warm, not a slogan). Brand/SEO/visual layers stay
//     country-neutral — no Slavic/Russian visual coding, never Russia.
//   • Svitlana is listed as Director only — the "Svitlana = owner" link is unconfirmed
//     (owner-gated); we never assert ownership.
//   • 🔴 The Miss Lana mini-story (PersonaIntro first-person line) is a TEMPORARY
//     placeholder — owner to supply; do not invent a bio. Portrait/art stay placeholders [TM].
// Copy is final (except the 🔴 mini-story). Server component; metadata via lib/seo (noindex).
import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import {
  Breadcrumb,
  Button,
  Container,
  Section,
  SectionHeader,
} from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { PersonaIntro } from "@/components/blocks/PersonaIntro";
import { TrustStrip } from "@/components/blocks/TrustStrip";
import { FACTS, TROUPE, VALUES } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Miss Lana's Fairy-Tale Theatre is a professional touring troupe led by 30+ years of experience, bringing kind, values-driven fairy tales to life for children across Los Angeles.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <SiteShell activeHref="/about">
      {/* Mission */}
      <Container className="pb-10 pt-10 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ]}
          className="mb-6"
        />
        <SectionHeader
          as="h1"
          eyebrow="Our theater"
          marker={<SparkStar size={18} />}
          title="Theater as a little bit of magic"
          subtitle="For Miss Lana, theatre has never been only a performance. It is a place where a child can meet courage, kindness, friendship, and wonder in a form they can see and feel. For more than 30 years, her work has brought fairy tales to life through actors, costumes, scenery, music, and the quiet magic of a shared story."
        />
      </Container>

      {/* 30+ years */}
      <Section tone="surface">
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <p className="font-display text-6xl text-forest-700 md:text-7xl">{FACTS.experience}</p>
          <div>
            <SectionHeader
              as="h2"
              eyebrow="Experience you can feel"
              title="Decades of bringing tales to life"
              subtitle="More than thirty years of stage experience stand behind every show — a professional troupe whose craft turns a simple fairy tale into a performance children remember."
            />
          </div>
        </div>
      </Section>

      {/* The troupe — 4 artists + roles (canonical) */}
      <Section>
        <SectionHeader
          as="h2"
          eyebrow="Meet the troupe"
          marker={<SparkStar size={16} />}
          title="A real company behind Miss Lana"
          subtitle="Not one entertainer, but a professional company — actors, writers and directors who build every show together."
        />

        {/* Team presentation — real troupe group photo on stage (operator-supplied). */}
        <figure className="mx-auto mt-10 max-w-3xl">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border-soft shadow-md">
            <Image
              src="/images/troupe-fairy-tale-theater.jpg"
              alt="Miss Lana and the full costumed troupe together on stage after a performance."
              fill
              sizes="(min-width: 768px) 48rem, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-center text-sm text-ink-soft">
            Miss Lana with the troupe on stage.
          </figcaption>
          <div className="mt-6 flex justify-center">
            <Button href="/gallery" variant="secondary">
              See the troupe in our gallery
            </Button>
          </div>
        </figure>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TROUPE.map((member) => (
            <li
              key={member.name}
              className="flex h-full flex-col items-center gap-3 rounded-lg border border-border-soft bg-white p-6 text-center shadow-sm"
            >
              {/* Placeholder portrait — real photos land in Phase 4 [ASSET]. */}
              <span className="flex h-20 w-20 items-center justify-center rounded-pill border border-border-soft bg-surface">
                <SparkStar size={28} />
              </span>
              <h3 className="font-display text-xl text-forest-800">{member.name}</h3>
              <p className="text-sm text-ink-soft">{member.role}</p>
            </li>
          ))}
        </ul>

        {/* Warm heritage — owner-approved to name the Ukrainian roots EXPLICITLY here,
            once, on /about only (BUILD_MISS_LANA_COPY_FIXES_001). Brand/SEO/visual layers
            stay country-neutral; never a slogan, never Slavic/Russian visual coding, never Russia. */}
        <div className="mt-10 max-w-prose rounded-2xl border border-border-soft bg-cream p-6 md:p-8">
          <p className="text-lg text-ink">
            For more than 30 years, our troupe has made theater for children — a craft we built
            on the Ukrainian stage before bringing it home to families across Los Angeles. Those
            years of classical training are what you see in every show: real costumes, real
            characters, and stories told with heart.
          </p>
        </div>
      </Section>

      {/* PersonaIntro — Miss Lana, first person, placeholder portrait */}
      <PersonaIntro />

      {/* Values */}
      <Section tone="surface">
        <SectionHeader
          as="h2"
          eyebrow="What we stand for"
          marker={<SparkStar size={16} />}
          title="Kind stories, every time"
          subtitle="The same thread runs through all eight of our shows."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="flex h-full flex-col gap-2 rounded-lg border border-border-soft bg-white p-6 shadow-sm"
            >
              <h3 className="font-display text-xl text-forest-800">{v.title}</h3>
              <p className="text-ink">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Trust + CTA */}
      <TrustStrip />
      <BookingCTABand
        heading="Bring the story to your children"
        sub="Tell us about your event and we'll bring a kind fairy tale to life — send a request or give us a call."
      />
    </SiteShell>
  );
}
