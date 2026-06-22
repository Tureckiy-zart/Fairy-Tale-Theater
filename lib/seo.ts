// SEO helpers — page metadata + schema.org builders. Spec: docs/core/04_SEO.md
// (PerformingGroup/LocalBusiness, TheaterEvent, BreadcrumbList, FAQPage; unique
// title/description/OG per page; clean canonical URLs) and SITE_STRUCTURE_AND_BLOCKS.md
// §6. Facts (brand, phones, areas served) come from docs/core (BRAND / PROJECT_BRIEF /
// SITE_STRUCTURE §2). Schema factories return plain objects for <JsonLd data={…} />.
import type { Metadata } from "next";
import { env } from "./env";
import type { JsonLdData } from "@/components/ui/JsonLd";

// --- Brand constants (docs/core/BRAND.md · SITE_STRUCTURE_AND_BLOCKS.md §2) ----
export const SITE = {
  name: "Miss Lana's Fairy-Tale Theater",
  shortName: "Miss Lana",
  description: "Touring children's live-costumed fairy-tale theater serving Los Angeles and beyond.",
  // Service-area business (no public storefront, 04_SEO.md).
  areasServed: ["Los Angeles", "San Diego", "Sacramento", "San Jose"],
  // click-to-call numbers (SITE_STRUCTURE_AND_BLOCKS.md §2 footer).
  phones: ["+1-213-282-1054", "+1-323-903-2039"],
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
 * robots (04_SEO.md). Titles are templated "<page> — Miss Lana's Fairy-Tale Theater"
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

interface TheaterEventInput {
  name: string;
  description: string;
  /** Show page path. */
  path: string;
  image?: string;
}

/** TheaterEvent for an individual show page (docs/core/04_SEO.md). */
export function theaterEventSchema({ name, description, path, image }: TheaterEventInput): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "TheaterEvent",
    name,
    description,
    url: absoluteUrl(path),
    image: image ? absoluteUrl(image) : undefined,
    performer: { "@type": "PerformingGroup", name: SITE.name },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "At your venue (touring)",
      address: { "@type": "PostalAddress", addressRegion: "CA", addressCountry: "US" },
    },
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
