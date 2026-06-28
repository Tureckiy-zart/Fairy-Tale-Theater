// sitemap.xml — generated from the real public route set only. Excludes internal or
// non-public surfaces: /design, /api/*, and dynamic non-pages. URLs are absolute and
// built from APP_BASE_URL (lib/seo → lib/env), so production uses the canonical host.
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { SHOWS } from "@/lib/shows";

// Static public marketing/legal routes. Keep this in sync with the app/ route tree.
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
  "/privacy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/privacy" ? "yearly" : "monthly",
    priority: path === "/" ? 1 : path === "/privacy" ? 0.3 : 0.7,
  }));

  const showEntries: MetadataRoute.Sitemap = SHOWS.map((show) => ({
    url: absoluteUrl(`/shows/${show.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...showEntries];
}
