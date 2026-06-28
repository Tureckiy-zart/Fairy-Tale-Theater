// The 8-show repertoire — the single data source for the /shows hub, every
// /shows/{slug} detail page, and the Home "Featured shows" grid. Facts (the eight
// titles, universal framing, per-show themes/ages, ~60 min total, ages 2–10) come from
// docs/core/01_CONTENT_INVENTORY.md; the two renamed titles + their slugs are the
// owner-approved decisions in this task (Morozko → The Winter's Gift / Father Frost,
// slug `the-winters-gift`; "Well, Red Bow, wait" → Little Red Riding Hood, slug
// `little-red-riding-hood`). Universal presentation only — NO Slavic/Russian/Ukrainian
// coding, NO "puppet" framing; tales are not attributed to any country.
//
// COPY STATUS: synopses/teasers adapted from the owner-authored legacy source into
// warm modern English (ADAPT_MISS_LANA_LEGACY_SHOW_CONTENT_001) — each show has a
// concise card teaser + a richer detail-page synopsis + a values theme. Plot/format
// items still owner-gated are tracked in docs/content/SHOW_COPY_OWNER_REVIEW.md (no
// invented plot, no puppet/cultural-origin claims). Titles and slugs are canonical
// and must NOT change (esp. #2/#5/#6 remain provisional pending owner approval).
// When a show has no `image`, Card/hero render a neutral on-brand fill (decorative
// spark, no copy) — no "pending"/"coming soon" wording is shown anywhere public. The
// optional `image` field is wired so a real asset path drops in without touching pages.

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
  /** Total runtime: about an hour — a ~30-min costumed play + ~30 min interactive play. */
  length: string;
  /** Show in the Home "Featured shows" grid. */
  featured?: boolean;
  /** Temporary photo path under /public — none yet (placeholder treatment, Phase 4 [ASSET]). */
  image?: string;
  /** CSS object-position for the crop (keyword or "x% y%") so faces/bodies aren't cut. */
  imagePosition?: string;
}

const LENGTH = "~60 min";

export const SHOWS: Show[] = [
  {
    slug: "donkeys-birthday",
    title: "Donkey's Birthday",
    teaser:
      "A warm birthday story about friendship, thoughtful surprises, and making someone feel truly loved.",
    synopsis:
      "A birthday is coming, but the happiest surprise is not the cake or the presents — it is discovering how carefully good friends listen, remember, and come together for someone they love. Donkey's friends each arrive with a different idea of what will make the day special, and their plans tumble into playful misunderstandings and small discoveries. By the end, the celebration becomes a gentle reminder that friendship grows through attention, respect, and the simple wish to make another person happy.",
    theme: "Friendship, mutual respect and thoughtful giving",
    ages: "Ages 2–10",
    length: LENGTH,
    image: "/images/gallery/shows/performer-on-stage-large-audience.jpg",
  },
  {
    slug: "little-red-riding-hood",
    title: "Little Red Riding Hood",
    teaser:
      "A lively forest adventure where courage and a helpful friend outsmart a very confident Wolf.",
    synopsis:
      "Little Red Riding Hood sets off with a trusting heart, while the Wolf is already planning a clever shortcut. But someone in the forest has noticed his tricks. When the Wolf turns his attention to the girl and her grandmother, a quick-thinking Hare understands the danger, and what follows is a playful chase full of warning, bravery, and help that arrives at just the right moment.",
    theme: "Courage, caring for others and listening to warnings",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    image: "/images/gallery/troupe/red-cape-character-with-basket-2.jpg",
    imagePosition: "52% 42%",
  },
  {
    slug: "the-bunnys-little-house",
    title: "The Bunny's Little House",
    teaser: "When Bunny loses a beloved home, loyal friends prove that no one has to face trouble alone.",
    synopsis:
      "Bunny's little house should be a safe and cheerful place. When that comfort is suddenly taken away, Bunny must find the courage to ask for help — and discover which friends will truly stand nearby. One by one, different characters try to lend a hand: some arrive with big promises, while others bring patience, bravery, and the right idea. The story grows into a gentle adventure about loyalty and the quiet strength friends find when they work together.",
    theme: "Friendship, mutual help and standing by a friend",
    ages: "Ages 2–10",
    length: LENGTH,
    image: "/images/gallery/shows/bunny-and-fox-with-bubbles.jpg",
  },
  {
    slug: "cinderella",
    title: "Cinderella",
    altTitle: "The Magic Slipper",
    teaser:
      "A gentle Cinderella story in which kindness opens a door that cruelty never could.",
    synopsis:
      "Cinderella's days are filled with work and unkind words, but she has not let bitterness change her heart. Then one unexpected evening brings music, wonder, and a chance to be seen for who she truly is. With a little help from her fairy godmother she reaches the ball and meets the Prince — though the magic cannot last forever. A lost slipper becomes the clue that leads him back to her, and the story reminds children that gentleness and courage hold a strength selfishness can never imitate.",
    theme: "Kindness, hope and inner strength",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    // image pending — owner to supply a Cinderella-specific photo.
  },
  {
    slug: "the-magic-castle",
    title: "The Magic Castle",
    teaser:
      "A fairy-tale adventure where friendship and helping hands open the way to wonder.",
    synopsis:
      "Beyond the ordinary path stands a castle full of questions, surprises, and a little mystery — and reaching it is only the beginning. The characters soon discover that no one can solve every problem alone. Step by step, they listen, share what they know, and help one another move forward, until the castle becomes more than a destination. It turns into a place where friendship reveals its own kind of magic.",
    theme: "Friendship, cooperation and shared discovery",
    ages: "Ages 2–8",
    length: LENGTH,
    image: "/images/gallery/shows/performer-with-kids-castle-stage.jpg",
  },
  {
    slug: "the-winters-gift",
    title: "The Winter's Gift",
    altTitle: "Father Frost",
    teaser: "A snowy fairy tale where kindness and honest work bring warmth even on the coldest day.",
    synopsis:
      "Deep in the winter forest, every choice is noticed. A hard-working girl treats the woods and its creatures with care, and her patience and generosity are quietly rewarded by a gentle spirit of winter — while a selfish stepsister discovers that gifts cannot be demanded and kindness cannot be pretended. A helpful heart finds friends among the animals, and the cold feels a little less cold because of them.",
    theme: "Kindness, hard work and patience over envy",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    image: "/images/gallery/children/kids-with-santa-by-tree.jpg",
  },
  {
    slug: "the-gingerbread-man",
    title: "The Gingerbread Man",
    teaser:
      "A quick little hero races through the world, certain that cleverness can solve everything.",
    synopsis:
      "The Gingerbread Man has only just come to life — and he is already on the run. Fast, cheerful, and very sure of himself, he is certain that no one can catch him. As he meets one character after another, he keeps trusting his speed and waving away good advice. His lively journey brings plenty of laughter and a little suspense, while gently showing that confidence is most useful when it travels together with care, listening, and good judgment.",
    theme: "Listening, caution and thoughtful choices",
    ages: "Ages 2–10",
    length: LENGTH,
    featured: true,
    // image pending — owner to supply a Gingerbread Man-specific photo.
  },
  {
    slug: "suzy-bee",
    title: "Suzy Bee",
    teaser:
      "A bright little bee works with care and discovers how much one helpful friend can change.",
    synopsis:
      "Suzy Bee is small, busy, and always ready to notice when someone needs help. Her day begins with work, but it soon becomes a story about sharing what she has with the friends around her. As she gathers food and meets one friend after another, Suzy learns that hard work feels even more meaningful when it brings comfort to others — and her kindness travels from character to character, turning an ordinary day into a gentle celebration of care and community.",
    theme: "Kindness, sharing and caring for a community",
    ages: "Ages 2–10",
    length: LENGTH,
    image: "/images/gallery/troupe/bee-character-posing.jpg",
    imagePosition: "50% 60%",
  },
];

/** Featured subset for the Home grid (real titles — placeholders retired). */
export const FEATURED_SHOWS: Show[] = SHOWS.filter((s) => s.featured);

/** Look up a show by its slug (detail route). */
export function getShow(slug: string): Show | undefined {
  return SHOWS.find((s) => s.slug === slug);
}

/**
 * A few other shows to cross-link from a detail page. Returns the shows that follow
 * the current one in the repertoire, wrapping around — so each detail page surfaces a
 * different, current-show-excluding set (deterministic, no randomness).
 */
export function relatedShows(slug: string, count = 3): Show[] {
  const idx = SHOWS.findIndex((s) => s.slug === slug);
  if (idx === -1) return SHOWS.slice(0, count);
  const others = [...SHOWS.slice(idx + 1), ...SHOWS.slice(0, idx)];
  return others.slice(0, count);
}
