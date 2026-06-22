# AGENTS.md — <PROJECT_NAME>

Read [`CLAUDE.md`](CLAUDE.md) first — it is the operational layer (stack,
commands, safety, scope fences, closure). This file is the short multi-agent
companion (Codex / Cursor / other agents).

## What this repo is

<One-line: what it is, and the single most important "NOT X" boundary —
e.g. "server-side API; the client is the separate ../<client> repo">.

## Repository safety (before any edit / commit / cleanup)

```bash
git status --short
git branch --show-current
git diff --stat
git diff --cached --stat
```

- Treat pre-existing staged/unstaged/untracked files as user work — never
  overwrite, format, or fold them into your commit.
- Stage by explicit path; never `git add .` / `git add -A`.
- Never print or commit secrets (`.env*`, key material `*.pem`/`*.der`/`*.key`).
- Destructive/irreversible commands need explicit operator confirmation that
  names the command and target. Vague "ok / go ahead" is not enough.

## Scope

- Edit `<source dir>`, not build outputs.
- Do not "fix" pre-existing errors in `<files>` unless that is the task.

## Verify before claiming done

Run `<verify-gate>` green, or a targeted test/lint over the touched area. Report
files changed, commands run, results, and remaining risks.
