# MISS_LANA_REPERTOIRE_OWNER_CANON_RECONCILE_001 — Report

**Date:** 2026-07-01 · **Branch:** `fix/repertoire-owner-canon` · **Type:** repertoire-canon /
public-data repair (P0) · **Status:** CLOSE_WITH_NOTES (PR open, not merged).

## 1. Problem

The previous commit `ab7bdd8` ("remove Donkey's Birthday — repertoire is now 7 shows")
correctly dropped Donkey's Birthday, but **over-corrected** the public repertoire down to
**7** shows. The owner's direct answers confirm **8 active shows** — the 7 that remained
**plus Three Little Pigs** — and also correct two public entities:

- the show published as **"The Winter's Gift / Father Frost"** is really **Two Sisters**;
- the provisional **"The Bunny's Little House"** is the owner-confirmed **The Rabbit House**.

## 2. Evidence matrix (current → owner truth → action)

| Current (pre-fix) | Owner truth | Action taken |
|---|---|---|
| *(absent)* | **Three Little Pigs**, ages 2–8, active, featured | **Added** to `SHOWS` (minimal honest copy — universal tale, no invented staging) |
| `the-bunnys-little-house` "The Bunny's Little House", 2–10 | **The Rabbit House**, ages 2–8, featured | **Renamed** title + slug `the-rabbit-house`; character "Bunny"→"Rabbit"; 301 from old slug |
| `little-red-riding-hood`, 2–10, featured | **Little Red Riding Hood**, ages 3–13, featured | Ages → 3–13; title confirmed; kept featured |
| `the-winters-gift` "The Winter's Gift / Father Frost", 2–10, featured | **Two Sisters**, ages 2–13, featured | **Replaced** by `two-sisters`; season-neutral copy from confirmed title + verified theme; 301 from old slug; retired winter/Santa image |
| `cinderella`, 2–10, featured | **Cinderella / The Magic Slipper**, ages 3–10 | Ages → 3–10; **featured removed** (not an owner priority) |
| `the-magic-castle`, 2–8 | **The Magic Castle**, ages 1–6 | Ages → 1–6 |
| `the-gingerbread-man`, 2–10, featured | **The Gingerbread Man**, ages 2–8 | Ages → 2–8; **featured removed** |
| `suzy-bee`, 2–10 | bee show, ages 2–8; owner source calls it **"Maya the Bee"** | Ages → 2–8; kept public name **Suzy Bee**; internal note added; **no** second card/route |
| `donkeys-birthday` (already removed in `ab7bdd8`) | **not in repertoire** | Left removed (404); **not** restored |

**Result:** `SHOWS` = **8** unique active shows. **Featured** (owner priority order):
Three Little Pigs · The Rabbit House · Little Red Riding Hood · Two Sisters.

## 3. Copy provenance (do-not-invent guardrail)

No legacy/verified source text exists anywhere in the repo for **Three Little Pigs** or
**Two Sisters** (confirmed by a repo-wide search). Therefore:

- **Three Little Pigs** — synopsis/teaser are a **minimal, honest retelling of the
  universally-known public tale** (straw/sticks/brick; the sturdy house holds), with the
  classic values theme (hard work, planning ahead, helping one another). **No** invented
  characters, staging, format, or a specific staged ending — only the "huff and a puff"
  signature that is intrinsic to the tale.
- **Two Sisters** — copy is grounded in the **confirmed title** plus the **verified theme**
  that carried over from the retired entity ("Kindness, hard work and patience over envy").
  The **winter / Father Frost / spirit-of-winter** specifics were **dropped** (they were tied
  to the retired "Winter's Gift" name and are not confirmed for "Two Sisters"). The old
  winter/Santa photo was retired for the same reason (season-neutral title).
- All other shows keep their previously-adapted, owner-review-tracked copy unchanged (only
  ages/featured/one rename).

## 4. Files changed (15)

**Code / data**
- `lib/shows.ts` — 8-show dataset; new Three Little Pigs + Two Sisters; Rabbit House rename;
  per-show owner ages; featured set; header/JSDoc comments rewritten.
- `next.config.ts` — two permanent (301) show-slug redirects (relative destination):
  `/shows/the-winters-gift`→`/shows/two-sisters`, `/shows/the-bunnys-little-house`→`/shows/the-rabbit-house`.
- `lib/site.ts`, `app/shows/page.tsx`, `app/about/page.tsx`, `app/birthdays/page.tsx`,
  `components/blocks/FeaturedShows.tsx` — public count copy `seven`/7 → `eight`/8.
- `tests/e2e/site.spec.ts` — H1 → "eight…"; new/renamed route H1s; +tests: 8 unique cards,
  old-URL 301 redirects, Donkey's Birthday 404, Suzy-Bee-only (Maya 404).

**Canon**
- `docs/core/01_CONTENT_INVENTORY.md` — repertoire table → 8 rows, owner ages, titles
  resolved, featured note, changelog entry.
- `docs/core/OWNER_ANSWERS_DECISION_RECORD.md` — §1 Repertoire row + per-show-ages note;
  §4 "Two show titles" marked RESOLVED (Suzy Bee/Maya kept open).
- `docs/core/PROJECT_BRIEF.md`, `03_SITEMAP_AND_SCOPE.md`, `00_PROJECT_INSTRUCTIONS.md`,
  `05_BUILD_CLAUDE.md`, `SITE_STRUCTURE_AND_BLOCKS.md` — counts 7→8; title open-questions resolved.

**Deliberately NOT touched:** dated content artifacts (`docs/content/FINAL_SHOW_COPY_PACK.md`,
`SHOW_COPY_OWNER_REVIEW.md`), reports/checklists/SEO CSVs, and the `/design` internal preview
("Eight shows" demo, already correct) — they are historical snapshots.

## 5. Verification

- `pnpm run ci:exact` → **exit 0** (lint: 0 errors, 1 pre-existing warning; typecheck OK;
  governance: 0 issues; secret-scan: OK; unit: 111 passed; build: **8 SSG show pages**
  prerendered).
- `pnpm exec playwright test` → **73 passed, 1 failed**. The single failure —
  `lead-api.spec.ts › rate limit … yields at least one 429` — **times out on the base branch
  too** (verified via `git stash`), caused by a live Telegram token returning HTTP 429 that
  slows the notify path; it is **pre-existing, environmental, and unrelated** to this task
  (no changed file is in the `/api/lead → lib/notify.ts` path). The full **Phase-2 shows**
  describe = **16/16 green**, including the 4 new assertions.
- Manual (prod `next start`): all **8** `/shows/{slug}` → 200; `donkeys-birthday`,
  `maya-the-bee` → 404; `the-winters-gift` → **301 → /shows/two-sisters**;
  `the-bunnys-little-house` → **301 → /shows/the-rabbit-house**; `sitemap.xml` lists exactly
  the 8 current show URLs and none of donkey/winters-gift/bunny.
- `git diff --check` clean.

## 6. Success criteria — all met

8 unique shows ✓ · Three Little Pigs present (data + route + hub) ✓ · Two Sisters replaces
Winter's Gift ✓ · Donkey's Birthday absent ✓ · no Suzy Bee/Maya duplicate ✓ · owner ages ✓ ·
featured = owner priority ✓ · counters eight/8 ✓ · build prerenders 8 pages ✓ · sitemap 8
URLs ✓ · permanent redirects for changed URLs ✓ · canon synced ✓ · ci:exact exit 0 ✓ ·
report + code review created ✓ · PR without merge (pending) ✓.

## 7. Notes / risks / follow-ups

- **NOTE (out of scope):** brand-band "Ages 2–10" (`FACTS.ages`, OWNER_ANSWERS §1) is now a
  center, not an envelope — per-show owner ranges span **1–6 … 2–13**. Left unchanged
  (changing brand age canon needs its own owner decision); flagged in OWNER_ANSWERS §1.
- **OPEN (owner):** public name of the bee show — **Suzy Bee** vs **Maya the Bee**. Kept
  Suzy Bee; single card/route only.
- **Pre-existing NOTE:** the `lead-api` rate-limit e2e is environment-flaky (Telegram 429).
- **No private owner transcript** exists in the repo and none was added; no home address /
  private data introduced.
- **Non-goals respected:** no live/puppet/combined filter, no format badges, Donkey not
  restored, no 9th show, no Suzy→Maya public rename, no price/booking/team/geo/design changes,
  no auto-merge.
- **Post-merge:** run `MISS_LANA_SHOW_FORMAT_METADATA_FILTERS_001`.
