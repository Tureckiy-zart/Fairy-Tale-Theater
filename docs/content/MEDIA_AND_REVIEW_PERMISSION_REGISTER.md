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
| `hero-girl-curtain.jpg` | **Home hero** | Owner's signature headline photo, from the theatre's **own previous site** (`magic-castle-puppet-theater.com` = our legacy domain, **NOT a competitor**). Owner-confirmed 2026-06-28 — **CLEARED**. |
| `troupe-fairy-tale-theater.jpg` | Services flagship card (+ About troupe shot) | operator-supplied troupe photo — **CLEARED**. |
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

> **Correction (2026-06-28):** an earlier note mislabeled `magic-castle-puppet-theater.com`
> as a "competitor." It is **our own legacy domain** (former "Magic Castle" brand →
> rebranded to Miss Lana's Fairy-Tale Theatre). Assets from it are the owner's own,
> not a competitor's. `hero-girl-curtain.jpg` is therefore CLEARED and back in the Home
> hero (see table above). The `quarantine/` items below stay out only because their
> exact rights/provenance are unverified — not because they are "competitor" assets.

| Asset | Reason |
|---|---|
| `quarantine/COMPETITOR-magic-castle-morozko-poster.jpg` | A show **poster** with unverified rights — kept out of `public/` pending owner confirmation. (Filename's "COMPETITOR" prefix predates the correction above; rename/move back if the owner confirms it's ours and cleared.) |
| `quarantine/scraped-tilda-assets/*` | scraped Tilda assets, provenance/rights unverified |

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
2. (Optional) supply a higher-resolution original of `hero-girl-curtain.jpg` if one
   exists — the current file is a crop from our old site (1008×756), fine for now.
3. Re-confirm no published frame shows an identifiable child without consent.
4. Collect ≥5 real reviews with permission → wire a trust block + Review schema.
