# Closure note — preview polish (FIX)

**Task:** `FIX_MISS_LANA_PREVIEW_POLISH_001` · **Mode:** TUNG v2-full (fix) · **Date:** 2026-06-22
**Status:** ✅ DONE — `pnpm run ci:exact` green · `pnpm test:e2e` 21/21 · `file_check` → EXISTS_READABLE.
**Scope:** four decision-free preview corrections + one optional copy softening. No new pages/blocks/
features, no token/design change, no owner-gated values.

## Fixes applied

1. **US dates** — `app/layout.tsx` `lang="en"` → `lang="en-US"`; the booking **date field** is now a
   masked `mm/dd/yyyy` text input (controlled, digits-only with auto-slashes, **no date library**) with
   format validation (`Use the mm/dd/yyyy format…`). `components/shell/LeadForm.tsx`. (Native
   `<input type="date">` follows browser locale, so a masked field is the deterministic US fix.)
2. **Lantern glyph** — added a `Lantern` silhouette (handle + body + warm glow window + base; server-safe
   inline SVG, token colours, `currentColor` frame) to `components/brand/Glyphs.tsx`, and replaced the
   bulb-like Phosphor `Lightbulb` in `BookingCTABand` (×2) and the `LeadForm` submit. Still a marked
   placeholder/DIRECTION (trademark gate). Phosphor remains the icon library (the lantern is a brand glyph
   like `SparkStar`, not a second library).
3. **Canonical featured-show titles** — Home's featured shows now carry the working EN titles from
   `docs/core/01_CONTENT_INVENTORY.md`, verbatim (incl. the two re-titled shows: **Little Red Riding
   Hood** and **Father Frost**). I first set them in `lib/site.ts` `PLACEHOLDER_SHOWS`; the concurrent
   Phase-2 session then **retired that array** and moved show data to a single source `lib/shows.ts`
   (used by the /shows hub, each show page, and Home's `FeaturedShows`) — same canonical-titles outcome,
   and it resolves the earlier lib/site↔lib/shows duplication. None invented.
4. **Doc naming** — `«Storybook Grove»` → `«Lantern Light»` reconciled in `docs/PROJECT_PROGRESS.md` and
   `docs/reports/2026-06-22-design-system-research.md` (the report's working name for the direction that
   shipped as Lantern Light; analysis unchanged, RU `(Сказочная роща)` → `(Фонарный свет)`). `grep docs/`
   for "Storybook Grove" → none.
5. **(optional) Friendlier stubs** — `StubPage` now shows a visitor-facing "We're putting this page
   together — coming soon…" instead of internal "Phase X builds…"; the `phaseNote` prop + its per-route
   args were removed.

## Verification

- `pnpm run ci:exact` green (lint 0 · typecheck clean · governance 0 · build ✓, all routes ○ Static).
- `pnpm test:e2e` — 21/21 (the valid-submit test now fills `12/01/2026`).
- Manual: `lang="en-US"` set; date reads `mm/dd/yyyy`; `Lantern` used in CTA bands + submit, no
  `Lightbulb` left in rendered UI; Home featured titles match the inventory; no "Storybook Grove" in docs.

## Findings (severity)

No **BLOCKER / HIGH / MEDIUM**.

- **NOTE (concurrent Phase-2 session)** — a parallel session built the real Phase-2 `/shows` hub
  (`lib/shows`, `ShowCardGrid`) **mid-task**, replacing the `app/shows` stub; my stub-copy edit there is
  moot (it is a real page now). The task anticipated Phase 2 in a separate session. The other 5 fixes are
  intact and effective; the integrated tree is green.
- **RESOLVED** — the lib/site ↔ lib/shows show-data duplication was consolidated by the Phase-2 session:
  `PLACEHOLDER_SHOWS` was retired and `lib/shows.ts` is the single source (hub, show pages, Home featured).
- **NOTE** — `components/ui/README.md` still uses `Lightbulb` in a Button usage example (illustrative doc
  snippet, not rendered UI); the internal `/design` styleguide also demos the Phosphor `Lightbulb` icon by
  name (a legitimate icon showcase, not the brand signature). Left as-is — out of scope.
- **NOTE (PersonaIntro)** — PersonaIntro uses a `UserCircle` **portrait** placeholder (a person, not a
  bulb); the task mentioned it but there was no bulb to change there — left correct.

## Deferred (out of scope — owner / Phase 2, NOT fixed here)

- **Price floor** — the `$300–350` table tier vs the "from $350" anchor needs ONE owner-chosen public
  floor; the table + all "from $X" copy should then be aligned. Left untouched (owner decision).
- **Top-nav "Pricing"** and **trimming the Home lead form** to a CTA → `/booking` — UX changes for the
  Phase-2 session.
- Distance-surcharge amounts, social links, real assets/copy, final logo/character/illustrations — gated.

Site stays **noindex**; tokens/design unchanged; primitives reused, not forked. Next major step: Phase 2
(`BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001`) — already underway in the separate session.
