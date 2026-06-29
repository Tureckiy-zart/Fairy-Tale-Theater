// Gallery media-data — the single source for /gallery (SITE_STRUCTURE §4.5). Mirrors
// lib/shows.ts: the page + GalleryGrid render straight from this list, so swapping or
// adding assets never touches a component. Photos are the operator-supplied, web-
// optimized shots under public/images/gallery/<category>/, sorted by content.
//
// CURATION (brand): the full sorted set lives on disk; this DISPLAY list is the
// curated subset — live costumed performers, the troupe, and the children. Near-
// duplicates and blurry shots are filed under public/images/gallery/ but not listed.
// 2026-06-29: the owner confirmed the real repertoire is MIXED — live costumed shows
// AND puppet-stage shows (the puppet side is a large part of the act), and reconciled
// positioning toward showing it. The four "Magic Castle" frames below (show-9..12)
// therefore include the puppet-booth scenes that earlier curation excluded under the
// older "live costumed theater, NOT puppet" read of BRAND.md / 01_CONTENT ("уйти от
// puppet"). 🔴 Brand canon (BRAND.md / 02_POSITIONING / 01_CONTENT) is under review to
// match the real mixed repertoire — see docs/PROJECT_PROGRESS.md.
// The 4 video clips (public/images/gallery/clips/) are filed but not displayed —
// content unverified (can't grade here); wire them in once reviewed.
// Captions are generic alt text (scene + emotion, §9) — no real person is named.

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
  /** Generic caption / alt text (scene + emotion, §9) — no real person named. */
  caption: string;
  /** Tile aspect ratio (drives the masonry rhythm), derived from the photo orientation. */
  aspect: "1/1" | "3/4" | "4/3" | "4/5" | "16/9";
  /** Asset path under /public (the photo, or a video poster frame). */
  src?: string;
  /** Video source (muted + captioned via captionsSrc) — none displayed yet. */
  poster?: string;
  /** Captions/subtitles track for a video (WebVTT). */
  captionsSrc?: string;
}

const DIR = "/images/gallery";

// Display set (on-brand, deduped). Aspect: portrait → 3/4, landscape → 4/3, square → 1/1.
export const GALLERY_ITEMS: GalleryItem[] = [
  // --- Shows: live costumed performers on stage ---
  { id: "show-1", category: "Shows", kind: "photo", aspect: "4/3", src: `${DIR}/shows/performer-with-kids-castle-stage.jpg`, caption: "A costumed performer entertains a seated group of preschoolers in front of a colourful castle stage set." },
  { id: "show-2", category: "Shows", kind: "photo", aspect: "4/3", src: `${DIR}/shows/performer-arms-raised-on-stage.jpg`, caption: "A performer throws her arms wide with joy on stage as children watch." },
  { id: "show-3", category: "Shows", kind: "photo", aspect: "3/4", src: `${DIR}/shows/fish-character-with-children.jpg`, caption: "A performer in a bright fish costume leans toward excited children during the show." },
  { id: "show-4", category: "Shows", kind: "photo", aspect: "4/3", src: `${DIR}/shows/performer-on-stage-large-audience.jpg`, caption: "A costumed performer presents on a small stage to a large seated audience of children." },
  { id: "show-5", category: "Shows", kind: "photo", aspect: "3/4", src: `${DIR}/shows/bunny-and-fox-with-bubbles.jpg`, caption: "Bunny and fox characters delight children amid a flurry of bubbles." },
  { id: "show-6", category: "Shows", kind: "photo", aspect: "3/4", src: `${DIR}/shows/bunny-and-fox-chase-scene.jpg`, caption: "A bunny and a fox character act out a playful chase scene on stage." },
  { id: "show-7", category: "Shows", kind: "photo", aspect: "3/4", src: `${DIR}/shows/fox-and-rabbit-stage-scene.jpg`, caption: "Two costumed performers act out a tender scene on a decorated stage." },
  { id: "show-8", category: "Shows", kind: "photo", aspect: "3/4", src: `${DIR}/shows/rabbit-sweeping-stage-scene.jpg`, caption: "A rabbit-costumed actor sweeps the stage while a fox character looks on." },

  // --- "Magic Castle" set (live costumed + puppet-stage, mixed repertoire) ---
  { id: "show-9", category: "Shows", kind: "photo", aspect: "3/4", src: `${DIR}/shows/wolf-performer-storybook-stage.jpg`, caption: "A performer in a full grey wolf costume acts out a scene on the grass before a decorated outdoor storybook stage." },
  { id: "show-10", category: "Shows", kind: "photo", aspect: "4/3", src: `${DIR}/shows/storybook-cabin-puppet-stage.jpg`, caption: "A whimsical outdoor stage with teal velvet drapes and sunflowers as the fox and wolf characters meet at a painted storybook cottage." },
  { id: "show-11", category: "Shows", kind: "photo", aspect: "4/3", src: `${DIR}/shows/fox-and-wolf-puppets-at-cabin-window.jpg`, caption: "Fox and wolf characters pop up at the window of a hand-painted log-cabin set strung with sunflowers." },
  { id: "show-12", category: "Shows", kind: "photo", aspect: "3/4", src: `${DIR}/shows/frog-puppet-at-cabin-window.jpg`, caption: "A cheerful green frog character leans from the flower-framed window of a painted storybook cottage." },

  // --- Troupe: the performers ---
  { id: "troupe-1", category: "Troupe", kind: "photo", aspect: "3/4", src: `${DIR}/troupe/bee-character-posing.jpg`, caption: "A performer in a black-and-yellow bee costume poses playfully before a flower-decked backdrop." },
  { id: "troupe-2", category: "Troupe", kind: "photo", aspect: "3/4", src: `${DIR}/troupe/red-cape-character-with-basket.jpg`, caption: "An actress in a red hooded cape holds a flower-trimmed basket outdoors." },
  { id: "troupe-3", category: "Troupe", kind: "photo", aspect: "4/3", src: `${DIR}/troupe/santa-and-host-portrait.jpg`, caption: "A performer dressed as Santa stands beside a smiling host among the pines." },
  { id: "troupe-4", category: "Troupe", kind: "photo", aspect: "3/4", src: `${DIR}/troupe/host-portrait-floral.jpg`, caption: "A warm close-up portrait of a smiling performer with a floral wrap." },
  { id: "troupe-5", category: "Troupe", kind: "photo", aspect: "3/4", src: `${DIR}/troupe/wolf-costume-character-posing.jpg`, caption: "A performer in a furry wolf costume strikes a playful pose." },
  { id: "troupe-6", category: "Troupe", kind: "photo", aspect: "3/4", src: `${DIR}/troupe/fox-and-rabbit-characters-posing.jpg`, caption: "Two performers in fox and rabbit costumes pose together before a spring backdrop." },
  { id: "troupe-7", category: "Troupe", kind: "photo", aspect: "3/4", src: `${DIR}/troupe/fox-character-in-window.jpg`, caption: "A smiling performer in a bright fox costume poses in a decorative window frame." },
  { id: "troupe-8", category: "Troupe", kind: "photo", aspect: "3/4", src: `${DIR}/troupe/santa-and-elf-characters.jpg`, caption: "A Santa performer and an elf-costumed entertainer pose together." },

  // --- Children: the audience ---
  { id: "children-1", category: "Children", kind: "photo", aspect: "3/4", src: `${DIR}/children/host-greeting-little-girl.jpg`, caption: "A costumed performer kneels to greet a delighted little girl at an outdoor event." },
  { id: "children-2", category: "Children", kind: "photo", aspect: "4/3", src: `${DIR}/children/kids-cheering-with-bubbles.jpg`, caption: "Children raise their hands cheering amid floating bubbles during the show." },
  { id: "children-3", category: "Children", kind: "photo", aspect: "4/3", src: `${DIR}/children/happy-kids-in-bubbles.jpg`, caption: "A group of laughing children cheers and reaches up amid bubbles." },
  { id: "children-4", category: "Children", kind: "photo", aspect: "3/4", src: `${DIR}/children/host-dancing-with-girl.jpg`, caption: "A performer spins and dances with a giggling girl at an indoor party." },
  { id: "children-5", category: "Children", kind: "photo", aspect: "3/4", src: `${DIR}/children/children-dancing-in-bubbles.jpg`, caption: "Excited children dance and play in a cloud of bubbles." },
  { id: "children-6", category: "Children", kind: "photo", aspect: "3/4", src: `${DIR}/children/kids-with-santa-and-elf.jpg`, caption: "Two children pose happily with a Santa performer and an elf entertainer." },
  { id: "children-7", category: "Children", kind: "photo", aspect: "3/4", src: `${DIR}/children/child-on-santas-lap.jpg`, caption: "A young child sits on Santa's lap in front of a decorated tree." },
  { id: "children-8", category: "Children", kind: "photo", aspect: "3/4", src: `${DIR}/children/child-hugging-bunny-character.jpg`, caption: "A smiling child is held by a friendly bunny-costumed performer in a garden." },
  { id: "children-9", category: "Children", kind: "photo", aspect: "3/4", src: `${DIR}/children/boys-laughing-in-audience.jpg`, caption: "Two young boys laugh and watch from their seats in the audience." },
  { id: "children-10", category: "Children", kind: "photo", aspect: "4/3", src: `${DIR}/children/host-with-seated-children.jpg`, caption: "A costumed performer engages a room of seated children watching attentively." },
];

/** Items for a given category (the page groups the masonry by category). */
export function galleryByCategory(category: GalleryCategory): GalleryItem[] {
  return GALLERY_ITEMS.filter((i) => i.category === category);
}
