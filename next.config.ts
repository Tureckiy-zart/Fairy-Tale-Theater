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
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
