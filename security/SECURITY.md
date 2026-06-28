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
middleware. Keep them on from the first deploy. Also set `form-action 'self'`,
`frame-src 'none'`, `object-src 'none'`, and a `Permissions-Policy` denying unused
features (camera/mic/geolocation/payment/usb).

> **`script-src 'unsafe-inline'` is kept on purpose.** Dropping it needs a nonce-based
> CSP via middleware, which forces every page into dynamic rendering and forfeits
> static generation. The XSS surface is minimal (no untrusted input is reflected as
> HTML — JSON-LD is escaped, no `dangerouslySetInnerHTML`), so the tradeoff isn't
> worth it here. Revisit if the app starts reflecting user input into markup.

## Lead pipeline (`POST /api/lead`)

The only stateful, abuse-exposed, PII-collecting surface. Model:

- **Honest acceptance.** `ok:true` is returned **only** after the lead is durably
  stored **or** the owner email webhook delivered (`lib/notify.deliverLead`). The disk
  store (`LEAD_STORE_DIR`, default git-ignored `.leads/`) is the primary recovery
  record; on a read-only/serverless filesystem it falls back to a temp dir and the
  delivered email is the record of last resort. If **both** fail we return 502 — never
  a fake success.
- **Honeypot.** A hidden `company` field; if filled, the route returns a decoy id
  **without** persisting or notifying (no inbox spam, no information leak).
- **Rate limiting is best-effort.** An in-memory per-IP token bucket (5/60s) that is
  **per-instance** (resets on cold start, not shared across serverless instances) and
  relies on the client IP. The **first** `X-Forwarded-For` value is client-controlled
  and spoofable, so the limiter trusts the **last** XFF entry (proxy-appended) by
  default, or `LEAD_TRUSTED_IP_HEADER` when set. For a hard limit, front the endpoint
  with an **edge/WAF/provider rate limiter** — the in-app one is a backstop only.
- **No PII in logs.** Failures are logged with the inquiry id + channel status only —
  never names, phones, emails, or message bodies.
- **PII never committed.** `.leads/` is git-ignored and `scripts/governance.mjs` fails
  the build if any `.leads/` file is tracked.

## CI gate

`pnpm run ci:exact` runs lint → typecheck → governance → **secret-scan** → build.
`secret-scan` (whole-repo mode) is on the gate, so a committed key/token/bot-token
fails the merge, not just the optional pre-commit hook.

## Network / deploy

- No static outbound IP on serverless → use the provider↔DB integration or a
  permanent `0.0.0.0/0` allow + a strong generated DB password (never a temporary
  allowlist entry).
- Any env change applies **only after redeploy**.
