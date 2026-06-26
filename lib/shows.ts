// The 8-show repertoire — the single data source for the /shows hub, every
// /shows/{slug} detail page, and the Home "Featured shows" grid. Facts (the eight
// titles, universal framing, per-show themes/ages, 35–50 min, ages 2–10) come from
// docs/core/01_CONTENT_INVENTORY.md; the two renamed titles + their slugs are the
// owner-approved decisions in this task (Morozko → The Winter's Gift / Father Frost,
// slug `the-winters-gift`; "Well, Red Bow, wait" → Little Red Riding Hood, slug
// `little-red-riding-hood`). Universal presentation only — NO Slavic/Russian/Ukrainian
// coding, NO "puppet" framing; tales are not attributed to any country.
//
// COPY STATUS — FINAL: the synopses/teasers below are the owner-approved final copy
// (BUILD_MISS_LANA_COPY_FIXES_001). Titles and slugs are canonical and must not change.
// Photos are PENDING (Card/hero render the marked "Photo — pending" placeholder; assets
// land in Phase 4) — the optional `image` field is wired so a real asset path drops in
// without touching pages.

export interface Show {
  /** Clean English slug — the indexable URL (/shows/{slug}). Canonical; do not change. */
  slug: string;
  /** Display title (Fraunces). Canonical. */
  title: string;
  /** Optional secondary line shown under the title (e.g. "Father Frost"). */
  altTitle?: string;
  /** One-line teaser for cards/hero. Final copy. */
  teaser: string;
  /** Full synopsis for the detail page. Final copy. */
  synopsis: string;
  /** Theme / value carried by the tale (01_CONTENT_INVENTORY). */
  theme: string;
  /** Age range — per-show (most 2–10; The Magic Castle is 2–8). */
  ages: string;
  /** Total runtime: a ~30-min costumed play + interactive play. */
  length: string;
  /** Show in the Home "Featured shows" grid. */
  featured?: boolean;
  /** Temporary photo path under /public — none yet (placeholder treatment, Phase 4 [ASSET]). */
  image?: string;
  /** object-position for the card crop (e.g. "top" so a portrait's face isn't cut). */
  imagePosition?: "top" | "center" | "bottom";
}

const LENGTH = "35–50 min";

export const SHOWS: Show[] = [
  {
    slug: "donkeys-birthday",
    title: "Donkey's Birthday",
    teaser: "A warm, funny tale about friendship and the small ways we show people we care.",
    synopsis:
      "It's Donkey's birthday, and all he really wants is for his friends to remember. A warm, funny tale about friendship and the small ways we show people we care.",
    theme: "Friendship and mutual respect",
    ages: "Ages 2–10",
    length: LENGTH,
    image: "/images/gallery/shows/performer-on-stage-large-audience.jpg",
  },
  {
    slug: "little-red-riding-hood",
    title: "Little Red Riding Hood",
    teaser: "A classic tale of courage, care, and looking out for the people we love.",
    synopsis:
      "A brave little girl sets off through the woods to visit her grandmother — and meets a sly wolf along the way. A classic tale of courage, care, and looking out for the people we love.",
    theme: "Courage, care and being safe",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    image: "/images/gallery/troupe/red-cape-character-with-basket-2.jpg",
    imagePosition: "top",
  },
  {
    slug: "the-bunnys-little-house",
    title: "The Bunny's Little House",
    teaser: "A heart-warming story where kindness and teamwork win the day.",
    synopsis:
      "When a clever fox slips into Bunny's little house and won't leave, Bunny doesn't give up — and neither do his friends. A heart-warming story where kindness and teamwork win the day.",
    theme: "Friendship and helping each other",
    ages: "Ages 2–10",
    length: LENGTH,
    image: "/images/gallery/shows/bunny-and-fox-with-bubbles.jpg",
  },
  {
    slug: "cinderella",
    title: "Cinderella",
    altTitle: "The Magic Slipper",
    teaser: "The beloved fairy tale about kindness, hope, and good hearts rewarded.",
    synopsis:
      "Kind-hearted Cinderella dreams of the ball, and a little magic helps her get there. The beloved fairy tale about kindness, hope, and good hearts rewarded.",
    theme: "Kindness is rewarded",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    // image pending — owner to supply a Cinderella-specific photo.
  },
  {
    slug: "the-magic-castle",
    title: "The Magic Castle",
    teaser: "Our signature show — full of wonder, and a reminder that helping a friend is the greatest magic of all.",
    synopsis:
      "Behind the gates of a magic castle, a big adventure and true friendship await. Our signature show — full of wonder, and a reminder that helping a friend is the greatest magic of all.",
    theme: "Friendship, helping and a little magic",
    ages: "Ages 2–8",
    length: LENGTH,
    image: "/images/gallery/shows/performer-with-kids-castle-stage.jpg",
  },
  {
    slug: "the-winters-gift",
    title: "The Winter's Gift",
    altTitle: "Father Frost",
    teaser: "A classic winter tale where kindness is rewarded.",
    synopsis:
      "On a snowy night, a kind and hard-working girl meets the gentle spirit of winter and learns that real warmth comes from a good heart. A classic winter tale where kindness is rewarded.",
    theme: "Kindness and hard work win out",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    image: "/images/gallery/children/kids-with-santa-by-tree.jpg",
  },
  {
    slug: "the-gingerbread-man",
    title: "The Gingerbread Man",
    teaser: "A lively favourite about cleverness, caution, and listening to those who care about us.",
    synopsis:
      "Freshly baked and full of mischief, the Gingerbread Man runs as fast as he can — \"Catch me if you can!\" A lively favourite about cleverness, caution, and listening to those who care about us.",
    theme: "Listening and looking before you leap",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    // image pending — owner to supply a Gingerbread Man-specific photo.
  },
  {
    slug: "suzy-bee",
    title: "Suzy Bee",
    teaser: "A sweet, gentle story about kindness and how even the smallest of us can make the whole garden better.",
    synopsis:
      "Little Suzy Bee buzzes through the meadow, helping every friend she meets. A sweet, gentle story about kindness and how even the smallest of us can make the whole garden better.",
    theme: "Kindness and helping friends",
    ages: "Ages 2–10",
    length: LENGTH,
    image: "/images/gallery/troupe/bee-character-posing.jpg",
  },
];

/** Featured subset for the Home grid (real titles — placeholders retired). */
export const FEATURED_SHOWS: Show[] = SHOWS.filter((s) => s.featured);

/** Look up a show by its slug (detail route). */
export function getShow(slug: string): Show | undefined {
  return SHOWS.find((s) => s.slug === slug);
}

/** A few other shows to cross-link from a detail page ("related shows"). */
export function relatedShows(slug: string, count = 3): Show[] {
  return SHOWS.filter((s) => s.slug !== slug).slice(0, count);
}
