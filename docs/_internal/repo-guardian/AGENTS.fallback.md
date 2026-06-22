# AGENTS.md

This repository uses Repo Guardian, a repository safety protocol for AI coding
agents. Follow it before editing files, committing work, cleaning state, or
running risky commands.

The canonical source is `skills/repo-guardian/SKILL.md`. If this file conflicts
with that skill, follow the skill and report the conflict.

## Repository Safety Rules

- Never assume the repository is clean.
- Treat pre-existing staged, unstaged, and untracked files as user work.
- Preserve user work unless the user explicitly asks for a scoped change.
- Do not overwrite, format, move, delete, stage, or commit unrelated files.
- If ownership is unclear, treat the file as user work.
- Stop when the requested task requires touching a file with unrelated user
  changes.

## Required Pre-Flight

Before edits, commits, cleanup, migrations, publishing, or deployment, run and
inspect:

```bash
git status --short
git branch --show-current
git diff --stat
git diff --cached --stat
```

Classify:

- staged
- unstaged
- untracked
- user work
- agent-created changes
- blocked or risky state

## Safe Work Mode

Use for implementation, fixes, refactors, docs, and file edits.

- Define target files before editing.
- Keep changes limited to the requested scope.
- Avoid broad formatting and opportunistic cleanup.
- Verify the change before reporting completion.
- Report files changed, commands run, results, repo state, and remaining risks.

## Audit-Only Mode

Use for reviews, analysis, inspection, planning, and risk reports.

- Do not edit files.
- Do not write reports to disk unless explicitly requested.
- Do not stage, unstage, commit, reset, clean, delete, rename, or move files.
- Report findings and recommended next actions only.

## Safe Commit Mode

Use when asked to commit or prepare a commit.

- Inspect full git state first.
- Show staged, unstaged, and untracked files separately.
- Commit only the approved scope.
- Do not run `git add .` or `git add -A` unless the user explicitly approves
  broad staging after seeing the exact file list.
- Use a normal professional commit message.

## Destructive Guard Mode

Use before irreversible or high-risk commands, including `rm -rf`,
`git reset --hard`, `git clean -fd`, branch deletion, history rewrite,
production deployment, package publishing, destructive migrations, and config
overwrites.

Before proceeding:

- Show the exact command.
- Explain the effect.
- State what work or data may be lost.
- Offer a safer alternative when possible.
- Require explicit confirmation that names the command and target.

Vague approvals such as "ok", "sure", "go ahead", or "do it" are not enough.

## Verification And Closure

Every implementation must end with a concise closure report:

- Status
- Changed files
- Verification commands and results
- Repository state
- Risks
- Next action

Do not claim completion without evidence.
