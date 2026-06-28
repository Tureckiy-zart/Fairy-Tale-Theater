// SEO helpers — page metadata + schema.org builders. Spec: docs/core/04_SEO.md
// (PerformingGroup/LocalBusiness, CreativeWork repertoire pages, BreadcrumbList,
// FAQPage; unique title/description/OG per page; clean canonical URLs) and
// SITE_STRUCTURE_AND_BLOCKS.md §6. Facts come from the central site module.
import type { Metadata } from "next";
import { env } from "./env";
import { AREAS, BRAND, EMAIL, PHONES } from "./site";
import type { JsonLdData } from "@/components/ui/JsonLd";

// --- Brand constants for SEO/schema. Facts are sourced from lib/site.ts so brand,
// contacts and geography cannot drift between UI and structured data.
export const SITE = {
  name: BRAND.name,
  shortName: BRAND.umbrella,
  // Generic search-intent phrase keeps American "theater" spelling on purpose.
  description: "Touring live costumed children's theater serving Los Angeles, Southern California and beyond.",
  // Service-area business (no public storefront, 04_SEO.md).
  areasServed: [AREAS.base, AREAS.region, ...AREAS.travel, "California"],
  phones: [PHONES[0].tel],
  email: EMAIL.address,
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

// --- Schema.org factories ---------------------------------------------------

/**
 * WebSite schema — feeds Google's site-name signal. name + alternateName tell search
 * engines to show the real brand instead of treating the bare domain as the brand.
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

/** PerformingGroup + LocalBusiness for a touring service-area business. */
export function organizationSchema(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": ["PerformingGroup", "LocalBusiness"],
    name: SITE.name,
    description: SITE.description,
    url: absoluteUrl("/"),
    telephone: SITE.phones[0],
    email: SITE.email,
    areaServed: SITE.areasServed.map((name) => ({
      "@type": name === AREAS.base || AREAS.travel.includes(name as (typeof AREAS.travel)[number]) ? "City" : "AdministrativeArea",
      name,
    })),
    // Service-area business — no public street address.
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
 * Schema for an individual show page. These are evergreen repertoire/catalog pages
 * — a touring show you can book any time, NOT a scheduled performance with a date.
 * CreativeWork is therefore accurate; Event/TheaterEvent without startDate is not.
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
