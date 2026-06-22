// The 8-show repertoire — the single data source for the /shows hub, every
// /shows/{slug} detail page, and the Home "Featured shows" grid. Facts (the eight
// titles, universal framing, per-show themes/ages, 35–50 min, ages 2–10) come from
// docs/core/01_CONTENT_INVENTORY.md; the two renamed titles + their slugs are the
// owner-approved decisions in this task (Morozko → The Winter's Gift / Father Frost,
// slug `the-winters-gift`; "Well, Red Bow, wait" → Little Red Riding Hood, slug
// `little-red-riding-hood`). Universal presentation only — NO Slavic/Russian/Ukrainian
// coding, NO "puppet" framing; tales are not attributed to any country.
//
// COPY STATUS — TEMPORARY: the synopses/teasers below are placeholder English copy
// written for layout (the referenced phase-2 content file was not present in the repo).
// They are refinable, NOT owner-blocked; final copy review is a later phase. Titles and
// slugs are canonical and must not change. Photos are PENDING (Card/hero render the
// marked "Photo — pending" placeholder; assets land in Phase 4) — the optional `image`
// field is wired so a real asset path drops in without touching pages.

export interface Show {
  /** Clean English slug — the indexable URL (/shows/{slug}). Canonical; do not change. */
  slug: string;
  /** Display title (Fraunces). Canonical. */
  title: string;
  /** Optional secondary line shown under the title (e.g. "Father Frost"). */
  altTitle?: string;
  /** One-line teaser for cards/hero. TEMPORARY copy. */
  teaser: string;
  /** Full synopsis for the detail page. TEMPORARY copy. */
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
}

const LENGTH = "35–50 min";

export const SHOWS: Show[] = [
  {
    slug: "donkeys-birthday",
    title: "Donkey's Birthday",
    teaser: "A warm story about friendship — and the gift of simply showing up.",
    synopsis:
      "It's Donkey's birthday, and his friends each set out to bring the perfect present. Along the way they discover that the kindest gift of all is being there for one another. A gentle, funny tale that ends with the whole audience joining the celebration.",
    theme: "Friendship and mutual respect",
    ages: "Ages 2–10",
    length: LENGTH,
  },
  {
    slug: "little-red-riding-hood",
    title: "Little Red Riding Hood",
    teaser: "The timeless tale of a brave girl, a clever plan and a happy ending.",
    synopsis:
      "Little Red Riding Hood sets off through the woods to visit her grandmother, and learns to keep her wits about her along the way. A classic European fairy tale told with warmth and plenty of giggles — courage and care win the day, and everyone is safe by the final bow.",
    theme: "Courage, care and being safe",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
  },
  {
    slug: "the-bunnys-little-house",
    title: "The Bunny's Little House",
    teaser: "When Bunny loses her home, her friends show up to help put things right.",
    synopsis:
      "Bunny's cozy little house is taken over, and she doesn't know what to do. One by one her friends arrive to help — and together they find that nothing is too big to fix when friends stand side by side. A reassuring story about kindness and helping each other.",
    theme: "Friendship and helping each other",
    ages: "Ages 2–10",
    length: LENGTH,
  },
  {
    slug: "cinderella",
    title: "Cinderella",
    altTitle: "The Magic Slipper",
    teaser: "A kind heart, a touch of magic and a glass slipper that changes everything.",
    synopsis:
      "Gentle, hard-working Cinderella dreams of one magical night at the ball. With a little help from her fairy godmother, kindness is rewarded and a single glass slipper sets everything right. The beloved classic, told with sparkle and song.",
    theme: "Kindness is rewarded",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
  },
  {
    slug: "the-magic-castle",
    title: "The Magic Castle",
    teaser: "An original adventure where friendship and a little magic save the day.",
    synopsis:
      "Behind the gates of the Magic Castle, an unlikely band of friends sets out on an adventure full of surprises. With teamwork, courage and a sprinkle of magic, they learn that helping one another is the greatest magic of all. A signature Miss Lana story.",
    theme: "Friendship, helping and a little magic",
    ages: "Ages 2–8",
    length: LENGTH,
  },
  {
    slug: "the-winters-gift",
    title: "The Winter's Gift",
    altTitle: "Father Frost",
    teaser: "A kind winter spirit quietly rewards a warm heart and willing hands.",
    synopsis:
      "On the coldest day of the year, a kind and hard-working child meets a gentle winter spirit who sees the goodness others overlook. Warmth, patience and a willing heart are quietly rewarded in this wintry tale of generosity — a close cousin of the Mother Holle stories.",
    theme: "Kindness and hard work win out",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
  },
  {
    slug: "the-gingerbread-man",
    title: "The Gingerbread Man",
    teaser: "A lively chase tale — \"Run, run, as fast as you can!\"",
    synopsis:
      "Fresh from the oven, the Gingerbread Man dashes off on a merry chase that the whole audience can join. Full of rhythm, repetition and laughter, it's a playful story about slowing down, listening and looking before you leap.",
    theme: "Listening and looking before you leap",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
  },
  {
    slug: "suzy-bee",
    title: "Suzy Bee",
    teaser: "A little bee with a big heart learns that helping friends is sweetest of all.",
    synopsis:
      "Suzy Bee buzzes from flower to flower, always ready to lend a hand. When the meadow needs her most, her small kindnesses add up to something wonderful. A bright, gentle story about generosity and helping the friends around you.",
    theme: "Kindness and helping friends",
    ages: "Ages 2–10",
    length: LENGTH,
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
