# Closure report — Home + global shell (Phase 1)

**Task:** `BUILD_MISS_LANA_HOME_AND_SHELL_001` · **Mode:** TUNG v2-full (feature → fix closure profile)
**Date:** 2026-06-22 · **Status:** ✅ DONE — `pnpm run ci:exact` green · `pnpm test:e2e` 21/21
**Scope:** global shell + Home + Booking + Pricing + minimal stub routes, on placeholders.
**Sources of truth:** `docs/core/SITE_STRUCTURE_AND_BLOCKS.md` (structure: §3 global, §4.1 Home, §4.4
Pricing, §4.7 Booking) · `docs/core/DESIGN_SYSTEM.md` (tokens/components/motion/a11y) ·
`PROJECT_BRIEF.md` / `01_CONTENT_INVENTORY.md` (facts). Built from the `@/components/ui` primitives.

---

## 1. Executive summary

A navigable, conversion-ready **skeleton** of the real site: the global shell + the three launch-critical
pages (Home, Booking, Pricing) + minimal stubs for every other nav target, assembled entirely from the
existing `@/components/ui` primitives and `lib/seo` — no forks, no duplicated tokens. All copy and imagery
are clearly-marked placeholders; the whole site is `noindex` until launch. Verify gate and e2e are green.

---

## 2. Mandatory closure sequence

### Step 1 — Scope verification

Built **only** the shell + Home + Booking + Pricing + 6 minimal stubs. No later-phase real pages
(no real `/shows` hub or `/shows/{slug}`, no real `/school-shows`/`/birthdays`/`/characters`/`/services`/
`/gallery`/`/about`, no `/blog`). No `non_goals` touched: no lead-form backend, no live map embed, no
distance-surcharge amounts, no real copy/photos, no final logo/character/illustrations, no SEO/indexing push.

### Step 2 — Implementation verification

- `pnpm install` — deps present (no change).
- `pnpm run ci:exact` — **green**: `lint` 0 errors · `typecheck` clean · `governance` 0 issues ·
  `build` ✓ (13 routes, all prerendered **○ Static**).
- `pnpm test:e2e` — **21/21 pass** (6 design + 1 smoke + **14** site — my 12 + 2 added with the icon-library swap).
- `file_check_command` → `EXISTS_READABLE` (app/page.tsx, app/booking/page.tsx, app/pricing/page.tsx).

### Step 3 — Reviewer-grade review

- **Blueprint fidelity** — Home block order is verbatim §4.1; Booking is §4.7; Pricing is §4.4; the
  global blocks are §3. (See §6 below for the block-by-block map.)
- **Primitive reuse (no duplication)** — every page/block composes `@/components/ui`
  (Button/Field/Card/Nav/Section/Container/SectionHeader/Breadcrumb/Tag) + `lib/seo`. When a parallel
  session shipped these primitives mid-task, I **deleted my duplicates** (`shell/SectionHeader`,
  `shell/Breadcrumb`, `shell/PlaceholderTag`) and refactored onto the canonical ones, and moved
  `ServiceLineCards` onto the extended `Card` (`accent`/`tag`).
- **Token fidelity** — only `@theme` token utilities; no ad-hoc hex/spacing/shadows. Color-rule audit
  passed: no white-on-gold, no `glow-400/500/600` as text, no dark ink on the success fill.
- **Accessibility** — skip-link, one `<main id="main-content">`, semantic landmarks/headings (one h1
  per page), visible `:focus-visible` (primitive), labelled fields, `(required)` spelled out, colour
  never the sole signal, touch targets ≥44–48px (primitive), keyboard drawer (focus-trap + ESC).
- **Motion / CWV** — Hero (LCP) is static; below-fold uses the `.ll-reveal` one-shot IO; `motion-safe:`
  variants only animate `transform`/`opacity`; reduced-motion stills everything (verified by e2e).
- **Facts** — phones (click-to-call), ages 2–10, areas, 30+ years, troupe, format are real; price face
  "from $350"; distance "on request" (no guessed amount).
- **Dead code** — none; lint/tsc clean.

### Step 4 — Execution-safety confirmation

- **No `non_goals` implemented** (see Step 1).
- **No `forbidden_execution_patterns` triggered** — no invented tokens/prices/surcharge; placeholders
  marked (never presented as final); primitives reused not forked; color rules respected; no layout/
  `transition:all` animation, LCP not animated, loops have a pause and reduce-motion stills them; Phosphor
  only, ≤2 weights, no extra fonts; no Slavic/Russian/Ukrainian coding, no "puppet"/"25 years in LA"/
  "only/first in LA"; no 404 from nav (stubs exist); placeholder pages stay `noindex`; no build outputs /
  real `.env` committed; task closed only after the gate + e2e are green.
- **All `execution_guardrails` respected** — read the blueprint/DS/brief/primitives before coding;
  composed from primitives; real facts from docs; hero = LCP no-animation; a11y; site-wide `noindex`;
  stubs minimal; featured/gallery via placeholders; one task = one session (closure recorded).

### Step 5 — File verification

Route + shell files exist and are readable (Step 2 `file_check`), plus the full inventory in §7. Build
prerenders all 13 routes.

### Step 6 — Closure summary

Phase 1 is complete and green. **Everything is placeholder content/imagery and the site is `noindex`
pre-launch.** Remaining: later-phase real pages (Phases 2–5), owner inputs, and the trademark-gated final
assets (§9–§11). Recommended next: `BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001` (Phase 2).

---

## 3. Deliverables checklist

| Deliverable | Status |
|---|---|
| Shell composites (SiteHeader/Nav, SiteFooter, BookingCTABand, LeadForm, SectionHeader, Breadcrumb) | ✅ (`components/shell/*`; SectionHeader/Breadcrumb = `@/components/ui`) |
| Home section blocks (TrustStrip, FormatExplainer, ServiceLineCards, featured ShowCard grid, B2B, B2C, PersonaIntro, GalleryTeaser, HowItWorks+areas) | ✅ `components/blocks/*` |
| Routes: `app/page.tsx`, `app/booking/page.tsx`, `app/pricing/page.tsx` + 6 stubs | ✅ |
| Site-wide noindex (pre-launch) | ✅ `app/layout.tsx` + per-page `buildMetadata({noindex})` |
| Playwright e2e (pages, nav, form validation, keyboard, reduced-motion) | ✅ `tests/e2e/site.spec.ts` (14) |
| Placeholder/phase note | ✅ this report |
| Closure review note (findings by severity, incl. pre-existing not-fixed) | ✅ §8 |

## 4. Success criteria

- ✅ Home/Booking/Pricing render with the exact §4.1/§4.7/§4.4 block order, composed from primitives.
- ✅ Global shell present and reused across pages (`SiteShell`).
- ✅ Nav resolves with no 404s (stubs exist); all routes use the shell (e2e: all targets 200).
- ✅ Real facts correct; public price "from $350"; distance "on request" (no amounts); placeholders marked.
- ✅ No "puppet" / "25 years in LA" / "only-first in LA" / Slavic coding / final logo-character (audited).
- ✅ Color rules + §3.3 contrast respected; focus-visible everywhere; LeadForm helper/error/success +
  working client validation + success state (e2e).
- ✅ Motion-safe-first; hero/LCP not animated; reduce-motion stills (e2e); loops paused (globals backstop).
- ✅ Whole site `noindex`; `/design` stays `noindex` (e2e).
- ✅ `pnpm run ci:exact` green; e2e smoke passes (21/21).
- ✅ Placeholder/phase note + findings note produced (this doc).

## 5. Verification evidence

```text
pnpm run ci:exact   → lint 0 · typecheck clean · governance: 0 issues · build ✓ (13 routes ○ Static)
pnpm test:e2e       → 21 passed (design 6 + smoke 1 + site 14)
file_check_command  → EXISTS_READABLE
```

e2e (`tests/e2e/site.spec.ts`) asserts: `/`,`/booking`,`/pricing` → 200 + H1; all nav/footer targets →
200 (no 404); a header nav link navigates; LeadForm empty-submit shows a field error and stays;
valid-submit shows the confirmation; skip-link is first focusable → `#main-content`; mobile drawer
opens/closes by keyboard restoring focus; under reduced motion `.ll-reveal` is opacity 1 and deep content
is visible; `<meta name="robots">` contains `noindex`.

## 6. Block-by-block fidelity

**Home (`/`, §4.1):** Hero `[ASSET]` (H1 "Live theater that comes to you.", primary "Book Miss Lana" +
secondary "See our shows", click-to-call, static glow, placeholder media, **LCP, no animation**) →
TrustStrip (30+ yrs · troupe of 4 · we come to you · ages 2–10 · kind values) → FormatExplainer (~30-min
costumed play + interactive/bubbles, 35–50 min, "not a one-off animator") → ServiceLineCards (4 lines,
§12 accents) → Featured shows (placeholder `Card` grid → /shows) → B2B teaser (sage → /school-shows) →
B2C teaser (coral → /birthdays) → PersonaIntro (first-person, placeholder portrait → /about) → Gallery
teaser (placeholder tiles → /gallery) → How it works + areas + "from $350" → BookingCTABand + LeadForm →
SiteFooter.

**Booking (`/booking`, §4.7):** Breadcrumb → H1 + click-to-call → LeadForm (name · phone · email · event
type [preschool/school/birthday/party] · date · time · city · number of children · show · comment) with
client validation + on-screen confirmation → service-area placeholder block.

**Pricing (`/pricing`, §4.4):** Breadcrumb → H1 → by-number-of-children table (≤15 $300–350 · ~40 ~$400 ·
50 $500 · 60 $600 · scales) → what's included → **distance on request** (no amounts) → packages by
segment (sage/coral/berry, "from $350") → BookingCTABand.

**Global (§3):** SiteHeader/Nav (sticky, transparent→cream, drawer, skip-link), SiteFooter, BookingCTABand,
LeadForm, SectionHeader, Breadcrumb — all reused.

## 7. File inventory

**New (29):** `lib/site.ts`; `components/motion/Reveal.tsx`; `components/brand/Glyphs.tsx`;
`components/shell/{SiteShell,SiteHeader,SiteFooter,BookingCTABand,LeadForm,StubPage}.tsx`;
`components/blocks/{Hero,TrustStrip,FormatExplainer,ServiceLineCards,FeaturedShows,B2BTeaser,B2CTeaser,
PersonaIntro,GalleryTeaser,HowItWorksAreas}.tsx`; `app/{booking,pricing,shows,school-shows,birthdays,
characters,gallery,about}/page.tsx`; `tests/e2e/site.spec.ts`; this report.
**Modified (4):** `app/page.tsx` (Home), `app/layout.tsx` (site-wide noindex), `next.config.ts` (dev-only
CSP `'unsafe-eval'`), `tsconfig.json` (modern strict hardening). The icon-library migration also touched
most files (parallel session).
**Appended (2):** `STATUS.md`, `docs/PROJECT_PROGRESS.md`.
**Created then removed (mine, superseded by ui primitives):** `components/shell/{SectionHeader,Breadcrumb,
PlaceholderTag}.tsx`.

## 8. Findings (severity)

No **BLOCKER / HIGH / MEDIUM**.

- **NOTE (coordination)** — the primitives were extended by a **parallel session mid-task**
  (`EXTEND_MISS_LANA_PRIMITIVES_001`). Per owner direction the single source is `@/components/ui`: I
  refactored the shell onto it, deleted my 3 duplicates, switched `ServiceLineCards` to the extended
  `Card`, and aligned `lib/site` to the `Accent` type. Future: parallel sessions in isolated worktrees
  (CLAUDE.md §7).
- **RESOLVED (was a NOTE)** — the `Nav` wordmark used to be hardcoded `href="#"` (scroll-to-top on inner
  pages). The parallel session added a `homeHref` prop to `Nav` (defaults to `/`); `SiteHeader` passes it,
  so the wordmark now routes Home from any page (e2e covers it).
- **NOTE (asset-gated)** — the "transparent header overlaying the hero photo" look isn't achieved yet (Nav
  is sticky/in-flow; hero sits below it). Fine on the placeholder; revisit when the hero asset lands.
- **NOTE** — two fact modules coexist: `lib/site.ts` (UI/content) and `lib/seo.ts` (SEO/schema +
  `buildMetadata`). Slight overlap (brand name; phones in display vs schema formats), kept by purpose;
  consolidate later if desired.
- **NOTE** — `Breadcrumb` emits BreadcrumbList JSON-LD by default on these `noindex` preview pages with
  `APP_BASE_URL`-default (localhost) URLs. Harmless; resolves to the real origin once the env var is set.
- **NOTE (gated)** — final logo/wordmark/Miss Lana character/production illustrations stay behind the
  trademark gate; ships on text wordmark + placeholder glyphs/portrait.
- **LOW (pre-existing) — FIXED** — `next.config.ts` CSP lacked `'unsafe-eval'`, so dev served React
  `eval() is not supported` console warnings. Fixed by allowing `'unsafe-eval'` in **development only**
  (`NODE_ENV !== "production"`); the production CSP stays strict (React never uses `eval()` in prod). The
  dev console warning is gone (the e2e run reports 0).

### Post-task follow-ups (operator-requested, same session)

- **Icon library modernized** — `phosphor-react@1.4.1` (deprecated) → `@phosphor-icons/react@2` (the
  maintained successor), migrated across the codebase by the parallel session. The `data-icon="duotone-brand"`
  brand-thread (§6) still recolors the duotone accent path to glow (e2e asserts it).
- **TypeScript hardened to a modern strict canon** — `tsconfig.json`: `target ES2022`, `allowJs:false`,
  `verbatimModuleSyntax`, `noUncheckedIndexedAccess`, `noUnusedLocals`/`noUnusedParameters`,
  `noImplicitOverride`, `noFallthroughCasesInSwitch`, `moduleDetection:"force"`,
  `forceConsistentCasingInFileNames`. Needed 2 defensive guards in `Nav.tsx` (possibly-undefined array
  access). Gate stays green.
- **Review screenshots** — full-page desktop + mobile captures of every route in
  `docs/reports/2026-06-22-screenshots/` (helper: `scripts/screenshots.mjs`).

## 9. Placeholder → final (what each later phase fills in)

| Placeholder now | Filled in | Phase / gate |
|---|---|---|
| Hero/gallery/teaser/show photos & video, persona portrait | real assets | Phase 4 `[ASSET]` |
| Body copy (headlines use canon taglines; body marked placeholder) | real EN copy | Phase 4 `[OWNER]` |
| Featured-show titles (invented, marked) + show pages | 8 real titles + `/shows/{slug}` | Phase 2 |
| `/school-shows`, `/birthdays` (stubs) | real B2B/B2C landings | Phase 2 |
| `/services`, `/characters`, `/gallery`, `/about` (stubs) | real content | Phase 3 |
| Distance-surcharge ("on request") | published rule/amounts | owner `[OWNER]` |
| Social links (disabled chips) | real links | owner |
| Text wordmark + glyphs + persona portrait | final logo/character/illustrations | trademark `[TM]` |
| LeadForm (demo, no send) | email/CRM backend | later task |
| Service-area "map" placeholder | GBP-first; live embed later | Phase ≥4 |
| Site-wide noindex; `/design` route | indexing on; `/design` env-guarded/removed | Phase 5 launch |

## 10. Owner inputs & gates

Show format-split + 2 retitled shows (Morozko → Father Frost; "Well Red Bow wait" → Little Red Riding
Hood); distance-surcharge rule/amounts; social links; photo/video assets; confirm owner = Svitlana
Grygoryshyna. **Trademark gate:** final logo/wordmark/character/illustrations.

## 11. Recommended next & post-actions

- **Next:** `BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001` (Phase 2 — `/shows` hub + show-detail template ×8 +
  `/school-shows` + `/birthdays`), then `BUILD_MISS_LANA_SHOWCASE_AND_ABOUT_001` (Phase 3).
- Keep the site **noindex** until Phase 5; keep `/design` env-guarded/removable.
- Do not start later-phase pages in this session (one task = one session).
