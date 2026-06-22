# Build findings — Home + global shell (Phase 1)

**Task:** `BUILD_MISS_LANA_HOME_AND_SHELL_001` (TUNG v2-full) · **Date:** 2026-06-22
**Scope:** global shell + Home + Booking + Pricing + minimal stub routes, on placeholders.
**Source of truth:** `docs/core/SITE_STRUCTURE_AND_BLOCKS.md` (structure) + `docs/core/DESIGN_SYSTEM.md` (visuals).

## What was built

- **Global shell** (`components/shell/`): `SiteShell` (header + `<main id="main-content">` + footer),
  `SiteHeader` (wraps the `Nav` primitive: sticky, transparent→cream on scroll, mobile drawer with
  focus-trap/ESC, skip-link), `SiteFooter` (click-to-call, areas, social placeholders, mini-sitemap,
  text wordmark, preview-build note), `BookingCTABand`, `LeadForm` (client validation + on-screen
  confirmation; **no backend**), `StubPage`.
- **Home** (`app/page.tsx`) — the full §4.1 stack: Hero → TrustStrip → FormatExplainer →
  ServiceLineCards → Featured shows → B2B teaser → B2C teaser → PersonaIntro → Gallery teaser →
  How it works + areas → BookingCTABand + LeadForm → SiteFooter. Blocks in `components/blocks/`.
- **Booking** (`app/booking/page.tsx`) — §4.7: LeadForm (name · phone/email · event type · date/time ·
  city · number of children · show · comment) + click-to-call + service-area placeholder + confirmation.
- **Pricing** (`app/pricing/page.tsx`) — §4.4: by-number-of-children table, what's included,
  distance **on request** (no amounts), packages by segment, "from $350", CTA.
- **Stub routes**: `/shows`, `/school-shows`, `/birthdays`, `/characters`, `/gallery`, `/about` —
  shell + "coming soon" + BookingCTABand (no 404s from nav).
- **Site-wide noindex** (`app/layout.tsx` `robots` + per-page `buildMetadata({noindex})`); `/design`
  keeps its own noindex.
- **e2e** (`tests/e2e/site.spec.ts`): 3 pages 200 + H1; all nav/footer targets resolve; LeadForm
  validation + confirmation; skip-link; mobile drawer keyboard; reduced-motion reveals; noindex.

Composed entirely from the **`@/components/ui` primitives** (Button/Field/Card/Nav/Section/Container/
SectionHeader/Breadcrumb/Tag) + `lib/seo` `buildMetadata` — no forks/duplication. Two small helpers
added: `components/motion/Reveal` (the canonical `.ll-reveal` IO pattern) and `components/brand/Glyphs`
(server-safe spark/glow motif). Facts live in `lib/site.ts`.

## Placeholder → final (what each later phase fills in)

| Placeholder now | Filled in | Phase / gate |
|---|---|---|
| Hero/gallery/teaser/show photos & video, persona portrait | real assets | Phase 4 `[ASSET]` (owner) |
| Body copy (headlines use canon taglines; body is marked placeholder) | real EN copy | Phase 4 `[OWNER]` |
| Featured-show titles (invented, marked) + show pages | 8 real titles + `/shows/{slug}` | Phase 2 |
| `/school-shows`, `/birthdays` (stubs) | real B2B/B2C landings | Phase 2 |
| `/services`, `/characters`, `/gallery`, `/about` (stubs) | real content | Phase 3 |
| Distance-surcharge amounts ("on request") | published rule/amounts | owner `[OWNER]` |
| Social links (disabled chips) | real links | owner |
| Text wordmark + Phosphor/SVG glyphs + persona portrait | final logo/character/illustrations | trademark gate `[TM]` |
| LeadForm (demo, no send) | email/CRM backend | later task |
| Service-area "map" placeholder | GBP-first; live embed later | Phase ≥4 |
| Site-wide noindex; `/design` route | indexing on; `/design` env-guarded/removed | Phase 5 launch |

## Verification

- `pnpm run ci:exact` — **green** (lint 0 errors · typecheck clean · governance 0 · build ✓, 13 routes static).
- `pnpm test:e2e` — **19/19 pass** (6 design + 1 smoke + 12 new site).
- Color rules audited (no white-on-gold, no glow-400/500/600 as text, no dark ink on success fill);
  no "puppet" / "25 years" / "only/first in LA" phrasing; phones/areas/ages/30+ years correct;
  price face "from $350"; distance never a guessed amount.

## Findings (severity)

- **NOTE (coordination)** — the primitives library was extended by a **parallel session mid-task**
  (`EXTEND_MISS_LANA_PRIMITIVES_001`). Per owner direction the single source was set to
  `@/components/ui`: I refactored the shell onto it and **removed my duplicate** `shell/SectionHeader`,
  `shell/Breadcrumb`, `shell/PlaceholderTag` (→ ui `SectionHeader`/`Breadcrumb`/`Tag`), switched
  `ServiceLineCards` to the extended `Card` (accent/tag), and aligned `lib/site` to the `Accent` type.
  Future: parallel sessions in isolated worktrees (CLAUDE.md §7).
- **NOTE (primitive limitation, not forked)** — the `Nav` wordmark anchor is hardcoded `href="#"`,
  so on inner pages it scrolls to top instead of going Home. Not a 404 / not broken nav. Fix = add a
  `homeHref` prop to the `Nav` primitive (separate task; not forking it here).
- **NOTE (asset-gated)** — the "transparent header over the hero photo" look isn't achieved yet (Nav is
  sticky/in-flow; the hero sits below it). Fine on the placeholder; revisit when the hero asset lands.
- **NOTE** — two fact modules coexist: `lib/site.ts` (UI/content — display phones, nav, lines, pricing,
  placeholder shows) and `lib/seo.ts` (SEO — schema-format phones, areasServed, `buildMetadata`). Slight
  overlap (brand name; phones in different formats) kept by purpose; consolidate later if desired.
- **NOTE** — `Breadcrumb` emits BreadcrumbList JSON-LD by default on these noindex preview pages with
  `APP_BASE_URL`-default (localhost) URLs. Harmless; resolves to the real origin once the env var is set.
- **NOTE (gated)** — final logo/wordmark/Miss Lana character/production illustrations remain behind the
  trademark gate; everything ships on text wordmark + placeholder glyphs/portrait.
- **LOW (pre-existing, NOT fixed — out of scope)** — `next.config.ts` CSP lacks `'unsafe-eval'`, so dev
  serves React's `eval() is not supported` console warnings; no prod impact, gate/tests green. (Already
  recorded under the tokens task.)

No **BLOCKER / HIGH / MEDIUM**.

## Owner inputs that unblock content

Show format-split + 2 retitled shows (Morozko → Father Frost; "Well Red Bow wait" → Little Red Riding
Hood); distance-surcharge rule/amounts; social links; photo/video assets; confirm owner = Svitlana
Grygoryshyna. Trademark gate: final logo/wordmark/character/illustrations.

## Recommended next

`BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001` (Phase 2 — `/shows` hub + show-detail template ×8 +
`/school-shows` + `/birthdays`), then `BUILD_MISS_LANA_SHOWCASE_AND_ABOUT_001` (Phase 3). Keep the site
noindex until Phase 5.
