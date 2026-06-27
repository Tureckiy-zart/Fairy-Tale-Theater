# Legacy & Alternate Domain Redirect Map

> Built by `FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001` (2026-06-27). **No secrets.**
> Canonical production host: **`https://misslanatheatre.com`** (apex, Theatre spelling).
> All redirects are **permanent 301**, **one hop** (source → final canonical URL).

## Canonical host

| Decision | Value |
|---|---|
| Canonical host | **apex** `misslanatheatre.com` (no `www`) |
| Scheme | HTTPS only (HSTS already set in `next.config.ts`) |
| Why apex | shorter, already the live production domain; `www` folds into it |

## Host-level redirects (→ canonical apex, path preserved)

Implemented in `next.config.ts` `redirects()` via `has: [{ type: "host" }]` — these
fire **only** when the deployment routes the hostname to this Next app (see
"Infrastructure" below).

| From host | Behavior |
|---|---|
| `www.misslanatheatre.com/*` | 301 → `https://misslanatheatre.com/*` |
| `misslanatheater.com/*` (protective, single-spelling) | 301 → `https://misslanatheatre.com/*` |
| `www.misslanatheater.com/*` | 301 → `https://misslanatheatre.com/*` |

## Legacy domain `magic-castle-puppet-theater.com` → closest new route

Explicit map (one hop each). Mapped paths win; everything else falls to the
catch-all → home (this is **not** a blind "everything → home").

| Legacy path (assumed) | New destination |
|---|---|
| `/` and any unmapped path | `https://misslanatheatre.com/` |
| `/about`, `/about-us` | `/about` |
| `/shows`, `/repertoire` | `/shows` |
| `/gallery`, `/photos` | `/gallery` |
| `/prices`, `/pricing` | `/pricing` |
| `/contact`, `/contacts`, `/booking` | `/booking` |
| `/birthday`, `/birthdays` | `/birthdays` |
| `/school`, `/school-shows` | `/school-shows` |

> ⚠️ **The exact legacy URL inventory is assumed, not confirmed.** Before activation,
> crawl/inspect the live `magic-castle-puppet-theater.com` (Screaming Frog, GSC
> "Pages", server logs, or the Wayback Machine) and reconcile this table so each
> real old URL with traffic/links maps to its closest new route. Add any
> high-value old paths that aren't covered above.

## Infrastructure (operator step — launch blocker, NOT done in code)

App-level `redirects()` only run if these hostnames resolve to **this** deployment.
Required at the DNS/registrar/CDN layer:

1. Point `misslanatheater.com` (+ `www`) DNS at the same host/CDN as the canonical
   site, OR configure a registrar/CDN-level 301 to `https://misslanatheatre.com`.
2. Point `magic-castle-puppet-theater.com` (+ `www`) similarly, then the app's
   `LEGACY_PATH_MAP` takes over per-path; OR replicate this map at the CDN edge.
3. Ensure HTTPS certs cover every alternate/legacy host (so the 301 itself is HTTPS,
   not an http→https→canonical chain).
4. **Do not** cancel legacy/protective domain registrations or renewals — they must
   keep resolving to serve the 301s.

## Verification (run after DNS is live — see required `curl` checks)

```
curl -sSIL https://misslanatheatre.com/            # 200, canonical
curl -sSIL https://www.misslanatheatre.com/        # 301 → apex (one hop)
curl -sSIL https://misslanatheater.com/            # 301 → misslanatheatre.com
curl -sSIL https://magic-castle-puppet-theater.com/about   # 301 → /about (one hop)
```

Confirm: single `Location` hop, `301` status, HTTPS throughout, no loops, the
mapped path lands on the closest new route (not blindly home).
