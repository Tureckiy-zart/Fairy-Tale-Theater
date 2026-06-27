// robots.txt — LAUNCHED (STABILIZE_MISS_LANA_PRELAUNCH_001, 2026-06-27). The public
// site is crawlable; only internal surfaces are disallowed (/api handlers, /design
// preview). The sitemap is advertised for discovery.
//
// ROLLBACK to pre-launch: replace `rules` with `[{ userAgent: "*", disallow: "/" }]`
// AND restore noindex in app/layout.tsx + per-page buildMetadata.
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/design"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
