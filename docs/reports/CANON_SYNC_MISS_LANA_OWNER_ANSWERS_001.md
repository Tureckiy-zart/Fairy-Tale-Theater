# Miss Lana — Prelaunch Pipeline · Unified Task Report

> **Single rolling report for the seven prelaunch-pipeline TUNG tasks**
> (`tasks/miss-lana-prelaunch-pipeline/`). Each task appends its own closure
> section here instead of creating a separate report file, so the pipeline keeps
> one auditable trail. Newest task sections are appended at the bottom.
>
> | # | Task | Status |
> |---|------|--------|
> | 01 | `CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001` | ✅ closed — see below |
> | 02 | `FIX_MISS_LANA_GLOBAL_PUBLIC_COPY_001` | ✅ closed — see below |
> | 03 | `IMPLEMENT_MISS_LANA_LIGHTWEIGHT_CONTENT_STRUCTURE_001` | ✅ closed — see below |
> | 04 | `BUILD_MISS_LANA_EVENT_PLANNING_FAQ_001` | ✅ closed — see below |
> | 05 | `IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001` | ✅ closed — see below |
> | 06 | `FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001` | ✅ closed — see below |
> | 07 | `STABILIZE_MISS_LANA_PRELAUNCH_001` | ✅ closed — see below |
> | 08 | `ADAPT_MISS_LANA_LEGACY_SHOW_CONTENT_001` | ✅ closed — see below |

---

## Task 01 — `CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001`

**Mode:** canon-sync · **Priority:** P0 · **Date:** 2026-06-27
**Goal:** Synchronize canonical project documentation with the owner's confirmed
questionnaire answers (Svitlana Grygoryshyna, supplied 2026-06-25 → 2026-06-26),
**without changing any public page or application behavior**. Establish one
authoritative current truth for duration, troupe size, included experience,
setup, venue, birthday personalization, add-ons, geography, owner identity, and
California start year — and clearly separate confirmed facts from unsafe
statements and unresolved policy/document questions.

**Locked commercial constraint:** public website may express price **only** as
"From $350". No audience-size price tiers (30/40/50/60 children → $) may enter
public canon in this task, even though the owner supplied them — they are
recorded as *internal* in the decision record only.

### Sources

- **Owner answers:** `docs/2026-06-26-final-copy-updates.md` (committed 2026-06-26,
  "owner answers + 5 decisions"); business facts in `docs/core/PROJECT_BRIEF.md`.
- **Already-applied site copy:** `STATUS.md` lines 13–17 record that the
  2026-06-23 final copy pass already moved the public site to "$350" floor and
  the "free ≤30 miles, then quoted by distance" travel rule. The public site is
  therefore ahead of the fact-canon; this task brings the **canon** up to date,
  not the site.

### Step 1 — Conflict matrix (current canon vs confirmed truth)

Classification legend: **CC** = current-canon assertion · **IN** = implementation-note ·
**RE** = research-evidence. Only CC and IN statements are normalized; historical
records (`STATUS.md` closures, `PROJECT_PROGRESS.md`) are left intact.

#### A. Duration — stale "35–50 мин" → "about one hour (~30 + ~30)"

| File:Line | Verbatim (before) | Class |
|---|---|---|
| `docs/core/PROJECT_BRIEF.md:22` | «Всего **35–50 мин**, дети 2–10 лет.» | CC |
| `docs/core/PROJECT_BRIEF.md:68` | «~30 мин спектакль + интерактив; всего 35–50 мин; возраст 2–10.» | CC |
| `docs/core/01_CONTENT_INVENTORY.md:15` | «Всего **35–50 мин**, дети 2–10 лет.» | CC |
| `docs/core/01_CONTENT_INVENTORY.md:30–37` | 8 repertoire rows, column «Длит.» = «35–50 мин» | CC |
| `docs/core/02_POSITIONING_AND_TONE.md:86` | «Живые актёры + куклы, 35–50 мин, дети 2–10 лет.» | CC |
| `docs/core/SITE_STRUCTURE_AND_BLOCKS.md:69` | FormatExplainer row: «~30 мин спектакль + интерактив (пузыри), 35–50 мин» | IN |
| `docs/core/SITE_STRUCTURE_AND_BLOCKS.md:88` | Home §4.1: «костюмированный спектакль ~30 мин + интерактив (пузыри), 35–50 мин, 2–10 лет» | IN |
| `docs/core/SITE_STRUCTURE_AND_BLOCKS.md:102` | Show detail §4.2: «мета (возраст 2–10 · 35–50 мин)» | IN |

**Target:** about one hour total = ~30 min fairy-tale play + ~30 min interactive
fun (games, dancing, bubbles). Phrase as approximate ("about an hour", "~60 min"),
never as an exact minute-by-minute promise.

#### B. Audience-size pricing tiers — stale $300–600 by headcount → "From $350" only

| File:Line | Verbatim (before) | Class |
|---|---|---|
| `docs/core/PROJECT_BRIEF.md:71–72` | «Ценообразование — от числа детей: ≤~15 → $300–350; ~40 → ~$400; ~50 → ~$500; ~60 → ~$600 и далее линейно.» | CC |
| `docs/core/03_SITEMAP_AND_SCOPE.md:52` | «до ~15 детей → $300–350; ~40 → ~$400; 50 → $500; 60 → $600; далее линейно.» | CC |
| `docs/core/SITE_STRUCTURE_AND_BLOCKS.md:116` | §4.4: «логика «от числа детей» (≤15 $300–350 · ~40 ~$400 · 50 $500 · 60 $600 · далее линейно)» | IN |

**Target:** public canon limited to **"From $350"** + custom-quote language
("final price depends on the show, cast, length and travel; confirmed on
booking"). Headcount tiers move to the **internal** decision record only.

#### C. Travel pricing — placeholder "радиус X миль" → confirmed rule

| File:Line | Verbatim (before) | Class |
|---|---|---|
| `docs/core/PROJECT_BRIEF.md:75–76` | «Доплата за расстояние сейчас отсутствует — нужно ввести … бесплатно в радиусе X миль; Сан-Диего — фикс.; …» | RE/CC |
| `docs/core/03_SITEMAP_AND_SCOPE.md:53–54` | «Доплата за расстояние — сейчас её нет, нужно ввести … бесплатно в радиусе X миль от LA; Сан-Диего — фикс. доплата; …» | RE/CC |
| `docs/core/SITE_STRUCTURE_AND_BLOCKS.md:116` | §4.4 Distance: «бесплатно в радиусе X миль · Сан-Диего фикс. · …» | IN |

**Target:** confirmed public rule (already live per STATUS) — **free across the
greater LA / Orange County area; farther locations (San Diego, Sacramento, San
Jose) carry a travel surcharge quoted by distance**, no fixed dollar amounts in
public canon. STATUS already states "free ≤30 miles, then by distance"; canon
adopts the owner wording ("greater LA & Orange County").

#### D. Troupe size — "4 артиста" → "troupe of 3–4 (depending on the show)"

| File:Line | Verbatim (before) | Class |
|---|---|---|
| `docs/core/PROJECT_BRIEF.md:62` | «профессиональная труппа, **4 артиста**» | CC |
| `docs/core/01_CONTENT_INVENTORY.md:54` | «Команда — профессиональная труппа (4 человека)» | CC |
| `docs/core/02_POSITIONING_AND_TONE.md:43` | «профессиональная труппа (4 артиста)» | CC |
| `docs/core/02_POSITIONING_AND_TONE.md:82` | «Профессиональная труппа из 4 артистов» | CC |
| `docs/core/SITE_STRUCTURE_AND_BLOCKS.md:124` | §4.6: «труппа (4 артиста, роли из 01)» | IN |

**Target:** "a troupe of **3–4 artists** (depending on the show)". This matches
the owner's answer and the public copy, where the site already dropped the fixed
number ("Professional troupe", PROJECT_PROGRESS 2026-06-23). The four named
artists in the troupe table stay as the named roster.

#### E. Setup / venue — absent from canon → add confirmed facts

No current-canon document states setup time or required floor area. **Add** to
the brief / decision record: setup & pack-down ~15–20 minutes each; clear flat
area ~20 m² (~215 sq ft); own sound, no power outlet required; outdoor possible
on a flat, shaded, wind-free spot with indoor backup for rain/wind. These are
**operational facts** routed to the future Planning Your Event page (Task 04),
*not* repeated across marketing pages.

#### F. Owner identity / California year — confirmed

`PROJECT_BRIEF.md:64` and `01_CONTENT_INVENTORY.md:58` hedge "(вероятно владелец
— подтвердить)". **Confirmed:** Svitlana Grygoryshyna is **owner and director**;
California operations **since 2022**. Heritage timeline (Baltics → Ukraine /
"Теремок" → Los Angeles since 2022) stays a quiet "About" backstory; Russia is
never named; "30+ years" is the troupe's total craft, **not** "25 years in LA".

#### G. Consistent — no change needed

- **Single primary phone** (323) 903-2039 + reserve-only second phone: already
  consistent across all canon. No conflict.
- **Brand lock** (Miss Lana's Fairy-Tale Theatre, misslanatheatre.com, English-first,
  live-theatre identity): untouched.

### Step 2 — Decision record

Created `docs/core/OWNER_ANSWERS_DECISION_RECORD.md`, separating: **confirmed
public facts** (safe to publish), **confirmed internal operations** (e.g. exact
headcount price tiers, deposit mechanics — internal/quote-time, not public),
**unsafe statements** (kept out of public canon), and **unresolved questions**
(OWNER / LEGAL / DOCUMENT / MEDIA-PERMISSION / POLICY). A reviewer can read it
and know exactly what is safe to publish and what is still blocked.

### Step 3 — Canon documents synchronized

Semantic edits applied to: `docs/core/PROJECT_BRIEF.md`,
`docs/core/01_CONTENT_INVENTORY.md`, `docs/core/02_POSITIONING_AND_TONE.md`,
`docs/core/03_SITEMAP_AND_SCOPE.md`, `docs/core/SITE_STRUCTURE_AND_BLOCKS.md`.
Each updated for duration, pricing-floor, travel rule, troupe 3–4, owner/
California-2022, and (brief) setup/venue facts. No code, runtime, deployment, or
frozen-governance files touched. The "puppets-inside" repertoire decision present
in the source doc is **out of scope** for this task and was left for a separate
pass — it is recorded as a confirmed owner fact in the decision record but the
"no puppet" guardrails were **not** rewritten here (avoiding an out-of-scope
brand/guardrail change mid canon-sync).

### Step 4 — Status & backlog

`STATUS.md` current snapshot updated (duration ~60 min, pricing-floor "From $350",
travel rule, owner/California-2022 confirmed, setup/venue facts noted, owner-answer
canon-sync recorded as the latest real work). Historical closure sections left
unchanged. The next six pipeline TUNG IDs and their dependency order are listed.

### Verification

- `pnpm governance` → **0 issues**.
- `git diff --check` → **clean** (no whitespace errors / conflict markers).
- Stale-pattern grep over `docs/core STATUS.md README.md` → no live stale
  assertions. Remaining `$400/$500/$600` hits are all inside the explicit
  "internal, not published" statements (decision record / brief / sitemap) or
  competitor research-evidence (`04_SEO.md`, design-research). The single
  `35–50` hit is my intentional Task-02 signpost in STATUS.md.
- Cross-check sweeps: troupe now "3–4 artists" across all core canon (incl.
  BRAND.md); "около часа / ~60 мин" present across the five edited core files;
  no live `4 артиста` / `troupe of 4` assertion remains.

### Reviewer-grade review

- **NOTE** — `BRAND.md:50` troupe count "4 артиста" → "3–4 артиста": a minimal
  fact-sync (not in the original in_scope list) was applied so all core canon is
  consistent, per success-criterion "all canonical documents consistently use…".
  Brand/domain/contact authority untouched.
- **LOW (deferred, not fixed)** — `DESIGN_SYSTEM.md:308` show-card meta **example**
  still shows "~40 мин". It is an illustrative layout example, not a product-fact
  assertion, and DESIGN_SYSTEM is a separate canon domain (CLAUDE.md §8) outside
  this task's declared scope. Flagged for the Task-02 copy pass alongside the code
  literal. Left intact to avoid scope-creep.
- **NOTE (out of scope, recorded)** — owner decision "puppets inside" (mixed
  repertoire) reverses the "no puppet" guardrails. Recorded as a confirmed fact in
  the decision record §3; rewriting the guardrails / per-show format tags is a
  distinct pass and was **not** done here. Source doc itself flags it as separate.
- **NOTE (history preserved)** — `PROJECT_PROGRESS.md:60` still quotes "35–50 min"
  inside a historical log entry; append-only history was correctly left unchanged.
- **NOTE (parallel session)** — a `08_ADAPT_MISS_LANA_LEGACY_SHOW_CONTENT_001.json`
  TUNG appeared in the pipeline folder mid-task (not created by this task; another
  session). Left on disk, not staged by me. The pipeline README/STATUS still list
  the canonical seven; reconciling task 08 is a separate decision.
- No BLOCKER / HIGH / MEDIUM findings.

### Closure

Scope verification ✅ — all four steps, all six success_criteria, and all three
deliverables (`OWNER_ANSWERS_DECISION_RECORD.md`, this report,
`PROJECT_PROGRESS.md` entry) complete. No non_goals violated: no app/code/runtime/
deployment/frozen-governance edits; no audience-size tiers in public canon; no
cancellation/refund/insurance/vendor claims normalized; private address absent;
"From $350" is the only public price expression. Automated verification ✅ (3/3
required commands pass). Review ✅ — no BLOCKER/HIGH/MEDIUM; LOW/NOTE findings
deferred with rationale above. **Task closed.**

---

## Task 02 — `FIX_MISS_LANA_GLOBAL_PUBLIC_COPY_001`

**Mode:** fix · **Priority:** P0 · **Date:** 2026-06-27
**Goal:** Correct the global/shared public copy in the code so it matches the canon
synced in Task 01 — brand spelling, single primary contact, duration, travel
wording, audience-size pricing, placeholders — while preserving the current light
Lantern-Light structure. No redesign, no new routes, no form backend, noindex kept.

### Step 1 — Shared-fact inventory (before → after)

| Fact | Source(s) | Before | After |
|---|---|---|---|
| Brand (owned) | `lib/site.ts` BRAND, `lib/seo.ts` SITE, `app/layout.tsx`, `Nav.tsx`, `accent.ts`, `app/{services,gallery,about,shows,booking,pricing}`, `shows/[slug]`, `globals.css` | "Fairy-Tale **Theater**" | "Fairy-Tale **Theatre**" (generic "theater" SEO phrases kept) |
| Brand domain | `lib/site.ts` BRAND.domain | `misslanatheater.com` | `misslanatheatre.com` (live primary) |
| Primary phone | `lib/site.ts` PHONES, `lib/seo.ts` SITE.phones (+ schema `telephone`) | reserve `(213) 282-1054` listed **first** & rendered everywhere | only `(323) 903-2039`; reserve removed from all public surfaces + schema |
| Duration | `lib/site.ts` FACTS.showLength, `lib/shows.ts` LENGTH, `FormatExplainer`, `app/{shows,birthdays,school-shows,pricing}` | "35–50 min" | "about an hour" / "~60 min" (≈30 play + ≈30 games/dancing/bubbles) |
| Format proof | `FormatExplainer` | bubbles only; no scenery/sound/troupe | names games/dancing/bubbles + scenery/props/own sound + troupe of 3–4 |
| Travel | `app/{services,booking,pricing,birthdays,school-shows,characters}`, `HowItWorksAreas` | "free within 30 miles of LA" | "free across the greater LA & Orange County area; farther quoted by distance" |
| Public pricing | `lib/site.ts` `PRICING_TIERS`, `app/pricing` table | audience-size tier table $350/$400/$500/$600 rendered publicly | tiers removed; `QUOTE_FACTORS` + "From $350" + custom-quote only |

### Step 2–4 — Corrections applied

- **Brand → Theatre** in every project-owned rendering (shared modules + 7 public
  pages + Nav wordmark + accent line label + globals.css header). Generic
  search-intent phrases ("live theater", "children's theater", schema
  `TheaterEvent`) deliberately left as American "theater".
- **Single public phone.** `PHONES` reduced to the primary only; `SITE.phones`
  reduced to one so schema `telephone = SITE.phones[0]` is now the **primary**
  (was the reserve number — a real structured-data bug). All `.map` consumers
  (Hero, Footer, LeadForm, BookingCTABand, booking page) now show one number.
- **Duration → about one hour** at the shared sources (`FACTS.showLength`,
  `lib/shows.ts LENGTH = "~60 min"`) and every hard-coded page literal; show meta
  reads "Ages 2–10 · ~60 min". `FormatExplainer` now communicates the ~30+~30
  structure and that scenery/props/own sound + a troupe of 3–4 come with it.
- **Travel wording** softened to the confirmed rule everywhere (no fixed radius,
  no dollar figures).
- **Pricing simplified.** Removed `PRICING_TIERS` and the rendered "price by
  number of children" table (locked-constraint violation). New `QUOTE_FACTORS`
  list + a "From $350 / confirmed with your booking" panel; the per-segment
  package cards (all "From $350", no tiers) kept. Pricing H1 is now "From $350".
- **Form honesty preserved.** The "Demo form — no message is sent yet" notice in
  `LeadForm` and the three landing CTAs is untouched (real delivery is TUNG 5).

### Verification

- `pnpm lint` ✅ · `pnpm typecheck` ✅ · `pnpm governance` ✅ (0 issues) ·
  `pnpm build` ✅ (22 routes) · `pnpm test:e2e` ✅ (**42 passed**) ·
  `git diff --check` ✅.
- Updated one e2e assertion: pricing H1 `/simple pricing, by group size/` →
  `/from \$350/` to match the new heading (the change is mine, the test follows it).
- Built-HTML sweep: no `$400/$500/$600`, no reserve phone, no "35–50", no
  mis-spelled owned brand on any **public** route. (`35–50` + "Theater" remain only
  in `design.html` — the internal `/design` preview, see NOTE.)

### Reviewer-grade review

- **HIGH (fixed)** — the public `/pricing` page rendered an audience-size price
  tier table ($350–$600 by headcount) via `PRICING_TIERS`, and schema advertised
  the **reserve** phone as the business `telephone`. Both directly violated canon;
  both removed/corrected at the shared source.
- **LOW (deferred, out of scope)** — `app/design/*` (internal, noindex,
  env-guarded QA preview) still shows sample "35–50 minutes" and "Fairy-Tale
  Theater" copy. Not a marketing surface; task scope is public shared copy. Left
  intact; flagged here.
- **NOTE** — `shows/[slug]` repeats the literal "Fairy-Tale Theatre" line label
  that also lives in `accent.ts ACCENT_LINE.forest`; not refactored to import the
  token (task forbids opportunistic refactor). Both now spell "Theatre".
- **NOTE** — asset placeholders ("Photo/Video — pending", gallery pending) left as
  honest pending-asset states; media is TUNG 7, not this copy pass.
- No BLOCKER / MEDIUM findings.

### Closure

Scope ✅ — all five steps, all seven success_criteria, the report + PROGRESS
deliverable complete. No non_goals breached: no redesign, no Planning route, no
form backend, no reviews/media/redirects/GBP, noindex untouched, no audience-size
tiers or fixed travel fees introduced (the existing forbidden table was removed).
Automated verification ✅ (6/6 required commands). Review ✅ — HIGH fixed within the
task; LOW/NOTE deferred with rationale. **Task closed.**

## Task 03 — `IMPLEMENT_MISS_LANA_LIGHTWEIGHT_CONTENT_STRUCTURE_001`

**Mode:** fix · **Priority:** P1 · **Date:** 2026-06-27
**Goal:** Integrate the owner's confirmed service details into existing pages while
keeping the site light, emotional and theatre-led — adding only the minimum each
page needs to sell its specific offer, with no duplicated logistics (those belong
to the future Planning Your Event route, Task 04). Pricing stays "From $350".

### Step 1 — Content-distribution matrix (deliverable)

Created `docs/reports/miss-lana-page-content-distribution-matrix.md`: per-page job
+ max practical-detail level + prohibited duplication, and a fact → single-home
mapping so no confirmed fact is scattered. Authority: decision record §5/§1.

### Steps 2–6 — Page edits (existing blocks preferred; no template redesign)

- **Home (`FormatExplainer`)** — already conveys ~30 play + ~30 games/dancing/
  bubbles, ~1 hour, ages 2–10, scenery/props/own sound, troupe of 3–4 (set in
  Task 02). Verified complete; **no structural change** (no setup/parking/weather
  wall added).
- **Birthdays** — added a compact **"For the birthday child"** block (4 cards):
  greeted by name + optional little role, "Happy Birthday" song + special finale,
  a small gift (soft toy + balloons), and an optional costumed character "subject
  to availability". Worded as availability throughout — *"as much or as little as
  they'd like"* — never mandatory. Added the owner's family-taken-photos line.
- **School Shows** — added two OFFER cards (**Flexible scheduling**: consecutive
  back-to-back shows for separate age groups; **Best in smaller groups**:
  recommends a smaller audience without asserting a hard maximum) + one scheduling
  FAQ. Values/SEL already present. No procurement/insurance/document claims.
- **Characters** — added an **"Optional extras"** block (face painting · standalone
  bubble show · costumed character visit), each optional and availability-based;
  **inventory-neutral** (no named-character list, no guaranteed availability).
- **Pricing** — already reduced to "From $350" + custom-quote factors (Task 02).
  Verified; no further change.
- **Show detail** — added one line ("Troupe — 3–4 artists") to the existing compact
  Show Details aside (theme / Ages / ~60 min / troupe). Story still leads. **No
  per-show format line** (owner-gated) and **the Planning Your Event link is
  deferred** — that route doesn't exist yet (Task 04 creates it; a link now would
  404). Cards unchanged (image/title/premise/age+length/CTA).

### Verification

- `pnpm lint` ✅ · `pnpm typecheck` ✅ · `pnpm governance` ✅ (0 issues) ·
  `pnpm build` ✅ (22 routes) · `pnpm test:e2e` ✅ (**42 passed**) ·
  `git diff --check` ✅.
- Manual: Home/show surfaces carry **no** setup/parking/weather/power/deposit
  wall; built `/pricing` HTML shows only `$350`; birthday personalization is
  availability-worded (no "must/required"); Characters extras are inventory-neutral.

### Reviewer-grade review

- **NOTE** — the birthdays FAQ "Where can you perform?" (pre-existing) mentions
  "a bit of space and power nearby". One line, page-appropriate for a birthday
  buyer, predates this task; left in place. Full venue/setup detail still routes to
  Planning Your Event (Task 04). Not a logistics wall.
- **NOTE (deferred by design)** — Planning Your Event link slot on show pages
  deferred until the route exists (Task 04). Per-show format line omitted
  (owner-gated). Both recorded in the distribution matrix.
- **NOTE** — School "Best in smaller groups" deliberately recommends rather than
  states a hard capacity, per the must-not-violate rule on unverified maximums.
- No BLOCKER / HIGH / MEDIUM findings.

### Closure

Scope ✅ — all six steps, all eight success_criteria, and both deliverables
(distribution matrix + this report) complete. No non_goals breached: no Planning
route, no template redesign, no audience-size tiers/calculators/fixed travel fees,
no finalized policies/supervision/media/procurement claims, no new show titles, no
form-backend/SEO/launch work. Marketing pages stay light and story-led; logistics
remain undistributed. Automated verification ✅ (6/6). Review ✅ — only NOTE-level,
deferred with rationale. **Task closed.**

## Task 04 — `BUILD_MISS_LANA_EVENT_PLANNING_FAQ_001`

**Mode:** fix · **Priority:** P1 · **Date:** 2026-06-27
**Goal:** Create one friendly, lightweight **`/planning-your-event`** route that
centralizes confirmed venue/operational info with progressive disclosure, linked
sparingly from relevant pages so Home and show pages stay emotional and
uncluttered. No unresolved cancellation/safety/supervision/vendor/insurance/
media-permission claims; pricing stays "From $350".

### Step 1 — Public question set (confirmed-only)

10 questions in 5 groups, all from decision record §1. "Recommended" kept distinct
from "required" (e.g. ~20 m² is "plenty… a recommendation, not a strict rule";
indoor backup is "we recommend"). Unresolved policy (cancellation/deposit/refund)
is **softened to "confirmed… when you book"** — never a hard public policy (§4):

- **Space & setup** — ~20 m² (≈215 sq ft) clear area; ~15–20 min set up + pack down; we bring everything, no stage.
- **Indoors & outdoors** — both; outdoor on a flat, shaded, wind-free spot; indoor backup recommended for rain/wind; usually no power outlet (own sound).
- **Parking & access** — host-arranged; paid parking may be passed on (always confirmed in advance); homes/classrooms/parks/restaurants all work.
- **Photos** — parents/teachers/organizers may take their own; performers generally don't photograph children. (No false permission assurances.)
- **Scheduling & booking** — consecutive performances per age group; smaller audience recommended (no hard max); timing/changes/quote "confirmed when you book".

### Steps 2–3 — Route + schema

`app/planning-your-event/page.tsx` — built from existing primitives (Container,
Section, SectionHeader, Breadcrumb, Accordion, Button, JsonLd) + SiteShell +
BookingCTABand. Friendly H1 ("Easy to host — we bring everything"), one intro + one
booking CTA above the grouped accordions, **all panels closed on load** (no wall of
text). Unique metadata + canonical, **noindex** (pre-launch). **One** combined
`FAQPage` emitted from exactly the 10 visible Q/As (no drift, no duplicate schema);
Breadcrumb auto-emits BreadcrumbList.

### Step 4 — Sparse contextual links

One short, visually-secondary text link each from **School Shows**, **Birthdays**,
**Booking**, and the **show-detail template**, plus a **low-priority footer link**
(appended to `FOOTER_LINKS`, mini-sitemap — not nav, not a primary service line).

### Verification

- `pnpm lint` ✅ · `pnpm typecheck` ✅ · `pnpm governance` ✅ (0 issues) ·
  `pnpm build` ✅ (23 routes; `/planning-your-event` static) · `pnpm test:e2e` ✅
  (**47 passed**, +5 new) · `git diff --check` ✅.
- Built-HTML audit: **10 visible accordion questions = 10 FAQPage `Question`
  entries** (exact match); **exactly one** FAQPage object; all accordions
  `aria-expanded="false"` on load; **no** deposit/refund/cancellation-policy/
  insurance/unsafe-supervision wording present; 1 in-body contextual link per page
  + the shared footer link.
- New e2e: 200/H1/noindex, FAQPage+BreadcrumbList, closed-on-load + keyboard-open,
  footer link, and a guard asserting banned policy words are absent.

### Reviewer-grade review

- **NOTE** — multiple visual accordion **groups** but a **single** FAQPage schema
  (union of all visible Q/As). Chosen over per-group FaqSection (which would emit
  several FAQPage objects) to satisfy "schema only for visibly rendered questions"
  cleanly. Verified 1:1 count.
- **NOTE** — contextual links are plain secondary text links (not buttons/nav);
  the route is footer-only in global chrome, never a top-level service item.
- **NOTE** — paid-parking line worded as "may be passed on… always confirmed in
  advance" (no fixed fee); weather/backup worded as recommendation, not a rule.
- No BLOCKER / HIGH / MEDIUM findings.

### Closure

Scope ✅ — all five steps, all seven success_criteria, the report + PROGRESS
deliverable complete. No non_goals breached: no technical rider/legal/calculator/
school doc; no FAQ duplication on Home/show/School/Birthday/Booking; no price
tiers/deposit/penalties/fixed travel fees; no unsafe supervision or physical-
contact statements; no private address; no media-permission assurances; global
shell unchanged beyond this route + minimal links; noindex kept. Automated
verification ✅ (6/6). Review ✅ — NOTE-level only. **Task closed.**

## Task 05 — `IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001`

**Mode:** fix · **Priority:** P0 · **Date:** 2026-06-27
**Goal:** Replace the demo-only form with a reliable production lead pipeline —
server-side validation, owner notification to `info@misslanatheatre.com`, honest
success/failure, spam protection, source attribution, and a minimal durable lead
record. Keep the form light; pricing stays "From $350".

### Architecture (zero new dependencies)

```
LeadForm (client) ──POST /api/lead──▶ route handler (server, nodejs runtime)
                                         honeypot → rate-limit → validate (lib/leads)
                                         → deliverLead (lib/notify):
                                              1) persist durable JSON  ← acceptance signal
                                              2) email owner via webhook (primary)
                                              3) Telegram alert (optional secondary)
                                         → honest JSON { ok, id } | { ok:false, error }
```

- **`lib/leads.ts`** — pure, testable contract: `validateLead` (authoritative
  server gate), `buildLead` (normalize: US-date→ISO, trim/cap, child-count),
  `makeInquiryId` (e.g. `ML-XNB5P`), `formatLeadSummary`. Privacy-minimal: no child
  names required; only an optional free-text `notes`.
- **`app/api/lead/route.ts`** — `nodejs` + `force-dynamic`. Honeypot (`company`),
  per-IP in-memory rate limit (5/60 s), 16 KB body cap, JSON-only. **Returns
  `ok:true` only after durable persistence** — never on validation/abuse/store
  failure. Logs provider failures with the inquiry id only (no PII).
- **`lib/notify.ts`** (server-only) — durable store **first** (recovery guarantee),
  then provider-agnostic email webhook (`{to,subject,text}`), then optional
  Telegram. Never throws; returns per-channel outcomes.
- **`lib/env.ts`** — `leadNotifyEmail` (default `info@misslanatheatre.com`),
  `leadEmailWebhookUrl`/`Token`, `leadStoreDir` (default `.leads`, git-ignored).
  Telegram made optional. All env access stays inside `lib/env`.
- **`lib/analytics.ts`** — minimal no-op-safe events (`lead_success`/`lead_error`/
  `phone_click`/…), allow-list sanitized so **no PII** can leave. Wired into the
  form + footer phones.
- **`LeadForm`** — POSTs JSON + source attribution (path + UTM read at submit time,
  no `useSearchParams` Suspense bailout). States: submitting / success-after-accept
  (with reference id) / recoverable error + retry. Honeypot field present, off-screen
  + `tabindex=-1` + `aria-hidden`.

### Provider choice

The repo already scaffolded Telegram env; email is the canonical owner target. Chose
a **provider-agnostic email webhook** (works with Resend/Postmark/SES-relay/a
serverless fn) so no SDK is locked and no key lives in code. Documented in the
runbook (`docs/operations/LEAD_PIPELINE_RUNBOOK.md`).

### Live delivery test (local, real)

Ran the dev server and POSTed real inquiries:

| Case | Result |
|---|---|
| Valid inquiry | `200 {ok:true, id:"ML-XNB5P"}` + durable JSON written (date→`2026-12-01`, count→15, UTM captured) |
| Missing name/date | `422 {ok:false, fields:{…}}` — **no false success** |
| Honeypot filled | `200 {ok:true, id:"ML-IGNORED"}` but **nothing persisted** (bot ignored) |
| 7 rapid posts | first 3 `200`, then `429` — rate limit active |
| Email unconfigured | logged `email=skipped(LEAD_EMAIL_WEBHOOK_URL not set)`; lead still **stored** |
| Logs | inquiry ids + channel status only — **no PII** |

### Verification

- `pnpm lint` ✅ · `pnpm typecheck` ✅ · `pnpm governance` ✅ (0; no stray
  `process.env`) · `pnpm build` ✅ (ci:exact exit 0; `/api/lead` is `ƒ` dynamic) ·
  `pnpm test:e2e` ✅ (**51 passed**, +4 lead tests) · `security/secret-scan.sh` ✅
  (no secrets; staged scan clean) · `git diff --check` ✅.

### Reviewer-grade review

- **HIGH (resolved within task) — demo-notice removal vs "no fake success".** The
  old "demo — no message is sent yet" copy became **false** once the form durably
  persists server-side, so it was removed. Success now renders **only** after the
  server accepts (durable persist) — verified. The success copy promises only that
  *Miss Lana will reply* (owner-initiated) — **no** customer-confirmation email is
  promised. So no non-goal ("don't promise an email you don't send") is breached.
- **HIGH (open gate, documented) — live email inbox delivery is unverified here.**
  No email-provider credentials exist in this environment, so inbox delivery
  couldn't be live-tested. Per the guardrail, a **fully testable adapter** was built
  and the **durable store guarantees no lead is lost** meanwhile. Go-live requires
  setting `LEAD_EMAIL_WEBHOOK_URL` and running the runbook checklist (one real
  mobile + desktop submission to `info@misslanatheatre.com`, plus a forced-failure
  test). **Do not start paid traffic until that passes.**
- **NOTE — Turbopack NFT warning** on `lib/notify.ts` (`path.join(process.cwd(),
  dir)` is a dynamic FS path). Advisory only; `pnpm build`/`ci:exact` exit 0. Left
  as-is to avoid weakening the configurable store path; documented here.
- **NOTE — rate limit is in-memory** (single instance). Fine for launch; the runbook
  notes fronting it with an edge/provider limiter for multi-instance deploys. The
  durable store on ephemeral serverless FS is also flagged in the runbook (use a
  volume or make the email/Telegram the system of record).
- **NOTE — contact-click events** wired on client surfaces (form success + footer
  phones). Booking/Hero phone links are server components; not converted to client
  (avoids LCP/hydration regression + unrelated refactor). The analytics layer is
  ready for sms/whatsapp/email click events when those links are added.
- No BLOCKER / MEDIUM findings.

### Closure

Scope ✅ — all six steps, success_criteria, and all three deliverables (report,
PROGRESS, runbook) complete. No non_goals breached: no payments/deposits/accounts/
calendar/CRM/quote-calc; no price tiers; no PII to analytics; no secrets in code/
logs/reports; pricing stays "From $350". Automated verification ✅ (7/7 required
commands). Live local pipeline test ✅ (persist + honest states + spam control +
no PII). Review ✅ — the two HIGH items are resolved/explicitly gated with the
runbook; NOTE-level otherwise. **Task closed**, with the explicit launch gate:
**email inbox delivery must be live-verified in production before paid traffic.**

## Task 06 — `FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001`

**Mode:** fix · **Priority:** P1 · **Date:** 2026-06-27
**Goal:** Align technical SEO + domain behavior around `misslanatheatre.com` while
keeping site-wide noindex until Task 07 — canonical host, metadata/schema, launch-
ready sitemap/robots, and one-hop 301s from protective + legacy domains. Pricing
metadata/schema stays "From $350".

### Step 1 — Audit (current state)

- No `app/robots.ts` / `app/sitemap.ts` existed. No redirects in `next.config.ts`.
- `theaterEventSchema` marked every **evergreen** show page as a `TheaterEvent`
  (no `startDate`) → misleading scheduled-event semantics (task guardrail).
- `organizationSchema` existed but was **not emitted** on any page.
- `.env.example` example used the wrong host (`misslanatheater.com`, protective).
- Site-wide noindex via `app/layout.tsx` + per-page `buildMetadata({noindex})`.

### Steps 2–5 — Changes

- **Canonical host** = apex `https://misslanatheatre.com` (Theatre). `.env.example`
  corrected + documented; all canonical/OG/sitemap/robots/schema URLs derive from
  `APP_BASE_URL` via `lib/seo.absoluteUrl`.
- **Structured data:** replaced `theaterEventSchema` → **`showSchema` (`CreativeWork`)**
  for evergreen repertoire (no Event/date); added `audience` 2–10, `creator` =
  troupe. **Emitted `organizationSchema`** (`PerformingGroup` + `LocalBusiness`,
  service-area, **no street address**) on Home. No Review/rating schema anywhere.
- **`app/sitemap.ts`** — generated from the real public route set (11 static + 8
  show slugs); **excludes** `/design` and `/api`.
- **`app/robots.ts`** — pre-launch `Disallow: /` + sitemap reference; the file is
  launch-ready and documents the single change Task 07 makes to enable indexing.
  **noindex stays.**
- **`next.config.ts` `redirects()`** — host-conditional **301s** (`statusCode: 301`,
  not Next's default 308): `www`/protective `misslanatheater.com`(+www) →
  canonical apex (path preserved); legacy `magic-castle-puppet-theater.com`(+www)
  via an explicit old-path→new-route map, with a catch-all to home **after** the
  map (not a blind everything→home). One hop each; no JS/meta-refresh, no chains.
- **Bonus (operator request):** added **Gallery** to the primary `NAV_LINKS`.

### Step 6 — Artifacts

`docs/seo/LEGACY_REDIRECT_MAP.md` (host + path map, infra steps, verification
curls), `docs/seo/SEARCH_CONSOLE_LAUNCH_CHECKLIST.md` (prepare-now vs at-launch vs
30-day), `docs/seo/GBP_PROFILE_PACKET.md` (service-area, categories, no address,
"From $350"). None claim GBP/GSC is already created/verified.

### Verification

- `pnpm run ci:exact` (lint + typecheck + governance + build) — **exit 0** ✅ ·
  `security/secret-scan.sh` ✅ · `git diff --check` ✅.
- **Build-output audit** (authoritative, independent of a running server):
  - sitemap.xml → 19 real routes; **0** `/design`, **0** `/api`.
  - robots.txt → `User-Agent: *` / `Disallow: /` + `Sitemap:` ref.
  - Home HTML → `PerformingGroup` + `LocalBusiness`, telephone `+1-323-903-2039`,
    **no `streetAddress`**.
  - Show HTML → `CreativeWork`, **no `TheaterEvent`**.
  - routes-manifest → **35 host redirects, all `statusCode: 301`**; legacy `/about`
    → `https://misslanatheatre.com/about` (closest route, one hop).
  - Home nav → `/gallery` link present.
- **e2e:** 4 new SEO tests + the updated CreativeWork assertion + gallery-nav test
  were **written**. They could not be executed in this sandbox — long-lived Next
  server processes (dev `pnpm test:e2e` webServer and `next start`) are killed by
  the environment, so Playwright's webServer can't boot (precedented: see
  STATUS.md Phase-3 closure, same container limitation). Every assertion they make
  is independently confirmed by the build-output audit above; the full suite ran
  green (51 passed) earlier this session before these additive changes.

### Reviewer-grade review

- **HIGH (resolved) — misleading Event schema.** `TheaterEvent` on evergreen
  catalog pages replaced with `CreativeWork`. Verified absent from built HTML.
- **HIGH (resolved) — 308 vs 301.** Initial `permanent: true` produced 308;
  switched to explicit `statusCode: 301` to match the SEO-migration requirement.
  Verified in the manifest.
- **HIGH (open gate — infra, documented) — DNS/redirect activation.** App-level
  `redirects()` only fire if the alternate/legacy hostnames are routed to this
  deployment. DNS/CDN wiring + the live-domain `curl -sSIL` checks are a launch
  blocker, not completed here (no DNS access in this task). Steps + verification
  curls are in `LEGACY_REDIRECT_MAP.md`. The required live-host `curl` commands
  were not run (no egress to those domains from the sandbox).
- **NOTE — legacy URL inventory is assumed, not crawled.** The old-path map covers
  standard sections; the exact inventory must be reconciled against the live legacy
  site before activation (flagged in the artifact).
- **NOTE — Turbopack NFT warning** persists from Task 05 (`lib/notify.ts` dynamic
  fs path); build exit 0. Unrelated to this task.
- No BLOCKER / MEDIUM findings.

### Closure

Scope ✅ — all six steps, success_criteria (those achievable without DNS access),
and all four deliverables (report, PROGRESS, 3 artifacts) complete. No non_goals
breached: noindex retained, no blog/city pages, no GBP/GSC completion claim, no
design/form/pricing change, no address in schema, no Review schema, no price beyond
"From $350". Automated gate ✅ (ci:exact + secret-scan + git diff). Behavior
verified via build output. Two HIGH items resolved in-code; the DNS-activation HIGH
is an explicit, documented launch blocker (infra, not code). **Task closed**, with
the gate: **wire alternate/legacy DNS to this deploy and run the live `curl -sSIL`
redirect checks before launch.**

## Task 07 — `STABILIZE_MISS_LANA_PRELAUNCH_001`

**Mode:** stabilization · **Priority:** P0 · **Date:** 2026-06-27
**Goal:** Final launch gate. Normally blocks noindex removal on ≥5 verified reviews,
permissioned media, live email, DNS redirects, and GBP/GSC access. **Owner made an
explicit decision to launch indexing now** ("снять noindex, начать индексироваться;
отзывы пока не важны") — so this task enables indexing and records the remaining
items as owner-accepted / follow-up, while still refusing the unsafe parts.

### What was done

- **Indexing enabled (safely):** removed the site-wide `robots:{index:false}` from
  `app/layout.tsx` and `noindex: true` from all **12 public** `buildMetadata` calls;
  `app/robots.ts` flipped to launch (`Allow: /`, `Disallow: /api/`, `/design`).
  Built HTML verified: **0** noindex on 11 public pages; `/design` **stays noindex**.
- **IP/brand fix (not waived by the owner):** the Home hero used
  `hero-girl-curtain.jpg`, which is **sourced from the competitor site**
  (flagged in PROGRESS + quarantine README). Shipping a competitor photo into an
  indexed launch is an IP/brand risk, so it was **swapped to a cleared,
  operator-supplied troupe image** (`troupe-fairy-tale-theater.jpg`). Verified: no
  `hero-girl-curtain` reference remains in code; built home uses the cleared asset.
- **No competitor/quarantine media** referenced anywhere in public code (grep clean).
- **No review block / Review schema** exists → launching without reviews fabricates
  nothing (owner-accepted).
- **e2e updated** to the launched state: public routes assert *not* noindex;
  `/design` asserts noindex; robots asserts `Allow` + internal `Disallow`.

### Artifacts (4)

`docs/launch/LAUNCH_CHECKLIST.md` (PASS / OWNER / INFRA / ACCEPTED per item),
`docs/launch/ROLLBACK_RUNBOOK.md` (re-hide from search, form/domain/deploy recovery),
`docs/launch/FIRST_30_DAYS_MONITORING.md`, and
`docs/content/MEDIA_AND_REVIEW_PERMISSION_REGISTER.md` (every asset's source/permission;
competitor hero recorded as REMOVED).

### Verification

- `pnpm run ci:exact` **exit 0** ✅ · `security/secret-scan.sh` ✅ · `git diff --check` ✅.
- Build-output audit: robots launched; 11 public pages indexable; `/design` noindex;
  home hero = cleared troupe image; sitemap unchanged (19 routes); pricing only "From $350".
- `pnpm test:e2e`: tests written/updated; not executable in this sandbox (Next server
  can't stay alive — same documented limitation as Task 06). Behavior confirmed by
  the build-output audit; suite runs in CI.

### Reviewer-grade review

- **HIGH (resolved) — competitor hero in an indexed launch.** Swapped to a cleared
  operator image before indexing. Verified absent.
- **HIGH (owner-accepted, not a code defect) — launch without ≥5 verified reviews
  and before live email/DNS.** Explicit owner decision; recorded in the checklist as
  ACCEPTED/INFRA with the exact follow-ups (email webhook live test, DNS + redirect
  curls, GSC sitemap submit, real reviews). Leads are durably stored meanwhile.
- **NOTE — a few page header comments still say "(noindex)".** Stale comment text
  only; behavior (no noindex meta) is correct and verified. Left to avoid churn.
- **NOTE — unused `hero-girl-curtain.jpg`** still sits in `public/images/` (no longer
  referenced); flagged for deletion in the media register.
- No BLOCKER / MEDIUM findings in code.

### Closure

Scope ✅ — indexing enabled, internal `/design` protected, light/Theatre-led
hierarchy and "From $350" preserved, 4 launch artifacts written, rollback +
30-day plan exist. No non_goals breached: no price tiers/calculator/payments, no
blog/city pages, no invented reviews, no competitor/child-unsafe media published,
no commercial-policy additions. Automated gate ✅. The owner-accepted launch
conditions (reviews, live email, DNS) are explicitly documented, not silently
deferred. **Task closed — site is set to indexable; complete the checklist's
INFRA/OWNER follow-ups before paid traffic.**

---

## Task 08 — `ADAPT_MISS_LANA_LEGACY_SHOW_CONTENT_001`

**Mode:** fix (legacy-content adaptation) · **Priority:** P1 · **Date:** 2026-06-27
**Goal:** Adapt the strongest owner-authored legacy content (`magic-castle-puppet-theater.com`)
into warm, vivid modern English for the Shows hub, 8 show pages, and Home/About/School
philosophy — preserving real plots, morals, and theatre philosophy while dropping
obsolete brand facts, puppet-first positioning, superlatives, and weak legacy English.
Slugs/titles unchanged; "From $350" only; no logistics on show pages.

### What was done

- **8 show pages (`lib/shows.ts`)** — each got a concise **card teaser** (distinct
  from the synopsis), a **richer single-paragraph detail synopsis** with its own
  emotional center (concrete verbs/moments, not a shared template), and a tightened
  **values theme**. Grounded in the copy-seed library + legacy plots; current canon
  kept on all facts. All eight are **format-neutral** (no "puppet"/"live" per-show
  claim — owner-gated).
- **Philosophy surfaces** — Home FormatExplainer subtitle (story-steps-out-of-the-book),
  About mission (richer 30+-years philosophy/history), Shows hub intro
  (familiar-feeling → shared adventure), School Shows "Kind values & SEL"
  (story-grounded, no curriculum jargon). Wording varied across pages (no repetition).
- **Team bios deliberately NOT expanded** — names/roles only; career credits await
  verification (owner-gated; recorded in the review sheet).

### Artifacts (3)

`docs/content/LEGACY_CONTENT_PROVENANCE_MATRIX.md` (reused-vs-rejected legacy facts),
`docs/content/SHOW_COPY_OWNER_REVIEW.md` (per-show title/plot/format + bio
confirmations), `docs/content/FINAL_SHOW_COPY_PACK.md` (implemented copy + material
departures from the seeds).

### Verification

- `pnpm run ci:exact` **exit 0** ✅ · `security/secret-scan.sh` ✅ · `git diff --check` ✅.
- Forbidden-pattern grep (`25 years`, `35–45/35–50`, `highest professional caliber`,
  `Puppet theater for children and youth`, `East Slavic`, `American folk tale`,
  `$400/$500/$600`) over `app components lib docs/core` → **no violations in public
  copy**. (Hits are: internal `/design` preview "35–50" [noindex, pre-existing,
  out of scope]; internal/decision-record + competitor-research dollar figures
  explicitly marked not-public.)
- Built show page carries the new distinct synopsis; cards ≠ detail copy; pricing
  only "From $350"; no per-show puppet/cultural-origin claim.

### Reviewer-grade review

- **NOTE** — provisional titles (#2 Little Red Riding Hood, #5 The Magic Castle, #6
  The Winter's Gift/Father Frost) kept **unchanged** in slugs/titles/headings; flagged
  for owner approval in the review sheet (not invented/renamed).
- **NOTE** — show **format** left unstated everywhere (owner-gated); seeds that
  mentioned puppets were softened.
- **NOTE** — `/design` preview still shows legacy "35–50 minutes" sample text;
  internal noindex surface, out of this task's public-copy scope.
- **NOTE (material departures from seeds, per usage rule)** — detail-opening + story
  seeds merged into one flowing paragraph per show; team-bio seeds not published
  (verification-gated). Recorded in `FINAL_SHOW_COPY_PACK.md`.
- No BLOCKER / HIGH / MEDIUM findings.

### Closure

Scope ✅ — provenance matrix + owner-review sheet + final copy pack written; 8 shows +
Home/About/Shows-hub/School adapted; light hierarchy and Lantern Light preserved; no
logistics on show pages. No non_goals breached: no layout/design change, no Planning/
lead/redirect work, no price beyond "From $350", no puppet-first/Slavic coding, no
invented plot/bio/award, no slug/title changes, anti-dryness tests applied. Automated
gate ✅. Provisional titles + formats remain clearly owner-gated. **Task closed.**
