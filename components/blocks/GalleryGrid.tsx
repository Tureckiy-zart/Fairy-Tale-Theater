// GalleryGrid — the /gallery grid (SITE_STRUCTURE §4.5 + §3 GalleryGrid). A warm,
// masonry-style grid (CSS columns → no JS, no layout-jank), grouped by the canon
// categories (Shows / Troupe / Children / Backstage), with embedded-video support
// (muted + captioned). Built from primitives + the brand light glyph; data comes from
// lib/gallery.ts so swapping/adding assets never touches this block. An item with no
// `src` falls back to the marked placeholder treatment (§9/§15). A category with no
// items is skipped. Server component that renders the <Reveal> island (§10).
import Image from "next/image";
import { Section, SectionHeader, Tag } from "@/components/ui";
import { cx } from "@/components/ui/cx";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";
import {
  GALLERY_CATEGORIES,
  galleryByCategory,
  type GalleryItem,
} from "@/lib/gallery";

// aspect-ratio utility per item (kept as a map so Tailwind sees the literals).
const ASPECT: Record<GalleryItem["aspect"], string> = {
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "16/9": "aspect-video",
};

/** Server-safe play triangle for video tiles (no client icon lib needed here). */
function PlayMark() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="var(--color-forest-600)" />
      <path d="M10 8.5 16 12 10 15.5Z" fill="white" />
    </svg>
  );
}

function GalleryTile({ item }: { item: GalleryItem }) {
  const isVideo = item.kind === "video";
  // When a real asset lands: photo → <Image>; video → poster <Image> + muted/captioned
  // <video>. Until then, the marked placeholder treatment (reserved aspect = no CLS).
  return (
    <figure
      className={cx(
        "relative overflow-hidden rounded-lg border border-border-soft bg-surface",
        ASPECT[item.aspect],
      )}
    >
      {item.src ? (
        isVideo ? (
          <video
            className="h-full w-full object-cover"
            poster={item.poster}
            muted
            playsInline
            controls
            preload="none"
          >
            <source src={item.src} />
            {item.captionsSrc ? (
              <track kind="captions" src={item.captionsSrc} srcLang="en" label="English" default />
            ) : null}
          </video>
        ) : (
          <Image
            src={item.src}
            alt={item.caption}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            className="object-cover"
          />
        )
      ) : (
        // Placeholder treatment — clearly marked, generic, not final (§15).
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-ink-muted">
          {isVideo ? <PlayMark /> : <SparkStar size={22} />}
          <span className="text-xs font-semibold uppercase tracking-[0.06em]">
            {isVideo ? "Video — pending" : "Photo — pending"}
          </span>
        </div>
      )}

      {isVideo ? (
        <figcaption className="absolute left-2 top-2">
          <Tag tone="solid" accent="forest">
            Video · muted + captions
          </Tag>
        </figcaption>
      ) : null}
    </figure>
  );
}

export function GalleryGrid() {
  return (
    <Section>
      {GALLERY_CATEGORIES.map((category) => {
        const items = galleryByCategory(category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="mb-12 last:mb-0">
            <SectionHeader
              as="h2"
              marker={<SparkStar size={16} />}
              title={category}
            />
            {/* Masonry via CSS columns: balanced, no JS, break-inside-avoid per tile. */}
            <div className="mt-8 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
              {items.map((item, i) => (
                <Reveal key={item.id} delayMs={i * 60} className="mb-4 break-inside-avoid">
                  <GalleryTile item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}
    </Section>
  );
}
