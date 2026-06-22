# Build findings — BUILD_MISS_LANA_SHOWCASE_AND_ABOUT_001 (Phase 3)

**Date:** 2026-06-22 · **Task:** Phase 3 — the four remaining MVP pages
(`/services`, `/characters`, `/gallery`, `/about`), replacing the Phase-1 stubs.
**Result:** MVP page set is **complete**. Verify gate green; e2e authored (could not
execute in this container — see NOTE on environment).

---

## What shipped

Composed entirely from `@/components/ui` primitives + existing blocks + `lib/seo`, on
the design system, mobile-first. Whole site stays **noindex**.

- **`app/services/page.tsx`** — umbrella overview (§4.3). Hero SectionHeader + intro
  ("one troupe, four ways to book") → the four service-line `Card`s (Fairy-Tale Theater
  / School Shows / Birthday Parties / & Friends) from `SERVICE_LINES`, each on its
  per-line accent (§12) with a CTA to its page → "from $350 / distance on request" note
  → `TrustStrip` → `BookingCTABand`. Reachable via a new footer "Services" link.
- **`app/characters/page.tsx`** — the "& Friends" line (§4.3), **berry** accent (§12).
  Hero (placeholder media) → differentiation from generic animators ("the quality of a
  real troupe", 3 cards) → how it works (3 steps) → `BookingCTABand`.
- **`app/gallery/page.tsx`** + **`components/blocks/GalleryGrid.tsx`** +
  **`lib/gallery.ts`** — scaffold (§4.5). SectionHeader + intro → masonry (CSS columns,
  no JS) grouped by the four canon categories (Shows / Troupe / Children / Backstage),
  with embedded muted+captioned **video** wiring → `BookingCTABand`. `lib/gallery.ts`
  mirrors `lib/shows.ts`: optional `src`/`poster`/`captionsSrc` so real graded assets
  drop in without page changes; until then every tile renders the marked
  "Photo/Video — pending" placeholder (no scraping; reserved aspect = no CLS).
- **`app/about/page.tsx`** — (§4.6). Mission → 30+ years → the troupe (4 artists + roles,
  canonical from `01_CONTENT`, new `TROUPE` in `lib/site`) → a **gentle, flagged**
  backstory → `PersonaIntro` (reused; first-person, placeholder portrait) → values (new
  `VALUES` in `lib/site`) → `TrustStrip` + `BookingCTABand`.
- **`lib/site.ts`** — added `TROUPE` (canonical names/roles), `VALUES`, and a footer
  "Services" link (so the umbrella page is reachable).
- **`tests/e2e/site.spec.ts`** — Phase-3 block: 200 + H1 ×4; noindex ×4; BreadcrumbList
  ×4; `/services` links to all four lines; gallery category headings + pending
  placeholders; `/about` 30+ years + full troupe; reduced-motion reveal.

Each page: one `h1`, unique `buildMetadata` (title/description/OG/canonical), `Breadcrumb`
(emits BreadcrumbList JSON-LD via the safe `JsonLd`), landmarks via `SiteShell`.

---

## Verification

- **`pnpm run ci:exact`** — **green** (lint + typecheck + governance + build; 22 routes
  prerendered, incl. the 4 new ones).
- **`pnpm test:e2e`** — **could not run in this container**: outbound network is blocked
  (403 on all hosts, incl. `cdn.playwright.dev`), so Playwright's browser binary can't be
  downloaded and no browser was cached. Tests are written and run in CI where the browser
  is available. **Substitute verification:** started `pnpm dev` and confirmed via `curl`
  for all four routes — HTTP 200, correct unique H1, `robots=noindex`, `BreadcrumbList`
  present; `/services` emits links to `/shows`, `/school-shows`, `/birthdays`,
  `/characters`; `/gallery` renders all four "… — pending assets" category headings + 17
  "pending" placeholders; `/about` renders all four troupe names.

---

## Reviewer-grade review (BLOCKER / HIGH / MEDIUM / LOW / NOTE)

No **BLOCKER / HIGH / MEDIUM**.

- **LOW** — `lib/gallery.ts` placeholder captions are temporary, generic alt text; real
  graded assets + final alt land in Phase 4 [ASSET].
- **NOTE (content file absent)** — the task's referenced copy file
  `docs/reports/2026-06-22-phase3-content-services-characters-gallery-about.md` was **not
  present** in the repo (same precedent as Phase 2). All landing/about prose is temporary
  placeholder copy authored from the canon (`SITE_STRUCTURE` §4.3/§4.5/§4.6, `BRAND`,
  `02_POSITIONING`); troupe names/roles are canonical from `01_CONTENT` (not invented).
- **NOTE (e2e environment)** — see Verification: browser download blocked; CI runs it.
- **NOTE (media)** — placeholder treatment only; no scraping; CSP `img-src 'self'`
  untouched; media fields wired for Phase 4.

---

## Closure sequence

1. **Scope** — built only the four Phase-3 pages (+ their data/block/test/footer wiring).
   No `/blog`, no real assets, no final brand art, no surcharge amounts, no confirmed
   owner/heritage claim, no indexing.
2. **Implementation** — `ci:exact` green; 4 routes EXISTS_READABLE and render 200/H1.
   e2e authored (CI-executed; curl-substitute green here).
3. **Review** — block fidelity to §4.3/§4.5/§4.6; primitives reused (no forks, no ad-hoc
   tokens); a11y (one h1, landmarks, ≥44px CTAs, color not sole signal); motion-safe /
   reduced-motion respected (no LCP/hero animation); About backstory gentle + flagged.
4. **Execution-safety** — no non-goals; no forbidden patterns (no scraping, no
   `dangerouslySetInnerHTML`, no second icon lib, no Slavic/Russian/Ukrainian coding, no
   "puppet" / "25 years" / "only-first").
5. **Summary** — MVP page set complete. Temporary/placeholder: all prose, all media
   (pending), persona portrait, troupe portraits.

---

## 🔴 Red gaps carried forward

- 🔴 Real graded owner photos/video — `/gallery` is a skeleton until then (Phase 4 [ASSET]).
- 🔴 Confirm **Svitlana Grygoryshyna = owner** → then finalize `/about` (now: Director only).
- 🔴 Heritage wording on `/about` — owner confirms how explicitly to name the roots
  (canon = quiet, warm, no coding); current text is the soft default, no country named.
- 🔴 Final Miss Lana portrait + any illustrated characters (placeholders; TM non-blocking).
- 🔴 Distance-surcharge amounts; real social links; format-split (carried from Phase 2).
- 🔴 Final EN copy review/approval (all Phase-3 prose is temporary).
