// Hero — Home block #1 (SITE_STRUCTURE §4.1). The LCP: H1 + sub render immediately
// with NO animation (§10.4). Server component (no Phosphor / no client JS) so the
// hero is as fast as possible. The signature glow is a static CSS gradient and the
// "photo" is a clearly-marked placeholder panel (no asset yet — §9/§15). H1 copy is
// the canon tagline (02_POSITIONING §7); facts (30+ years, areas) come from lib/site.
import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { GlowOrb, SparkStar } from "@/components/brand/Glyphs";
import { AREAS, FACTS, PHONES } from "@/lib/site";

function PhoneGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-forest-600">
      <path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative flex overflow-hidden bg-linear-to-b from-cream to-surface md:min-h-[calc(100svh-4rem)] md:items-center">
      {/* Static decorative glow (off-frame lantern light) — NOT animated (LCP, §10.4). */}
      <GlowOrb
        className="pointer-events-none absolute -right-24 -top-20 hidden h-112 w-112 md:block"
      />
      <Container className="relative grid items-center gap-10 pb-16 pt-10 md:grid-cols-2 md:gap-12 md:pb-24 md:pt-16">
        {/* Copy column */}
        <div>
          <p className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-[0.06em] text-glow-700">
            <SparkStar size={16} />
            Live children&rsquo;s theater · {AREAS.base}
          </p>
          <h1 className="mt-3 font-display text-4xl text-forest-800 sm:text-5xl lg:text-6xl">
            Live theater that comes to you.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Professional live children&rsquo;s theater for {AREAS.base} — preschools, schools
            &amp; families. {FACTS.experience} of kind, timeless fairy tales, brought to life and
            brought to you.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/booking" size="lg">
              Book a show
            </Button>
            <Button href="/shows" size="lg" variant="secondary">
              See our shows
            </Button>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <PhoneGlyph />
              Prefer to call?
            </span>
            {PHONES.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className="font-semibold text-forest-700 underline-offset-4 hover:underline"
              >
                {p.display}
              </a>
            ))}
          </p>
        </div>

        {/* Hero photo — the owner's signature image, from the theatre's own previous
            site (magic-castle-puppet-theater.com = our legacy domain, NOT a
            competitor). Owner-confirmed as our headline photo. Reserved 4:3 box = no
            layout shift; priority + sizes for LCP. */}
        <div className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border-soft shadow-md">
            <Image
              src="/images/hero-girl-curtain-gold.jpg"
              alt="A young girl in a tiara peeks out from behind a red stage curtain."
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[64%_center]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
