# Security defaults

Baked in from day one — `repo-guardian` + these defaults apply from the first
commit, not retrofitted later.

## Secrets

- `.env*` are git-ignored; only `.env.example` (placeholders) is tracked. See
  [`.env.example`](.env.example).
- Read env **lazily** at call time — see [`lazy-env-reader.md`](lazy-env-reader.md).
- **Never commit key material** (`*.pem`, `*.der`, `*.key`, `*.p12`,
  attestation private files). The `secret-scan` hook blocks it.
  > Lesson (real): a sibling repo had `attestation-private.{pem,der,b64}`
  > committed to git history. `.env` was correctly ignored, but the private keys
  > were not. Rotation + history-rewrite is then an operator decision. Don't let
  > it happen — the pre-commit scan exists for exactly this.
- A secret that ever touched a screenshot/chat/commit is compromised → revoke and
  rotate everywhere; redeploy.

## Secret scanning

[`secret-scan.sh`](secret-scan.sh) — heuristic scanner for private keys, common
API-key shapes, inline-password DB URIs, bot tokens. Two modes:

```bash
security/secret-scan.sh            # whole repo (CI / kit self-check)
security/secret-scan.sh --staged   # staged content only (pre-commit)
```

Install the pre-commit hook:

```bash
git config core.hooksPath security/hooks   # or copy hooks/pre-commit into .git/hooks/
```

## Web headers (frontend / API baselines)

Set a strict **Content-Security-Policy** and **HSTS** at the edge/server:

- `Content-Security-Policy: default-src 'self'; ...` — tighten per app; avoid
  `unsafe-inline`/`unsafe-eval` where possible.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- Plus `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

The JS baseline wires these in `next.config` headers; the Python baseline via
middleware. Keep them on from the first deploy.

## Network / deploy

- No static outbound IP on serverless → use the provider↔DB integration or a
  permanent `0.0.0.0/0` allow + a strong generated DB password (never a temporary
  allowlist entry).
- Any env change applies **only after redeploy**.
