# Google Search Console — Launch Checklist

> Built by `FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001` (2026-06-27). **No secrets.**
> Canonical host: **`https://misslanatheatre.com`**. The site is **noindex
> pre-launch** — do **not** submit the sitemap or request indexing until
> `STABILIZE_MISS_LANA_PRELAUNCH_001` removes noindex.

## Before launch (safe to prepare now)

- [ ] Create a **Domain property** for `misslanatheatre.com` in Search Console
      (covers http/https + all subdomains in one property). Verify via the DNS TXT
      record at the registrar.
- [ ] (Optional) Add `GOOGLE_SITE_VERIFICATION` to deployment env — `lib/env` already
      exposes `googleSiteVerification`; wire it into `app/layout.tsx` metadata
      `verification.google` only if using the HTML-tag method instead of DNS.
- [ ] Add separate properties (or confirm coverage) for the **legacy**
      `magic-castle-puppet-theater.com` and **protective** `misslanatheater.com` so
      you can watch the 301s and use **Change of Address** from the legacy property.
- [ ] Confirm `https://misslanatheatre.com/sitemap.xml` renders the real route set
      (Home, /shows + 8 show URLs, /services, /school-shows, /birthdays, /characters,
      /gallery, /pricing, /planning-your-event, /about, /booking) and **excludes**
      `/design` and `/api`.
- [ ] Confirm `https://misslanatheatre.com/robots.txt` currently shows `Disallow: /`
      (pre-launch) — this is expected.

## At launch (only after noindex is removed — Task 07)

- [ ] Confirm robots.txt now allows crawling (`Disallow: /api/`, `/design` only) and
      that pages no longer send `noindex` (layout + per-page).
- [ ] **Submit** `https://misslanatheatre.com/sitemap.xml` in the canonical property.
- [ ] Use **URL Inspection** on `/` and 2–3 key routes → "Request indexing".
- [ ] From the legacy property, file **Change of Address** → `misslanatheatre.com`.
- [ ] Verify the protective/legacy properties show 301s landing on canonical URLs.

## First 30 days (monitor)

- [ ] **Pages** report: coverage rising; no "Discovered – not indexed" spikes.
- [ ] **Page indexing**: watch for accidental duplicates between www/apex or
      theater/theatre — all should resolve to the apex Theatre host.
- [ ] **Removals / Manual actions**: none expected.
- [ ] **Core Web Vitals**: LCP/CLS/INP green (the build is static/SSG).
- [ ] **Links**: confirm legacy domain's old backlinks now flow through the 301s.

## Notes

- Search Console **property creation requires owner Google-account access** — this
  checklist does not claim any property is already created/verified.
- No Review schema, ratings, or private address are present on the site (audited in
  the task report); nothing to remediate there.
