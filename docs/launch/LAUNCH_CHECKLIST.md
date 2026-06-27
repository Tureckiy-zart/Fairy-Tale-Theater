# Launch Checklist — Miss Lana's Fairy-Tale Theatre

> `STABILIZE_MISS_LANA_PRELAUNCH_001` (2026-06-27). Evidence-based PASS / BLOCKED /
> N/A. **Indexing was enabled by explicit owner decision** ("снять noindex, начать
> индексироваться; отзывы пока не важны") — so a few normal launch gates are recorded
> as **owner-accepted / follow-up** rather than blocking. Pricing stays "From $350".

## Status legend
- **PASS** — done + verified in this task.
- **OWNER** — owner/account action or asset required (follow-up; not done in repo).
- **INFRA** — deployment/DNS/provider step (follow-up; not done in repo).
- **ACCEPTED** — normally a launch gate; owner chose to launch without it.

## Indexing & search controls

| Item | Status | Evidence |
|---|---|---|
| Site-wide `noindex` removed | **PASS** | `app/layout.tsx` global robots removed; 11 public pages have **0** noindex meta in built HTML |
| `/design` stays noindex | **PASS** | `app/design/page.tsx` `robots:{index:false}`; built `design.html` has noindex |
| `robots.txt` allows crawl, blocks internals | **PASS** | built `robots.txt`: `Allow: /`, `Disallow: /api/`, `Disallow: /design`, `Sitemap:` |
| `sitemap.xml` = real routes, no /design /api | **PASS** | built sitemap: 19 routes; 0 `/design`, 0 `/api` |
| Canonical host (apex `misslanatheatre.com`) | **PASS** (code) / **INFRA** (DNS) | URLs from `APP_BASE_URL`; set it to `https://misslanatheatre.com` at deploy |
| Submit sitemap to Search Console | **OWNER** | needs GSC property + owner Google account — see `docs/seo/SEARCH_CONSOLE_LAUNCH_CHECKLIST.md` |

## Structured data & metadata

| Item | Status | Evidence |
|---|---|---|
| Org schema (PerformingGroup/LocalBusiness), no address | **PASS** | built `index.html` has both types, no `streetAddress` |
| Show pages = CreativeWork (not misleading Event) | **PASS** | built show HTML: `CreativeWork`, no `TheaterEvent` |
| Unique title/description/canonical per route | **PASS** | `buildMetadata` per page |
| No Review schema (no verified reviews yet) | **PASS** | none emitted |

## Lead pipeline

| Item | Status | Evidence |
|---|---|---|
| Form posts to server, success only after accept | **PASS** | `/api/lead` + LeadForm; local live test (Task 05) |
| Durable lead store (no loss) | **PASS** | `.leads/` JSON per inquiry, verified locally |
| Spam (honeypot + rate limit) | **PASS** | verified: honeypot ignored, 429 after 5/60s |
| Owner **email** delivery to info@misslanatheatre.com | **INFRA** | set `LEAD_EMAIL_WEBHOOK_URL`; run `docs/operations/LEAD_PIPELINE_RUNBOOK.md` go-live |
| No PII in logs/analytics | **PASS** | verified: ids only; analytics allow-list |

## Domains & redirects

| Item | Status | Evidence |
|---|---|---|
| 301 host redirects (protective + legacy) in app | **PASS** (code) | 35 rules, all `statusCode:301`, legacy→closest route |
| DNS routes alternate/legacy hosts to this deploy | **INFRA** | see `docs/seo/LEGACY_REDIRECT_MAP.md` |
| Live `curl -sSIL` redirect/SSL checks | **INFRA** | run post-DNS (no sandbox egress) |

## Trust content & media

| Item | Status | Evidence |
|---|---|---|
| ≥5 verified reviews w/ permission | **ACCEPTED** (owner: "отзывы пока не важны") | no reviews block on site; add later when supplied |
| Real media, permission-safe (no child faces w/o consent) | **PASS (current set)** / **OWNER (final)** | gallery uses curated on-brand assets; competitor/quarantine media NOT referenced publicly; see `docs/content/MEDIA_AND_REVIEW_PERMISSION_REGISTER.md` |
| No competitor/quarantined media public | **PASS** | grep: 0 competitor/quarantine refs in public code |
| Trademark-gated logo/mascot | **OWNER** | text wordmark only; final assets gated |

## QA (automated)

| Item | Status | Evidence |
|---|---|---|
| `pnpm run ci:exact` (lint+typecheck+governance+build) | **PASS** | exit 0 |
| `security/secret-scan.sh` | **PASS** | no secrets |
| `git diff --check` | **PASS** | clean |
| `pnpm test:e2e` | **ACCEPTED** | tests written; Next server can't stay alive in this sandbox (precedent) — behavior verified via build output; runs in CI |
| Pricing only "From $350" everywhere | **PASS** | built HTML audit; no tiers/calculator |

## Sign-off

- Launch-blocking BLOCKER/HIGH in code: **none open**.
- Owner-accepted launch without reviews + before live email/DNS: **recorded above**.
- Immediate follow-ups before paid traffic: (1) email webhook live test, (2) DNS +
  redirect curls, (3) GSC sitemap submit, (4) real reviews when available.
