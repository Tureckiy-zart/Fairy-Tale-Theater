#!/usr/bin/env bash
# install_skills.sh — clone github.com/anthropics/skills, copy matching skill
# folders into ./.claude/skills/ of the CURRENT repo. Skips already-present
# skills; never overwrites.
#
# Usage: install_skills.sh <keyword> [keyword...]
#   keywords are matched (token-prefix, case-insensitive) against skill folder names.
#   e.g. install_skills.sh frontend design web ui
#
# Recommended keyword sets by detected stack (see SKILL.md step 3):
#   any frontend / fullstack:   frontend design web
#     -> matches frontend-design, canvas-design, web-artifacts-builder (+ webapp-testing).
#   backend / library / Python: (skip unless design skills requested)
#
# NOTE: github.com/anthropics/skills has NO motion/animation skill, so the keywords
# `motion`/`animation`/`ui` match nothing here and install nothing. `frontend-design`
# already covers motion. The dedicated `motion-dev-animations` is a THIRD-PARTY skill
# installed manually (see SKILL.md step 3 "Animations"). This script only clones SKILLS_REPO.
#
# Env overrides:
#   SKILLS_REPO  (default https://github.com/anthropics/skills)
set -euo pipefail

REPO_URL="${SKILLS_REPO:-https://github.com/anthropics/skills}"
DEST="$(pwd)/.claude/skills"

if [ "$#" -eq 0 ]; then
  echo "ERROR: no keywords given. Usage: install_skills.sh <keyword> [keyword...]" >&2
  exit 2
fi

if ! command -v git >/dev/null 2>&1; then
  echo "ERROR: git not available — cannot clone $REPO_URL" >&2
  exit 3
fi

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

echo "Cloning $REPO_URL (shallow)..."
if ! git clone --depth 1 --quiet "$REPO_URL" "$TMP/skills" 2>"$TMP/err"; then
  echo "ERROR: clone failed (no network?):" >&2
  sed 's/^/  /' "$TMP/err" >&2
  exit 4
fi

mkdir -p "$DEST"

# Find every skill folder (dir containing SKILL.md) in the clone.
mapfile -t skill_dirs < <(find "$TMP/skills" -name SKILL.md -printf '%h\n' | sort -u)

echo "Found ${#skill_dirs[@]} skills in repo. Matching keywords: $*"
echo

copied=0 skipped=0 nomatch=0
for d in "${skill_dirs[@]}"; do
  name="$(basename "$d")"
  # Tokenise the folder name on hyphens/underscores, lowercase.
  # A keyword matches a skill if any TOKEN starts with the keyword.
  # Token-prefix (not substring-anywhere) so "ui" doesn't match "b-ui-lder".
  ltokens="$(printf '%s' "$name" | tr '[:upper:]_' '[:lower:]-' | tr '-' '\n')"
  match=0
  for kw in "$@"; do
    lkw="$(printf '%s' "$kw" | tr '[:upper:]' '[:lower:]')"
    while IFS= read -r tok; do
      case "$tok" in "$lkw"*) match=1; break;; esac
    done <<< "$ltokens"
    [ "$match" = 1 ] && break
  done
  [ "$match" = 1 ] || { nomatch=$((nomatch+1)); continue; }

  if [ -e "$DEST/$name" ]; then
    echo "SKIP   $name (already present in repo)"
    skipped=$((skipped+1))
    continue
  fi
  cp -r "$d" "$DEST/$name"
  echo "COPIED $name -> .claude/skills/$name"
  copied=$((copied+1))
done

echo
echo "Done: $copied copied, $skipped skipped (already present), $nomatch unmatched."
if [ "$copied" = 0 ] && [ "$skipped" = 0 ]; then
  echo "NOTE: no skill folder name matched your keywords. Re-run with broader" >&2
  echo "      keywords, or list available skills:" >&2
  printf '  %s\n' "${skill_dirs[@]##*/}" | sort -u >&2
fi
