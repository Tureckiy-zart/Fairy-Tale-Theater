# Media & Review Permission Register

> `STABILIZE_MISS_LANA_PRELAUNCH_001` (2026-06-27). Every public trust asset, with
> source + permission status. **No identifiable child media without consent; no
> competitor assets; no invented reviews.** Update this whenever media changes.

## Status legend
- **CLEARED** — operator-supplied, safe to publish.
- **REVIEW** — provenance/permission not fully documented; re-confirm with owner.
- **REMOVED** — was/would be a competitor or unverified asset; not on the site.

## Published images (referenced in code)

| Asset | Where | Source / status |
|---|---|---|
| `troupe-fairy-tale-theater.jpg` | **Home hero** (new), Services flagship card | operator-supplied troupe photo — **CLEARED**. Replaced the competitor-sourced hero at launch. |
| `miss-lana-portrait.jpg` | PersonaIntro | operator-supplied director portrait — **CLEARED** |
| `miss-lana-friends.jpg` | Characters hero, Friends card | operator-supplied (bee performer) — **CLEARED** |
| `birthday-party.jpg` | Birthdays hero + card | operator-supplied — **CLEARED** |
| `school-assembly.jpg` | School Shows hero + card | operator-supplied (web copy of MPO original) — **CLEARED** |
| `gallery/shows/*`, `gallery/troupe/*`, `gallery/children/*` | Gallery + teasers | curated on-brand subset of the operator's raw dump (`public/images/1/`) — **CLEARED**. Puppet-screen/blurry/duplicate frames were curated OUT. |

> **Children's faces:** the curated set favors stage/troupe/general-audience frames.
> Per the owner answer, site media avoids recognizable children's faces (no releases
> taken). If any published frame shows an identifiable child, swap it before scaling
> traffic — flagged as **REVIEW**, not a launch blocker for the owner-approved launch.

## Removed / quarantined (must never be public)

| Asset | Reason |
|---|---|
| `hero-girl-curtain.jpg` | **REMOVED from code** — sourced from competitor site `magic-castle-puppet-theater.com` (IP/brand risk). File remains in `public/images/` unused; candidate for deletion. |
| `quarantine/COMPETITOR-magic-castle-morozko-poster.jpg` | competitor poster — quarantined, never served |
| `quarantine/scraped-tilda-assets/*` | scraped Tilda assets, provenance unverified |

## Per-show photos

Show detail/card photos are mapped working guesses from the gallery (PROGRESS
2026-06-26). They are operator-owned (**CLEARED** for use) but the **exact
photo↔show pairing** is owner-to-confirm. Cinderella & The Gingerbread Man
intentionally show the "photo pending" placeholder (no suitable cleared frame yet).

## Reviews

| Item | Status |
|---|---|
| Verified reviews (≥5 target) | **NOT PUBLISHED** — none supplied with source/permission. Owner decision: launch without them ("отзывы пока не важны"). No review block, no Review schema on the site → nothing fabricated. Add a trust block + Review schema only when real, permissioned reviews arrive. |

## Follow-ups (before scaling traffic)

1. Owner confirms photo↔show pairings; supply per-show photos for the 2 placeholders.
2. Delete the unused competitor `hero-girl-curtain.jpg` from `public/images/`.
3. Re-confirm no published frame shows an identifiable child without consent.
4. Collect ≥5 real reviews with permission → wire a trust block + Review schema.
