# FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001 — report

> **The full closure report lives in the unified prelaunch-pipeline report**, under
> the **"Task 06"** section:
>
> → [`docs/reports/CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001.md`](./CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001.md) — `## Task 06 — FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001`
>
> SEO artifacts: [`docs/seo/LEGACY_REDIRECT_MAP.md`](../seo/LEGACY_REDIRECT_MAP.md) ·
> [`SEARCH_CONSOLE_LAUNCH_CHECKLIST.md`](../seo/SEARCH_CONSOLE_LAUNCH_CHECKLIST.md) ·
> [`GBP_PROFILE_PACKET.md`](../seo/GBP_PROFILE_PACKET.md). Pointer file only.

**Status:** ✅ closed (2026-06-27). Canonical apex host `misslanatheatre.com`;
`app/sitemap.ts` (real routes, excludes /design + /api) + `app/robots.ts`
(pre-launch `Disallow: /`, launch-ready); evergreen show schema switched to
`CreativeWork` (no misleading Event); `organizationSchema` (no street address)
emitted on Home; one-hop **301** host redirects (protective + legacy → canonical)
in `next.config.ts`; Gallery added to nav. `ci:exact` + secret-scan + git-diff
green; behavior verified from build output. **noindex retained** until Task 07.

**⚠️ Launch gate:** DNS/CDN must route the protective + legacy hostnames to this
deploy, then run the live `curl -sSIL` redirect checks. Reconcile the assumed
legacy URL map against the real old site before activation.
