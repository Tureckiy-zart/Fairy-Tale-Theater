# Closure review — BUILD_MISS_LANA_DESIGN_PREVIEW_001

**Date:** 2026-06-22 · **Task:** build one internal `/design` styleguide route + minimal token foundation.
**Location:** `baselines/js-next/` (the repo's only Next.js app; confirmed with owner as the site app).
**Gate:** `pnpm run ci:exact` green (lint + typecheck + governance 0 issues + build) · `pnpm test:e2e` 3/3 green.

---

## What was built

- **Token foundation** (Tailwind **v4**, CSS-first): `app/globals.css` — all DESIGN_SYSTEM.md
  §3/§4/§5/§10/§14 tokens in `@theme static` (colors, type scale, radius, elevation, easing) +
  `:root` motion durations + base layer (typography, focus, `focus-halo` for green buttons) +
  ambient `@keyframes` (float/twinkle/reveal) + `prefers-reduced-motion` backstop + a Phosphor
  duotone brand-thread rule. `@theme static` forces every token to `:root` so `var(--color-*)`
  refs in the SVG/focus/duotone CSS always resolve.
- **Fonts:** `app/layout.tsx` — Fraunces (`opsz`+`SOFT` axes) + Nunito via `next/font/google`
  (self-hosted, subset latin+latin-ext, `display:swap`, metric-override fallback). Verified the
  `<html>` element carries both variable classes and `--font-display → var(--font-fraunces)`.
- **Route:** `app/design/page.tsx` (`robots: index:false, follow:false`) + 9 colocated sections
  under `app/design/_components/` (static server sections; icon/motion/components sections are
  client because phosphor-react uses React context).
- **9 sections:** Color (ramps + on-color demos + §3.3 safe/forbidden contrast pairs) · Typography
  (full scale, weights, lead, caps, wordmark direction) · Spacing/Radius/Elevation · Iconography
  (Phosphor Regular + Duotone) · Motif (placeholder lantern + 4-point star, labeled DIRECTION) ·
  Motion (hover-lift, CTA glow, press, one-shot reveal, ambient float/twinkle with pause) ·
  Components (CTA variants, non-submitting booking form with helper/error/success, show card,
  sample nav) · Service-line accents (4 chips, text-safe + fill-with-white) · Accessibility
  (focus-visible demo + §13 baseline).
- **Test:** `tests/e2e/design.spec.ts` (200 + 9 headings + noindex meta).
- **Docs:** how-to-view in `baselines/js-next/README.md`; this findings note; `STATUS.md` +
  `docs/PROJECT_PROGRESS.md` updated.

## Token fidelity / scope / safety

- All hex/px/ms/token values copied verbatim from DESIGN_SYSTEM.md; component instances exercise
  the Tailwind utilities (`bg-forest-600`, `rounded-pill`, `shadow-glow`, …) — confirmed generated
  in the compiled CSS (49 `--color-*` vars emitted).
- No invented tokens; no second icon library; ≤2 Phosphor weights per section group; noindex;
  no "puppet" framing; zero Slavic/Russian/Ukrainian visual coding (grep clean); no final
  logo/character/illustration (placeholders labeled DIRECTION).
- Motion: motion-safe-first (`motion-safe:` variants), only transform/opacity/shadow/color animated,
  no `transition: all`, no LCP-element animation, ambient loops have a pause + reduced-motion stills.

---

## Findings by severity

- **BLOCKER:** none.
- **HIGH:** none.
- **MEDIUM (fixed in this task):** small (10–12px) caption/code labels initially used `text-ink-muted`
  (3.63:1 — below AA 4.5 for small text; §3.2 reserves `ink-muted` for large/decorative). Switched all
  small-text utility uses to `text-ink-soft` (5.86:1). The `ink-muted` token is still documented via
  its large-text hex sample.
- **LOW:** `phosphor-react@1.4.1` is the package named in DESIGN_SYSTEM.md §6/§14.3 but is unmaintained
  and declares a React ≤18 peer range; it installs and renders fine under React 19 (pnpm emits a peer
  warning only, build/e2e green). The maintained successor `@phosphor-icons/react` (same Phosphor set,
  React 19 support) is the recommended swap when the production primitives are built — still "Phosphor,
  one library."
- **LOW (pre-existing, not fixed — out of scope):** dev-mode console shows
  `eval() is not supported … Content-Security-Policy` because `next.config.ts` CSP omits
  `'unsafe-eval'`. This is React **dev-only** instrumentation; production is unaffected and e2e is green.
  Tune the CSP per app when wiring real pages.
- **NOTE:** Phosphor Duotone two-tone (forest body + glow accent) is achieved via a CSS rule targeting
  the secondary `[opacity]` path (stable in Phosphor output). If a future Phosphor/successor version
  changes that markup, revisit the `[data-icon="duotone-brand"]` rule.
- **NOTE:** Service-line accent hexes for Birthdays/&Friends (coral/berry) are directional per §12/§15 —
  finalize and re-check contrast during the real build.
- **NOTE:** The default create-next-app `/` boilerplate page was left untouched (out of scope); it
  still renders and its smoke test passes. The token foundation now also applies app-wide.

## Remaining / gated

- Gated on trademark-clearance: final logo/wordmark, Miss Lana character, production illustrations,
  finalized secondary accent hexes, photo grade preset (§7/§8/§15).
- The `/design` route must be env-guarded or removed before production launch.

## Recommended next tasks (separate TUNG v2 each)

1. `IMPLEMENT_MISS_LANA_DESIGN_TOKENS_001` — production reusable primitives (Button/Input/Card/Nav)
   across the app (consider migrating icons to `@phosphor-icons/react`).
2. Real page builds (home + 4 service lines) once copy/IA are ready.
3. Trademark-gated: finalize logo/wordmark + Miss Lana character + production illustrations.
