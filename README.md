# JS baseline — Next + React 19 + TS + Tailwind 4 + pnpm

Scaffolded with `create-next-app` (App Router, no `src/`), then wired with the
kit's governance gate, security headers, and Playwright.

## Stack (pinned, verified green)

Next 16.2.9 · React 19.2.4 · TypeScript 5 · Tailwind 4 (`@tailwindcss/postcss`) ·
ESLint 9 (`eslint-config-next` flat config) · Playwright 1.6 · pnpm.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint
pnpm typecheck    # tsc --noEmit
pnpm governance   # scripts/governance.mjs — invariant gate (extend per project)
pnpm ci:exact     # lint -> typecheck -> governance -> build  (the merge gate)
pnpm test:e2e     # Playwright — run `npx playwright install` once first
```

`pnpm ci:exact` is verified green on this baseline.

## Design preview — `/design` (internal, noindex)

An internal visual-QA page that renders the locked Miss Lana design system
(color, type, spacing/radius/elevation, icons, motif direction, motion, and
component instances) straight from `docs/core/DESIGN_SYSTEM.md`.

```bash
pnpm dev   # then open http://localhost:3000/design
```

It is **internal only** (`robots: noindex, nofollow`) and is **not** a real page.
To check motion: enable your OS "reduce motion" setting and reload — all loops /
reveals should still and the page stay usable. **Env-guard or remove this route
before the production launch.** Placeholders (lantern glyph, "Miss Lana" wordmark,
show photos) are direction only, pending trademark-clearance.

## What's wired beyond create-next-app

- `scripts/governance.mjs` — invariant gate (no `dangerouslySetInnerHTML`, no
  hardcoded keys, no direct `process.env` outside `lib/env`, no committed key
  files). Exits non-zero on any finding. Extend with brand/a11y/perf rules.
- `next.config.ts` — security headers (CSP, HSTS, nosniff, referrer-policy,
  frame-options). See `../../security/SECURITY.md`.
- Playwright config + a smoke test under `tests/e2e/`. `test:e2e` is separate
  from `ci:exact` so the merge gate stays install-light (no browser download).

## Env

Copy `../../security/.env.example` to `.env`, fill real values, and read them via
the lazy reader pattern in `../../security/lazy-env-reader.md` (`lib/env.ts`).
Never commit `.env`.
