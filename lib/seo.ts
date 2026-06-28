// SEO helpers — page metadata + schema.org builders. Spec: docs/core/04_SEO.md
// (PerformingGroup/LocalBusiness, TheaterEvent, BreadcrumbList, FAQPage; unique
// title/description/OG per page; clean canonical URLs) and SITE_STRUCTURE_AND_BLOCKS.md
// §6. Facts (brand, phones, areas served) come from docs/core (BRAND / PROJECT_BRIEF /
// SITE_STRUCTURE §2). Schema factories return plain objects for <JsonLd data={…} />.
import type { Metadata } from "next";
import { env } from "./env";
import { AREAS, BRAND, PHONES } from "./site";
import type { JsonLdData } from "@/components/ui/JsonLd";

// --- Brand constants for SEO/schema. Facts are SOURCED from lib/site.ts (the single
// source of site-wide facts) — never re-declared here, so brand name / areas / phone
// can't drift between the click-to-call UI and schema.org. Only the SEO-specific
// search-intent `description` lives here. (docs/core/BRAND.md · 04_SEO.md)
export const SITE = {
  name: BRAND.name,
  shortName: BRAND.umbrella,
  // Generic search-intent phrase keeps American "theater" spelling on purpose.
  description: "Touring live costumed children's theater serving Los Angeles and beyond.",
  // Service-area business (no public storefront, 04_SEO.md).
  areasServed: [AREAS.base, ...AREAS.travel],
  // Primary public click-to-call only — single source is lib/site PHONES (E.164). The
  // legacy second number is reserve-only and is never exposed publicly or in schema.
  phones: [PHONES[0].tel],
} as const;

/** Absolute URL for a site-relative path, from APP_BASE_URL (lib/env). */
export function absoluteUrl(path = "/"): string {
  const base = env.baseUrl.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

interface MetaInput {
  title: string;
  description: string;
  /** Site-relative path → canonical + OG url. */
  path: string;
  /** OG/Twitter image (absolute or site-relative). */
  image?: string;
  /** Keep a page (e.g. internal previews) out of the index. */
  noindex?: boolean;
}

/**
 * Build a page's Next Metadata: unique title/description, canonical, Open Graph,
 * robots (04_SEO.md). Titles are templated "<page> — Miss Lana's Fairy-Tale Theatre"
 * unless they already include the brand.
 */
export function buildMetadata({ title, description, path, image, noindex }: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE.name) ? title : `${title} — ${SITE.name}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: fullTitle,
      description,
      url,
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
  };
}

// --- Schema.org factories (return plain objects for <JsonLd>) -----------------

/**
 * WebSite schema — feeds Google's "site name" in the search snippet. Without it Google
 * falls back to the bare domain (misslanatheatre.com) above the title, which reads like
 * the brand is printed twice. `name` + `alternateName` tell it to show the real brand.
 * (Google "Site names" docs / 04_SEO.md.)
 */
export function websiteSchema(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    alternateName: SITE.shortName,
    url: absoluteUrl("/"),
  };
}

/** PerformingGroup + LocalBusiness for the org (areaServed = touring cities). */
export function organizationSchema(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": ["PerformingGroup", "LocalBusiness"],
    name: SITE.name,
    description: SITE.description,
    url: absoluteUrl("/"),
    telephone: SITE.phones[0],
    areaServed: SITE.areasServed.map((name) => ({ "@type": "City", name })),
    // service-area business — no public street address (04_SEO.md).
    address: { "@type": "PostalAddress", addressRegion: "CA", addressCountry: "US" },
  };
}

interface ShowInput {
  name: string;
  description: string;
  /** Show page path. */
  path: string;
  image?: string;
}

/**
 * Schema for an individual show page. These are EVERGREEN repertoire/catalog pages
 * — a touring show you can book any time, NOT a scheduled performance with a date.
 * So we deliberately use CreativeWork (a theatrical work), NOT Event/TheaterEvent:
 * emitting Event without a startDate is misleading scheduled-event data (04_SEO.md /
 * task guardrail). The bookable nature is conveyed by a non-priced Offer reference to
 * the org; no price beyond "From $350" appears anywhere in schema.
 */
export function showSchema({ name, description, path, image }: ShowInput): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: absoluteUrl(path),
    image: image ? absoluteUrl(image) : undefined,
    genre: "Children's fairy-tale theatre",
    inLanguage: "en",
    audience: { "@type": "PeopleAudience", suggestedMinAge: 2, suggestedMaxAge: 10 },
    creator: { "@type": "PerformingGroup", name: SITE.name },
  };
}

export interface Crumb {
  name: string;
  /** Site-relative path. */
  href: string;
}

/** BreadcrumbList from an ordered list of crumbs (also used by <Breadcrumb>). */
export function breadcrumbSchema(items: Crumb[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export interface QA {
  question: string;
  answer: string;
}

/** FAQPage from question/answer pairs (pair with the Accordion content). */
export function faqSchema(items: QA[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}
