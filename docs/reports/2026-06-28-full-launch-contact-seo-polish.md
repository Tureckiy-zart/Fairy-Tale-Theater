# Full public launch: contact, service-area and SEO polish

**Task:** `FULL_LAUNCH_CONTACT_SEO_POLISH_001`  
**Date:** 2026-06-28  
**Branch:** `fix/full-launch-contact-and-seo`  
**Pull request:** #12  
**Status:** implementation complete; reviewable PR open; not merged into `main`.

## Goal

Finish the public-launch code path for Miss Lana's Fairy-Tale Theatre: remove the remaining pre-launch contradictions, expose the real written contact route, normalize the California service area, keep the public route set indexable, and preserve the working lead-delivery pipeline.

## Implemented

- Restored the locked public brand spelling **Miss Lana's Fairy-Tale Theatre** in the visible header/footer wordmark.
- Published `info@misslanatheatre.com` alongside `(323) 903-2039`.
- Replaced call-first wording with text, email, WhatsApp and phone reply options.
- Preserved the current production lead API, durable persistence and notification pipeline; the reply preference is carried through the existing notes contract without a risky launch-time database/Sheets migration.
- Replaced the public `GBP-first · embed later` placeholder with finished service-area content.
- Normalized geography across Home, Booking, Pricing, School Shows, Birthdays, footer, metadata and schema:
  - Los Angeles is the base.
  - Southern California is the regular market.
  - San Diego, Sacramento, San Jose and other California locations are available by request.
  - No unapproved blanket free-travel radius or invented travel surcharge is published.
- Added an indexable `/privacy` page, linked it from the footer and included it in `sitemap.xml`.
- Kept public marketing/legal routes indexable while `/design` and `/api/` remain excluded from the public crawl surface.
- Added a permanent pull-request CI workflow and targeted launch-regression tests.

## Verification evidence

Final commit tested: `bb3083361f276b7939028f0fe7845431020d1a92` plus the restored CI workflow already present on the branch.

- `pnpm run ci:exact` — **PASS**
  - lint
  - typecheck
  - governance
  - secret scan
  - unit tests
  - production build
- Full `pnpm test:e2e` Playwright suite — **PASS**
- Vercel preview deployment — **READY / PASS**
- Pull request #12 — open and mergeable at the time of the final check.

Two failures discovered during closure were test-selector/copy ambiguity rather than production failures:

1. A new test used `locator("header")`, which matched the global banner and section headers. It was corrected to the semantic `banner` role.
2. An existing success-message assertion became ambiguous after the same response-time wording appeared in the page hero/footer. Public wording was de-duplicated so the assertion targets the actual confirmation state again.

## Reviewer-grade findings

- **BLOCKER:** none open.
- **HIGH:** none open in the repository implementation.
- **MEDIUM:** none open in the changed launch surfaces.
- **LOW:** the form keeps phone required because the current authoritative server contract requires it; email remains optional unless email is selected as the preferred reply route.
- **NOTE:** external indexing and profile actions cannot be completed by repository code alone.

## Not claimed / still external

This PR makes pages crawlable and supplies robots, sitemap, canonicals and structured data. It does **not** claim that Google has already indexed every page.

After merge and production deployment, the operator still needs to verify externally:

- production `robots.txt`, `sitemap.xml` and canonical URLs on `misslanatheatre.com`;
- Google Search Console ownership and sitemap submission;
- Google Business Profile/service-area configuration;
- live legacy/protective-domain 301 behavior;
- production lead delivery using the configured email/Telegram/Sheets providers.

## Delivery decision

The implementation is delivered through PR #12. No direct push or merge to `main` was performed by this task.
