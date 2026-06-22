#!/usr/bin/env bash
# detect_stack.sh — inspect the current repo and print a stack report.
# Read-only: touches nothing, only reports what it finds.
set -euo pipefail

ROOT="$(pwd)"
echo "# Stack report for: $ROOT"
echo

have() { [ -e "$ROOT/$1" ]; }
hit()  { printf '  - %s\n' "$1"; }

# --- git ---
if [ -d "$ROOT/.git" ]; then
  echo "git: yes"
else
  echo "git: NO (offer 'git init' before writing .claude/)"
fi
echo

# --- existing Claude config ---
echo "existing Claude config:"
have "CLAUDE.md"                && hit "CLAUDE.md present (do NOT clobber)"        || hit "no CLAUDE.md"
have ".claude/settings.json"    && hit ".claude/settings.json present (MERGE)"    || hit "no .claude/settings.json"
if [ -d "$ROOT/.claude/skills" ]; then
  installed="$(find "$ROOT/.claude/skills" -maxdepth 2 -name SKILL.md -printf '%h\n' 2>/dev/null | xargs -r -n1 basename | sort -u | paste -sd, -)"
  hit "installed skills: ${installed:-<none>}"
else
  hit "no .claude/skills/"
fi
echo

# --- language / package managers ---
echo "languages & managers:"
have "package.json"   && hit "Node.js (package.json)"
have "pnpm-lock.yaml" && hit "pnpm"
have "yarn.lock"      && hit "yarn"
have "package-lock.json" && hit "npm"
have "bun.lockb"      && hit "bun"
have "pyproject.toml" && hit "Python (pyproject.toml)"
have "requirements.txt" && hit "Python (requirements.txt)"
have "go.mod"         && hit "Go (go.mod)"
have "Cargo.toml"     && hit "Rust (Cargo.toml)"
have "Gemfile"        && hit "Ruby (Gemfile)"
have "composer.json"  && hit "PHP (composer.json)"
echo

# --- frontend frameworks (parse package.json deps if jq or node available) ---
echo "frontend signals:"
fe=0
if have "package.json"; then
  deps=""
  if command -v node >/dev/null 2>&1; then
    deps="$(node -e 'try{const p=require(process.cwd()+"/package.json");console.log(Object.keys({...p.dependencies,...p.devDependencies}).join("\n"))}catch(e){}' 2>/dev/null || true)"
  elif command -v jq >/dev/null 2>&1; then
    deps="$(jq -r '(.dependencies//{})+(.devDependencies//{})|keys[]' "$ROOT/package.json" 2>/dev/null || true)"
  else
    deps="$(grep -oE '"(react|next|vue|svelte|@angular/core|solid-js|tailwindcss|vite|astro|remix)"' "$ROOT/package.json" 2>/dev/null | tr -d '"' || true)"
  fi
  for fw in react next vue svelte "@angular/core" solid-js astro remix "@remix-run/react"; do
    if printf '%s\n' "$deps" | grep -qiE "^${fw}$"; then hit "framework: $fw"; fe=1; fi
  done
  for st in tailwindcss "styled-components" "@emotion/react" sass; do
    if printf '%s\n' "$deps" | grep -qiE "^${st}$"; then hit "styling: $st"; fe=1; fi
  done
  for bt in vite webpack "@vitejs/plugin-react" esbuild; do
    if printf '%s\n' "$deps" | grep -qiE "^${bt}$"; then hit "bundler: $bt"; fi
  done
fi
# file-based fallback
ls "$ROOT"/*.html >/dev/null 2>&1 && { hit "html files at root"; fe=1; }
[ -d "$ROOT/src/components" ] && { hit "src/components/ dir"; fe=1; }
[ "$fe" = 0 ] && hit "none detected"
echo

# --- test / lint / format tooling present ---
echo "tooling present:"
have "package.json" && grep -qE '"(test|lint|format|build)"' "$ROOT/package.json" 2>/dev/null && hit "npm scripts: $(grep -oE '"(test|lint|format|build|dev|typecheck)"' "$ROOT/package.json" | tr -d '"' | sort -u | paste -sd, -)"
have ".eslintrc"        && hit "eslint config"
ls "$ROOT"/.eslintrc* >/dev/null 2>&1 && hit "eslint config"
ls "$ROOT"/.prettierrc* >/dev/null 2>&1 && hit "prettier config"
have "ruff.toml"        && hit "ruff"
grep -q "ruff" "$ROOT/pyproject.toml" 2>/dev/null && hit "ruff (pyproject)"
grep -q "mypy" "$ROOT/pyproject.toml" 2>/dev/null && hit "mypy (pyproject)"
grep -q "pytest" "$ROOT/pyproject.toml" 2>/dev/null && hit "pytest (pyproject)"
echo

echo "# end report"
