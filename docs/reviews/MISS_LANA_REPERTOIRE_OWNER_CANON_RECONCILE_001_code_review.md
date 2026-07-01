# Code Review — MISS_LANA_REPERTOIRE_OWNER_CANON_RECONCILE_001

**Reviewer:** implementing agent (self-review, reviewer-grade) · **Date:** 2026-07-01 ·
**Branch:** `fix/repertoire-owner-canon` · **Scope:** 15 changed files (data, config, copy,
tests, canon). Severity vocab: **BLOCKER / HIGH / MEDIUM / LOW / NOTE**.

## Verdict: APPROVE (no BLOCKER / no open HIGH). Ready for human review.

## Per-file review

### `lib/shows.ts` (data source of truth)
- Exactly **8** unique slugs; `getShow` / `relatedShows` / `FEATURED_SHOWS` derive from the
  array, so `/shows`, `/shows/{slug}`, sitemap, related, `generateStaticParams` all stay in
  sync. **OK.**
- Featured = `three-little-pigs, the-rabbit-house, little-red-riding-hood, two-sisters`
  (4 items) → fills `lg:grid-cols-4` exactly on Home/Birthdays. Order matches owner priority. **OK.**
- Per-show ages match the owner matrix (2–8 / 2–8 / 3–13 / 2–13 / 3–10 / 1–6 / 2–8 / 2–8). **OK.**
- **NOTE:** The Rabbit House keeps `bunny-and-fox-with-bubbles.jpg` (a rabbit/bunny costumed
  actor — on-brand and title-consistent); the asset *filename* is unchanged (harmless).
- **NOTE:** Two Sisters and Three Little Pigs intentionally have **no `image`** → neutral
  on-brand fill (matches existing Cinderella/Gingerbread treatment); no "pending" text shown.
- **LOW (accepted):** Two Sisters copy drops the winter/Father-Frost specifics by design
  (do-not-invent). Reads as a self-contained, honest two-sisters tale.

### `next.config.ts` (redirects)
- Two 301s added **before** the host loops, **relative** destination → single clean hop on
  the canonical host, stays on-host in dev/prod (verified: `301 → /shows/two-sisters` and
  `→ /shows/the-rabbit-house`). **OK.**
- Uses `statusCode: 301` consistent with the file's existing SEO-migration convention. **OK.**
- **NOTE:** old slugs only ever existed on the canonical site (not legacy old-site URLs), so
  alternate/legacy-host interaction is a non-issue; even so, relative destinations avoid a
  prod-domain jump during local testing.

### Public copy (`app/shows/page.tsx`, `lib/site.ts`, `app/about/page.tsx`,
`app/birthdays/page.tsx`, `components/blocks/FeaturedShows.tsx`)
- Every public "seven/7" count flipped to "eight/8"; grep confirms **no stray "seven"** left
  in `app`/`lib`/`components` (excluding the `/design` internal preview, already "Eight"). **OK.**
- H1 "Eight kind fairy tales to choose from" + metadata description updated together. **OK.**

### `tests/e2e/site.spec.ts`
- H1 assertion → "eight…"; new route H1s for `three-little-pigs`, `two-sisters`; retired
  `the-winters-gift` PAGES row removed (now covered by the redirect test). **OK.**
- New assertions: 8 unique cards (CTA count **and** unique `/shows/{slug}` href count),
  old-URL→new-slug 301 chain, Donkey 404, Suzy-Bee-only (Maya 404). All green (16/16 in the
  Phase-2 describe). **OK.**
- **NOTE:** `main a[href^="/shows/"]` on the hub matches only the 8 card links (breadcrumb
  `/shows` and "See all shows" `/shows` lack the trailing slash; CTA band → `/booking`).

### Canon docs (7 files)
- Counts 7→8 reversed everywhere they were flipped by `ab7bdd8`; repertoire table rebuilt to
  8 owner rows with ages; resolved title open-questions in 01/03/00/SITE_STRUCTURE/OWNER_ANSWERS,
  leaving **only** the Suzy Bee/Maya public-name question open; changelog + decision-record
  entries added. Internally consistent with `lib/shows.ts`. **OK.**
- **NOTE:** markdownlint (MD060 compact-table / MD004 / MD032) warnings shown by the IDE are
  **pre-existing** and match the docs' existing table style; they are not part of the ESLint
  `pnpm lint` gate and do not affect `ci:exact` (exit 0).

## Guardrail / non-goal audit
- No format filter, no format badges, Donkey not restored, no 9th show, no Suzy→Maya rename,
  no 8→7 mechanical flip (each line reviewed for meaning), Three Little Pigs added in data
  (not docs-only), Two Sisters not left beside Winter's Gift, no duplicate Maya route, no old
  indexable URL deleted without a 301, no unrelated cleanup, **no private transcript
  committed**, no direct push to main, closure not claimed on a green build alone (8 routes +
  redirects + sitemap manually verified). **All satisfied.**

## Residual risk
- One **pre-existing, environmental** e2e failure (`lead-api` rate-limit, Telegram 429) —
  reproduces on the base branch; out of scope. Documented in the report.
