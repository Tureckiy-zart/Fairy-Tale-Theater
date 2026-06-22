#!/usr/bin/env bash
# secret-scan.sh — fail if anything that looks like a real secret is staged
# (pre-commit) or present (CI / kit self-check). Heuristic, conservative.
# Usage:
#   security/secret-scan.sh                 # scan tracked + untracked files (CI/self-check)
#   security/secret-scan.sh --staged        # scan only staged content (pre-commit)
set -euo pipefail

MODE="${1:-all}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

# Files to inspect
if [ "$MODE" = "--staged" ]; then
  mapfile -t FILES < <(git diff --cached --name-only --diff-filter=ACM)
else
  mapfile -t FILES < <(git ls-files 2>/dev/null; git ls-files --others --exclude-standard 2>/dev/null)
fi

# Never scan these (binaries / vendored / lockfiles / examples)
EXCLUDE_RE='(^|/)(node_modules|\.git|dist|\.next|__pycache__|\.venv)/|\.lock$|\.lockb$|pnpm-lock\.yaml$|package-lock\.json$|\.env\.example$|secret-scan\.sh$'

# Patterns that indicate a REAL secret (not a placeholder)
# Placeholders like __REPLACE_ME__, <...>, xxxx, example are tolerated.
PATTERNS=(
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'        # private key material
  'sk-ant-[A-Za-z0-9_-]{20,}'                  # Anthropic key
  'sk-[A-Za-z0-9]{32,}'                        # OpenAI-style key
  'AKIA[0-9A-Z]{16}'                           # AWS access key id
  'ghp_[A-Za-z0-9]{36,}'                       # GitHub PAT
  'xox[baprs]-[A-Za-z0-9-]{10,}'               # Slack token
  'mongodb(\+srv)?://[^<\n]*:[^<@\n]+@'        # Mongo URI with inline password
  '[0-9]{6,}:[A-Za-z0-9_-]{30,}'               # Telegram bot token
)

hits=0
for f in "${FILES[@]}"; do
  [ -z "$f" ] && continue
  [[ "$f" =~ $EXCLUDE_RE ]] && continue
  [ -f "$f" ] || continue
  # skip binary
  if grep -Iq . "$f" 2>/dev/null; then :; else continue; fi
  for pat in "${PATTERNS[@]}"; do
    if grep -nEH "$pat" "$f" 2>/dev/null | grep -vE '__REPLACE_ME__|<[^>]+>|EXAMPLE|example|placeholder'; then
      hits=$((hits+1))
    fi
  done
  # any tracked key-material file by extension
  case "$f" in
    *.pem|*.der|*.key|*.p12|*.pfx) echo "$f: key-material file present (never commit)"; hits=$((hits+1));;
  esac
done

if [ "$hits" -gt 0 ]; then
  echo "secret-scan: FAIL — $hits potential secret(s) above. Remove/placeholder them." >&2
  exit 1
fi
echo "secret-scan: OK — no real secrets detected (${#FILES[@]} files scanned)."
