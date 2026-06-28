# Miss Lana's Fairy-Tale Theatre — SEO, Local Search & AI-Visibility Audit

**Task:** `AUDIT_MISS_LANA_SEO_LOCAL_AND_AI_VISIBILITY_2026_001` (TUNG v2-full, **audit / READ-ONLY**)
**Date:** 2026-06-28 · **Timezone for live checks:** UTC (server) · **Brand:** Miss Lana's Fairy-Tale Theatre · **Primary domain:** `misslanatheatre.com`
**Repository:** `/home/user/Fairy-Tale-Theater` · **Branch:** `claude/miss-lana-seo-audit-g1kc7h` · **HEAD:** `99fc9d4` (Merge PR #11 — normalize lead outputs) · **Working tree:** clean (no code changes)

> This audit modifies **no** code, content, schema, redirects, robots, sitemap, DNS, Vercel, Search Console, Google Business Profile, analytics, or environment. The only files created are this report and the eight artifacts under `docs/reports/seo/`.

---

## 1. Executive summary

Miss Lana's Fairy-Tale Theatre has an **unusually strong technical-SEO foundation at the code level** for a small business: per-page unique titles/descriptions/canonicals, a correct robots + sitemap, breadcrumbs everywhere, correct `CreativeWork` schema for evergreen show pages (deliberately *not* fake `Event` data), a multi-typed `PerformingGroup`+`LocalBusiness` entity, a per-host 301 redirect matrix, security headers, and a static/SSG render that ships meaningful HTML without JS. All of this was **verified by building and running the production server locally** (`next build` + `next start` with `APP_BASE_URL=https://misslanatheatre.com`) and curling every route.

The decisive caveat: **the live production site `https://misslanatheatre.com` could not be reached from this audit environment** — the organization's egress policy returns `403` on the CONNECT tunnel for that host (and WebFetch is blocked for all hosts). So everything about *production behavior, indexation, ranking, redirects-as-deployed, and Core Web Vitals field data* is **UNVERIFIED here** and handed off with exact verification commands. Documentation says the site is "LIVE / publicly indexable since 2026-06-27," but **documentation is not proof of production**, and this audit could not independently confirm it.

The biggest real gaps are **not on-page technical SEO** — they are the off-page / operational layer that actually drives a service-area business: **Google Business Profile (existence/claim unverified), verified reviews (missing), conversion measurement (not wired — analytics is a no-op shim), Search Console submission (account-gated), and the DNS attachment that makes the coded redirects actually fire.** These match the project's own documented open items, which is a good sign of discipline.

**Four headline verdicts** (detail in §31):
- **Technically ready to index (code):** YES at code level; **UNVERIFIED on production** (pending `APP_BASE_URL` + reachability + indexation confirmation).
- **Locally ready to acquire customers:** **NO** — GBP, reviews, and citations are not yet in place/verified.
- **Measurement-ready:** **NO** — no analytics sink wired; Search Console submission unverified.
- **Growth-ready:** **PARTIAL** — strong content/IA scaffold; needs reviews, GBP, media completion, measurement, and intent tuning.

---

## 2. Audit scope, date, access and limitations

- **In scope:** repository SEO inventory; localhost production-build behavior; domain/redirect logic; metadata/schema; IA/internal links; keyword/intent; local SEO/GBP readiness; reviews/citations; competitors; CWV (code signals + handoff); measurement readiness; AI-search; official 2026 guidance; forum evidence; roadmap + child TUNGs.
- **Access granted:** repository (full read), local build/run, WebSearch.
- **Access NOT available (material limitations):**
  1. **Production host unreachable** — `misslanatheatre.com:443` returns `403` at the egress proxy ("policy denial"); WebFetch returns `403` for *all* hosts. Confirmed via `$HTTPS_PROXY/__agentproxy/status`. The same egress block was recorded by a prior build session in `STATUS.md`. **No live production HTTP, header, redirect, rendered-HTML, JSON-LD-on-prod, or CrUX check was possible.** Per environment policy, this was reported, not bypassed.
  2. **No Search Console / GA4 / GBP / Bing / Apple / Vercel / registrar access** — indexation, performance field data, profile status, and analytics could not be observed. Provided as owner handoff (§28).
  3. **WebFetch blocked** — official-source and forum research used WebSearch snippets only; publication dates are reported only when shown in a snippet.
  4. **No browser / Lighthouse** in-env (egress + no Playwright browser) — lab CWV not run; assessed from code.
- **Mitigation:** production behavior was approximated by **building and running the real production server locally** with the production base URL and curling every route + host variant. This is stronger evidence than reading source, **weaker than the live host**, and is labeled "localhost" throughout.

---

## 3. Source hierarchy and methodology

Evidence ranked: **(1) observed implementation** (code + localhost build/run output) → **(2) official platform documentation** (Google Search Central, GBP Help, Search Console Help, schema.org, Next.js, Bing, Apple — see `seo/2026-06-28-official-source-log.md`) → **(3) first-party GSC/GBP/analytics** (none authorized) → **(4) reputable industry research** → **(5) forums/anecdotes last** (`seo/2026-06-28-forum-practitioner-evidence.md`, all labeled ANECDOTAL).

Every finding carries: **status** (DONE/PARTIAL/MISSING/INCORRECT/UNVERIFIED/NOT_APPLICABLE), **severity** (BLOCKER/HIGH/MEDIUM/LOW/NOTE), **confidence** (HIGH/MEDIUM/LOW), evidence, business impact, action, owner, effort, dependency, verification. Code state, live production, and external guidance are kept separate. No keyword volume, traffic, rank, review count, or backlink metric is invented.

---

## 4. Current SEO scorecard (with rubric)

**Rubric.** Each pillar scored 0–5 against the evidence available to this audit. **Code = what the implementation does (verified locally). Prod = whether it's proven on the live host.** A pillar is capped at 3/5 when its outcome depends on an unverified production/account fact. 0 = absent, 1 = stub, 2 = partial, 3 = implemented-but-unverified-or-gaps, 4 = strong with minor gaps, 5 = complete & verified.

| Pillar | Score | Basis |
|---|---|---|
| A. Repo ↔ deploy reconciliation | 3/5 | Code excellent; prod render UNVERIFIED (egress) |
| B. Crawlability / indexability | 3/5 | robots/sitemap/SSG correct locally; **indexation on Google UNVERIFIED** |
| C. Canonicalization / migration | 3/5 | App 301s correct (one hop) locally; **DNS attachment + APP_BASE_URL UNVERIFIED** |
| D. Metadata / SERP presentation | 4/5 | Unique titles/desc/canonical/H1; **no og:image**, weak pricing H1 |
| E. Structured data / entity | 3/5 | Correct types incl. `CreativeWork`; **entity gaps** (logo/sameAs/image); FAQ not eligible |
| F. IA / internal linking | 4/5 | Clear hub-and-spoke, breadcrumbs everywhere, footer mini-sitemap |
| G. Keyword / intent mapping | 3/5 | Pages map to intent; cannibalization risks; some gaps |
| H. Content / trust / experience | 3/5 | Strong copy + real photos; **reviews missing**, positioning tension |
| I. Local SEO / GBP | 1/5 | Excellent prep packet; **GBP existence/claim UNVERIFIED**, no reviews/citations |
| J. Competitors / SERP landscape | 3/5 | Mapped (snapshot); ranks not definitive |
| K. Performance / mobile | 3/5 | Good code signals; **field CWV UNVERIFIED** |
| L. Image / video search | 3/5 | 26 real photos w/ alt; **no og:image/ImageObject/VideoObject; 4 clips unused** |
| M. Measurement / conversion | 1/5 | **Analytics is a no-op; GSC/GA4 unverified** |
| N. AI-search visibility | 2/5 | Good fundamentals; entity/3rd-party signals pending |

**Overall: foundation strong, activation weak.** The site is built well; it is not yet *operating* as a lead channel.

---

## 5. What is already implemented correctly (DONE)

> Verified by `next build` + `next start` (`APP_BASE_URL=https://misslanatheatre.com`) + curl. These are code/localhost-DONE; production parity is UNVERIFIED.

- **Per-page unique metadata** — every route returns a unique, descriptive `<title>` (templated `"<page> — Miss Lana's Fairy-Tale Theatre"`), unique meta description, and a self-referential `canonical`. `lib/seo.ts:buildMetadata`. (DONE / confidence HIGH)
- **One `<h1>` per page**, descriptive (except `/pricing`, see §8). (DONE)
- **robots.txt** — `Allow: /`, `Disallow: /api/`, `Disallow: /design`, advertises sitemap + host. `app/robots.ts`. (DONE)
- **sitemap.xml** — 19 canonical apex-HTTPS URLs (11 static + 8 shows); `/design` and `/api` excluded. `app/sitemap.ts`. (DONE)
- **Show schema is correct & honest** — evergreen shows emit `CreativeWork` (with audience/creator/genre), **not** `Event`/`TheaterEvent` without a date. This matches Google's "true representation" policy and the task guardrail. `lib/seo.ts:showSchema`. (DONE / HIGH — a genuine quality signal)
- **Entity** — multi-typed `["PerformingGroup","LocalBusiness"]` + `WebSite` on home, service-area `areaServed`, **no public street address** (correct for an SAB). `lib/seo.ts:organizationSchema`. (DONE for the model; PARTIAL for completeness, §7)
- **BreadcrumbList** JSON-LD on every page via `Breadcrumb`/`PageHero`; correct trail on show pages. (DONE)
- **Redirect matrix (app level)** — `next.config.ts` 301s: `www`→apex, `misslanatheater.com`(+www)→apex, legacy `magic-castle-puppet-theater.com` mapped paths→closest route (one hop), unmapped→home. **Verified locally** via `Host:` header (all single-hop 301 to HTTPS apex). (DONE at app level; prod firing UNVERIFIED, §10)
- **`/design` is not public** — runtime `notFound()` when `NODE_ENV=production` (curl returned **404**), plus `noindex` + robots `Disallow`. Triple-protected. (DONE)
- **Security headers** — CSP, HSTS (preload), nosniff, Referrer-Policy, X-Frame-Options DENY, Permissions-Policy — all present on the home response. `next.config.ts`. (DONE)
- **Render quality** — static/SSG; home ships ~140 KB HTML with full content (no interaction required). Good for crawl + AI snippet eligibility. (DONE)
- **Fonts** — self-hosted via `next/font` (Fraunces/Nunito), `display: swap`, metric-override fallback → low CLS risk. (DONE)
- **Real media** — 73 assets in `/public`; 26 curated real photos on `/gallery` with descriptive alt text; hero uses `priority` + `sizes`. (DONE, with gaps in §7/§8)
- **Excellent launch-prep docs** — `docs/seo/SEARCH_CONSOLE_LAUNCH_CHECKLIST.md`, `GBP_PROFILE_PACKET.md`, `LEGACY_REDIRECT_MAP.md` all correctly state they do **not** prove GBP/SC/redirects exist (discipline matches this audit's framing). (DONE)

---

## 6. What is partial or only documented (PARTIAL)

- **Entity completeness** — `Organization/LocalBusiness` lacks `logo`, `image`, `email`, `@id`, and `sameAs` (social/GBP). Organization schema appears only on home, not `/about`. (PARTIAL / MEDIUM) — **F-11**
- **Show media** — 6/8 show pages have a hero+`og:image`; **Cinderella** and **The Gingerbread Man** have none. (PARTIAL / LOW) — **F-12**
- **Redirects** — coded and locally correct, but **only documentation** asserts they fire in production; DNS attachment + certs are an explicit operator step (`LEGACY_REDIRECT_MAP.md` §"Infrastructure"). Legacy path map is **assumed**, not reconciled against the real old site. (PARTIAL / HIGH) — **F-03**
- **Canon vs code drift** — `docs/core/04_SEO.md` still recommends `Event/TheaterEvent` for shows (code correctly uses `CreativeWork`) and an optional Ukrainian `hreflang` layer (no translated pages exist; the task says don't recommend hreflang without approved pages). (PARTIAL/INCORRECT / LOW) — **F-17**
- **Gallery video** — 4 clips filed under `/public/images/gallery/clips/` but **not displayed** and unverified; no `VideoObject`. (PARTIAL / MEDIUM) — **F-14**

---

## 7. What is missing (MISSING)

- **Conversion measurement** — `lib/analytics.ts:track()` only pushes to `window.dataLayer` *if it exists*; **no GA4/GTM/dataLayer script is loaded anywhere** (confirmed: no `next/script`, no gtag, no dataLayer init). `lead_success`, `phone_click`, etc. are **no-ops**. (MISSING / HIGH) — **F-07**
- **Open Graph image** — **no `opengraph-image`/`twitter-image` file anywhere**; all static pages render no `og:image` (twitter card downgrades to `summary`). Poor social/AI card previews. (MISSING / MEDIUM) — **F-08**
- **Verified reviews / testimonials** — none on site; a launch trust requirement (≥5 genuine, parents + school reps). (MISSING / HIGH) — **F-09**
- **Google Business Profile (operational)** — existence/claim/verification **unverifiable** here; if absent, it's the single biggest missing local-lead channel. (MISSING/UNVERIFIED / HIGH) — **F-05**
- **Search Console property + sitemap submission + Change of Address** — account-gated; unverified. (MISSING/UNVERIFIED / HIGH) — **F-04**
- **Bing Webmaster Tools / IndexNow / Apple Business Connect** — not set up (Apple supports no-storefront businesses). (MISSING / MEDIUM) — **F-16**
- **Citations / NAP set + local partnership mentions** — not established. (MISSING / MEDIUM) — **F-20**
- **`ItemList`/`CollectionPage` schema on `/shows`** — optional but absent. (MISSING / LOW) — **F-15**

---

## 8. What is incorrect or risky (INCORRECT / risk)

- **`APP_BASE_URL` fallback risk (highest single risk).** `lib/env.baseUrl` defaults to `http://localhost:3000`. It drives **every** canonical, sitemap URL, OG URL, JSON-LD `url`, and `metadataBase`. If it is not set to `https://misslanatheatre.com` in production, the entire site self-canonicalizes to localhost — catastrophic for indexing. **UNVERIFIED here.** (UNVERIFIED / BLOCKER-if-wrong) — **F-02**
- **`/pricing` H1 = "From $350".** The H1 is a price, not a descriptive heading — weak for intent and a missed "how much does kids party entertainment cost in LA" target. (INCORRECT / MEDIUM) — **F-10**
- **FAQ rich-result expectation.** `FAQPage` markup is on `/school-shows`, `/birthdays`, `/planning-your-event`, but since Aug 2023 FAQ rich results show only for authoritative **gov/health** sites — Miss Lana will **not** get them. Not harmful, but no enhancement should be claimed; optionally remove to trim payload. (NOT_APPLICABLE / NOTE) — **F-13**
- **Legacy http hosts could chain.** If the legacy/protective hosts lack their own HTTPS cert, an old `http://…/path` link may go `http→https→canonical` (a chain). Keep to one hop. (UNVERIFIED / MEDIUM) — **F-06**
- **Canonical trailing-slash inconsistency.** Home canonical = `…/com` (no slash); sitemap + schema use `…/com/`. Google normalizes, but align them. (PARTIAL / LOW) — **F-19**
- **`robots.txt` `Host:` directive** is non-standard (only Yandex). Harmless. (NOTE) — **F-18**
- **Positioning vs assets.** Brand is locked as "live theatre, **not** puppets," yet the real repertoire is partly puppet and puppet imagery is filed in `/public`. Affects honest E-E-A-T claims; owner to reconcile (already flagged in `lib/gallery.ts`). (UNVERIFIED / NOTE) — **F-24**
- **No invented metrics, fake reviews, doorway pages, link buying, or GBP keyword-stuffing are recommended anywhere in this audit** (explicitly avoided per task guardrails).

---

## 9. Production URL and indexability inventory

Full machine-readable inventory: **`seo/2026-06-28-url-inventory.csv`**. Summary:

- **19 indexable public URLs** (home, `/shows` + 8 shows, `/services`, `/school-shows`, `/birthdays`, `/characters`, `/gallery`, `/pricing`, `/planning-your-event`, `/about`, `/booking`) — all returned **200 locally** with correct canonical, in the sitemap.
- **Excluded correctly:** `/design` (404 in prod + noindex + Disallow), `/api/lead` (Disallow `/api/`).
- **Production indexation status: UNVERIFIED** — could not run a `site:misslanatheatre.com` check or GSC URL Inspection from this environment. Handoff in §28. Forum evidence (ANECDOTAL) warns new **Next.js** sites commonly sit in "Discovered – currently not indexed" for a while — expect a normal lag, confirm via GSC.

---

## 10. Domain / redirect migration matrix

Full matrix: **`seo/2026-06-28-redirect-matrix.csv`**. App-level behavior **verified locally** via `Host:` header against `next start`:

| From | Result (localhost) | Prod |
|---|---|---|
| `www.misslanatheatre.com/` | **301 → `https://misslanatheatre.com/`** (one hop) | UNVERIFIED |
| `misslanatheater.com/` (protective) | **301 → apex** | UNVERIFIED |
| `magic-castle-puppet-theater.com/about` | **301 → `/about`** (one hop, mapped) | UNVERIFIED |
| `magic-castle-puppet-theater.com/random` | **301 → home** (catch-all, one hop) | UNVERIFIED |
| `http://…` any host | not testable locally | UNVERIFIED (HSTS header set in code) |

**Critical dependencies (operator, NOT done in code):** these app redirects fire **only if** the alternate/legacy hostnames are attached to the deployment with DNS + valid HTTPS certs (`LEGACY_REDIRECT_MAP.md` §Infrastructure). The legacy path map is **assumed** — reconcile it against the real `magic-castle-puppet-theater.com` (crawl/Wayback/GSC) before relying on it. **F-03, F-06.**

---

## 11. Metadata and SERP-presentation audit

Full inventory: **`seo/2026-06-28-metadata-schema-inventory.csv`**.

- **Titles/descriptions:** unique, descriptive, intent-aware on all 19 URLs (DONE). Brand uses British "Theatre" while body copy uses American "theater" — **intentional and valid** (captures the larger US "theater" query base on the same page; not cannibalization).
- **Canonicals:** correct and self-referential everywhere.
- **H1s:** unique and one-per-page, **except `/pricing` ("From $350")** — fix to a descriptive heading (**F-10**).
- **Open Graph/Twitter:** OG title/description/url/site_name present everywhere; **`og:image` only on the 6 show pages that have a photo** — every static page (incl. home) renders **no image** (**F-08**). Add a default `opengraph-image`.
- **Favicon/icons:** `icon.svg`, `favicon.ico`, `apple-icon.png` present (file-based API).

---

## 12. Structured-data and entity audit

JSON-LD verified in rendered HTML (localhost):

- **Home:** `["PerformingGroup","LocalBusiness"]` + `WebSite` — valid multi-type (confirmed against schema.org). Service-area model, no street address (correct).
- **Show pages:** `CreativeWork` (correct for evergreen) + `BreadcrumbList`.
- **All pages:** `BreadcrumbList`.
- **`/school-shows`, `/birthdays`, `/planning-your-event`:** `FAQPage` — valid markup but **not eligible for rich results** (gov/health-only since 2023) — **F-13**.
- **Gaps (F-11):** no `logo`, `image`, `email`, `@id`, `sameAs` on the Organization; no `ImageObject`/`VideoObject`; no `ItemList` on `/shows`.
- **Eligibility reality (official):** **do not** add self-hosted `Review`/`AggregateRating` star markup — a business reviewing itself is ineligible and risky; reviews belong on GBP. `Event` rich results need *publicly bookable, physical-location* shows — keep using `CreativeWork`.
- **Verified:** `/school-shows` and `/birthdays` render exactly **2** JSON-LD blocks each (1 `BreadcrumbList` + 1 `FAQPage`) — no duplicate breadcrumb.

---

## 13. Site architecture and internal-link audit

- **Shape:** clean hub-and-spoke. Home → 4 service lines (`/services`, `/school-shows`, `/birthdays`, `/characters`) → `/shows` hub → 8 show detail pages (with related-shows cross-links + booking CTA). Crawl depth ≤ 2 for all key pages.
- **Global nav** (`lib/site.NAV_LINKS`) + **footer mini-sitemap** (`FOOTER_LINKS`, includes `/services`, `/pricing`, `/planning-your-event`, `/booking`) → no orphan pages; every sitemap URL is internally linked.
- **Breadcrumbs** everywhere (nav + schema).
- **Booking CTA** on every page (header + `BookingCTABand` + show CTAs).
- **Opportunities (F-15, OPTIMIZE TUNG):** add contextual links from `/school-shows`↔`/birthdays`↔relevant shows; ensure `/services` clearly parents the audience pages; consider `ItemList` on `/shows`.

---

## 14. Keyword and search-intent map

Full map: **`seo/2026-06-28-keyword-intent-map.csv`**. All volumes labeled **unknown (no authorized tool access)** — none fabricated. No Russian/Slavic semantics; no doorway city pages.

- **Primary intent per page:** home = "children's theater/theatre los angeles" (brand + core local); `/shows` = "live kids show / fairy tale show for kids LA"; `/services` = "touring/mobile children's theatre LA"; `/school-shows` = "school assembly entertainment LA"; `/birthdays` = "birthday party entertainment LA"; `/characters` = "costumed character show LA"; `/pricing` = "how much does kids party entertainment cost LA".
- **Cannibalization risks:** home vs `/shows` vs `/services` all pull "kids show LA" — keep distinct H1s/titles (brand vs experience vs commercial offer). `/services` should parent, not compete with, `/school-shows` & `/birthdays`.
- **Spelling:** "theater" vs "theatre" belong on the **same** page (variant coverage), not split.
- **Defensible, supportable targets:** touring/we-come-to-you; live actors **not** puppets; ages-2 early-years preschool/Montessori; transparent "from $350"; kindness-as-brand (not generic SEL).
- **Do NOT target:** Russian queries; ticketed-venue/box-office queries (structurally unsupported); "puppet" as a primary term (misleading); thin geo pages for San Diego/San Jose/Sacramento (research-only until real, distinct content + bookings exist).

---

## 15. Page-by-page content gap analysis

| Page | Strength | Gap / action |
|---|---|---|
| Home | Strong hero, trust strip, real hero photo, clear CTAs | Add `og:image`; add reviews/testimonials block once collected |
| /shows | Clear 8-show catalog | Optional `ItemList` schema; "shows for 2-year-olds" angle |
| /shows/{slug} | Unique synopsis, theme, CreativeWork, og:image (6/8) | 2 missing images (F-12); plot/format owner-gated |
| /services | Good umbrella linking 4 lines | Tighten as parent hub; internal links down |
| /school-shows | SEL/kindness, turnkey, FAQ | Preschool/Montessori/ages-2 emphasis; real school testimonials |
| /birthdays | Strong B2C, steps, FAQ | "interactive/fairy-tale party" emphasis; parent reviews |
| /characters | Clear anti-generic framing | Distinguish from show pages to avoid cannibalization |
| /gallery | 26 real photos, alt text | Publish video (F-14); ImageObject optional |
| /pricing | Transparent "from $350" | **Fix H1 (F-10)**; keep price crawlable |
| /planning-your-event | Genuinely useful logistics FAQ | Strong as-is; FAQ rich result N/A |
| /about | Troupe, 30+ yrs, values, heritage | Add `Organization` schema; "Miss Lana story" (owner-gated); reviews |
| /booking | Clear conversion, areas | Wire conversion tracking (F-07) |

Content is **substantiable from real theatre expertise** (no generic AI articles needed). Owner-gated items (final Miss Lana story, format-split, social links) are tracked in canon.

---

## 16. Google Business Profile and local SEO audit

- **Model:** textbook **service-area business** (touring, no storefront) → **hide the address**, define service areas (≤ ~2h drive; up to 20). The repo's `docs/seo/GBP_PROFILE_PACKET.md` is policy-correct (name, primary category "Children's theater", secondary "Entertainment service"/"Event planner" — **not** "Puppet theater"; phone/email/website; "From $350" only; no fake reviews; no residential address).
- **Status: UNVERIFIED (F-05).** Could not check from this environment whether a profile exists/is claimed/duplicated/suspended. The owner believed there may be a forgotten profile — **must be checked first** (duplicate/suspension is a P0 risk).
- **Ranking levers (official):** relevance (category + on-site content), distance (proximity — not controllable), prominence (reviews, citations, links/mentions). Forum/case-study evidence (ANECDOTAL) repeatedly notes SABs with hidden addresses rank harder — comply with policy and compensate with reviews/categories/genuinely local content; **never fake an address** (suspension risk).
- **Category caution (ANECDOTAL):** Google has begun blocking some category changes — choose the primary category correctly **on first setup**.

---

## 17. Reviews, citations, partnerships and off-page authority

- **Reviews (F-09, MISSING/HIGH):** target ≥5 genuine reviews (parents + preschool/school reps). Compliant method: simple direct asks with a GBP review link to **all** customers; **no gating** (the forum "separate feedback from review" tactic is non-compliant), **no incentives, no fakes**. Respond to every review.
- **Citations/NAP (F-20):** build a modest, identical NAP on a few high-authority directories that match the business (GigSalad, The Bash, Yelp, Kids Out & About). Phone consistency matters most; don't over-invest in citation churn.
- **Partnerships/mentions:** preschools/Montessori/PTAs, family-event blogs (Mommy Poppins, Upparent, FunWithKidsInLA) — earned features are a distribution play, not a link scheme.
- **Do NOT:** buy links/reviews, mass-submit citations, or keyword-stuff the business name.

---

## 18. Competitor and SERP snapshot

Full snapshot (with explicit date/device/location/method caveats): **`seo/2026-06-28-competitor-serp-snapshot.md`**. Snapshot context: **2026-06-28, desktop, US (not LA-geolocated), WebSearch listings — not the live local-pack.** Ranks are approximate.

- **Closest by product:** **A Faery Hunt** (live costumed actors, ages 2-9, schools+parties; leans outdoor-park).
- **Closest by model:** **Puppet Theater on Wheels** (mobile, from $395) and **PollyBilly** (mobile, ages 3-8, kindness framing) — both **puppets**.
- **Heritage/authority bar:** **Bob Baker Marionette Theater** (venue, since 1963).
- **School cluster:** Shows That Teach (SEL, K-6), California Kids Fun ($375/45 min), Academic Entertainment / Mobile Ed (national, geo pages).
- **Defensible gaps for Miss Lana:** one brand unifying touring + school-assembly + birthday/family as **live fairy-tale plays**; live actors not puppets; early-years (2-5) preschool focus; ownable kindness/lantern framing; real troupe story; transparent "from $350". (Not fabricated: review counts/ranks/backlinks — owner to confirm.)

---

## 19. Core Web Vitals / mobile / performance audit

- **Field data (CrUX/GSC): UNVERIFIED (F-22)** — no access; **report lab and field separately** once live (GSC CWV report + PageSpeed Insights field data).
- **Lab: not run** (no browser/egress in-env).
- **Code signals (positive):** static/SSG (cacheable, fast TTFB), `next/font` self-hosted with `display:swap` + metric-override fallback (low CLS), hero `Image` with `priority` + `sizes` (LCP), reserved aspect-ratio boxes for media (low CLS), no third-party scripts loaded, minimal client JS (mostly server components). **INP risk** is low but watch the client islands (`Nav` drawer, `Accordion`, `LeadForm`, `Breadcrumb`).
- **Mobile:** `lang="en-US"`, responsive layouts, tap-friendly CTAs, masked date input; canon is mobile-first. Verify on a real device post-launch.

---

## 20. Image / video search audit

- **Images:** 26 curated real photos on `/gallery` with descriptive, person-neutral alt text; descriptive filenames; `next/image` (responsive, lazy by default, hero eager). **Gaps:** no `og:image` on static pages (**F-08**); 2 show pages imageless (**F-12**); no `ImageObject` schema.
- **Video:** 4 clips filed but **not displayed**, unverified; **no `VideoObject`**, no YouTube presence (**F-14**). Publishing real performance video (ideally YouTube) with captions/transcripts + `VideoObject` is a strong trust + discovery opportunity.
- **Note:** keep children's faces handling per the decision record (no releases) — affects which media can be published.

---

## 21. Search Console / Bing / analytics readiness

- **Search Console:** **UNVERIFIED (F-04)** — create a **Domain property** (DNS TXT), submit `sitemap.xml`, URL-Inspect key routes, file **Change of Address** from the legacy property. The repo's `SEARCH_CONSOLE_LAUNCH_CHECKLIST.md` is ready to execute.
- **GA4 / conversion tracking:** **MISSING (F-07)** — `lib/analytics.track()` is a no-op (no sink). Wire GA4/GTM (privacy-safe: events already carry **no PII**) so `lead_success`, `phone_click`, `sms_click`, `whatsapp_click`, `email_click` are captured.
- **Bing/IndexNow/Apple (F-16):** not set up — recommended for fuller coverage (Apple supports no-storefront SABs).
- **Lead pipeline (context):** `STATUS.md` notes MongoDB durable store implemented but **prod secrets + Preview/Prod E2E not yet verified** — lead delivery is not launch-verified (separate pipeline task, not this audit).

---

## 22. AI-search / AEO visibility audit

- **Official stance (May 15 2026 gen-AI guide):** **no special "AEO/GEO" requirements** to appear in AI Overviews/AI Mode — a page must be **indexed and snippet-eligible**; strong original content + clear entity info + reviews are the levers.
- **AI-answer tests:** not run from this environment (no access); recommend the owner test brand/category questions in available AI tools post-launch, recording date + variability.
- **Improvements (evidence-based, F-21):** complete GBP; add `sameAs`/`logo`/`image`/`@id` to the entity; concise factual on-page answers (areas, ages, length, price-from); earn third-party mentions + genuine reviews. The site's clean SSR HTML already aids snippet/citation eligibility.
- **Reject:** hidden text, prompt injection, mass synthetic content, recommendation manipulation (none present; none recommended).

---

## 23. Official 2026 guidance synthesis

Full log (47 sources): **`seo/2026-06-28-official-source-log.md`**. Key points applied to Miss Lana:
- **FAQ rich results = gov/health only** (since Aug 2023) → don't expect them (F-13).
- **Self-serving Review markup ineligible** → reviews live on GBP, not in own schema.
- **`CreativeWork` (not dated `Event`) is correct** for evergreen shows — implementation already complies.
- **Multi-type `PerformingGroup`+`LocalBusiness` valid.**
- **Site moves (June 2026 update):** Change of Address for all www/non-www variants; 301s (not chains); keep ≥1 year.
- **GSC Domain property** covers protocol+subdomain variants (ideal given the alt domains).
- **CWV 2026:** LCP ≤ 2.5s, INP ≤ 200ms (INP replaced FID 2024-03-12), CLS ≤ 0.1 at p75 field.
- **GBP SAB:** hide address; specific primary category; never categories-as-keywords; never incentivize reviews.

---

## 24. Forum / practitioner evidence synthesis

Full set (26 items / 5 communities, all **ANECDOTAL**): **`seo/2026-06-28-forum-practitioner-evidence.md`**. (Reddit was unreachable by the search crawler and was **not** fabricated; the quota of ≥15 items / ≥4 communities is met via Local Search Forum, Google Search Central Community, GBP Community, WebmasterWorld, Sterling Sky.) Recurring patterns (subordinate to official docs):
1. SAB hidden-address correlates with weaker local-pack rank (comply anyway; compensate). 
2. SABs are harder to rank than storefronts — nail the basics.
3. City pages only when genuinely unique (avoid doorway pages).
4. Pick the GBP primary category right the first time (changes increasingly blocked).
5. Direct review asks work; gating is the trap.
6. New **Next.js** sites often sit in "Discovered – not indexed" — expect lag, ensure homepage indexed + strong internal links.
7. Migration/redirect mistakes cause lasting losses.
8. AI Overviews are reshaping local search with high uncertainty — no settled playbook.

---

## 25. Full gap matrix

Machine-readable with all schema fields: **`seo/2026-06-28-prioritized-backlog.csv`** (24 findings F-01…F-24). Counts:

- **P0 (5):** F-01 reachability/indexation UNVERIFIED, F-02 APP_BASE_URL, F-03 domain/DNS redirects, F-04 Search Console, F-05 GBP.
- **P1 (5):** F-06 http chain, F-07 measurement no-op, F-08 og:image, F-09 reviews, F-10 pricing H1.
- **P2 (8):** F-11 entity gaps, F-12 show images, F-14 video, F-16 Bing/IndexNow/Apple, F-20 citations, F-22 CWV field, F-23 content, (F-15 schema).
- **P3 (5):** F-13 FAQ N/A, F-17 canon drift, F-18 robots Host, F-19 trailing slash, F-21 AI entity, F-24 positioning.

By status: DONE (many, §5) · PARTIAL (F-03, F-11, F-12, F-14, F-19, F-22) · MISSING (F-04, F-07, F-08, F-09, F-15, F-16, F-20) · INCORRECT (F-10, F-17) · UNVERIFIED (F-01, F-02, F-05, F-06, F-21, F-24) · NOT_APPLICABLE (F-13).

---

## 26. Prioritized 0-14 / 15-30 / 31-90 day roadmap

**0–14 days (P0 — make launch real & measurable):**
1. Confirm `APP_BASE_URL=https://misslanatheatre.com` in prod; verify live home canonical (F-02). *(infra, XS)*
2. Confirm production reachability + run `site:` / GSC URL Inspection on home + 3 routes (F-01). *(owner/infra, S)*
3. Create GSC **Domain property**, submit sitemap (F-04). *(owner, S)*
4. Check for existing/duplicate/suspended **GBP**; if none, create SAB profile from the packet (F-05). *(owner, M)*
5. Attach + DNS-point alt/legacy domains; verify one-hop 301s live; reconcile legacy path map (F-03, F-06). *(infra, M)*

**15–30 days (P1 — activate the channel):**
6. Wire GA4/GTM; confirm conversion events in DebugView (F-07). *(code, S)*
7. Add default `opengraph-image` (+ key pages) (F-08). *(code, S)*
8. Begin collecting ≥5 genuine reviews; add testimonials block (F-09). *(owner/content, M)*
9. Fix `/pricing` H1; light intent/internal-link tuning (F-10, F-13, F-15). *(code, S)*
10. File **Change of Address** from legacy property once 301s verified (F-04). *(owner, S)*

**31–90 days (P2/P3 — grow):**
11. Enrich entity (logo/image/sameAs/@id; org on /about) (F-11, F-21). *(code, S)*
12. Supply 2 missing show images; review + publish video w/ VideoObject (F-12, F-14). *(owner/code, M)*
13. Bing/IndexNow/Apple Business Connect; citations/NAP; partnership outreach (F-16, F-20). *(owner, M)*
14. Measure CWV (field + lab); fix any regressions (F-22). *(owner/code, S)*
15. Reconcile positioning vs assets; update canon 04_SEO.md (F-24, F-17). *(owner/docs, S)*
16. Optional supportable content (e.g., ages-2 angle) — no doorway pages, no mass AI (F-23). *(owner/content, L)*

**Owner types:** code · owner/content · infrastructure/account · marketing/outreach · ongoing ops.

---

## 27. Measurement plan and KPIs

- **Setup (once):** GSC Domain property + sitemap; GA4 with the existing event names; Bing/IndexNow; (optional) Apple Business Connect; GBP Insights.
- **Baseline (record at launch):** indexed pages (GSC), impressions/clicks, branded vs non-branded queries, GBP views/calls/direction requests, leads (form + phone), landing-page conversion rate. **No PII** in analytics.
- **30/60/90:** 30 — coverage rising, no "Discovered – not indexed" spikes, CWV field green, GBP verified + first reviews; 60 — non-branded impressions for school/birthday/character clusters, first local-pack appearances, conversion baseline; 90 — review velocity, citation consistency, run a **focused re-audit** and a **full audit after 90 days of GSC data**.

---

## 28. Owner questions and access handoff

Run these (open network / authorized accounts) — **this audit could not**:

**Live checks (open network):**
```
curl -sSIL https://misslanatheatre.com/                 # 200, canonical, no noindex header
curl -sSIL https://www.misslanatheatre.com/             # 301 -> apex (one hop)
curl -sSIL https://misslanatheater.com/                 # 301 -> apex
curl -sSIL https://magic-castle-puppet-theater.com/about# 301 -> /about (one hop)
curl -s https://misslanatheatre.com/robots.txt          # Allow /, Disallow /api/ /design
curl -s https://misslanatheatre.com/sitemap.xml         # 19 apex-HTTPS URLs
# view-source home: canonical == https://misslanatheatre.com (NOT localhost) -> confirms APP_BASE_URL
```
**Account checks:**
- **Vercel:** is `APP_BASE_URL` set to the apex? Are `www`, `misslanatheater.com`(+www), `magic-castle-puppet-theater.com`(+www) attached with certs?
- **Registrar/DNS:** do all alternate/legacy hosts resolve to the deployment? Are legacy/protective registrations paid/renewing?
- **Search Console:** Domain property verified? Sitemap submitted? Any "Discovered – not indexed"? Change of Address filed?
- **GBP:** does a profile exist (incl. forgotten/duplicate/suspended)? Verified as SAB with hidden address?
- **GA4/Bing/Apple:** configured?
- **Reviews:** how many genuine reviews can be collected now (parents + schools)?

**Owner decisions:** final Miss Lana story copy; social links (for `sameAs`); positioning vs puppet reality (F-24); whether to publish the filed video clips.

---

## 29. Recommended child implementation TUNGs (outlines — do not execute here)

1. **`FIX_MISS_LANA_TECHNICAL_SEO_AND_REDIRECTS_001`** — verify/lock `APP_BASE_URL`; attach + verify alt/legacy domains (one-hop 301, HTTPS); reconcile legacy path map vs old site; fix trailing-slash consistency; robots `Host` cleanup. *(P0; covers F-02, F-03, F-06, F-18, F-19)*
2. **`IMPLEMENT_MISS_LANA_GOOGLE_BUSINESS_PROFILE_AND_LOCAL_FOUNDATIONS_001`** — check/claim/create SAB GBP from the packet; categories; service areas; description; booking link. *(P0; F-05)*
3. **`OPTIMIZE_MISS_LANA_PAGE_INTENT_AND_INTERNAL_LINKING_001`** — pricing H1; intent tuning vs cannibalization; contextual internal links; `ItemList` on /shows; canon 04_SEO.md update; FAQ-schema decision. *(P1/P3; F-10, F-13, F-15, F-17, F-23)*
4. **`BUILD_MISS_LANA_REVIEWS_CITATIONS_AND_LOCAL_AUTHORITY_001`** — policy-compliant review workflow (≥5, no gating); testimonials block; NAP/citations; partnership outreach. *(P1/P2; F-09, F-20)*
5. **`OPTIMIZE_MISS_LANA_MEDIA_CWV_AND_VIDEO_SEARCH_001`** — default `opengraph-image`; 2 missing show images; publish video + VideoObject; ImageObject; CWV field+lab. *(P1/P2; F-08, F-12, F-14, F-22)*
6. **`IMPLEMENT_MISS_LANA_SEARCH_MEASUREMENT_AND_MONITORING_001`** — GA4/GTM wiring; GSC Domain property + sitemap + Change of Address; Bing/IndexNow/Apple; KPI baseline + 30/60/90 monitoring. *(P0/P1; F-01, F-04, F-07, F-16)*
7. **`IMPROVE_MISS_LANA_AI_SEARCH_ENTITY_VISIBILITY_001`** — entity enrichment (sameAs/logo/image/@id, org on /about); concise factual answers; positioning reconciliation; AI-answer monitoring. *(P2/P3; F-11, F-21, F-24)*

---

## 30. Evidence matrix and source log

- **Repository evidence:** `lib/seo.ts`, `lib/site.ts`, `lib/env.ts`, `lib/analytics.ts`, `lib/shows.ts`, `lib/gallery.ts`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/**/page.tsx`, `app/design/page.tsx`, `next.config.ts`, `components/ui/{JsonLd,Breadcrumb,PageHero}.tsx`, `components/blocks/FaqSection.tsx`, `.env.example`, `package.json`, `docs/core/*`, `docs/seo/*`, `STATUS.md`.
- **Localhost evidence:** `next build` (27 routes, 8 SSG show pages) + `next start` (`APP_BASE_URL=https://misslanatheatre.com`, port 3100) + curl: home 200 + headers + JSON-LD; show page meta+JSON-LD+og:image; robots.txt; sitemap.xml (19 URLs); `/design` → 404 (prod guard); 404 for unknown; **Host-header 301 tests** (www/alt/legacy, all one-hop to HTTPS apex).
- **Production evidence:** **NONE** — `misslanatheatre.com:443` egress-blocked (403 CONNECT, confirmed via `$HTTPS_PROXY/__agentproxy/status`).
- **External sources:** `seo/2026-06-28-official-source-log.md` (47 official sources), `seo/2026-06-28-forum-practitioner-evidence.md` (26 anecdotal items / 5 communities), `seo/2026-06-28-competitor-serp-snapshot.md`, `seo/2026-06-28-keyword-intent-map.csv`. All access date 2026-06-28; dates "not shown" where snippets omitted them.

---

## 31. Final verdict

> Four separate verdicts, per the task's closure requirement.

1. **Technically ready for indexing?** — **YES at the code level, UNVERIFIED on production.** The implementation is correct (unique metadata, canonicals, robots, sitemap, honest schema, SSR HTML, one-hop redirects, /design hidden). It becomes a clean YES once three production facts are confirmed: `APP_BASE_URL` = apex (F-02), the host is reachable/indexable (F-01), and the alt/legacy domains 301 correctly as deployed (F-03). Until then, **do not assume indexation** — documentation is not proof.

2. **Locally ready to acquire customers?** — **NO.** The single biggest local channel, **Google Business Profile, is unverified/likely incomplete** (F-05), **verified reviews are missing** (F-09), and **citations/partnerships are not established** (F-20). The on-site local signals (service-area schema, areas served, click-to-call) are good, but local acquisition for an SAB lives mostly off-site, and that layer is not yet active.

3. **Measurement-ready?** — **NO.** Conversion analytics is a **no-op shim** (no GA4/GTM/dataLayer — F-07), and Search Console property/sitemap submission is **unverified** (F-04). The business currently cannot see leads, queries, or indexation. This is the fastest, cheapest gap to close and gates everything else.

4. **Growth-ready?** — **PARTIAL.** The content architecture, copy, real photography, and differentiation (touring + live-actors-not-puppets + early-years + kindness) are a strong, defensible base. Growth is unlocked by completing GBP + reviews + measurement + media (og:image/video) + intent tuning — none of which require risky tactics. With the P0/P1 items done, this site is well-positioned to compete in the LA children's-entertainment market.

**Top 5 next actions:** (1) confirm `APP_BASE_URL` + production reachability/indexation; (2) check/claim/create the GBP; (3) wire GA4 + create the GSC Domain property and submit the sitemap; (4) verify the alt/legacy domain 301s as deployed; (5) start collecting ≥5 genuine reviews. **Next TUNGs:** the seven outlined in §29, P0 first (`FIX_…TECHNICAL_SEO_AND_REDIRECTS`, `IMPLEMENT_…GBP_AND_LOCAL_FOUNDATIONS`, `IMPLEMENT_…SEARCH_MEASUREMENT_AND_MONITORING`).

---

*Read-only audit. No code, configuration, accounts, listings, or domains were modified. No secrets, private analytics, or customer PII are included. Forum evidence is labeled anecdotal and subordinate to official documentation throughout.*
