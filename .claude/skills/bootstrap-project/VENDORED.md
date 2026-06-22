# Vendored copy — bootstrap-project

This is a **vendored copy** of the `bootstrap-project` skill, committed into the
kit so it works on any machine without relying on a globally-installed skill.

- **Upstream (source of truth):** `~/.claude/skills/bootstrap-project/`
- **This copy:** `skills/bootstrap-project/` in the kit.

## Anti-drift rule

When you edit the **upstream** skill (`SKILL.md`, `scripts/`, `templates/`),
re-copy the change into this folder so the two stay identical:

```bash
cp -r ~/.claude/skills/bootstrap-project/. skills/bootstrap-project/
# then remove this VENDORED.md from the diff if you re-copied over it
```

The kit's `operating-layer/mcp.json.example`, `operating-layer/CLAUDE.template.md`,
and `operating-layer/PROJECT_BRIEF.template.md` are mirrors of this skill's
`templates/`; keep those in sync too.

## How a new project uses it

After `bootstrap.sh` lays the kit down, run the `bootstrap-project` skill in the
new repo (it auto-activates, or invoke `/bootstrap-project`). It detects the
stack, installs official design skills, writes a tuned `.claude/settings.json`,
and fills the 7-slot `CLAUDE.md`. See `SKILL.md` for the full procedure.
