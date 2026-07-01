// The 8-show repertoire — the single data source for the /shows hub, every
// /shows/{slug} detail page, and the Home "Featured shows" grid. The eight active
// titles, universal framing, per-show themes and owner-confirmed age ranges come from
// docs/core/01_CONTENT_INVENTORY.md, reconciled to the owner's direct repertoire answers
// (MISS_LANA_REPERTOIRE_OWNER_CANON_RECONCILE_001): Three Little Pigs was added, the
// erroneous "The Winter's Gift / Father Frost" entity was replaced by its real title
// Two Sisters (slug `two-sisters`), and the provisional "The Bunny's Little House" is now
// the owner-confirmed The Rabbit House (slug `the-rabbit-house`). Old slugs 301-redirect
// via next.config. Donkey's Birthday is intentionally NOT in the repertoire. Universal
// presentation only — NO Slavic/Russian/Ukrainian coding; tales are not attributed to any country.
//
// COPY STATUS: synopses/teasers for the legacy shows were adapted from the owner-authored
// legacy source into warm modern English (ADAPT_MISS_LANA_LEGACY_SHOW_CONTENT_001). Three
// Little Pigs and Two Sisters have NO legacy source text, so their copy is a MINIMAL,
// honest retelling from the confirmed title (and, for Two Sisters, the verified theme)
// alone — no invented characters, staging, or format. Plot/format items still owner-gated
// are tracked in docs/content/SHOW_COPY_OWNER_REVIEW.md. The bee show is published as
// "Suzy Bee"; the owner's source transcript calls it "Maya the Bee" — a public-rename
// decision is deliberately deferred (do NOT create a second card/route). When a show has
// no `image`, Card/hero render a neutral on-brand fill (decorative spark, no copy) — no
// "pending"/"coming soon" wording is shown anywhere public. The optional `image` field is
// wired so a real asset path drops in without touching pages.

export interface Show {
  /** Clean English slug — the indexable URL (/shows/{slug}). Canonical; do not change. */
  slug: string;
  /** Display title (Fraunces). Canonical. */
  title: string;
  /** Optional secondary line shown under the title (e.g. "The Magic Slipper"). */
  altTitle?: string;
  /** One-line teaser for cards/hero. Final copy. */
  teaser: string;
  /** Full synopsis for the detail page. Final copy. */
  synopsis: string;
  /** Theme / value carried by the tale (01_CONTENT_INVENTORY). */
  theme: string;
  /** Age range — per-show, owner-confirmed (spans "Ages 1–6" … "Ages 2–13"). */
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

// Owner-priority order (Three Little Pigs · The Rabbit House · Little Red Riding Hood ·
// Two Sisters lead as Featured), then the rest of the repertoire.
export const SHOWS: Show[] = [
  {
    slug: "three-little-pigs",
    title: "Three Little Pigs",
    teaser:
      "Three little pigs set out to build homes of their own — and learn that patient, careful work is what keeps everyone safe.",
    synopsis:
      "Three little pigs head out into the world to build homes of their own. Two are in a hurry and finish as fast as they can, while the third takes the time to build something sturdy and strong. When a huff and a puff put their little houses to the test, it is patience and careful work that hold firm — and the pigs discover how much safer everything feels when they look out for one another. A lively, familiar tale full of laughter and gentle suspense, with a warm, reassuring ending.",
    theme: "Hard work, planning ahead and helping one another",
    ages: "Ages 2–8",
    length: LENGTH,
    featured: true,
    // image pending — no verified Three Little Pigs photo; neutral on-brand fill for now.
  },
  {
    slug: "the-rabbit-house",
    title: "The Rabbit House",
    teaser:
      "When Rabbit loses a beloved home, loyal friends prove that no one has to face trouble alone.",
    synopsis:
      "Rabbit's little house should be a safe and cheerful place. When that comfort is suddenly taken away, Rabbit must find the courage to ask for help — and discover which friends will truly stand nearby. One by one, different characters try to lend a hand: some arrive with big promises, while others bring patience, bravery, and the right idea. The story grows into a gentle adventure about loyalty and the quiet strength friends find when they work together.",
    theme: "Friendship, mutual help and standing by a friend",
    ages: "Ages 2–8",
    length: LENGTH,
    featured: true,
    image: "/images/gallery/shows/bunny-and-fox-with-bubbles.jpg",
  },
  {
    slug: "little-red-riding-hood",
    title: "Little Red Riding Hood",
    teaser:
      "A lively forest adventure where courage and a helpful friend outsmart a very confident Wolf.",
    synopsis:
      "Little Red Riding Hood sets off with a trusting heart, while the Wolf is already planning a clever shortcut. But someone in the forest has noticed his tricks. When the Wolf turns his attention to the girl and her grandmother, a quick-thinking Hare understands the danger, and what follows is a playful chase full of warning, bravery, and help that arrives at just the right moment.",
    theme: "Courage, caring for others and listening to warnings",
    ages: "Ages 3–13",
    length: LENGTH,
    featured: true,
    image: "/images/gallery/troupe/red-cape-character-with-basket-2.jpg",
    imagePosition: "52% 42%",
  },
  {
    slug: "two-sisters",
    title: "Two Sisters",
    teaser:
      "Two sisters, two very different hearts — a gentle tale where kindness and honest work quietly outshine envy.",
    synopsis:
      "Two sisters share a home but not a temper. One is patient, kind, and quick to help; the other expects the world to serve her and grumbles when it does not. When each must make her own way, their choices are quietly noticed — and it is care, honest work, and a generous heart, rather than demands and complaints, that are gently rewarded. Along the way the kind sister finds friends where her sister found none, and the story reminds children that the way we treat others has a way of finding its way back to us.",
    theme: "Kindness, hard work and patience over envy",
    ages: "Ages 2–13",
    length: LENGTH,
    featured: true,
    // image pending — the retired "Winter's Gift" photo was winter/Santa-specific and no
    // longer fits the season-neutral "Two Sisters" title; neutral on-brand fill for now.
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
    ages: "Ages 3–10",
    length: LENGTH,
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
    ages: "Ages 1–6",
    length: LENGTH,
    image: "/images/gallery/shows/performer-with-kids-castle-stage.jpg",
  },
  {
    slug: "the-gingerbread-man",
    title: "The Gingerbread Man",
    teaser:
      "A quick little hero races through the world, certain that cleverness can solve everything.",
    synopsis:
      "The Gingerbread Man has only just come to life — and he is already on the run. Fast, cheerful, and very sure of himself, he is certain that no one can catch him. As he meets one character after another, he keeps trusting his speed and waving away good advice. His lively journey brings plenty of laughter and a little suspense, while gently showing that confidence is most useful when it travels together with care, listening, and good judgment.",
    theme: "Listening, caution and thoughtful choices",
    ages: "Ages 2–8",
    length: LENGTH,
    // image pending — owner to supply a Gingerbread Man-specific photo.
  },
  {
    // Published as "Suzy Bee"; owner source transcript calls this same show "Maya the Bee"
    // — public-rename decision deferred (do NOT add a second card/route for Maya the Bee).
    slug: "suzy-bee",
    title: "Suzy Bee",
    teaser:
      "A bright little bee works with care and discovers how much one helpful friend can change.",
    synopsis:
      "Suzy Bee is small, busy, and always ready to notice when someone needs help. Her day begins with work, but it soon becomes a story about sharing what she has with the friends around her. As she gathers food and meets one friend after another, Suzy learns that hard work feels even more meaningful when it brings comfort to others — and her kindness travels from character to character, turning an ordinary day into a gentle celebration of care and community.",
    theme: "Kindness, sharing and caring for a community",
    ages: "Ages 2–8",
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
