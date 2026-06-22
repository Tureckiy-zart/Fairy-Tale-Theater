# CLAUDE.md — <PROJECT_NAME>

<!--
Starter CLAUDE.md emitted by bootstrap-project. All 7 invariant slots
(HERMES_SKILLS_AUDIT_002 §7). Slots 1–5 are filled by the skill from the
detect_stack.sh report (real package.json/pyproject data). Slots 6–7 (negative
scope fences + closure workflow) are filled from detection too — see the inline
hints. Replace every <...> placeholder; delete this comment when done.
Merge-not-clobber: if a CLAUDE.md already exists, do NOT overwrite it.
-->

## 0. What this file is (slot 1)

Operational helper for agents working in this repo: stack, commands, safety,
scope fences, how a task closes. **It is not architectural canon.** Source of
truth about architecture is `<canon doc / README>`. **On conflict, the
deeper/stricter canon wins**, not this file.

## 1. Language (slot 2)

<Chat/reasoning in the human's language; code, identifiers, comments, commit
messages, filenames in English.> — the single most universal stanza.

## 2. Read before work (slot 3)

0. **`PROJECT_BRIEF.md` — read this FIRST, before you build anything.** It states
   what this project is, who it's for, and the pain it addresses. If it's still
   mostly placeholders, the brief was skipped at bootstrap — fill it (or ask)
   before non-trivial work, so you're building from understanding, not guessing.
1. This `CLAUDE.md` — operational layer.
2. `<architecture / canon doc>`.
3. `<README / engineering standards>`.
4. `<review checklist / progress log>`.

## 3. Stack & project reality (slot 4)

- **What it is:** <one-line description>.
- **Runtime:** <Node >=X / Python >=X>, <module system>.
- **Language/tooling:** <TypeScript strict / Python + types>.
- **Tests:** <Vitest / pytest>.
- **Package manager:** <pnpm / uv> (one only — never mix lockfiles).
- **What it is NOT:** <not the monorepo root / not the client / not the source repo>.

## 4. Commands (slot 5)

```bash
<install>      # from package.json scripts / pyproject
<dev>
<build>
<typecheck>
<test>
<verify-gate>  # the real merge gate, e.g. pnpm ci:exact / ruff && mypy && pytest
```

> Do not invent commands the project does not have. Verify = the real gate + targeted runs.

## 5. Repository safety (safety protocol)

Canonical version is the `repo-guardian` skill if installed; otherwise the
fallback safety doc applies. Minimum: inspect git state before editing
(`git status --short`, `git branch --show-current`, `git diff --stat`,
`git diff --cached --stat`); a file is yours only if you created/modified it in
this task; stage by explicit path (never `git add .`); destructive commands need
explicit operator confirmation naming the command and target; never print or
commit secrets.

### 5.1 Secrets

- `.env*` git-ignored; only `.env.example` (placeholders) tracked.
- Never commit key material (`*.pem`, `*.der`, `*.key`). MCP config (`.mcp.json`)
  uses `${ENV_VAR}` references, never inline keys.

## 6. Negative scope fences (slot 6 — fill from detection)

Concrete "this is NOT X" boundaries (auto-derivable: sibling repos detected next
to this one, monorepo root, build outputs, pre-existing errors):

- This repo is **NOT** `<sibling/client/monorepo-root detected at ../<name>>` — do
  not edit it from here.
- Edit **`<source dir, e.g. src/ or app/>`**, not build outputs (`<dist/, .next/,
  compiled JS, .tsbuildinfo>`).
- Do **not** "fix" pre-existing `<lint/type>` errors in `<files>` unless that is
  the task — they pre-date current work.
- `<generated/legacy locations>` are not to be relocated or rewritten.

## 7. Task-closure workflow (slot 7 — fill from detection)

1. **Verify.** Run `<verify-gate from slot 4>` green; for scoped changes use a
   targeted test/lint over the touched area. No blanket runs beyond written scope.
2. **Reviewer-grade review** of the diff with severity vocab
   **BLOCKER / HIGH / MEDIUM / LOW / NOTE**. A `BLOCKER` or open `HIGH` blocks closure.
3. **Record the outcome** in `<the project's progress trail: docs/PROJECT_PROGRESS.md
   / a report>`. Don't claim "done" without evidence (files changed, commands run,
   results, risks).