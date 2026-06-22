// Hero — Home block #1 (SITE_STRUCTURE §4.1). The LCP: H1 + sub render immediately
// with NO animation (§10.4). Server component (no Phosphor / no client JS) so the
// hero is as fast as possible. The signature glow is a static CSS gradient and the
// "photo" is a clearly-marked placeholder panel (no asset yet — §9/§15). H1 copy is
// the canon tagline (02_POSITIONING §7); facts (30+ years, areas) come from lib/site.
import { Button, Container, Tag } from "@/components/ui";
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
    <section className="relative overflow-hidden bg-linear-to-b from-cream to-surface">
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
            {/* PLACEHOLDER lead — facts are real; phrasing is swappable copy. */}
            Professional children&rsquo;s theater for {AREAS.base} preschools, schools &amp;
            parties — {FACTS.experience} of kind, timeless fairy tales, brought to life by a
            live costumed troupe.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/booking" size="lg">
              Book Miss Lana
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

        {/* Placeholder media — real hero photo/video is pending (§9/§15). Reserved 4:3
            box so there is no layout shift when the asset lands. */}
        <div className="relative">
          <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-border-soft bg-linear-to-br from-forest-100 via-glow-50 to-surface shadow-md">
            <GlowOrb className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2" />
            <div className="relative flex flex-col items-center gap-3 text-center">
              <SparkStar size={40} />
              <p className="font-display text-2xl text-forest-700">Real show photo / video</p>
              <Tag>Asset pending</Tag>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
