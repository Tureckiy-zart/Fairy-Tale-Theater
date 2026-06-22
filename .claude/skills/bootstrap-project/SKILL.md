---
name: bootstrap-project
description: >
  Bootstraps a new (or existing) repository for high-quality Claude Code work:
  auto-detects the tech stack, installs the relevant official design/frontend
  skills from github.com/anthropics/skills into the repo, writes a tuned
  .claude/settings.json (permissions + hooks) and a starter CLAUDE.md.
  Asks clarifying questions when the stack or intent is ambiguous instead of
  guessing. Use when the user says "bootstrap this repo", "set up this project
  for Claude", "развернуть скилы", "настрой проект", "set up frontend skills",
  or invokes /bootstrap-project in a fresh repository.
---

# bootstrap-project

A meta-skill. Its job is to take the current repository from "nothing
configured" to "properly set up for Claude Code work" the way the official docs
and dev-community consensus recommend — in one invocation, adapting to whatever
stack the repo actually is.

You (Claude) DRIVE this. The helper scripts are deterministic plumbing; the
judgement (what stack, which skills, which permissions) is yours. When the
repository's nature is genuinely ambiguous, ASK — do not guess.

## Hard rules

- Operate on the **current working directory's repository only**. Never touch
  `$HOME/.claude/` or other repos.
- **Never overwrite** an existing `CLAUDE.md`, `.claude/settings.json`, or an
  already-installed skill without first showing the user what exists and
  getting an explicit go-ahead. Default to *merge/extend*, not clobber.
- Everything you write goes under the repo: `./.claude/` and `./CLAUDE.md`.
- If the repo is not a git repository, say so and offer `git init` before
  writing `.claude/` (so the config can be committed).
- No secrets in `settings.json`. Permissions allow *commands*, not credentials.

## Procedure

### 0. Project brief — ask what we're building (compressed Phase −1)
Before detecting anything, take ~30 seconds to learn what this project IS and to
separate **what the operator knows** from **what only the client / business owner
knows**. Ask a short, skippable, **two-level** survey. This activates Phase −1 at
the start instead of leaving discovery as a "don't forget".

**0a. First, ask the client's communication language.**
Before any other question: *"In what language should we talk to the client / write
the client-facing questionnaire?"* Free-form answer; **default = the operator's own
language** (the language this conversation is in). Record it as `CLIENT_LANG`.
Everything addressed to the client — `CLIENT_QUESTIONS.md` and any owner-facing
text — is written in `CLIENT_LANG`. **Never hardcode a language**; if the operator
skips, fall back to the conversation's language.

**0b. Two-level brief survey (operator answers; gaps become client questions).**
Ask the operator 3–4 brief questions. Route each answer by **who actually knows it**:

- **Operator answers it** → the answer goes into `PROJECT_BRIEF.md`.
- **Operator says "I don't know" / "that's the client's" / "ask the client"** → do
  **NOT** write "(not specified)". **Reformulate** the question into a warm, human,
  owner-facing form, in `CLIENT_LANG`, and append it to **`CLIENT_QUESTIONS.md`**
  at the repo root (a question *for the owner*, not a dead internal blank).
- **Operator skips entirely / empty / "skip"** (question not relevant, or they don't
  want the survey) → record the default or "(not specified)" in `PROJECT_BRIEF.md`
  and move on. (This is what keeps the survey non-blocking.)

The questions are a compressed version of `CLIENT_INTAKE_QUESTIONNAIRE` mode B
(`docs/discovery/`), not invented — keep them aligned with it:

1. **What are we building, in one phrase?** → brief "What we're building".
2. **Who is it for / what pain does it solve?** → brief "Who it's for / pain".
3. **Discovery mode?** own brand (inside-out) / someone else's business
   (outside-in) / skip → brief "Discovery mode".
4. **Baseline — JS or Python?** (only if not obvious from the repo / not already
   passed in) → informs detection in step 1. *(Operator/repo-only — never route
   this one to the client.)*

**Survey rules (non-negotiable — do NOT make this a nag):**
- **Skippable, one-shot, non-blocking.** Ask each question at most once. Never
  re-prompt, never loop, never insist on a non-empty answer — write the placeholder
  (or route to the client) and continue.
- **Two-level, not flat.** A gap is never a dead "(not specified)" when the operator
  told you the *client* holds the answer — it becomes a real question in
  `CLIENT_QUESTIONS.md`.
- **No research here.** This only *collects a brief + a client-question list*. Actual
  discovery research is Phase −1 proper (`docs/discovery/`) — do not start it here.

You may ask 0a + the four in one batched AskUserQuestion (each with a clear "skip"
*and* "ask the client" path) or inline; either way a single pass.

Then write the two repo-root files:

- **`PROJECT_BRIEF.md`** from `templates/PROJECT_BRIEF.md`: pre-fill answered
  fields, leave the rest as `<placeholders>`. **Merge-not-clobber:** if it already
  exists with content, do NOT overwrite a filled brief — leave it and just report.
- **`CLIENT_QUESTIONS.md`** from `templates/CLIENT_QUESTIONS.md`, **rendered in
  `CLIENT_LANG`**. It carries (a) every question the operator routed to the client
  above, plus (b) the standard client packet (pain, numbers, brand voice) and (c)
  the **site/design-vision block** — so the operator has one ready-to-send list for
  the owner, not just the gaps. **Merge-not-clobber:** if `CLIENT_QUESTIONS.md`
  already exists with answers, do NOT overwrite it; add only genuinely new questions
  (or just report). The English template is the canonical source — translate each
  question into `CLIENT_LANG` as you write the file.

The brief is the compressed entry to Phase −1; for the full method (questionnaire
+ outside-in / inside-out playbooks) point at `docs/discovery/`. **End Step 0 with
the explicit discovery hand-off** (see Step 7) — never leave the operator on a bare
"clarify it in discovery".

### 1. Survey the repo
Run the stack detector and read its report:

```bash
bash "$CLAUDE_SKILL_DIR/scripts/detect_stack.sh"
```

(If `$CLAUDE_SKILL_DIR` is unset, the script lives next to this file under
`scripts/`.) Also glance at the repo yourself: `package.json`, `pyproject.toml`,
`go.mod`, `Cargo.toml`, framework config files, existing `.claude/` and
`CLAUDE.md`. Note what already exists so step 5 merges instead of clobbering.

### 2. Decide stack + intent — ask if unclear
From the detector + your read, classify the project: **frontend**,
**backend/API**, **fullstack**, **library/CLI**, **data/Python**, **mixed**, or
**unknown**. Pick the skill set accordingly.

If ANY of these is ambiguous, use AskUserQuestion (do not guess):
- The detector found no clear stack, or found several competing ones.
- It's a frontend repo but the framework (React/Next/Vue/Svelte/etc.) or
  styling system (Tailwind/CSS-modules/styled) is unclear.
- It's unclear whether the user wants design skills at all (e.g. backend repo).
- There's an existing CLAUDE.md/settings.json and you're unsure whether to
  extend or leave it.

Phrase questions concretely, offer a recommended option first. Only ask what you
genuinely can't infer — don't interrogate when the repo is obvious.

### 3. Install skills from GitHub
For frontend / fullstack repos, install the official design skills. The
installer shallow-clones `github.com/anthropics/skills`, finds skill folders
(dirs containing `SKILL.md`) matching the given keywords, and copies them into
`./.claude/skills/`:

```bash
bash "$CLAUDE_SKILL_DIR/scripts/install_skills.sh" frontend design web
```

- Pass keywords matched against skill folder names (case-insensitive).
- **Recommended keyword set: `frontend design web`.** In `github.com/anthropics/skills`
  this matches the real design skills — `frontend-design`, `canvas-design`,
  `web-artifacts-builder` (and `webapp-testing`). Use the same set for any frontend
  or fullstack repo; for backend/library/Python skip this step unless the user asks
  for design skills.
- **Animations — read the honest note below before adding `motion`/`animation`.**
  Those keywords match **no** folder in `anthropics/skills`, so they install nothing.
  The `frontend-design` skill (installed by the set above) already carries motion
  guidance; a dedicated Motion.dev skill is third-party and manual (see below).
- The script SKIPS skills already present in `./.claude/skills/` and prints what
  it copied vs skipped. Relay that to the user; never silently overwrite.
- If the clone fails (no network), say so plainly and continue with
  settings/CLAUDE.md — do not fabricate an install.
- For non-frontend repos, skip this step unless the user asked for design skills.

**Animations — the honest state (this was broken before):**
`anthropics/skills` ships **no** dedicated motion/animation skill. The keywords
`motion`/`animation`/`ui` match nothing there, so the old "auto-install
`motion-dev-animations`" never actually worked — don't promise it. Two correct paths:
- **Default — do nothing extra.** The installed **`frontend-design`** skill already
  covers deliberate motion ("leverage motion deliberately: page-load sequence,
  scroll-triggered reveal, hover micro-interactions…"). Good enough for most repos.
- **Dedicated Motion.dev codegen (opt-in, third-party).** For springs, scroll
  effects, gesture/drag, 120fps GPU animations, `motion-dev-animations` is a
  **third-party** skill (NOT Anthropic-official), at
  `github.com/199-biotechnologies/motion-dev-animations-skill`. Install it manually
  **only when the operator asks**, and tell them it's third-party:
  ```bash
  git clone https://github.com/199-biotechnologies/motion-dev-animations-skill \
    .claude/skills/motion-dev-animations    # repo-local; or ~/.claude/skills for global
  ```
  Never silently pull a non-Anthropic skill into the user's repo — surface it and
  let them decide.

### 4. Write `.claude/settings.json` (permissions + hooks)
Generate it tuned to the detected stack — don't paste a generic blob. Base it on
official-docs recommendations:
- **permissions.allow**: the read-only / safe commands this stack runs
  constantly, so the user stops getting prompted. Frontend → `npm`/`pnpm`/`yarn`
  scripts, `npx tsc`, eslint, prettier, vitest/jest. Python → `pytest`, `ruff`,
  `mypy`, `python -m ...`. Always include common read-only git/ls/cat-class
  ops. Keep it tight; never allow destructive or network-exfil commands by
  default.
- **hooks**: a `PostToolUse` hook on Edit|Write that runs the stack's formatter
  (prettier / ruff format) so edits stay clean — only if that tool is actually
  present in the repo. Don't add hooks for tools the repo doesn't have.
- If `.claude/settings.json` already exists, MERGE: add missing allow-entries
  and hooks, never drop the user's existing ones. Show a diff-style summary.

### 5. Write a starter `CLAUDE.md` (all 7 slots)
Only if none exists (merge-not-clobber: if a `CLAUDE.md` already exists, leave it
and just report). Start from `templates/CLAUDE.md` in this skill and fill every
`<...>` placeholder with real, observed data — never invent rules the repo
doesn't follow. The template carries the **7-slot invariant** (HERMES_SKILLS
_AUDIT_002 §7); all seven MUST be present:

1. What this file is (operational helper, not canon; conflict → stricter canon wins)
2. Language policy
3. Read-before-work list
4. Stack / reality one-liner (package manager, framework, what it is NOT)
5. Commands block (real install/dev/build/typecheck/test + the verify gate)
6. **Negative scope fences** — fill from detection: sibling repos found next to
   this one (`../<name>`), monorepo root, build outputs (`dist/`, `.next/`,
   `.tsbuildinfo`), and "do not fix pre-existing errors." These prevent
   cross-project rule bleed and were previously written by hand.
7. **Task-closure workflow** — fill from detection: the verify gate from slot 4 +
   the severity vocab `BLOCKER/HIGH/MEDIUM/LOW/NOTE` + where the progress trail
   lives. Reference, don't duplicate, any MEMORY/progress file.

Slots 1–5 come from `detect_stack.sh`; slots 6–7 are the formerly-manual additions
this skill now emits.

### 6. Write an MCP config template (`.mcp.json.example`)
Only if no `.mcp.json` or `.mcp.json.example` exists (merge-not-clobber). Copy
`templates/mcp.json.example` to the repo root as `.mcp.json.example` and copy
`templates/MCP.README.md` alongside (e.g. `docs/MCP.README.md`). This is a
**secret-safe template**, not an active config:

- Emit `.mcp.json.example` (NOT `.mcp.json`) so Claude Code does not auto-load a
  placeholder. The user copies it to `.mcp.json` and fills real servers.
- Format (established from `~/.claude.json` → `mcpServers`): each server keyed by
  name; `stdio` = `{type,command,args,env}`, remote = `{type:"http"|"sse",url,headers}`.
- **Never inline a secret.** All keys are `${ENV_VAR}` references. Tell the user
  the SEO connector (Semrush/Ahrefs — their choice) drops straight into this shape.

### 7. Report
Summarize concretely: the brief collected and whether `PROJECT_BRIEF.md` and
`CLIENT_QUESTIONS.md` were written (or left as-is because they already had
content), stack detected, skills installed (copied vs skipped), settings.json
changes, whether the 7-slot `CLAUDE.md` was created, and whether
`.mcp.json.example` was emitted. Remind the user to
`git add .claude/ CLAUDE.md .mcp.json.example` if they want the team to share the
setup, to copy `.mcp.json.example` → `.mcp.json` and fill real servers when they
need MCP, and that installed skills auto-activate by their description on the next
relevant task.

**Then give the explicit Phase −1 hand-off (do NOT leave discovery implicit):**

> **Next step — discovery (Phase −1):**
> - The brief is in `PROJECT_BRIEF.md`. **`CLIENT_QUESTIONS.md`** (repo root, in
>   `CLIENT_LANG`) holds the questions only the owner can answer — incl. the
>   site/design-vision block. **Send that file to the business owner.**
> - When answers come back, work in **`docs/discovery/`**: start with
>   `INTAKE_PLAYBOOKS.md` — pick **mode B (inside-out)** if the client is on
>   contact, **mode A (outside-in)** if cold — and the full
>   `CLIENT_INTAKE_QUESTIONNAIRE.md`.
> - **Minimal anchor to start is just city + business type.** A missing
>   website / Google Maps / socials is a *finding*, not a blocker — it goes into
>   `CLIENT_QUESTIONS.md` and the report (see the playbook's degradation note).

State this as the literal next action, with the file names — that is the on-ramp
the operator follows out of bootstrap into real discovery work.

## Notes
- Skills already work globally by auto-activation; copying them into the repo is
  for *committing them to the project* so collaborators get the same setup.
- This skill is idempotent: re-running it re-detects, skips what's present, and
  only fills gaps. **All emissions are merge-not-clobber** — `PROJECT_BRIEF.md`,
  `CLIENT_QUESTIONS.md`, the 7-slot `CLAUDE.md`, `.mcp.json.example`, settings, and
  installed skills are only written when absent; an existing one (incl. a filled-in
  brief or a client-questions file with answers) is never overwritten.
- The Step 0 survey is **skippable, one-shot, non-blocking and two-level**: the
  operator answers what they know (→ `PROJECT_BRIEF.md`); anything they flag as
  "the client's" is reformulated into an owner-facing question (→
  `CLIENT_QUESTIONS.md`, in `CLIENT_LANG`) rather than dying as "(not specified)".
  A plain empty answer still just becomes a placeholder. It collects a brief + a
  client-question list; it does not run discovery.
- New in this version: a **two-level Step 0** that (a) asks the client's
  communication language first (`CLIENT_LANG`, never hardcoded), (b) splits brief
  questions operator-vs-client and emits a ready-to-send **`CLIENT_QUESTIONS.md`**
  (incl. a **site/design-vision** block) in that language, and (c) ends with an
  explicit discovery hand-off. Still emits all **7 CLAUDE.md slots** (negative
  scope fences + closure workflow) and a secret-safe `.mcp.json.example`
  (`${ENV_VAR}` refs, zero inline keys). **Animations corrected:** `anthropics/skills`
  has no motion skill — `frontend-design` covers motion; the dedicated
  `motion-dev-animations` is third-party / manual-install (see step 3), not an
  auto-install. Templates live in `templates/`.
