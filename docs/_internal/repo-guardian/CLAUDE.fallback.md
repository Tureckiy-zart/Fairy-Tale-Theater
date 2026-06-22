# CLAUDE.md — Repo Guardian

## Canonical Skill

If `skills/repo-guardian/SKILL.md` exists in this repository or your Claude
Code skill path, read it as the canonical instruction set and follow it instead
of this file.

If the canonical skill is not available, follow this file as a standalone
fallback safety protocol.

This file does not duplicate the full skill. It provides enough behavior for
safe repository work when the full skill is not present.

---

## Core Principle

Guard repository state before speed.

- Never treat the repository as clean unless you checked.
- Never treat all changes as yours unless you created them in this task.
- Never run destructive commands without explicit user confirmation.
- Never claim completion without evidence.

---

## Required Pre-Flight

Run before editing, committing, cleaning, or any risky operation:

```bash
git status --short
git branch --show-current
git diff --stat
git diff --cached --stat
```

Classify what you see:

- **clean** — no changes
- **own_changes** — changes you created in this task
- **user_wip** — existing changes not created by you
- **mixed_scope** — changes from multiple unrelated tasks
- **staged_ready** — staged content matches requested scope
- **staged_mixed** — staged content includes unrelated files
- **risky** — destructive or irreversible operation possible
- **blocked** — cannot continue safely without user decision

Never blur staged and unstaged.

---

## Work Modes

### Safe Work Mode

Use when implementing, fixing, editing, refactoring, or updating.

- Inspect repository state before editing.
- Do not modify unrelated files.
- Do not auto-format broad areas unless explicitly requested.
- Do not mix your changes with existing user work.
- Stop and report if the task requires touching files already modified by
  someone else.

### Audit-Only Mode

Use when inspecting, reviewing, researching, analyzing, auditing, or planning
without implementation.

- Do not edit files.
- Do not stage, unstage, commit, reset, clean, or move files.
- Do not run formatters.
- Read, inspect, and report only.
- If an edit seems necessary, recommend it but do not perform it.

### Safe Commit Mode

Use when committing, preparing a commit, or closing work.

- Inspect full git state before commit.
- Show what is staged, unstaged, and untracked.
- Confirm which files will be included.
- Never include unrelated files.
- Never stage everything blindly (`git add .` or `git add -A`).
- Never commit secrets, env files, logs, caches, or personal files.
- If staged changes include mixed scopes, stop and ask before committing.
- Stage files explicitly by path.

### Destructive Guard Mode

Use before any destructive or irreversible operation including:

`rm -rf`, `git reset --hard`, `git clean -fd`, `git clean -fdx`,
`git checkout -- <file>`, `git restore`, `git push --force`, deleting branches,
dropping tables, destructive migrations, overwriting production config.

Before proceeding:

1. Explain the irreversible effect in plain language.
2. Show the exact command.
3. State what data or work may be lost.
4. Offer a safer alternative when possible.
5. Require explicit user confirmation that names the command and target.

Invalid confirmations: "ok", "sure", "go ahead", "do it", "fine".

Valid confirmation example: "Yes, run `git reset --hard` on this branch."

---

## Ownership Rules

A file is yours only if you created or modified it during the current task.

Treat a file as user work if:

- it was modified before you started
- it is staged before you started
- it is untracked before you started
- ownership is unclear

Do not overwrite user work. Do not clean up unrelated files. Do not fix
opportunistic issues outside scope unless explicitly asked.

---

## Secrets and Sensitive Files

Never commit or print secrets. Treat as sensitive by default:

`.env`, `.env.*`, private keys, certificates, tokens, credentials, production
config, database dumps, logs with tokens, cloud provider credentials.

If such files appear in git status, warn and exclude them unless the user gives
a specific safe reason.

---

## Verification and Closure

Every implementation must end with evidence. Report:

```text
Status: DONE | PARTIAL | BLOCKED

Changed:
- <file>: <what changed>

Verification:
- <command>: PASS | FAIL | NOT RUN — <reason>

Repository state:
- staged: <summary>
- unstaged: <summary>
- untracked: <summary>
- user work preserved: yes / no / unknown

Risks:
- <remaining risk or none>

Next:
- <next action or none>
```

Do not claim "done" unless you can state files changed, commands run, results,
and risks remaining.

---

## Stop Conditions

Stop immediately and ask when:

- a destructive command is needed
- unrelated user work blocks the task
- staged changes are mixed
- ownership is unclear
- secrets may be exposed
- production or migration environment is involved
- verification fails and the next action is risky

---

## Prompt Examples

```text
Use repo-guardian Safe Work Mode. Inspect repository state before editing.
Preserve existing user work and verify before reporting completion.
```

```text
Use repo-guardian Audit-Only Mode. Inspect and report only. Do not edit files.
```

```text
Use repo-guardian Safe Commit Mode. Commit only the requested scope.
Do not run git add .
```

```text
Use repo-guardian Destructive Guard Mode. Show the exact command and effect
before any destructive action.
```

---

## Non-Goals

Repo Guardian is not a formatter, linter, test runner, security scanner, or
replacement for code review, backups, or branch protection.

It is an agent behavior safety protocol for repository work.
