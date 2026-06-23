// Characters / Miss Lana & Friends (/characters) — the "& Friends" line (SITE_STRUCTURE
// §4.3 + BRAND.md). Block order: hero (placeholder media) → costumed characters who come
// to visit → differentiation from generic animators (the quality of a real theater
// troupe) → how it works → CTA + BookingCTABand. "& Friends" line accent = berry (§12).
// "A real troupe, not a one-off animator" is real positioning (02_POSITIONING); copy is
// final. Costumed-character media renders the marked placeholder treatment (Phase 4
// [ASSET]/[TM]). Server component; metadata via lib/seo (noindex). Breadcrumb → schema.
import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import {
  ACCENT_BORDER_TOP,
  Breadcrumb,
  Button,
  Container,
  Section,
  SectionHeader,
  Tag,
} from "@/components/ui";
import { cx } from "@/components/ui/cx";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";

export const metadata: Metadata = buildMetadata({
  title: "Characters & Friends",
  description:
    "Costumed characters who come to visit the children — performed by a professional theater troupe, not a one-off animator. Warm, in-character and full of wonder, for ages 2–10.",
  path: "/characters",
  noindex: true,
});

const DIFFERENCE: { title: string; body: string }[] = [
  {
    title: "A professional troupe",
    body: "Led by 30+ years of stagecraft, our trained actors stay fully in character — voice, movement and warmth — not a costume hired for the hour.",
  },
  {
    title: "Real theater quality",
    body: "Costumes, props and performance built for the stage come to your event, so the magic feels genuine rather than improvised.",
  },
  {
    title: "Kind and age-aware",
    body: "Gentle with the littlest, lively with the older ones — every visit is shaped around the children and stays kind throughout.",
  },
];

const STEPS: { n: string; title: string; body: string }[] = [
  { n: "1", title: "Choose your characters", body: "Tell us who you'd love to welcome and the kind of moment you have in mind." },
  { n: "2", title: "Send a request", body: "Share your date, place and group — we'll confirm availability and a quote." },
  { n: "3", title: "They come to visit", body: "Our troupe arrives in character, ready to greet, play and make the day magical." },
];

export default function CharactersPage() {
  return (
    <SiteShell activeHref="/characters">
      {/* Hero */}
      <Container className="pb-12 pt-10 md:flex md:min-h-[calc(100svh-4rem)] md:flex-col md:pb-16 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Characters", href: "/characters" },
          ]}
          className="mb-6"
        />
        <div className="grid items-center gap-10 md:my-auto lg:grid-cols-2">
          <div>
            <Tag accent="berry" tone="accent" className="mb-3">
              Miss Lana &amp; Friends
            </Tag>
            <SectionHeader
              as="h1"
              accent="berry"
              title="Costumed characters who come to visit"
              subtitle="Friendly characters arrive at your event in full costume and in character — performed by our professional troupe. Not a one-off animator: a real piece of theater that comes to the children."
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking">Book a character visit</Button>
              <Button href="/shows" variant="secondary">
                Browse the shows
              </Button>
            </div>
          </div>
          {/* Costumed-character photo — operator-supplied. */}
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border-soft shadow-md">
            <Image
              src="/images/miss-lana-friends.jpg"
              alt="A performer in a bee costume on the grass in front of a flower-decorated backdrop."
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>

      {/* Differentiation from generic animators */}
      <Section tone="surface">
        <SectionHeader
          as="h2"
          accent="berry"
          eyebrow="The difference"
          marker={<SparkStar size={16} />}
          title="The quality of a real troupe"
          subtitle="Why a character visit from Miss Lana & Friends feels different from a one-off animator."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {DIFFERENCE.map((d) => (
            <div
              key={d.title}
              className={cx(
                "flex h-full flex-col gap-2 rounded-lg border border-border-soft bg-white p-6 shadow-sm",
                ACCENT_BORDER_TOP.berry,
              )}
            >
              <h3 className="font-display text-xl text-forest-800">{d.title}</h3>
              <p className="text-ink">{d.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHeader
          as="h2"
          accent="berry"
          eyebrow="How it works"
          marker={<SparkStar size={16} />}
          title="Three steps to a visit"
          subtitle="From first message to the moment they arrive. From $350; free within 30 miles, beyond quoted by distance."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex h-full flex-col gap-3 rounded-lg border border-border-soft bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-berry/15 font-display text-xl text-berry-text">
                {s.n}
              </span>
              <h3 className="font-display text-xl text-forest-800">{s.title}</h3>
              <p className="text-ink">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <BookingCTABand
        heading="Ready to welcome the characters?"
        sub="A real troupe in costume, brought to your event for ages 2–10. Send a request or give us a call."
      />
    </SiteShell>
  );
}
