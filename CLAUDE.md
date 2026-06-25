# CLAUDE.md — Fairy-Tale-Theater

## 0. What this file is (slot 1)

Operational helper for agents working in this repo: stack, commands, safety,
scope fences, how a task closes. **It is not architectural canon.** Source of
truth about method/process is the governance core under
`docs/_internal/governance/`; about the product, `PROJECT_BRIEF.md` and the
Phase −1 work in `docs/discovery/`. **On conflict, the deeper/stricter canon
wins**, not this file.

## 1. Language (slot 2)

Chat / reasoning with the operator in **Russian**. Client-facing text
(`CLIENT_QUESTIONS.md`, discovery deliverables) in **Russian** (CLIENT_LANG).
Code, identifiers, comments, commit messages, filenames — **English**.

## 2. Read before work (slot 3)

0. **`PROJECT_BRIEF.md` (root) → `docs/core/PROJECT_BRIEF.md`** — read FIRST. Root
   brief is a pointer; the **canonical facts** live in `docs/core/PROJECT_BRIEF.md`.
   Brand: **Miss Lana's Fairy-Tale Theatre** (touring children's theatre, LA);
   primary production domain: `misslanatheatre.com`.
1. `docs/core/` — **project canon** (source of truth): `BRAND.md`,
   `02_POSITIONING_AND_TONE.md`, `DESIGN_SYSTEM.md`, `01_CONTENT_INVENTORY.md`,
   `03_SITEMAP_AND_SCOPE.md`, `04_SEO.md`, `05_BUILD_CLAUDE.md`,
   `00_PROJECT_INSTRUCTIONS.md`. On brand conflict, `BRAND.md` + tone win.
2. This `CLAUDE.md` — operational layer.
3. `docs/_internal/governance/` — TUNG task system + execution rule (the canon).
4. `docs/reports/` — market/competitor/design research backing the canon.

## 3. Stack & project reality (slot 4)

- **What it is:** Marketing and lead-generation website for Miss Lana's
  travelling children's theatre in Los Angeles: live, in-person shows for
  schools, preschools, birthday parties, and family events.
- **Runtime:** Node + Next.js 16 (App Router), ES modules.
- **Language/tooling:** TypeScript 5 (strict), Tailwind CSS 4, ESLint 9
  (eslint-config-next).
- **Framework:** Next.js 16.2.9 + React 19.2.4.
- **Tests:** Playwright e2e (`tests/e2e/`). No unit-test runner wired yet.
- **Package manager:** **pnpm** only — never mix lockfiles (no npm/yarn).
- **What it is NOT:** not an interactive browser theatre, game, streaming
  product, ticketing platform, factory-starter-kit (`~/factory-starter-kit` —
  the template this was deployed from), sibling project under
  `/home/tureckiy/Projects/`, or monorepo root.

## 4. Commands (slot 5)

```bash
pnpm install                 # deps
pnpm dev                     # next dev (local)
pnpm build                   # next build
pnpm typecheck               # tsc --noEmit
pnpm lint                    # eslint
pnpm governance              # node scripts/governance.mjs (TUNG governance check)
pnpm test:e2e                # playwright test
pnpm run ci:exact            # VERIFY GATE: lint && typecheck && governance && build
```

> Do not invent commands the project does not have. Verify = `pnpm run ci:exact`
> green + targeted runs over the touched area.

## 5. Repository safety (safety protocol)

Canonical version is the `repo-guardian` skill if installed; otherwise the
fallback in `docs/_internal/repo-guardian/`. Minimum: inspect git state before
editing (`git status --short`, `git branch --show-current`, `git diff --stat`,
`git diff --cached --stat`); a file is yours only if you created/modified it in
this task; stage by explicit path (never `git add .`); destructive commands need
explicit operator confirmation naming the command and target; never print or
commit secrets.

### 5.1 Secrets

- `.env*` git-ignored; only `.env.example` (placeholders) tracked.
- Never commit key material (`*.pem`, `*.der`, `*.key`). MCP config (`.mcp.json`)
  uses `${ENV_VAR}` references, never inline keys. Run `security/secret-scan.sh`
  (pre-commit hook installed → `core.hooksPath = security/hooks`).

## 6. Negative scope fences (slot 6)

- This repo is **NOT** `~/factory-starter-kit` (the kit it was bootstrapped from)
  and **NOT** any sibling under `/home/tureckiy/Projects/` (e.g. `../Magic-castle`,
  `../calk_bills`, `../engine-ui`, `../TenerifeMusic`, …) — do not edit them from here.
- Edit **`app/`** (and `public/`, `tests/`, config at root), not build outputs
  (`.next/`, `node_modules/`, `*.tsbuildinfo`).
- Do **not** "fix" pre-existing lint/type errors outside the task's scope — they
  pre-date current work.
- `docs/_internal/governance/` is **frozen canon** — do not hand-edit; fix the
  upstream original and re-copy.

## 7. Task-closure workflow (slot 7)

1. **Verify.** Run `pnpm run ci:exact` green; for scoped changes also run a
   targeted lint/typecheck/e2e over the touched area. No blanket runs beyond
   written scope.
2. **Reviewer-grade review** of the diff with severity vocab
   **BLOCKER / HIGH / MEDIUM / LOW / NOTE**. A `BLOCKER` or open `HIGH` blocks closure.
3. **Record the outcome** per the TUNG task system (`docs/_internal/governance/`).
   "Implementation done" ≠ "task closed" — close explicitly, with evidence (files
   changed, commands run, results, risks). One task = one session.
4. **Change log (MANDATORY, at the end of EVERY task):** append a short entry to
   **`docs/PROJECT_PROGRESS.md`** (append-only full log) — date + 1–3 lines (files
   touched + gist). Do NOT log CI/test runs or debugging — only substantive changes.
   `STATUS.md` = current snapshot; `docs/PROJECT_PROGRESS.md` = chronology.

## 8. Design system — Miss Lana (LOCK — apply ALWAYS)

For any **design / UI / frontend / visual** work, the source of truth is
**`docs/core/DESIGN_SYSTEM.md`** (DS v1.0), read with `docs/core/BRAND.md` +
`02_POSITIONING_AND_TONE.md` (on brand conflict, they win).

- **"Lantern Light" idea:** forest greens + golden-amber glow on warm cream;
  signature = warm light/lantern (Svitlana = "light"). **Bright, but kind.**
- **Tokens are the source of truth.** Color / type (`Fraunces` display + `Nunito`
  body) / spacing / radius / elevation / motion / icons (`Phosphor`) come from
  `DESIGN_SYSTEM.md` — never invent ad-hoc colors/fonts/spacing. The token
  foundation is wired in `app/globals.css`; primitives live in `components/ui/`;
  preview at `/design` (`app/design/`).
- **Accessibility built in (WCAG AA):** amber text only `glow-700`; no white text
  on gold; visible focus; `motion-safe`-first + `prefers-reduced-motion`; animate
  only `transform`/`opacity` (don't touch LCP).
- **Anti-patterns (forbidden):** "big open mouths" / cartoon-shouty; cold
  corporate/template; AI-default (cream + contrast serif + terracotta); **any
  Slavic/Russian/Ukrainian visual coding** (Ukrainian team — brand not associated
  with Russia).
- **Trademark-clearance gate:** logo/wordmark, final Miss Lana character, production
  illustrations are **direction only**, not final.
