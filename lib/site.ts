// Single source of site-wide FACTS and nav config — imported by both server and
// client components (plain module, no hooks). Facts come from the canon, NOT from
// memory: PROJECT_BRIEF.md (phones, ages, areas, 30+ years, troupe, pricing logic),
// BRAND.md (brand/lines), SITE_STRUCTURE_AND_BLOCKS.md §2 (nav/footer). Marketing
// COPY (service-line blurbs, values) is the approved final copy
// (BUILD_MISS_LANA_COPY_FIXES_001); only verified facts live here. Do not invent
// values — change the canon first.
import type { Accent } from "@/components/ui/accent";

/** Brand identity (BRAND.md — LOCK). Domain not yet live; shown for reference only. */
export const BRAND = {
  name: "Miss Lana's Fairy-Tale Theater",
  umbrella: "Miss Lana",
  descriptor: "Fairy-Tale Theater",
  domain: "misslanatheater.com",
} as const;

/** Verified facts (PROJECT_BRIEF.md / 01_CONTENT_INVENTORY.md / 02_POSITIONING). */
export const FACTS = {
  experience: "30+ years",
  troupe: "professional troupe",
  ages: "Ages 2–10",
  /** ~30-min costumed show + interactive play (e.g. a bubble show); 35–50 min total. */
  showLength: "35–50 min",
  format: "A ~30-minute costumed fairy-tale play plus interactive play with the kids",
  /** Public price face (PROJECT_BRIEF): real amount by group size; travel free within 30 mi of LA, quoted by distance beyond. */
  priceFrom: "from $350",
} as const;

/** Click-to-call phones (real — 01_CONTENT_INVENTORY.md). tel: is E.164, US (+1). */
export const PHONES = [
  { display: "(213) 282-1054", tel: "+12132821054" },
  { display: "(323) 903-2039", tel: "+13239032039" },
] as const;

/** Service-area business (04_SEO.md): base LA + named travel areas. No public address. */
export const AREAS = {
  base: "Los Angeles",
  travel: ["San Diego", "Sacramento", "San Jose"],
} as const;

/** Primary header nav (SITE_STRUCTURE_AND_BLOCKS.md §2). "Book" is a CTA, not a link. */
export const NAV_LINKS = [
  { label: "Shows", href: "/shows" },
  { label: "School Shows", href: "/school-shows" },
  { label: "Birthdays", href: "/birthdays" },
  { label: "Characters", href: "/characters" },
  { label: "About", href: "/about" },
] as const;

/** Primary CTA target — the booking/contact page (conversion block #1). */
export const BOOK_CTA = { label: "Book a show", href: "/booking" } as const;

/** Footer mini-sitemap (SITE_STRUCTURE_AND_BLOCKS.md §2). */
export const FOOTER_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Shows", href: "/shows" },
  { label: "School Shows", href: "/school-shows" },
  { label: "Birthdays", href: "/birthdays" },
  { label: "Characters", href: "/characters" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Book / Contact", href: "/booking" },
] as const;

/**
 * The 4 service lines under the Miss Lana umbrella (BRAND.md), each a per-section
 * accent (DESIGN_SYSTEM.md §12 — Accent token map in components/ui/accent.ts).
 */
export const SERVICE_LINES: {
  key: string;
  title: string;
  /** Short line/audience label shown as the card Tag. */
  tag: string;
  blurb: string; // final copy (BUILD_MISS_LANA_COPY_FIXES_001)
  href: string;
  accent: Accent;
  /** Card photo (operator-supplied; placeholder direction). Omit → "Photo — pending". */
  media?: string;
  mediaAlt?: string;
}[] = [
  {
    key: "theater",
    title: "Fairy-Tale Theater",
    tag: "Flagship",
    blurb: "Our eight kind fairy-tale shows, performed live with an interactive finale.",
    href: "/shows",
    accent: "forest",
    media: "/images/troupe-fairy-tale-theater.jpg",
    mediaAlt: "Miss Lana and the costumed troupe together on stage after a fairy-tale show.",
  },
  {
    key: "birthdays",
    title: "Birthday Parties",
    tag: "For families",
    blurb: "A real theater show for the birthday child, at your home or venue.",
    href: "/birthdays",
    accent: "coral",
    media: "/images/birthday-party.jpg",
    mediaAlt: "A princess-costumed performer playing with a little girl at an outdoor birthday party.",
  },
  {
    key: "school",
    title: "School Shows",
    tag: "For schools",
    blurb: "Assembly-ready, values-driven theater for preschools, Montessori and schools.",
    href: "/school-shows",
    accent: "sage",
    media: "/images/school-assembly.jpg",
    mediaAlt: "A live costumed show for a room full of seated preschoolers in their classroom.",
  },
  {
    key: "friends",
    title: "Miss Lana & Friends",
    tag: "Characters",
    blurb: "Costumed characters who come to visit the children.",
    href: "/characters",
    accent: "berry",
    media: "/images/miss-lana-friends.jpg",
    mediaAlt: "A performer in a bee costume on the grass in front of a flower-decorated backdrop.",
  },
];

/**
 * The 8-show repertoire (titles/slugs/themes/synopses) now lives in `lib/shows.ts`
 * — the single source for the /shows hub, every /shows/{slug} page, and Home's
 * Featured shows. The old PLACEHOLDER_SHOWS array was retired once the real titles
 * landed (BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001).
 */

/**
 * The professional troupe (01_CONTENT_INVENTORY.md §"Команда"). Names + roles are
 * CANONICAL facts (do not invent/alter). NOTE: Svitlana is listed as Director; the
 * "Svitlana = owner" link is NOT yet confirmed (🔴 owner-gated) — so we present her
 * role only, never assert ownership. The Ukrainian roots are the owner-approved
 * backstory (BUILD_MISS_LANA_COPY_FIXES_001) — named explicitly and warmly ONCE, in
 * the /about heritage paragraph only; brand/SEO/visual layers stay country-neutral,
 * never Slavic/Russian/Ukrainian visual coding, never a slogan, never Russia.
 */
export const TROUPE: { name: string; role: string }[] = [
  { name: "Svitlana Grygoryshyna", role: "Director" },
  { name: "Armen Tadevosyan", role: "Actor, showman, host & writer" },
  { name: "Victoria Stolyarenko", role: "Actress, writer & creative director" },
  { name: "Roman Listopad", role: "Actor, director & teacher" },
];

/**
 * The values that run through every show (01_CONTENT_INVENTORY.md / 02_POSITIONING):
 * kindness, friendship, helping one another. Used on /about. Final copy.
 */
export const VALUES: { title: string; body: string }[] = [
  {
    title: "Kindness",
    body: "Every story we tell carries it — gentleness, generosity and doing the right thing.",
  },
  {
    title: "Friendship",
    body: "The heart of what we do — friendship, teamwork and standing by your friends.",
  },
  {
    title: "Helping one another",
    body: "The lesson children take home — small acts of help that make everything better.",
  },
];

/**
 * Pricing logic by number of children (PROJECT_BRIEF.md). Real, approximate, owner
 * logic — public face is "from $350" (no sub-$350 figure shown publicly); travel is
 * free within 30 miles of LA and quoted by distance beyond that (no dollar amounts).
 */
export const PRICING_TIERS: { group: string; price: string }[] = [
  { group: "Up to ~15 children", price: "$350" },
  { group: "About 40 children", price: "~$400" },
  { group: "About 50 children", price: "~$500" },
  { group: "About 60 children", price: "~$600" },
  { group: "Larger groups", price: "scales from there" },
];
