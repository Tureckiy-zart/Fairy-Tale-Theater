// sitemap.xml — generated from the REAL public route set only (04_SEO.md). Excludes
// internal/non-public surfaces: /design (internal preview), /api/* (handlers), and
// dynamic non-pages. URLs are absolute and built from APP_BASE_URL (lib/seo →
// lib/env), so they always use the canonical production host once deployed.
//
// The site is LAUNCHED / publicly indexable (site-wide noindex removed 2026-06-27,
// STABILIZE_MISS_LANA_PRELAUNCH_001). This sitemap is live and can be submitted to
// Search Console. /design and /api/* stay excluded (internal / non-public).
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { SHOWS } from "@/lib/shows";

// Static public marketing routes (one indexable URL each). /design and /api are
// intentionally absent. Keep this in sync with the app/ route tree.
const STATIC_ROUTES = [
  "/",
  "/shows",
  "/services",
  "/school-shows",
  "/birthdays",
  "/characters",
  "/gallery",
  "/pricing",
  "/planning-your-event",
  "/about",
  "/booking",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const showEntries: MetadataRoute.Sitemap = SHOWS.map((show) => ({
    url: absoluteUrl(`/shows/${show.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...showEntries];
}
