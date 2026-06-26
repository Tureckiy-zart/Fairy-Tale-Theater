// GalleryTeaser — Home block #9 (SITE_STRUCTURE §4.1): a strip of real-show photos
// → /gallery. Pulls the first six on-brand photos from lib/gallery.ts (the same
// curated source the /gallery grid renders), so swapping/adding assets never touches
// this block. Square tiles keep a steady rhythm; <Image fill> + object-cover gives the
// "gentle crop" with no CLS. Server component — it renders the client <Reveal> for the
// one-shot fade-in (§10).
import Image from "next/image";
import { Button, Section, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import { SparkStar } from "@/components/brand/Glyphs";
import { GALLERY_ITEMS } from "@/lib/gallery";

// First six real photos from the curated gallery set (skip any video).
const TILES = GALLERY_ITEMS.filter((i) => i.kind === "photo" && i.src).slice(0, 6);

export function GalleryTeaser() {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Real moments"
          marker={<SparkStar size={16} />}
          title="From our shows"
          subtitle="Warm photos from our real performances — the shows on stage, the troupe in costume, and the children who watch them."
        />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {TILES.map((item, i) => (
          <Reveal key={item.id} delayMs={i * 60}>
            <figure className="relative aspect-square overflow-hidden rounded-lg border border-border-soft bg-surface">
              <Image
                src={item.src!}
                alt={item.caption}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </figure>
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
