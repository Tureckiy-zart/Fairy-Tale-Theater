// About (/about) — SITE_STRUCTURE_AND_BLOCKS.md §4.6. Block order: mission (theater as
// magic) → 30+ years → the troupe (4 artists + roles, canonical from 01_CONTENT) →
// quiet warm backstory → PersonaIntro (Miss Lana, first person) → values → CTA.
//
// 🔴 GATES (kept gentle + flagged, NOT hard-coded as confirmed):
//   • The backstory is the canon's SOFT default — a rich theatrical tradition carried
//     to LA. It deliberately avoids any Slavic/Russian/Ukrainian visual or copy coding
//     and is NOT a slogan (canon §4.6). The explicit heritage wording + owner sign-off
//     are owner-gated; do not name a country or assert it as confirmed here.
//   • Svitlana is listed as Director only — the "Svitlana = owner" link is unconfirmed
//     (owner-gated); we never assert ownership.
//   • The Miss Lana portrait + any character art stay placeholders (PersonaIntro; [TM]).
// Copy is temporary. Server component; metadata via lib/seo (noindex pre-launch).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  Breadcrumb,
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
    "Miss Lana's Fairy-Tale Theater is a professional touring troupe with 30+ years of experience, bringing kind, values-driven fairy tales to life for children across Los Angeles.",
  path: "/about",
  noindex: true,
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
          subtitle="We believe a story, well told, can delight a child, spark their imagination and bring a kind idea to life. That's what Miss Lana's Fairy-Tale Theater brings to your event — a real, costumed performance, right where your children are. Temporary copy."
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
              subtitle="More than thirty years of stage experience stand behind every show — a professional troupe whose craft turns a simple fairy tale into a performance children remember. Temporary copy."
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
          subtitle="Not one entertainer, but a professional company — actors, writers and directors who build every show together. Temporary copy."
        />
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

        {/* Quiet, warm backstory — SOFT default; explicit heritage is owner-gated (🔴).
            No Slavic/Russian/Ukrainian coding; not a slogan (canon §4.6). */}
        <div className="mt-10 max-w-prose rounded-2xl border border-border-soft bg-cream p-6 md:p-8">
          <p className="text-lg text-ink">
            Behind Miss Lana is a company rooted in a rich theatrical tradition — years of
            classical stage training carried across the world and brought home to Los
            Angeles, where it now lives on as a touring children&rsquo;s theater. Temporary copy.
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
          subtitle="The same thread runs through all eight of our shows. Temporary copy."
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
