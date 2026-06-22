// Gallery media-data scaffold — the single source for /gallery (SITE_STRUCTURE §4.5).
// Mirrors lib/shows.ts: real assets drop into the optional `src` (and `poster` for
// video) without touching the page or the GalleryGrid block. Until then every item
// renders the design-system "Photo/Asset — pending" placeholder treatment (§9/§15;
// Phase 4 [ASSET]). NO scraping of the old site — placeholders only (CSP img-src
// 'self'; IP/hygiene). Categories come from the canon: Shows / Troupe / Children /
// Backstage. Captions are written as generic, non-final alt text (no real people
// named, nothing presented as a finished asset).

/** The four gallery categories (SITE_STRUCTURE §4.5). */
export type GalleryCategory = "Shows" | "Troupe" | "Children" | "Backstage";

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Shows",
  "Troupe",
  "Children",
  "Backstage",
];

export interface GalleryItem {
  /** Stable key. */
  id: string;
  category: GalleryCategory;
  /** Photo tile, or an embedded video (muted + captioned — §4.5). */
  kind: "photo" | "video";
  /**
   * Generic caption / alt text (scene + emotion, §9). TEMPORARY, non-final — no real
   * person is named and nothing is presented as a final asset.
   */
  caption: string;
  /** Tile aspect ratio (drives the masonry rhythm). */
  aspect: "1/1" | "3/4" | "4/3" | "4/5" | "16/9";
  /** Real photo/video-poster path under /public — none yet (placeholder until Phase 4). */
  src?: string;
  /** Poster frame for a video — none yet (placeholder until Phase 4). */
  poster?: string;
  /** Captions/subtitles track for a video (WebVTT) — wired for Phase 4. */
  captionsSrc?: string;
}

// Placeholder set — varied aspects per category so the masonry reads as a real grid
// the moment assets land (no CLS: each tile reserves its ratio now). All `src` pending.
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "show-1", category: "Shows", kind: "photo", aspect: "4/3", caption: "A costumed fairy-tale scene mid-performance." },
  { id: "show-2", category: "Shows", kind: "video", aspect: "16/9", caption: "A short clip from a live show — muted, with captions." },
  { id: "show-3", category: "Shows", kind: "photo", aspect: "3/4", caption: "A character on stage in full costume." },
  { id: "show-4", category: "Shows", kind: "photo", aspect: "4/5", caption: "A magical moment from one of the tales." },

  { id: "troupe-1", category: "Troupe", kind: "photo", aspect: "4/5", caption: "A member of the troupe in costume." },
  { id: "troupe-2", category: "Troupe", kind: "photo", aspect: "1/1", caption: "The troupe together before a show." },
  { id: "troupe-3", category: "Troupe", kind: "photo", aspect: "4/3", caption: "An actor sharing a moment with the audience." },

  { id: "children-1", category: "Children", kind: "photo", aspect: "4/3", caption: "Children laughing during the interactive play." },
  { id: "children-2", category: "Children", kind: "photo", aspect: "3/4", caption: "A child reaching for the bubbles." },
  { id: "children-3", category: "Children", kind: "video", aspect: "16/9", caption: "Kids joining in the show — muted, with captions." },
  { id: "children-4", category: "Children", kind: "photo", aspect: "1/1", caption: "Delighted faces in the front row." },

  { id: "backstage-1", category: "Backstage", kind: "photo", aspect: "4/3", caption: "Costumes and props ready before the curtain." },
  { id: "backstage-2", category: "Backstage", kind: "photo", aspect: "3/4", caption: "Setting up the stage at a venue." },
  { id: "backstage-3", category: "Backstage", kind: "photo", aspect: "1/1", caption: "A quiet moment getting into character." },
];

/** Items for a given category (the page groups the masonry by category). */
export function galleryByCategory(category: GalleryCategory): GalleryItem[] {
  return GALLERY_ITEMS.filter((i) => i.category === category);
}
