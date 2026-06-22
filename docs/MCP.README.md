# MCP config template

`mcp.json.example` is a **secret-safe template** for project-scoped MCP servers.
It is emitted as `.mcp.json.example` (not `.mcp.json`) so Claude Code does not
auto-load a placeholder config. To activate: copy it to `.mcp.json`, fill the
real server packages/URLs, and provide the env values **out of band** (never
inline a key).

## Format (established firsthand, not guessed)

Verified against the live machine config at `~/.claude.json` → `mcpServers`
(values redacted): each server is keyed by name with this shape —

- **stdio server** (local process, e.g. an npx-published MCP):
  `{ "type": "stdio", "command": "npx", "args": [...], "env": { "KEY": "..." } }`
  (observed: `mongodb`, `magic`).
- **http / sse connector** (remote, e.g. a hosted SEO connector like Semrush or
  Ahrefs): `{ "type": "http", "url": "https://.../mcp", "headers": { ... } }`
  (remote connectors such as the Google Calendar/Drive ones authenticate
  out-of-band; see `~/.claude/mcp-needs-auth-cache.json`).

## Secret discipline

- **Never inline a key.** Use `${ENV_VAR}` expansion — Claude Code substitutes
  environment variables in `.mcp.json` at load time.
- Keep real values in `.env` (git-ignored) or your shell, referenced as `${VAR}`.
- `.mcp.json` may itself be git-ignored if the team prefers per-developer config;
  `.mcp.json.example` is the tracked, shareable shape.

## For SEO connectors (Semrush / Ahrefs)

The operator picks **one** when needed (separate decision). Drop it into
`.mcp.json` as either a stdio server (if it ships an npx MCP package) or an http
connector (if hosted), with the API key as `${SEMRUSH_API_KEY}` / `${AHREFS_API_KEY}`.
This template is ready to receive it — no code change needed.