# Site Copy Audit — Miss Lana's Fairy-Tale Theater

**Task:** HERMES_SITE_COPY_AUDIT_001 · read-only · 2026-06-23
**Scope:** every site-facing text block (pages, shell, blocks, microcopy, metadata, schema text, copy in data modules) vs the project canon.
**Status of this doc:** recommendations only. **No files were modified.**

---

## 1. Executive summary

The MVP copy is in **good shape and broadly on-canon**. Voice is warm, kind, values-first ("kindness, friendship, helping one another"); positioning is consistently "a professional live costumed theater, not a one-off animator"; the honesty rule holds (no "only/first/best"); identity is theater, not "puppet"; the Ukrainian heritage is handled as a quiet, country-neutral backstory. The 8-show repertoire, troupe, ages, runtime, areas, phones and "from $350" all match the canon. Forbidden-framing grep is **clean** in rendered copy.

Almost everything flagged below is **temporary-placeholder hygiene**, not off-brand writing. The few things that should change first:

1. **Strip the literal "Placeholder copy." / "Temporary copy." tokens** — these ship to visitors in **49 places across 15 files** (page subtitles, card blurbs, lib/site blurbs). This is the single biggest "temporary → final" item. *(HIGH)*
2. **`PersonaIntro` alt text asserts "founder"** — `"Miss Lana, founder and host…"`. The Svitlana = owner/founder link is explicitly **owner-gated / unconfirmed** in the canon; the rest of the site correctly says "Director" only. *(HIGH)*
3. **Pricing contradiction:** the public face is **"from $350"** everywhere, but the pricing table's first row is **"$300–350"** for up to ~15 children — a visitor sees a sub-$350 figure under a "from $350" promise. Owner must reconcile the public floor. *(MEDIUM)*

No `BLOCKER`-level factual error or forbidden-framing violation was found. The prose itself is refinable, not broken.

---

## 2. Scope and exclusions

**Covered (all in scope):** Home + all 11 blocks; Booking; Pricing; Shows hub; the 8 show-detail pages (single template + `lib/shows`); School Shows; Birthdays; Services; Characters; Gallery; About. Shell: `Nav`/`SiteHeader`, `SiteFooter`, `BookingCTABand`, `LeadForm`, `StubPage`, `Card`. Metadata + JSON-LD (`buildMetadata`, `organizationSchema`, `theaterEventSchema`, `breadcrumbSchema`, `faqSchema`). Data modules: `lib/shows.ts`, `lib/site.ts`, `lib/gallery.ts`, `lib/seo.ts`.

**Excluded (per task non-goals):** imagery/photo/video quality; visual design, layout, components, perf, a11y mechanics; rewriting/applying copy; competitor/pricing research; the internal `/design` styleguide page copy.

---

## 3. Method

1. Read the canon first: `02_POSITIONING_AND_TONE.md` (voice), `BRAND.md`, `01_CONTENT_INVENTORY.md`, `04_SEO.md`, `SITE_STRUCTURE_AND_BLOCKS.md`, plus the task's `current_truth`.
2. Forbidden-term grep passes over `app/ components/ lib/`: `puppet`, `25 years`, `magic castle`, `russian|slavic|ukrain|soviet`, `only|first in LA`, Cyrillic `[\x{0400}-\x{04FF}]`, `теремок`.
3. Per-file walk of every page, block, shell component and data module — observation → judgment → recommendation, with file:line citations.
4. Cross-checks: facts vs canon; SEO title/description/H1 uniqueness; show titles/slugs consistency; phone/date/dash format; CTA/booking-path consistency.

**Forbidden-term grep result:** clean in rendered copy. Hits were only (a) code comments stating the rules, (b) the out-of-scope `/design` page, and (c) the **show title** "The Magic Castle" in `lib/shows.ts` — an *allowed show title* (not the retired brand), correctly not flagged.

---

## 4. Inventory matrix

Status legend: **real** = final-ready fact/label · **temp** = placeholder prose to finalize · **stub** = scaffold/marker text · **missing** = required copy absent.

### 4.1 Data modules

| Module | Block | Short quote | Status | Issue | Sev |
|---|---|---|---|---|---|
| `lib/site.ts:10` | BRAND | `"Miss Lana's Fairy-Tale Theater"` | real | matches BRAND.md | — |
| `lib/site.ts:18` | FACTS | `experience "30+ years"`, `ages "Ages 2–10"`, `showLength "35–50 min"`, `priceFrom "from $350"` | real | all match canon | — |
| `lib/site.ts:30` | PHONES | `(213) 282-1054 / (323) 903-2039` | real | match canon | — |
| `lib/site.ts:36` | AREAS | base LA + San Diego/Sacramento/San Jose | real | match canon | — |
| `lib/site.ts:86–116` | SERVICE_LINES blurbs | `"…Placeholder copy."` ×4 | temp | literal token visible; blurbs render on `/services` + Home | HIGH |
| `lib/site.ts:139` | TROUPE | 4 names + roles, Svitlana = "Director" | real | matches canon; ownership correctly NOT asserted | — |
| `lib/site.ts:150` | VALUES | `"…Placeholder copy."` ×3 | temp | literal token visible on `/about` | HIGH |
| `lib/site.ts:170` | PRICING_TIERS | `"Up to ~15 children" → "$300–350"` | real (owner logic) | first row contradicts "from $350" face | MED |
| `lib/shows.ts:42–128` | 8 synopses + teasers | e.g. `"A signature Miss Lana story."` | temp | placeholder prose, owner-approval pending; titles/slugs canonical | HIGH |
| `lib/seo.ts:11` | SITE.description | `"Touring children's live-costumed fairy-tale theater…"` | real | feeds org schema + root meta; "live-costumed" slightly awkward | LOW |
| `lib/gallery.ts:43` | 14 captions | `"A costumed fairy-tale scene mid-performance."` | temp (generic alt) | non-final, generic by design; fine until assets land | NOTE |

### 4.2 Pages

| Page | Block | Short quote | Status | Issue | Sev |
|---|---|---|---|---|---|
| Home `/` | Hero H1 | `"Live theater that comes to you."` | real | on-canon tagline (§7); but page-title says "Live **children's** theater…" — mismatch | LOW |
| Home | Hero lead | `"Professional children's theater for LA…"` | temp | clean placeholder (no visible token) | NOTE |
| Home | FormatExplainer | `subtitle "…Placeholder copy — final wording lands in a later phase."` + 4 `"Placeholder copy."` | temp | literal tokens visible | HIGH |
| Home | ServiceLineCards | `subtitle "…Placeholder copy."` | temp | token visible | HIGH |
| Home | FeaturedShows | `"…a few favourites below. Photos coming soon."` | stub | asset marker, fine | NOTE |
| Home | B2BTeaser / B2CTeaser | `"…Placeholder copy."` + `"Assembly / classroom photo"` / `"Birthday party photo"` | temp/stub | tokens visible; teaser photo still placeholder while the linked pages use real photos | MED |
| Home | PersonaIntro | `"Hi, I'm Miss Lana. With 30+ years…"` + `"…Placeholder copy."` | temp | first-person persona is canon (§8) ✓; token visible; **alt = "founder"** (see 5.B) | HIGH |
| Home | GalleryTeaser | `"…Placeholder tiles — assets pending."` | stub | asset marker, fine | NOTE |
| Home | HowItWorksAreas | 3× `"Placeholder copy."` + `"Distance is quoted on request."` | temp | tokens visible; facts correct | HIGH |
| `/booking` | header + map | `"Book a show"`, `"Service-area map / GBP-first · embed later"` | real/stub | clean; map is a deliberate placeholder | NOTE |
| `/booking` | LeadForm | labels/helpers/errors/success (see 4.3) | real | strong, see below | — |
| `/pricing` | header | `"Transparent, market pricing — from $350…"` | real | clean | — |
| `/pricing` | table + notes | `"$300–350"` row; `"…(placeholder presentation)."` | real/stub | $300–350 vs "from $350"; "placeholder presentation" token visible | MED |
| `/pricing` | packages | `"Every package starts from $350. Placeholder copy."` + 3× `"Placeholder copy."` | temp | tokens visible; "from $350" vs table | HIGH |
| `/shows` (hub) | header | `"Eight kind fairy tales to choose from"` | real | clean, on-voice | — |
| `/shows/{slug}` | synopsis note | `"Synopsis is placeholder copy, refined before launch."` | stub | honest marker; remove at launch | MED |
| `/shows/{slug}` | hero/CTA/related | `"Book this show"`, `"Also known as {altTitle}"` | real | clean; consistent | — |
| `/school-shows` | hero + offer | `"Theater your school can say yes to… Temporary copy."` | temp | token visible; positioning real | HIGH |
| `/school-shows` | FAQ ×5 | logistics/ages/values/travel Q&A | real | accurate, on-canon, feeds FAQPage | — |
| `/birthdays` | hero + steps | `"A magical party — without the hassle… Temporary copy."` | temp | token visible; positioning real | HIGH |
| `/birthdays` | FAQ ×5 | `"From $350, by number of children; distance… on request."` | real | accurate | — |
| `/services` | hero + footer line | `"…Pick the format that fits your event. Temporary copy."` ×2 | temp | tokens visible; umbrella positioning real | HIGH |
| `/characters` | hero/difference/steps | `"Costumed characters who come to visit"` + 8× `"Temporary copy."` | temp | tokens visible; "not a one-off animator" real | HIGH |
| `/gallery` | header | `"…placeholders below show where each will live. Temporary copy."` | temp/stub | token visible | MED |
| `/about` | mission | `"Theater as a little bit of magic… Temporary copy."` | temp | token visible | HIGH |
| `/about` | 30+ years | `"More than thirty years of stage experience… Temporary copy."` | temp | fact correct; token visible | HIGH |
| `/about` | troupe | 4 members + roles (from `lib/site`) | real | canonical; ownership not asserted ✓ | — |
| `/about` | backstory | `"…rooted in a rich theatrical tradition — years of classical stage training carried across the world and brought home to Los Angeles. Temporary copy."` | temp | **correctly country-neutral, not a slogan** ✓ (§4.6); token visible; explicit heritage still owner-gated | HIGH (token) |
| `/about` | values | 3× from VALUES (`"…Placeholder copy."`) | temp | tokens visible | HIGH |

### 4.3 Shell / global

| Component | Text | Status | Issue | Sev |
|---|---|---|---|---|
| `Nav` (header) | links Shows/School Shows/Birthdays/Characters/About + "Book Miss Lana"; "Skip to content"; wordmark "Miss Lana / Fairy-Tale Theater" | real | clean, consistent with nav config + BRAND | — |
| `SiteFooter` | tagline `"Professional live children's theater that comes to you — 30+ years…"`; "Where we go"; "Social / Links pending"; "© {year} … All rights reserved."; `"Preview build / Placeholder content & imagery · not for indexing yet."` | real/stub | tagline is clean placeholder; **"Preview build" badge must be removed at launch**; social = owner-pending | MED |
| `BookingCTABand` | default `sub "…Placeholder copy."` | temp | default only; most callers override with real subs | MED |
| `LeadForm` | labels, helpers, errors, success panel; `"Demo only — this form doesn't send anything yet."`; success `"This is a demo form — no message is sent yet…"` | real | well-written, friendly, accessible; demo notices intentional pre-backend | NOTE |
| `StubPage` | `"Coming soon"`, `"We're putting this page together — coming soon."` | stub | **component is unused** (no imports) — dead copy, safe to ignore/remove | NOTE |
| `Card` | placeholder slot `"Photo — pending"` | stub | asset marker | NOTE |

### 4.4 SEO / metadata (per page)

| Page | Title (templated `— Miss Lana's Fairy-Tale Theater`) | Description present? | Unique? |
|---|---|---|---|
| Home | "Live children's theater that comes to you" | ✓ (~155c) | ✓ |
| /booking | "Book a show / Contact" | ✓ | ✓ |
| /pricing | "Pricing" | ✓ | ✓ |
| /shows | "Shows" | ✓ | ✓ |
| /shows/{slug} | per-show title (×8) | ✓ generated from teaser/ages/length | ✓ |
| /school-shows | "School Shows" | ✓ | ✓ |
| /birthdays | "Birthday Parties" | ✓ | ✓ |
| /services | "Services" | ✓ | ✓ |
| /characters | "Characters & Friends" | ✓ | ✓ |
| /gallery | "Gallery" | ✓ | ✓ |
| /about | "About" | ✓ | ✓ |

All titles unique; all descriptions present, sensible length, English-intent keywords (children's theater LA, preschools, school assembly, birthday party, ages 2–10, from $350). One H1 per page confirmed (`SectionHeader` defaults to `h2`; Hero/`as="h1"` supplies the single H1). Image `alt` text is meaningful throughout. **Every page hard-codes `noindex: true`** — correct pre-launch, but ~13 flags must be flipped at launch (see §8).

---

## 5. Findings by dimension

### A. Voice & positioning — **compliant** *(confidence HIGH)*
Warm, kind, plain language; values stated directly; "professional troupe, not a single animator" carried on Home (`FormatExplainer`), `/characters`, `/birthdays`; "live theater that comes to you" is the canon tagline (§7). No superlatives; honesty rule respected. No off-voice prose found. *Only* issue is the visible scaffolding tokens (dimension D).

### B. Forbidden framings — **clean, one owner-gate to watch**
- No `puppet`, no `25 years`, no `only/first`, no Russian/Slavic/Ukrainian coding, no stray Cyrillic, no leftover brand-"Magic Castle". Show title "The Magic Castle" correctly retained (`lib/shows.ts:88`).
- About backstory is exemplary: country-neutral, not a slogan, heritage kept implicit (`app/about/page.tsx:119–123`). ✓
- **HIGH — unconfirmed ownership claim:** `components/blocks/PersonaIntro.tsx:21` alt = `"Miss Lana, founder and host of the theater…"`. Canon: Svitlana is "Director" only, the owner/founder link is **unconfirmed and owner-gated** (`lib/site.ts:135–137`, `01_CONTENT_INVENTORY.md:57`). **Recommendation:** drop "founder" → e.g. "Miss Lana, the theater's host and storyteller" until the owner confirms. (The first-person persona voice itself is on-canon — only the word "founder" over-asserts.)

### C. Factual accuracy — **accurate** *(confidence HIGH)*
30+ years ✓, ages 2–10 ✓, 35–50 min ✓, troupe names/roles verbatim ✓, areas ✓, phones ✓, distance "on request" with **no published surcharge amounts** ✓ (`/pricing` says amounts are owner-set and unpublished). One internal contradiction, dimension F.

### D. English-first quality — **good**
Native, idiomatic US English; consistent en-dashes (`35–50`, `2–10`, `$300–350`); mm/dd/yyyy date mask; tasteful microcopy. No stray RU. Minor: "live-costumed" (`lib/seo.ts:14`) reads slightly awkward — consider "live costumed children's theater".

### E. SEO copy — **complete** *(see §4.4)*
Unique titles + descriptions, one H1/page, English intent keywords, meaningful alt. Gap is operational, not textual: the hard-coded `noindex` flags (launch task).

### F. Consistency — **strong, one real conflict**
- Show titles/slugs/themes/ages/length are **single-sourced** from `lib/shows.ts` → hub, detail, Home Featured, Birthdays all agree by construction. ✓
- Phone format, dash style, "from $350", "distance on request", areas — consistent across pages. ✓
- **MEDIUM — price face conflict:** "from $350" (hero, `/pricing` header, packages "Every package starts from $350", school-shows, birthdays, CTAs) vs `PRICING_TIERS` first row **"$300–350"** (`lib/site.ts:171`). A visitor reads "from $350" then sees $300. Owner must set the public floor (raise the row to "$350" for the public face, or change the promise).
- **LOW — title vs H1:** Home `<title>` "Live **children's** theater that comes to you" vs H1 "Live theater that comes to you." Align wording.

### G. CTA & booking path — **consistent**
Every page routes to `/booking` (primary) + click-to-call; `BookingCTABand` + `LeadForm` repeat the lead capture; CTA labels are clear and varied ("Book Miss Lana", "Request a school show", "Book a birthday show", "Book a character visit", "Get a quote"). No dead links (social render as inert placeholders, not `#`). ✓

---

## 6. Temporary → final list (must be replaced/approved before launch)

1. **All 49 literal `"Placeholder copy."` / `"Temporary copy."` strings** across 15 files (`lib/site.ts`; `app/{services,school-shows,gallery,about,pricing,characters,birthdays}/page.tsx`; `components/blocks/{FormatExplainer,ServiceLineCards,HowItWorksAreas,B2BTeaser,B2CTeaser,PersonaIntro}.tsx`; `components/shell/BookingCTABand.tsx`). — **finalize wording, delete the tokens.**
2. **8 show synopses + teasers** (`lib/shows.ts`) — owner review/approval; titles & slugs stay canonical.
3. **`/about` prose** — mission, 30+ years, troupe intro, backstory, values blurbs.
4. **`/shows/{slug}` "Synopsis is placeholder copy…" note** — remove once synopses approved.
5. **`SiteFooter` "Preview build · Placeholder content & imagery · not for indexing yet" badge** — remove at launch.
6. **`/pricing` "(placeholder presentation)" / "Surcharge amounts pending"** — replace once amounts land.
7. **Service-line + values blurbs** in `lib/site.ts`.
8. **Hero/footer taglines** (clean placeholders, but confirm final wording).

## 7. Owner-needed list (only the owner can supply/decide)

1. **Approve the 8 synopses** (or supply real ones) + confirm any per-show nuance.
2. **Mission / About prose** sign-off; **explicit heritage wording** + whether to name the country (currently country-neutral by canon default).
3. **"Svitlana = owner/founder" confirmation** — gates the `PersonaIntro` "founder" wording and any ownership language.
4. **Distance surcharge amounts** (still "on request" — none may be published until decided).
5. **Public price floor** — reconcile "from $350" vs the $300–350 tier (which figure is public).
6. **Social links** (Instagram/Facebook/YouTube currently inert placeholders).
7. **Format split for the 8 shows** (live / hybrid) — affects future show-page tags (currently omitted, owner-gated).
8. Later: reviews/testimonials (place reserved), optional Ukrainian language layer.

## 8. Prioritized fix plan

**Change first (pre-launch blockers for polish/accuracy):**
1. Remove "founder" from `PersonaIntro` alt text (B) — owner-gated accuracy. *(HIGH)*
2. Resolve the "from $350" vs "$300–350" price conflict with the owner (F). *(MED→HIGH once decided)*
3. Strip all `Placeholder/Temporary copy` tokens as final copy lands (D/§6). *(HIGH, bulk)*

**Then (launch hygiene):**
4. Remove `SiteFooter` "Preview build" badge + `/shows` synopsis note + `/pricing` "placeholder presentation". 
5. Flip the ~13 hard-coded `noindex: true` flags (per-page `buildMetadata` + root `app/layout.tsx`) at launch — track explicitly so nothing stays deindexed.
6. Align Home `<title>` with H1 wording.

**Cosmetic / optional:**
7. "live-costumed" phrasing in `lib/seo.ts` description.
8. Delete the unused `StubPage` component (dead "Coming soon" copy) or keep as a 404-safety scaffold.
9. Home B2B/B2C teaser still show placeholder photo boxes while the dedicated pages use real images — asset task, but the "Asset pending" labels read inconsistently.

## 9. Recommended next step

Open **`BUILD_MISS_LANA_COPY_FIXES_001` (TUNG v2-full)** to *apply* the approved/owner-supplied copy: finalize the 8 synopses + landing/about prose, delete every placeholder token, fix the "founder" alt and the price-floor conflict, and (at launch) flip the `noindex` flags. Published copy + SEO/schema text are v2-full triggers (spec §8); this audit is read-only and stops here.

---

## 10. Final verification summary

- **Scope:** all 11 MVP page types (Home, Booking, Pricing, Shows hub, 8 show pages, School Shows, Birthdays, Services, Characters, Gallery, About) + all 4 data modules + shell + blocks are in the matrix. No page or module skipped.
- **Evidence:** every finding quotes the text and cites file:line; severities (BLOCKER/HIGH/MED/LOW/NOTE) assigned; subjective calls carry confidence; temporary vs final is explicit per block.
- **Grep:** forbidden-term passes run (`puppet`, `25 years`, Russian/Slavic/Ukrainian, `only/first`, Cyrillic, brand-"Magic Castle"); clean in rendered copy; show-title "The Magic Castle" correctly not mis-flagged.
- **Facts:** cross-checked verbatim against canon — no mismatch (one internal price-face contradiction noted, not a canon error).
- **No files modified** — read-only audit. Report is date-prefixed in `docs/reports/`.
