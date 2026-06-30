// Single source of site-wide FACTS and nav config — imported by both server and
// client components (plain module, no hooks). Facts come from the canon, NOT from
// memory: PROJECT_BRIEF.md (phones, ages, areas, 30+ years, troupe, pricing logic),
// BRAND.md (brand/lines), SITE_STRUCTURE_AND_BLOCKS.md §2 (nav/footer). Marketing
// COPY (service-line blurbs, values) is the approved final copy
// (BUILD_MISS_LANA_COPY_FIXES_001); only verified facts live here. Do not invent
// values — change the canon first.
import type { Accent } from "@/components/ui/accent";

/** Brand identity (BRAND.md — LOCK). misslanatheatre.com is the live primary domain. */
export const BRAND = {
  name: "Miss Lana's Fairy-Tale Theatre",
  umbrella: "Miss Lana",
  descriptor: "Fairy-Tale Theatre",
  domain: "misslanatheatre.com",
} as const;

/** The single public price floor. All price faces below derive from it (no drift). */
const PRICE_FLOOR = "$350";

/** Verified facts (PROJECT_BRIEF.md / 01_CONTENT_INVENTORY.md / 02_POSITIONING). */
export const FACTS = {
  experience: "30+ years",
  troupe: "professional troupe",
  ages: "Ages 2–10",
  /** About one hour: ~30-min costumed play + ~30 min of games, dancing and bubbles. */
  showLength: "about an hour",
  format: "a ~30-minute costumed fairy-tale play, then ~30 minutes of games, dancing and bubbles",
  /** Public price face (PROJECT_BRIEF): only "from $350"; travel quoted by custom quote. */
  priceFrom: `from ${PRICE_FLOOR}`,
  /** Capitalized price face for sentence-start / headings ("From $350"). */
  priceFromCap: `From ${PRICE_FLOOR}`,
  /** Bare price floor ("$350") for inline interpolation. */
  priceFloor: PRICE_FLOOR,
} as const;

/**
 * Click-to-call phone (01_CONTENT_INVENTORY.md). Only the primary public number is
 * exposed; the legacy second number is reserve-only and never a public contact. tel:
 * is E.164, US (+1).
 */
export const PHONES = [
  { display: "(323) 903-2039", tel: "+13239032039" },
] as const;

/** Primary written contact (BRAND.md / 01_CONTENT_INVENTORY.md). */
export const EMAIL = {
  address: "info@misslanatheatre.com",
  href: "mailto:info@misslanatheatre.com",
} as const;

/** Reply choices shown in the booking form. Written contact remains preferred. */
export const CONTACT_METHODS = ["Text message", "Email", "WhatsApp", "Phone call"] as const;

/**
 * Touring service-area facts. Los Angeles is the base, not the boundary: the troupe
 * serves Southern California and accepts farther California travel by request. No
 * blanket free-travel radius or unapproved surcharge is encoded here; every booking
 * receives a custom quote.
 */
export const AREAS = {
  base: "Los Angeles",
  region: "Southern California",
  travel: ["San Diego", "Sacramento", "San Jose"],
  byRequest: "Other California locations",
} as const;

/** Primary header nav (SITE_STRUCTURE_AND_BLOCKS.md §2). "Book" is a CTA, not a link. */
export const NAV_LINKS = [
  { label: "Shows", href: "/shows" },
  { label: "School Shows", href: "/school-shows" },
  { label: "Birthdays", href: "/birthdays" },
  { label: "Characters", href: "/characters" },
  { label: "Gallery", href: "/gallery" },
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
  { label: "Planning your event", href: "/planning-your-event" },
  { label: "About", href: "/about" },
  { label: "Book / Contact", href: "/booking" },
  { label: "Privacy", href: "/privacy" },
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
    title: "Fairy-Tale Theatre",
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
 * CANONICAL facts (do not invent/alter). This array is the /about troupe GRID — the
 * performing artists. Svitlana Grygoryshyna (owner & director, canon-confirmed
 * 2026-06-26) is NOT a grid card here (owner request 2026-06-29 — avoids duplicating
 * the Miss Lana persona); instead /about names her as the company's owner & director
 * in the troupe section, and the Miss Lana persona runs in PersonaIntro. The
 * Ukrainian roots are the owner-approved
 * backstory (BUILD_MISS_LANA_COPY_FIXES_001) — named explicitly and warmly ONCE, in
 * the /about heritage paragraph only; brand/SEO/visual layers stay country-neutral,
 * never Slavic/Russian/Ukrainian visual coding, never a slogan, never Russia.
 */
export const TROUPE: {
  name: string;
  role: string;
  photo?: string;
  /** Tailwind object-position utility for the circular crop (default: center). */
  photoPosition?: string;
  bio?: string;
}[] = [
  {
    // Photo pre-cropped to a square (face-centred) so head sizes match across cards — no object-position needed.
    name: "Armen Tadevosyan",
    role: "Actor, showman, host & writer",
    photo: "/images/actors/armen-tadevosyan.jpg",
    bio: "He has starred in the comedy films Mer Baky 1 and Mer Baky 2, the Comments TV show, the Yere1 sitcom, the Harevanner TV series, and the 220V and Kargin Haghordum comedy series. Today he is a TV host at AMGA TV USA and also acts in films and commercials and hosts events. His career as a comedian began in 1993.",
  },
  {
    name: "Victoria Stolyarenko",
    role: "Actress, writer & creative director",
    photo: "/images/actors/victoria-stolyarenko.jpg",
    photoPosition: "object-[50%_30%]", // nudge crop up a touch
    bio: "A graduate of the Sumy Higher School of Culture and of the Rivne State Humanities University in Ukraine, where she qualified as a drama-theatre director and teacher. She has worked in television and cinema.",
  },
  // Marzhan: photo + bio provided by owner (2026-06-29); role "Actress" provisional (🔴 owner-gated).
  // Photo pre-cropped to a square (face-centred) so head sizes match across cards.
  {
    name: "Marzhan Kanlybayeva",
    role: "Actress",
    photo: "/images/actors/marzhan-kanlybayeva.jpg",
    bio: "She has performed in children's theatre and appeared in film and television projects, including Hollywood films and TV series.",
  },
  // Anton Gakh: surname + bio supplied by owner 2026-06-29 (replaced Roman Listopad).
  // Author-written bio; opening reworked to the house third-person voice, facts kept.
  {
    name: "Anton Gakh",
    role: "Actor",
    photo: "/images/actors/anton.jpg",
    photoPosition: "object-top", // head sits high in frame — keep it from cropping
    bio: "An actor with 14 years in theatre, film and television, he began in amateur theatre in Ukraine before building an international career in China, where he worked alongside Jackie Chan, Wu Jing and other renowned actors. He has appeared in numerous films, TV series and commercials, including The Battle at Lake Changjin, one of the highest-grossing films in Chinese cinema history. He also represented Ukraine at the International Festival of Arts in Algeria in 2016. Now based in Los Angeles, he continues to perform on stage while pursuing his film and television career.",
  },
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
 * What shapes a custom quote (PROJECT_BRIEF.md / OWNER_ANSWERS_DECISION_RECORD.md §1).
 * Public pricing is limited to "from $350" plus these factors — NO audience-size price
 * tiers, tables, calculators, or fixed travel surcharges are shown publicly (locked
 * commercial constraint). The internal headcount logic lives in the decision record,
 * not in the public site.
 */
export const QUOTE_FACTORS: string[] = [
  "The show you choose and the size of the group",
  "How long you'd like us — the show, plus any extra interactive time",
  "Where you are — travel outside our regular Los Angeles service area",
  "Any optional extras, like face painting or a costumed character visit",
];
