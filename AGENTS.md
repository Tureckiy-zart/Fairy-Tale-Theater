# AGENTS.md — Miss Lana's Fairy-Tale Theatre

Read [`CLAUDE.md`](CLAUDE.md) first — it is the operational layer (stack,
commands, safety, scope fences, closure). This file is the short multi-agent
companion (Codex / Cursor / other agents).

## What this repo is

Marketing + lead-generation website for **Miss Lana's Fairy-Tale Theatre** (a
touring live children's theatre in Los Angeles), built with **Next.js 16 App
Router + TypeScript (strict) + Tailwind 4**, package manager **pnpm**. **NOT** an
interactive browser theatre/game/streaming/ticketing product, **NOT** the
`~/factory-starter-kit` it was bootstrapped from, and **NOT** any sibling repo
under `/home/tureckiy/Projects/`.

## Repository safety (before any edit / commit / cleanup)

```bash
git status --short
git branch --show-current
git diff --stat
git diff --cached --stat
```

- Treat pre-existing staged/unstaged/untracked files as user work — never
  overwrite, format, or fold them into your commit (parallel sessions pre-stage
  the index here — verify `git diff --cached` before any commit).
- Stage by explicit path; never `git add .` / `git add -A`.
- Never print or commit secrets (`.env*`, key material `*.pem`/`*.der`/`*.key`).
  PII lives in `.leads/` (git-ignored) — never commit it.
- Destructive/irreversible commands need explicit operator confirmation that
  names the command and target. Vague "ok / go ahead" is not enough.

## Scope

- Edit `app/`, `components/`, `lib/`, `public/`, `tests/`, and root config — not
  build outputs (`.next/`, `node_modules/`, `*.tsbuildinfo`).
- `docs/_internal/governance/` is frozen canon — fix the upstream original and
  re-copy, don't hand-edit.
- Do not "fix" pre-existing lint/type errors outside your task's scope.

## Verify before claiming done

Run the verify gate green:

```bash
pnpm run ci:exact   # lint && typecheck && governance && secret-scan && test:unit && build
```

For scoped changes also run a targeted `pnpm test:unit` / `pnpm test:e2e` over
the touched area. Report files changed, commands run, results, and remaining
risks. Append a 1–3 line entry to `docs/PROJECT_PROGRESS.md` at the end of the
task (CLAUDE.md §7).
