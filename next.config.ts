import type { NextConfig } from "next";

// Security headers on by default (see ../../security/SECURITY.md). Tune the CSP
// per app; this is a sane, not-too-strict starter. Headers are runtime-only —
// they do not affect `next build`.
//
// React + Turbopack use eval() in DEVELOPMENT only (debugging / call-stack rebuild),
// so allow 'unsafe-eval' in dev to keep the console clean; production CSP stays
// strict (React never uses eval() in production). next.config.ts is outside the
// governance scan dirs, so reading NODE_ENV here is fine.
const isDev = process.env.NODE_ENV !== "production";

// `script-src 'unsafe-inline'` is kept on purpose: dropping it requires a nonce-based
// CSP via middleware, which forces every page into dynamic rendering and forfeits this
// site's static generation. The XSS surface is minimal (no untrusted input is ever
// reflected as HTML — JSON-LD is escaped, no dangerouslySetInnerHTML), so the tradeoff
// isn't worth it here. `form-action`/`frame-src 'none'`/`object-src 'none'` plus
// `frame-ancestors`/HSTS/nosniff harden the realistic vectors. (security/SECURITY.md)
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob:",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

// Canonical production host (apex, Theatre spelling — docs/core/04_SEO.md / BRAND.md).
const CANONICAL = "https://misslanatheatre.com";

// Legacy old-site path → closest new route. One hop each (source host → final
// canonical destination, no chains). Unmapped legacy paths fall through to the
// catch-all → home. The exact legacy URL inventory must be confirmed against the
// live old site before activation — see docs/seo/LEGACY_REDIRECT_MAP.md.
const LEGACY_PATH_MAP: { source: string; destination: string }[] = [
  { source: "/about", destination: `${CANONICAL}/about` },
  { source: "/about-us", destination: `${CANONICAL}/about` },
  { source: "/shows", destination: `${CANONICAL}/shows` },
  { source: "/repertoire", destination: `${CANONICAL}/shows` },
  { source: "/gallery", destination: `${CANONICAL}/gallery` },
  { source: "/photos", destination: `${CANONICAL}/gallery` },
  { source: "/prices", destination: `${CANONICAL}/pricing` },
  { source: "/pricing", destination: `${CANONICAL}/pricing` },
  { source: "/contact", destination: `${CANONICAL}/booking` },
  { source: "/contacts", destination: `${CANONICAL}/booking` },
  { source: "/booking", destination: `${CANONICAL}/booking` },
  { source: "/birthday", destination: `${CANONICAL}/birthdays` },
  { source: "/birthdays", destination: `${CANONICAL}/birthdays` },
  { source: "/school", destination: `${CANONICAL}/school-shows` },
  { source: "/school-shows", destination: `${CANONICAL}/school-shows` },
];

// Hosts that must 301 to the canonical apex host. The protective alternate spelling
// (misslanatheater.com) and the www variant of the canonical host both fold in.
const ALTERNATE_HOSTS = [
  "www.misslanatheatre.com",
  "misslanatheater.com",
  "www.misslanatheater.com",
];

const LEGACY_HOSTS = ["magic-castle-puppet-theater.com", "www.magic-castle-puppet-theater.com"];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    const hostHas = (host: string) => [{ type: "host" as const, value: host }];
    // Explicit 301 (not Next's default `permanent: true` → 308). SEO domain
    // migrations expect a classic 301 Moved Permanently.
    const redirects: Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>> = [];

    // 1) Alternate/protective/www hosts → canonical apex, preserving the path. 301.
    for (const host of ALTERNATE_HOSTS) {
      redirects.push({
        source: "/:path*",
        has: hostHas(host),
        destination: `${CANONICAL}/:path*`,
        statusCode: 301,
      });
    }

    // 2) Legacy domain — explicit old-path map to the closest new route. 301.
    for (const host of LEGACY_HOSTS) {
      for (const { source, destination } of LEGACY_PATH_MAP) {
        redirects.push({ source, has: hostHas(host), destination, statusCode: 301 });
      }
      // Catch-all: any other legacy path → home (one hop). Placed AFTER the map so
      // mapped paths win; this is not a blind "everything → home".
      redirects.push({
        source: "/:path*",
        has: hostHas(host),
        destination: CANONICAL,
        statusCode: 301,
      });
    }

    return redirects;
  },
};

export default nextConfig;
