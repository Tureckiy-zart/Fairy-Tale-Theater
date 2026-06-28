# Reviewer-Grade Post-Implementation Review — Prelaunch Pipeline (Tasks 01–08)

> Per `docs/_internal/REVIEW_BLOCK.json`
> (`TUNG_UNIVERSAL_POST_IMPLEMENTATION_REVIEW_BLOCK_001`). Each task in the block is
> reviewed **separately**, across all review axes, with severity-ranked evidence and
> an individual closure recommendation. Date: 2026-06-28.

## Task/block under review

The eight prelaunch-pipeline TUNGs (`tasks/miss-lana-prelaunch-pipeline/`), as
landed in two commits on `chore/tung-prelaunch-pipeline-ordering`:
`3ed2c4a` (01–05, merged via PR #6) and `9e210bd` (06–08, PR #7).

## Bounded scope & evidence set

- Changed-file lists from `git show --stat` for both commits (read in full, not
  just hunks, for all code surfaces).
- Authority: `docs/core/*` canon, `OWNER_ANSWERS_DECISION_RECORD.md`, `04_SEO.md`,
  the per-task reports, and the task JSONs.
- Evidence is from source reads + production **build output** (`.next/server/app/*`)
  — used because the sandbox cannot keep a Next server alive for live e2e (see
  Test-sufficiency note, which applies block-wide).

## Verification executed (bounded)

| Check | Result |
|---|---|
| `pnpm run ci:exact` (lint + typecheck + governance + build) | **exit 0** |
| `security/secret-scan.sh` | **exit 0** (no secrets) |
| `git diff --check` | clean |
| Build-output audit (robots, sitemap, schema, noindex, redirects manifest) | as cited per task |
| `pnpm test:e2e` (live) | **not executable in sandbox** — Next server is killed by the environment; tests written, run in CI |

Classification: the single Turbopack **NFT warning** (`lib/notify.ts` dynamic
`process.cwd()` fs path) is **introduced by Task 05** and is non-fatal (build exit
0). All other surfaced items are introduced-by-block or pre-existing as noted.

---

## Task 01 — `CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001`

**Surface:** docs only (`docs/core/*`, `STATUS.md`, new decision record). No code.

- **Correctness/canon:** duration→~1h, troupe→3–4, pricing→"From $350" (tiers moved
  internal), travel rule, owner/CA-2022 — all consistent across the edited canon
  files. The internal headcount tiers live **only** in the decision record §2, clearly
  marked not-public. ✅
- **Leakage:** the $400/$500/$600 figures exist in `docs/core` but exclusively inside
  "internal / not published" statements — not a public-surface leak. ✅
- **DRY/authority:** `OWNER_ANSWERS_DECISION_RECORD.md` is correctly positioned as the
  single owner-fact source; later tasks cite it. No competing source of truth.
- **NOTE:** the "puppets-inside" owner decision is recorded but the "no puppet"
  guardrails were intentionally **not** rewritten (deferred). Tracked, not a defect.

**Findings:** none above NOTE. **Closure: CLOSE.**

---

## Task 02 — `FIX_MISS_LANA_GLOBAL_PUBLIC_COPY_001`

**Surface:** `lib/site.ts`, `lib/seo.ts`, `lib/shows.ts`, `app/layout.tsx`, Nav,
accent, 7 public pages, `globals.css`, `tests/e2e`.

- **Correctness (HIGH, resolved in-task):** the pre-existing schema bug —
  `telephone: SITE.phones[0]` was the **reserve** number — is fixed: `SITE.phones` and
  `PHONES` are both reduced to the single primary `+1-323-903-2039`. Verified: no
  `282-1054` anywhere; build HTML telephone = primary. ✅
- **Correctness (HIGH, resolved):** the public audience-size price **table**
  (`PRICING_TIERS` → $350–$600) was removed and replaced by `QUOTE_FACTORS` + "From
  $350". No price tier in built HTML. ✅
- **Regression:** reducing `PHONES`/`SITE.phones` to one element is consumed only via
  `.map(...)` (Footer, Hero, LeadForm, BookingCTABand, booking) and `[0]` (schema) —
  all safe with a single element. No downstream break. ✅
- **DRY (MEDIUM):** the flagship service-line label **"Fairy-Tale Theatre"** is
  hardcoded in `components/ui/accent.ts:9` (`ACCENT_LINE.forest`) **and** duplicated as
  a literal in `app/shows/[slug]/page.tsx:88`. These are the same label; the detail
  page should consume the token. Divergence risk if the line is ever renamed. (Task 02
  explicitly chose not to refactor; surfaced here.)
- **Canon:** generic SEO "theater" preserved; owned brand → "Theatre". Correct
  selective replacement (no blind global swap). ✅
- **Tests:** e2e pricing H1 assertion updated to match the new "From $350" heading. ✅

**Findings:** 1 MEDIUM (DRY label duplication). **Closure: CLOSE_WITH_NOTES** →
follow-up FU-1.

---

## Task 03 — `IMPLEMENT_MISS_LANA_LIGHTWEIGHT_CONTENT_STRUCTURE_001`

**Surface:** `app/birthdays`, `app/school-shows`, `app/characters`,
`app/shows/[slug]` (troupe line), distribution-matrix artifact.

- **Correctness/canon:** birthday personalization worded as availability ("as much or
  as little as they'd like"), not mandatory; characters extras inventory-neutral;
  school scheduling without a hard max; show-detail "Troupe — 3–4 artists" matches
  canon. ✅
- **Leakage of logistics:** no setup/parking/weather wall on Home or show pages
  (verified by grep in the task). ✅
- **Thin spot (LOW):** the show-detail aside hardcodes the literal string
  `3–4 artists`; `FACTS` in `lib/site.ts` carries troupe-related copy but not this
  exact value, so it's a standalone literal. Low divergence risk (canon-stable), but a
  candidate to centralize alongside other `FACTS`.
- **Regression:** added OFFER cards (6 total) render in the existing `sm:grid-cols-2`
  grid — no layout regression. ✅

**Findings:** 1 LOW. **Closure: CLOSE.**

---

## Task 04 — `BUILD_MISS_LANA_EVENT_PLANNING_FAQ_001`

**Surface:** new `app/planning-your-event/page.tsx`, `FOOTER_LINKS`, 4 contextual
links, e2e.

- **Correctness:** one combined `FAQPage` from exactly the 10 visible Q/As (verified:
  10 visible questions = 10 schema `Question` entries, exactly one FAQPage object).
  No schema drift. ✅
- **Boundary/canon:** confirmed-only facts; unresolved policy softened to "confirmed
  when you book"; no deposit/refund/cancellation/insurance/supervision wording
  (verified by an e2e guard + build-HTML grep). ✅
- **Brittleness (LOW):** the page keeps `SPACE/VENUE/.../ALL_QA` arrays and a parallel
  `GROUPS` array; `ALL_QA` is a manual concat of the same five arrays. If a future
  editor adds a group but forgets to add it to `ALL_QA`, the visible accordion and the
  FAQPage schema would silently diverge. A derived `ALL_QA = GROUPS.flatMap(g=>g.items)`
  would make drift impossible. LOW.
- **Footer link:** added to `FOOTER_LINKS` (mini-sitemap), not nav — correct
  low-priority placement. Contextual links are secondary text links. ✅

**Findings:** 1 LOW (manual `ALL_QA` concat). **Closure: CLOSE_WITH_NOTES** → FU-2
(optional hardening).

---

## Task 05 — `IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001`

**Surface:** `app/api/lead/route.ts`, `lib/leads.ts`, `lib/notify.ts`,
`lib/analytics.ts`, `lib/env.ts`, `LeadForm`, `SiteFooter`, `.env.example`,
`.gitignore`, runbook, e2e.

- **Correctness/honesty:** `ok:true` is returned **only** after durable persistence;
  validation/abuse/store failure returns `ok:false` with the right status (422/429/
  413/502). LeadForm sets success **only** inside `if (res.ok && data.ok)`. No fake
  success. ✅ (Verified live locally during the task.)
- **Leakage:** secrets read only via `lib/env` in server-only `lib/notify`/route;
  `lib/analytics` is client-safe with an allow-list that strips PII; logs carry only
  `lead.id` + channel status. `.leads/` is git-ignored. ✅
- **Security:** server-side authoritative validation; honeypot + per-IP rate limit;
  16 KB body cap; email `subject` uses only the fixed `EVENT_TYPES` + id (no
  user-free-text → no header injection); webhook receives a JSON `text` field (not raw
  SMTP). ✅
- **Ordering (LOW):** the **honeypot check runs before the rate limiter**, and a
  honeypot hit returns early with `ok:true`. A bot flooding the honeypot is therefore
  **not** rate-limited (each request still does no work, but isn't throttled). Consider
  rate-limiting before/around the honeypot, or counting honeypot hits. LOW.
- **Robustness (NOTE):** `persist()` uses `flag:"wx"` (no overwrite). An id collision
  on the same day (≈1 in 33.5M per day per id) would be classified as a store
  **error** → a valid lead rejected with 502. Negligible probability; a one-retry with
  a fresh id would remove it. NOTE.
- **Leakage precision (NOTE):** `lib/notify.ts` header comment says "no PII beyond the
  id," but the **Telegram** alert body includes `city`, `eventType`, and `date`. The
  destination is the owner's own channel (acceptable), but the comment slightly
  overstates. Tighten the comment or the message. NOTE.
- **Maintainability (NOTE):** Turbopack NFT warning from `join(process.cwd(), dir)` in
  `storeDir()`. Build exit 0; advisory only.
- **Open launch gate (HIGH, documented, not a code defect):** live **email inbox**
  delivery is unverified (no provider creds in this env). The adapter is fully testable
  and the durable store loses nothing; go-live requires `LEAD_EMAIL_WEBHOOK_URL` + the
  runbook checklist. Correctly recorded, not silently deferred.

**Findings:** 1 HIGH (open infra gate, documented), 1 LOW (honeypot/rate-limit order),
3 NOTE. **Closure: CLOSE_WITH_NOTES** → FU-3 (honeypot order + collision retry +
comment), and the email go-live remains an operator gate.

---

## Task 06 — `FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001`

**Surface:** `app/sitemap.ts`, `app/robots.ts`, `next.config.ts` (redirects),
`lib/seo.ts` (showSchema/org), `lib/site.ts` (nav), `.env.example`, e2e, 3 artifacts.

- **Correctness — redirects:** host-conditional **301** (verified `statusCode:301` ×35
  in `routes-manifest`, not the default 308). Specific legacy paths are pushed **before**
  the catch-all, and Next uses first-match → mapped paths win, catch-all → home is one
  hop. The canonical apex host is **not** in `ALTERNATE_HOSTS`, so no self-redirect
  loop. ✅
- **Correctness — schema:** evergreen show pages use `CreativeWork` (no `startDate`
  Event) — verified absent `TheaterEvent` in built HTML. Org schema has no
  `streetAddress`. ✅
- **Sitemap/robots:** sitemap = real routes only, **0** `/design` `/api`; robots
  references the sitemap. ✅
- **Doc drift (LOW):** `showSchema` doc-comment claims "a non-priced Offer reference to
  the org," but the returned object has **no `offers` field**. Stale comment (code is
  fine — no price leak; build HTML has 0 `offers`). Fix the comment.
- **Brittleness (LOW):** `app/sitemap.ts STATIC_ROUTES` is a **hand-maintained** list
  parallel to the real `app/` route tree. A new public route added later won't appear
  in the sitemap unless someone updates this array. Acceptable for a small site;
  flagged so it isn't forgotten.
- **Infra gate (HIGH, documented):** the redirects only fire if DNS routes the
  alternate/legacy hosts to this deploy; the live `curl -sSIL` checks need egress +
  DNS (not available here). The legacy old-URL map is **assumed**, not crawled. Both
  are explicitly recorded in `LEGACY_REDIRECT_MAP.md` as launch blockers.

**Findings:** 1 HIGH (infra/DNS gate, documented), 2 LOW (offers comment, hand-kept
sitemap). **Closure: CLOSE_WITH_NOTES** → FU-4 (comment fix) + operator DNS gate.

---

## Task 07 — `STABILIZE_MISS_LANA_PRELAUNCH_001`

**Surface:** `app/layout.tsx` (global robots), 12 pages (per-page noindex removed),
`app/robots.ts` (launch), `components/blocks/Hero.tsx` (image swap), e2e, 4 artifacts.

- **Correctness — indexing:** every public page now has **0** noindex meta (built
  HTML); `/design` retains noindex; robots → `Allow: /` with `/api/` + `/design`
  disallowed. The flip is complete and consistent across all three control surfaces
  (layout, per-page, robots). ✅
- **Security/IP (RETRACTED 2026-06-28):** Task 07 swapped the Home hero
  `hero-girl-curtain.jpg` believing it was "competitor-sourced." **That was a
  mislabel** — `magic-castle-puppet-theater.com` is the theatre's **own legacy
  domain**, so the image is the owner's own and carried no IP risk. The swap was
  **reverted** on owner instruction; `hero-girl-curtain.jpg` is the Home hero again.
  Net: no actual IP defect existed.
- **Boundary gap (MEDIUM):** **`/design` is still built and routable in production** —
  it is noindex + robots-disallowed, but reachable by direct URL. Canon
  (`SITE_STRUCTURE §9`) called for env-guarding or removing it before prod. Indexing is
  prevented, but the internal preview surface is publicly served. Defense-in-depth gap.
- **(RETRACTED 2026-06-28):** earlier this flagged `hero-girl-curtain.jpg` as an
  "unused competitor" file for deletion. It is the owner's own legacy-site photo and is
  now the active Home hero again — **do not delete**.
- **Doc drift (LOW):** a few page header comments still say "(noindex)" / "metadata via
  lib/seo (noindex)" though the pages are now indexable. Comment-only; behavior correct.
- **Owner-accepted gates (documented):** launch without ≥5 reviews and before live
  email/DNS is an **explicit owner decision**, recorded in the checklist as
  ACCEPTED/INFRA with named follow-ups. No review/Review-schema exists → nothing
  fabricated. Correctly handled, not silently deferred.

**Findings:** 1 HIGH (resolved), 1 MEDIUM (`/design` reachable in prod), 2 LOW.
**Closure: CLOSE_WITH_NOTES** → FU-5 (env-guard/remove `/design`; delete unused hero;
fix stale "(noindex)" comments).

---

## Task 08 — `ADAPT_MISS_LANA_LEGACY_SHOW_CONTENT_001`

**Surface:** `lib/shows.ts` (8 shows), `FormatExplainer` (Home), `app/about`,
`app/shows` (hub), `app/school-shows`, 3 content artifacts.

- **Correctness/canon:** 8 distinct synopses (card teaser ≠ detail synopsis, verified);
  no per-show puppet/cultural-origin claim; no "25 years / 35–45 / superlatives";
  pricing untouched ("From $350"). Forbidden-pattern grep clean in public copy. ✅
- **No fabrication:** plots adapted from the seed library (owner-authored source);
  provisional titles (#2/#5/#6) and formats left unchanged/unstated and flagged in the
  owner-review sheet; team bios **not** expanded. ✅
- **Anti-dryness:** each show has a concrete action/character; not a single template. ✅
- **Doc drift (LOW):** `lib/shows.ts:29` interface comment still says
  "The Magic Castle is 2–8" inline — accurate, but the broader header comment block was
  rewritten; no functional issue. Minor.
- **NOTE:** the internal `/design` preview still shows legacy "35–50 minutes" sample
  copy — out of this task's public-copy scope (internal, noindex), but it now reads
  as stale once the public canon is ~1 hour. Tracked under FU-5 (`/design`).

**Findings:** 1 LOW + 1 NOTE (both doc/internal). **Closure: CLOSE.**

---

## Regression assessment (block-wide)

No introduced regression in adjacent behavior. The riskiest change — reducing
`PHONES`/`SITE.phones` to one element (Task 02) — is consumed only via `.map`/`[0]`
and is safe. The `telegram*` env signature change to `string | undefined` (Task 05)
has a single guarded consumer (`lib/notify.ts`). The noindex flip (Task 07) is
complete across all three control surfaces. `ci:exact` exit 0 confirms no
type/lint/governance/build break.

## Leakage / boundary assessment

No secret/PII leakage: env read only through `lib/env` in server-only modules;
analytics allow-list strips PII; logs carry id + status only; `.leads/` git-ignored;
secret-scan clean. One **boundary gap**: `/design` internal preview is served in prod
(noindex, but reachable) — MEDIUM, Task 07. Telegram alert carries mild lead context
to the owner's own channel (NOTE, Task 05).

## DRY / abstraction assessment

- MEDIUM: "Fairy-Tale Theatre" service-line label duplicated (`accent.ts` ↔
  `shows/[slug]` literal) — FU-1.
- LOW: `app/sitemap.ts` static route list hand-maintained vs the route tree — FU-4.
- LOW: `planning-your-event` `ALL_QA` is a manual concat of the group arrays — FU-2.
- LOW: `3–4 artists` literal in show-detail not centralized in `FACTS`.

Otherwise abstractions are well-placed: `lib/leads`/`notify`/`analytics` cleanly
separated; `buildMetadata`/schema factories reused; honest channel-outcome model.

## Test-sufficiency assessment

Tests are real (assert schema types, robots/sitemap content, noindex state, FAQPage
count, lead success-after-accept, honeypot off-screen) — not snapshot/trivia. The
material gap is **execution**: the sandbox can't keep a Next server alive, so the
suite was validated by build-output audit, not a live run, this turn. It runs in CI.
No new false-confidence tests. The lead pipeline lacks **unit** tests for
`lib/leads`/`lib/notify` pure functions (they're only covered via e2e) — a reasonable
follow-up given they're the highest-value invariants (FU-3, optional).

## Canon / authority compliance assessment

Compliant: owned brand "Theatre" with generic-SEO "theater" preserved; "From $350"
only; service-area schema without address; no Review schema without reviews;
`CreativeWork` not misleading Event; noindex on `/design`; decision record as the
single owner-fact source. No accidental new source of truth. The "puppets-inside"
guardrail rewrite remains a tracked deferral, not drift.

## Closure recommendation (per task)

| Task | Recommendation |
|---|---|
| 01 CANON_SYNC | **CLOSE** |
| 02 GLOBAL_COPY | **CLOSE_WITH_NOTES** (FU-1) |
| 03 LIGHTWEIGHT_CONTENT | **CLOSE** |
| 04 EVENT_PLANNING_FAQ | **CLOSE_WITH_NOTES** (FU-2, optional) |
| 05 LEAD_PIPELINE | **CLOSE_WITH_NOTES** (FU-3; email go-live = operator gate) |
| 06 SEO_DOMAIN | **CLOSE_WITH_NOTES** (FU-4; DNS activation = operator gate) |
| 07 STABILIZE/LAUNCH | **CLOSE_WITH_NOTES** (FU-5) |
| 08 LEGACY_COPY | **CLOSE** |

**Block verdict: CLOSE_WITH_NOTES.** No BLOCKER. The two HIGH items (Task 05 email,
Task 06 DNS) are **operator/infra launch gates already documented**, not code defects.
One MEDIUM (`/design` reachable in prod) and one MEDIUM (DRY label) warrant bounded
follow-ups; the rest are LOW/NOTE.

## Follow-up tasks (bounded, evidence-cited)

- **FU-1 — De-duplicate the service-line label.** Replace the `"Fairy-Tale Theatre"`
  literal in `app/shows/[slug]/page.tsx:88` with `ACCENT_LINE.forest` from
  `components/ui/accent.ts`. Resolves Task 02 MEDIUM (DRY). Bounded: 1 file.
- **FU-2 (optional) — Derive `ALL_QA`.** In `app/planning-your-event/page.tsx`,
  compute `ALL_QA = GROUPS.flatMap(g => g.items)` so the visible accordion and FAQPage
  schema cannot drift. Resolves Task 04 LOW.
- **FU-3 — Harden the lead route.** Rate-limit around the honeypot (or count honeypot
  hits); retry `persist()` once with a fresh id on `wx` collision; correct the
  `lib/notify.ts` "no PII beyond id" comment re: the Telegram body. Optionally add unit
  tests for `lib/leads`/`lib/notify`. Resolves Task 05 LOW + NOTEs.
- **FU-4 — Sitemap + schema comment.** Fix the stale `showSchema` "Offer" doc-comment
  in `lib/seo.ts`; optionally derive `app/sitemap.ts` static routes from a shared route
  registry. Resolves Task 06 LOWs.
- **FU-5 — Internal-surface + cleanup before launch.** Env-guard or remove `/design`
  in production (not just noindex); fix stale "(noindex)" page header comments; refresh
  `/design` sample "35–50 minutes" copy. Resolves Task 07 MEDIUM/LOW + Task 08 NOTE.
  **/design env-guard should precede public launch.** (The earlier "delete
  `hero-girl-curtain.jpg`" item is withdrawn — it's the owner's own active hero.)

> Operator gates (not code defects, already documented): live email webhook test
> (Task 05) and DNS + live redirect `curl` checks (Task 06) before paid traffic.
