// GalleryTeaser — Home block #9 (SITE_STRUCTURE §4.1): a strip of real-show photos
// → /gallery. Assets are gated (§9/§15), so the tiles are clearly-marked placeholders
// (reserved squares so there is no CLS when photos land). Server component (no
// Phosphor) — it renders the client <Reveal> for the one-shot fade-in (§10).
import { Button, Section, SectionHeader, Tag } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";

const TILES = ["a", "b", "c", "d", "e", "f"];

export function GalleryTeaser() {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Real moments"
          marker={<SparkStar size={16} />}
          title="From our shows"
          subtitle="Warm photos and video from real performances. Placeholder tiles — assets pending."
        />
        <Tag>Photos pending</Tag>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {TILES.map((t, i) => (
          <Reveal key={t} delayMs={i * 60}>
            <div className="flex aspect-square items-center justify-center rounded-lg border border-border-soft bg-surface text-ink-muted">
              <div className="flex flex-col items-center gap-1.5">
                <SparkStar size={20} />
                <span className="text-xs font-semibold uppercase tracking-[0.06em]">Photo — pending</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8">
        <Button href="/gallery" variant="secondary">
          See the gallery
        </Button>
      </div>
    </Section>
  );
}
