// Single source of site-wide FACTS and nav config — imported by both server and
// client components (plain module, no hooks). Facts come from the canon, NOT from
// memory: PROJECT_BRIEF.md (phones, ages, areas, 30+ years, troupe, pricing logic),
// BRAND.md (brand/lines), SITE_STRUCTURE_AND_BLOCKS.md §2 (nav/footer). Marketing
// COPY lives in the blocks and is placeholder (clearly marked); only verified facts
// live here. Do not invent values — change the canon first.
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
  troupe: "professional troupe of 4",
  ages: "Ages 2–10",
  /** ~30-min costumed show + interactive play (e.g. a bubble show); 35–50 min total. */
  showLength: "35–50 min",
  format: "A ~30-minute costumed fairy-tale play plus interactive play with the kids",
  /** Public price face (PROJECT_BRIEF): real amount by group size; distance is on request. */
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
export const BOOK_CTA = { label: "Book Miss Lana", href: "/booking" } as const;

/** Footer mini-sitemap (SITE_STRUCTURE_AND_BLOCKS.md §2). */
export const FOOTER_LINKS = [
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
  blurb: string; // placeholder copy
  href: string;
  accent: Accent;
}[] = [
  {
    key: "theater",
    title: "Fairy-Tale Theater",
    tag: "Flagship",
    blurb: "Our flagship — costumed actors bring a kind fairy tale to life, then play along with the kids. Placeholder copy.",
    href: "/shows",
    accent: "forest",
  },
  {
    key: "birthdays",
    title: "Birthday Parties",
    tag: "For families",
    blurb: "A real theater show for the birthday child — magic that comes to you, no hassle. Placeholder copy.",
    href: "/birthdays",
    accent: "coral",
  },
  {
    key: "school",
    title: "School Shows",
    tag: "For schools",
    blurb: "Assembly-ready, values-driven theater for preschools, Montessori and schools. Placeholder copy.",
    href: "/school-shows",
    accent: "sage",
  },
  {
    key: "friends",
    title: "Miss Lana & Friends",
    tag: "Characters",
    blurb: "Costumed characters who come to visit — the quality of a theater troupe, not a one-off animator. Placeholder copy.",
    href: "/characters",
    accent: "berry",
  },
];

/**
 * PLACEHOLDER show titles for the featured grid — invented, neutral, kind-tale
 * names for LAYOUT REVIEW ONLY (real titles are owner-pending, 01_CONTENT_INVENTORY).
 * Marked visibly in the UI as placeholders; swapped in a later phase.
 */
export const PLACEHOLDER_SHOWS: { title: string; blurb: string }[] = [
  { title: "The Lantern & the Little Fox", blurb: "A gentle tale about sharing your light. Placeholder blurb." },
  { title: "The Bunny's Little House", blurb: "Friends help a bunny find a home again. Placeholder blurb." },
  { title: "The Winter's Gift", blurb: "Kindness and hard work are quietly rewarded. Placeholder blurb." },
  { title: "The Gingerbread Friend", blurb: "A runaway treat learns to slow down and listen. Placeholder blurb." },
];

/**
 * Pricing logic by number of children (PROJECT_BRIEF.md). Real, approximate, owner
 * logic — public face is "from $350"; distance surcharge amounts are NOT decided
 * (shown as "on request", never guessed).
 */
export const PRICING_TIERS: { group: string; price: string }[] = [
  { group: "Up to ~15 children", price: "$300–350" },
  { group: "About 40 children", price: "~$400" },
  { group: "About 50 children", price: "~$500" },
  { group: "About 60 children", price: "~$600" },
  { group: "Larger groups", price: "scales from there" },
];
