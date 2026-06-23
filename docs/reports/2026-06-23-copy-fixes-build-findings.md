# Build findings — BUILD_MISS_LANA_COPY_FIXES_001

**Date:** 2026-06-23 · **Mode:** fix · **Closure profile:** feature → fix · **Type:** v2-full (published copy + SEO/schema text)
**Source of truth:** `docs/reports/2026-06-23-final-copy.md` (approved final copy) + `docs/reports/2026-06-23-site-copy-audit.md` (findings) + canon (`docs/core/`).

## Summary

Applied the owner-approved final site copy across the MVP page set: removed every visible
`Placeholder copy.` / `Temporary copy.` literal (~49 across ~15 files), set the 8 synopses/teasers
to final, finalized service-line + values blurbs, locked the public price floor at **$350** (table
floor included), published the **30-mile-free / quoted-by-distance** travel rule, named the
**Ukrainian roots explicitly** in the `/about` heritage paragraph (warm, once, country-neutral
elsewhere), fixed the `PersonaIntro` "founder" alt, aligned the Home `<title>` with the H1, and
de-awkwarded the `lib/seo.ts` description. The site stays **noindex**, the preview badge stays, and
imagery stays placeholder — those belong to the launch task (Phase 5).

`pnpm run ci:exact` green · `pnpm test:e2e` green (42 passed).

## What changed

### Data modules
- **`lib/shows.ts`** — 8 synopses + teasers set to the approved final text; titles/slugs unchanged.
  Header comment flipped `TEMPORARY` → `FINAL`.
- **`lib/site.ts`** — `SERVICE_LINES` blurbs (×4) and `VALUES` (×3) finalized; `PRICING_TIERS`
  first row `$300–350` → **`$350`**; price/heritage comments updated to the owner decisions.
- **`lib/seo.ts`** — `SITE.description` `"…children's live-costumed fairy-tale theater…"` →
  **`"Touring live costumed children's theater serving Los Angeles and beyond."`**

### Home blocks
- **Hero** — final lead; removed placeholder comment.
- **FormatExplainer** — final subtitle + 4 point bodies.
- **ServiceLineCards** — final subtitle.
- **HowItWorksAreas** — final step bodies + subtitle; areas line now states the 30-mile-free rule.
- **B2BTeaser / B2CTeaser** — tokens removed; final subtitles/lines.
- **PersonaIntro** — alt `"…founder and host…"` → **`"Miss Lana, the theater's host and storyteller…"`**;
  subtitle finalized; the first-person line is kept and clearly marked `🔴 TEMPORARY` (owner mini-story pending — no bio invented).
- **BookingCTABand** — default `sub` token removed.
- **`app/page.tsx`** — `<title>` `"Live children's theater…"` → **`"Live theater that comes to you"`** (matches H1; meta description keeps "children's theater").

### Pages
- **/services** — final intro subtitle; bottom line now states the 30-mile-free rule.
- **/school-shows** — SEL body + hero subtitle tokens removed; pricing line + FAQ now state the 30-mile-free rule.
- **/birthdays** — step + hero subtitle tokens removed; how-to-book subtitle + cost FAQ state the 30-mile-free rule.
- **/characters** — all 6 tokens removed; how-it-works subtitle states the 30-mile-free rule.
- **/gallery** — subtitle token removed.
- **/pricing** — subtitle/metadata travel wording; table note `(placeholder presentation)` removed;
  **Distance block** rewritten to free-within-30-miles / quoted-by-distance and the
  `Surcharge amounts pending` Tag + "amounts pending" paragraph removed (unused `Tag` import dropped);
  package blurbs + subtitle tokens removed.
- **/booking** — service-area subtitle aligned to the 30-mile-free rule (consistency).
- **/about** — mission, 30-years, troupe and values subtitles finalized; **heritage paragraph**
  now names the **Ukrainian roots explicitly** (warm, once); the `PersonaIntro` mini-story stays the
  marked `🔴 TEMPORARY` line; page-header gate comments updated (heritage approved; ownership still not asserted).
- **/shows/[slug]** — removed the "Synopsis is placeholder copy, refined before launch." note.

### Other
- **Deleted** `components/shell/StubPage.tsx` (dead "Coming soon" component, no imports).
- Stale `temporary/placeholder` code comments in `FaqSection`, `FeaturedShows`, `app/shows/page.tsx`,
  `app/shows/[slug]/page.tsx`, `FormatExplainer` flipped to "final".
- e2e: **no assertions referenced changed strings** (all asserted H1s/headings were preserved), so no test edits were required.

## Verification

- `pnpm run ci:exact` — **green** (lint · typecheck · governance · build 22 routes).
- `pnpm test:e2e` — **green**, 42 passed.
- Grep: **zero** `Placeholder copy` / `Temporary copy` literals in shipped (non-`/design`) copy;
  **zero** rendered "founder"; **no** sub-$350 figure or distance dollar amount; `from $350` consistent (26 mentions); table floor `$350`.
- "Ukraine" named in rendered copy **only** in the `/about` heritage paragraph; **no** "Russia" reference anywhere.

## Reviewer-grade review

Severity vocab BLOCKER / HIGH / MEDIUM / LOW / NOTE.

- **No BLOCKER / HIGH.**
- **NOTE** — A few existing **H1s differ from the final-copy file's headline shorthand** (e.g. `/services`
  H1 "The same theater, shaped to your day" vs file's "One troupe, four ways to delight your children";
  `/about`, `/characters`, `/shows` likewise). These H1s are **not placeholder strings** and changing them
  is **out of the enumerated scope** ("copy/text only, plus the trivial alt/title edits") and would cascade
  into un-enumerated e2e/IA changes. Kept the working H1s; applied the file's wording to the
  placeholder **subtitles/intros** beneath them. Flag for the owner if H1 alignment is desired.
- **NOTE** — `VALUES` were realigned to the file's kindness / friendship / helping trio (the old third
  value "Wonder for every child" did not match the approved list); titles + bodies are card-length, derived
  from the file (not improvised themes).
- **NOTE** — `/about` mission subtitle reorders the file's two mission sentences to avoid a verbatim echo of
  the existing H1 ("Theater as a little bit of magic"); same facts/message, file vocabulary.

## Stays pre-launch (NOT touched — by design)

- **noindex** still on every route; **preview badge** ("Placeholder content & imagery · not for indexing yet") still present.
- **Imagery** stays placeholder treatment (incl. the `/about` "Temporary photo" caption); **social links** stay inert.
- **No** format tag/filter on `/shows`.

## 🔴 Open gaps carried forward

- 🔴 **Miss Lana mini-story** (owner) — replace the marked temporary `PersonaIntro` first-person line.
- 🔴 **Real graded photos/video** (asset track) — gallery/hero/portrait still placeholder.
- 🔴 **Social links** (owner) — still inert.
- 🔴 **Format-split of the 8 shows** (owner) — only if they differ; else drop permanently.

## Recommended next

Phase 5 — pre-launch + launch: a11y/CWV/e2e/tech-SEO pass, validate schema/sitemap/robots, remove
`/design`, flip `noindex` + remove the preview badge, launch `misslanatheater.com` → 301 from old →
GBP → resubmit sitemap → Search Console. (Needs real photos in first.)
