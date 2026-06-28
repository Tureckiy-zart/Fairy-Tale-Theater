# Full-Repository Reviewer-Grade Code Review — Miss Lana's Fairy-Tale Theatre

**Date:** 2026-06-28
**Mode:** `REVIEW_BLOCK` (TUNG universal post-implementation review), widened to **whole-repository** scope at operator request.
**Reviewer perimeter:** all of `app/`, `components/`, `lib/`, `scripts/`, `tests/`, root config, governance + security tooling, and the docs that govern those surfaces.
**Verification run:** `pnpm typecheck` ✅ (exit 0) · `pnpm lint` ✅ (exit 0) · `pnpm governance` ✅ (0 issues). Full `pnpm build` **not** re-run (audit-only; build was green at last pipeline task per `PROJECT_PROGRESS.md`).
**Note on the canonical deliverable path:** `docs/reports/TUNG_UNIVERSAL_POST_IMPLEMENTATION_REVIEW_BLOCK_001.md` already exists (a prior review of the *lead pipeline only*). It was **not** overwritten; this repo-scope report is written to a new file and supersedes it at repository scope.

---

## 1. Task / block under review

A whole-repo reviewer-grade pass: find subtle defects, brittleness, leakage, DRY/abstraction problems, security weaknesses, and closure gaps across the Next.js 16 marketing/lead-gen site, then produce a step-by-step remediation strategy. This is an **audit**, not an implementation — no source files were modified (only this report + one `PROJECT_PROGRESS` line were added).

## 2. Bounded scope and evidence set

- **Read in full:** `app/api/lead/route.ts`, `lib/{leads,notify,env,seo,site,analytics,shows,gallery}.ts`, `next.config.ts`, `.gitignore`, `components/shell/LeadForm.tsx`, `components/ui/{Button,Nav,Accordion,Card,JsonLd,Breadcrumb}.tsx`, `components/motion/Reveal.tsx`, `components/blocks/{GalleryGrid,ServiceLineCards}.tsx`, `app/{layout,robots,sitemap}.ts(x)`, `app/shows/[slug]/page.tsx`, `scripts/governance.mjs`, `playwright.config.ts`, `STATUS.md`.
- **Reviewed via three parallel reviewer agents (full reads, conclusions verified against source):** every `app/*/page.tsx`; every `components/blocks|shell|ui` file; `tests/e2e/*`, `.env.example`↔`lib/env.ts` parity, `security/*`, `governance.mjs` coverage, doc parity.
- **Static checks:** image-reference existence, `process.env` access map, `next/link` usage count, `'use client'` inventory, hardcoded-fact grep.

## 3. Files reviewed

390 tracked files total. Product surface reviewed: 24 `app/` files, 35 `components/` files, 8 `lib/` files, `scripts/governance.mjs`, 3 `tests/e2e/` specs, root configs, `security/`, and the governing docs. Non-product trees (`.claude/skills/**`, `docs/**` content, `public/**` assets, `quarantine/**`, `assets-originals/**`) were scoped out except where they govern behavior.

## 4. Verification executed

| Gate | Result | Notes |
|---|---|---|
| `pnpm typecheck` | ✅ exit 0 | TS strict clean |
| `pnpm lint` | ✅ exit 0 | eslint-config-next clean |
| `pnpm governance` | ✅ 0 issues | the gate's 4 rules pass (see M7 for what it does *not* check) |
| `pnpm build` | not re-run | audit-only; green at last task |
| referenced `/images/**` exist in `public/` | ✅ all 13 resolve | no broken image paths |
| `next/link` usages | **0** | see H5 |
| direct `process.env` outside `lib/env` | **0** (only `next.config.ts`, allowed) | lazy-env discipline holds |

**Classification of the one ambiguous item:** the lead-store production durability (B1) cannot be classified pre-existing-vs-introduced from inside the repo because **there is no deploy manifest** — it is an *unverified production assumption*, flagged as a gating risk rather than a confirmed in-build failure.

---

## 5. What is genuinely good (so the findings are read in context)

This is a well-built codebase. Real strengths, verified:

- **Lead-pipeline integrity model is honest.** `route.ts` returns `ok:true` **only** after durable persistence; validation/abuse/store failures never fake success (`route.ts:80-94`). Honeypot returns a decoy id **without** persisting or notifying (`:56-58`). Logs are id-only, no PII (`:82-91`).
- **No XSS escape hatches.** Zero `dangerouslySetInnerHTML`. `JsonLd` correctly neutralizes `<` → `<` before injecting into `<script type="application/ld+json">` (`JsonLd.tsx:14`).
- **Lazy, centralized env reader** — the only `process.env` reader, enforced by governance; secrets never imported into client modules.
- **Accessibility is taken seriously.** `Nav` has a real focus-trap + ESC + scroll-lock + focus-restore + IntersectionObserver cleanup (`Nav.tsx:85-122`); `Field`/`Accordion` use `useId`, `aria-*`, `role="alert"`, icon+text (never color-alone). `Reveal` disconnects its observer.
- **Good thin abstractions:** `accent.ts` (one map drives Card/Tag/SectionHeader); `FaqSection` derives both the `<Accordion>` and the `faqSchema` JSON-LD from one array so they can't drift.

---

## 6. Findings by severity

> Severity per the REVIEW_BLOCK model. "Confirmed" = verified against source. "Conditional" = depends on an external fact (deploy target) the repo doesn't pin.

### BLOCKER (conditional — verify before trusting paid traffic)

**B1 — The "durable" lead store writes to the local filesystem; production durability is unverified and likely broken on a serverless/read-only host.**
`lib/notify.ts:41-51` persists each inquiry with `writeFile(join(cwd, ".leads"), …, { flag:"wx" })`. Acceptance (`ok:true`) is gated on this write succeeding (`notify.ts:106-110`, `route.ts:80-84`). Evidence: **no `Dockerfile`/`vercel.json`/`output:"standalone"` in the repo**, `STATUS.md:3` says `Deployment: LIVE`, and `docs/launch/LAUNCH_CHECKLIST.md:39` marks the store **"PASS — verified locally."** If the live target is serverless (the default assumption for a Next.js app with no other manifest — e.g. Vercel), the app filesystem is read-only except `/tmp`, so every write throws → **every booking inquiry returns 502 and is rejected** (the #1 conversion path silently fails). If it writes to `/tmp` or an ephemeral disk, leads survive only until the next cold start/redeploy — the recovery guarantee is illusory. If it's a single persistent-disk Node host, it works but does not survive horizontal scaling.
**Why it matters:** this is the live revenue path collecting real PII; "verified locally" ≠ verified in the production runtime.
**Fix direction:** confirm the deploy target now; make persistence target a writable, durable sink for that target (external KV/DB/object store, or make the email-webhook delivery the acceptance signal with the disk store as a best-effort secondary), then run a **real production** end-to-end test (submit → record exists → notification received). Until proven, treat the lead path as at-risk.

### HIGH

**H1 — Rate limiter is trivially bypassed via a forged `X-Forwarded-For`.** `route.ts:35-39` (`clientIp`) trusts the **first** value of the client-supplied `x-forwarded-for` header with no trusted-proxy allow-list. Any client can send a fresh `X-Forwarded-For: <random>` per request and get a new per-IP token bucket every time, defeating the `5/60s` limit entirely. Combined with the in-memory bucket being per-instance, the rate limit is best-effort at best. For a public PII-collecting endpoint this is the real abuse control and it's spoofable.
**Fix:** derive the client IP from the platform's *trusted* header (e.g. the rightmost XFF entry appended by your proxy, or the platform's dedicated header), or move rate-limiting to an edge/WAF/provider limiter and document the in-app one as best-effort. State the model in `SECURITY.md`.

**H2 — The abuse-exposed lead pipeline is almost entirely untested, and there is no unit-test runner.** `package.json` wires **only** Playwright. `lib/leads.ts` is documented as "pure, fully unit-testable" yet `validateLead` / `buildLead` / `makeInquiryId` / `normalizeDate` / `formatLeadSummary` have **zero** unit tests; `lib/notify.ts` (`persist`, `deliverLead` "accepted-iff-stored") has none. The 4 e2e lead tests cover the 200 happy path + the honeypot's *DOM attributes* only. **Untested server branches:** honeypot-accepts-without-persisting, `429` rate-limit, `422` server validation, `413` oversize, `400` malformed, `502` store-failure. A regression that disables rate-limiting or fakes success would pass CI green.
**Fix:** add `vitest`; unit-test `lib/leads`+`lib/notify`; add Playwright `request`-fixture tests that hit `/api/lead` directly for every reject branch; wire both into `ci:exact`.

**H3 — Code and canon disagree on launch state (decision-affecting).** `app/layout.tsx:21-30`, `app/robots.ts`, and `app/sitemap.ts` say the site is **LAUNCHED / publicly indexable** (noindex removed 2026-06-27); the e2e suite asserts "indexable post-launch." But `STATUS.md:3` says `Launch state: PRE-LAUNCH … Сайт остаётся noindex`, `STATUS.md:9-11` lists "noindex removal" + "≥5 verified reviews" as **still-pending launch dependencies**, and `README` repeats pre-launch/noindex. A reader cannot tell whether the site is intentionally live or was switched indexable ahead of its own gates.
**Fix:** decide the authoritative state. If launched: correct `STATUS.md`/`README`/spec headers/`sitemap.ts` comment and confirm the review-count gate was waived. If not: re-add the noindex per the documented rollback. One source of truth.

**H4 — Eleven static blocks/primitives are needlessly `"use client"`, pulling the repertoire-render path into the client bundle on an LCP-sensitive site.** Confirmed no hooks/handlers/browser APIs in: `Card.tsx`, `ShowCardGrid`, `FeaturedShows`, `ServiceLineCards`, `B2BTeaser`, `B2CTeaser`, `PersonaIntro`, `HowItWorksAreas`, `FormatExplainer`, `TrustStrip`, `BookingCTABand`. They render `<Reveal>` (a client child) — but a **server** component can render a client child without itself becoming client. `Card` is the most-instantiated leaf (every show/service grid), so marking it client forces hydration of otherwise-static markup. The brief explicitly optimizes for LCP/conversion.
**Fix:** remove `"use client"` from these 11 (keep `Field` — `useId`; keep `SiteFooter` — has an `onClick`). Verify First Load JS drops via `pnpm build`.

### MEDIUM

**M1 — Two sources of truth for brand facts ("accidental new source of truth").** `lib/seo.ts:11-21` defines a `SITE` constant duplicating the brand name, areas, and phone that also live in `lib/site.ts` (`BRAND`, `AREAS`, `PHONES`). The phone diverges in format: `lib/seo.ts` ships `"+1-323-903-2039"` to schema.org while `lib/site.ts` click-to-call uses `"+13239032039"`; `SITE.areasServed` re-lists `[AREAS.base, ...AREAS.travel]`. `lib/site.ts` claims to be "the single source of site-wide facts" — `SITE` contradicts that.
**Fix:** have `lib/seo.ts` import the brand/phone/areas from `lib/site.ts`; keep one phone format (derive the schema/E.164 forms from a single value).

**M2 — `FACTS.priceFrom` and `FACTS.ages` are bypassed by hardcoded literals throughout page copy.** `"$350"` is hand-typed in ~13 JSX sites (`pricing` ×5, `birthdays` ×3, `planning-your-event` ×2, `characters`, `shows`, plus FAQ data) while only `services`/`school-shows` import `FACTS.priceFrom`. `"Ages 2–10"` is hardcoded in ~8 sites and `FACTS.ages` is **never imported**. `"30+ years"` is duplicated in prose 5×. If any of these change they drift silently.
**Fix:** route body copy through `FACTS.*` (add a capitalized-price helper since `FACTS.priceFrom` is lowercase); consider a governance rule forbidding the literals outside `lib/site.ts`.

**M3 — Production CSP keeps `script-src 'unsafe-inline'`.** `next.config.ts:20` allows inline scripts in production, which negates most of the CSP's XSS value. Practical risk here is low (no untrusted input is reflected as HTML anywhere), but it's weak defense-in-depth. Also missing: `form-action 'self'`, `frame-src`, and a `Permissions-Policy` header.
**Fix:** move to a nonce-based CSP (Next middleware) to drop `'unsafe-inline'` for scripts; add `form-action 'self'` and `Permissions-Policy`.

**M4 — The "Photo — pending" placeholder is implemented 3 different ways and has already diverged.** `Card.tsx:91-98` (text-only), `GalleryGrid.tsx:74-81` (spark/play + caption), `shows/[slug]/page.tsx:126-132,179-185` (spark + heading + `<Tag>`). One state, three treatments.
**Fix:** extract `<MediaPlaceholder kind="photo"|"video"/>` in `components/ui/` and consume it in all three.

**M5 — Hero/breadcrumb page scaffolding is copy-pasted across ~10 pages.** The `SiteShell → Container → Breadcrumb([Home,…]) → SectionHeader as="h1"` opener and the `…→ BookingCTABand → /SiteShell` closer repeat near-identically in `about`, `booking`, `birthdays`, `characters`, `gallery`, `pricing`, `planning-your-event`, `school-shows`, `services`, `shows`. The first crumb is always `{Home,"/"}`.
**Fix:** extract a `<PageHero breadcrumb eyebrow title subtitle/>` template (auto-prepending Home) and a shared page shell.

**M6 — Governance gate gives a false sense of security.** `scripts/governance.mjs` checks only `dangerouslySetInnerHTML`, PEM private keys, `sk-ant`/`AKIA`, and stray `process.env`. It is the only gate in `ci:exact`. `security/secret-scan.sh` (which *does* know Telegram/webhook/Slack/Mongo patterns) is **not** in `ci:exact` — it only runs as a pre-commit hook *if* `core.hooksPath` was set. So CI would not catch a committed Telegram bot token or webhook bearer token, nor a stray `.leads/*.json` (PII) entering the tree.
**Fix:** add `secret-scan.sh` (or its patterns) to `ci:exact`; add a governance check that `.leads/` content is never tracked; optionally add token/`next/link`/raw-hex checks.

**M7 — Env hygiene drift in both directions.** `GOOGLE_MAPS_API_KEY` is the only `required()` getter (`env.ts:22-24`) — it **throws** on first access, is **absent from `.env.example`**, and is **never consumed** anywhere (a latent landmine: anyone who triggers it crashes with no documented fix). `GOOGLE_SITE_VERIFICATION` is defined but unused and undocumented (the layout emits no verification tag despite `04_SEO`). `.env.example` also carries dead starter keys (`DATABASE_URL`, `ANTHROPIC_API_KEY`, `SOME_SERVICE_TOKEN`, `NODE_ENV`) the app never reads, implying integrations that don't exist.
**Fix:** remove or demote+document `GOOGLE_MAPS_API_KEY`; wire `googleSiteVerification` into metadata or drop it; prune dead `.env.example` keys to match `lib/env.ts`.

**M8 — `Breadcrumb` is `"use client"` on a weak justification.** Its header comment claims the Phosphor separator "uses React context" forcing client, but Phosphor icons render fine in server components and Breadcrumb has no hooks/handlers. Likely an unnecessary client boundary (same class as H4, separated because the stated rationale needs a deliberate check).

### LOW

- **L1 — Inquiry-id collision rejects a legitimate lead.** `makeInquiryId` (`leads.ts:153-158`) uses `Math.random()` for 5 chars; `persist` uses `flag:"wx"` (no overwrite). A same-day collision (~1 in 28M) makes the write throw → `502` for a valid inquiry. Consider retry-on-collision or a longer/monotonic id. (Already noted in the prior pipeline review.)
- **L2 — Stale "noindex pre-launch" comments** across ~11 page headers + `sitemap.ts:6-9` + `tests/e2e/*` spec headers, now contradicting the launched state (subset of H3; cosmetic but misleading).
- **L3 — Two inline `rgba(234,174,53,…)` glow gradients** (`BookingCTABand.tsx:24`, `Glyphs.tsx:98`) hand-inline the value of `--color-glow-400` instead of referencing the token → silent drift if the token is retuned.
- **L4 — `new Date().getFullYear()` in the statically-prerendered footer** (`SiteFooter.tsx`) can show a stale copyright year after Jan 1 without a redeploy.
- **L5 — Duplicated icon-feature card markup** (`FormatExplainer.tsx:52-58` ≈ `HowItWorksAreas.tsx:30-36`) — extract a `<FeatureCard/>`.
- **L6 — `relatedShows` is mislabeled** (`shows.ts:161-163`): returns the first N shows by array order, not anything "related." Rename or implement real relatedness.
- **L7 — `AGENTS.md` is an unfilled template** (`<PROJECT_NAME>`, `<verify-gate>` placeholders) — fill with `pnpm run ci:exact` + source dirs, or remove.
- **L8 — `tests/e2e/smoke.spec.ts` is near-empty and fully redundant** with `site.spec.ts` — inflates the green count.

### NOTE

- Several "indexable" e2e assertions are **vacuous**: they run only `if (await robots.count())`, which is now 0 on public pages, so the body never executes (`site.spec.ts:118-125,…`). They'd pass even if noindex were re-introduced differently.
- In-memory rate limit is per-instance and resets on cold start (documented in `route.ts`, but **not** in `SECURITY.md`, which never describes the lead pipeline at all).
- The prior `TUNG_UNIVERSAL_POST_IMPLEMENTATION_REVIEW_BLOCK_001.md` reviewed the pipeline and found it sound with NOTE-level items only; this report widens scope and reclassifies the durability/IP-trust/test items upward with whole-repo context.

---

## 7. Regression assessment

No introduced regressions (audit made no code changes; typecheck/lint/governance green). Latent regression **vectors** that current gates would not catch: a disabled rate-limit (H1/H2), a faked-success path (H2), a broken production lead store (B1), and any fact drift from M1/M2. All four are invisible to `ci:exact` today because the reject branches and the production runtime are untested.

## 8. Leakage / boundary assessment

- **Secret/PII leakage:** none found in code — logs are id-only, analytics is allow-listed, env is server-only. **Boundary gap:** CI does not enforce that secrets (Telegram/webhook tokens) or `.leads/` PII never get committed (M6).
- **State leakage:** the rate-limit `Map` is process-global with opportunistic cleanup — correct, but per-instance (NOTE).
- **Client/server boundary leakage:** 11 modules over-declared `"use client"` (H4/M8) — bundle bloat, not a security leak.
- **Token/style leakage:** essentially none — two inline glow gradients are the only token bypass in shipped UI (L3).
- **Event/timer/observer leakage:** none — every observer is disconnected, no dangling listeners/timers.

## 9. DRY / abstraction assessment

The primitives layer is exemplary (`accent.ts`, `cx.ts`, `FaqSection`). The duplication is concentrated and structural, not incidental: two fact sources (M1), bypassed `FACTS` literals (M2), a 3-way placeholder (M4), repeated page scaffolding (M5), twin feature cards (L5). These are worth extracting because they've **already diverged** (phone format, placeholder treatment) — the hallmark of duplication that should become an abstraction.

## 10. Test sufficiency assessment

**Insufficient for the risk profile.** The only stateful, abuse-exposed, revenue-critical code (the lead pipeline) has one happy-path e2e and no unit tests, on a project with no unit runner. Pure functions explicitly written for testability are untested; every server reject/abuse branch is untested; the durability guarantee is asserted nowhere in code. The e2e suite is otherwise decent (real JSON-LD/sitemap/robots/404 invariants) but contains vacuous indexability assertions. This is the highest-leverage gap after B1.

## 11. Canon / authority compliance assessment

- **Lazy-env discipline:** ✅ enforced and honored.
- **No `dangerouslySetInnerHTML`, no committed key material:** ✅.
- **"Single source of facts" (CLAUDE.md / `lib/site.ts`):** ⚠️ violated by M1 (second source in `lib/seo.ts`) and M2 (bypassed literals).
- **Design tokens as source of truth (DS LOCK):** ✅ almost entirely; L3 is the only bypass.
- **Launch canon vs code:** ❌ contradictory (H3) — the governing `STATUS.md`/`README` disagree with shipped behavior.

---

## 12. Step-by-step remediation strategy

Phased, each phase gated by `pnpm run ci:exact` + targeted tests. Ordered by risk-to-the-business, not by effort.

### Phase 0 — Verify & decide (hours; do first)
1. **Confirm the production deploy target** and prove the lead store works *in production* (B1). If serverless/read-only → move persistence to a durable external sink or make webhook-delivery the acceptance signal; then run a real submit→record→notification test. **Do not run paid traffic until this passes.**
2. **Resolve the launch-state contradiction** (H3): pick the authoritative state; align `STATUS.md`, `README`, `sitemap.ts`/page/spec comments, and confirm or waive the review-count gate.

### Phase 1 — Security hardening (≈1 day)
3. **Fix the IP-trust model** for rate-limiting (H1): trust only the proxy-appended IP, or delegate to an edge/WAF limiter; document in `SECURITY.md`.
4. **Tighten the production CSP** (M3): nonce-based `script-src` (drop `'unsafe-inline'`), add `form-action 'self'` + `Permissions-Policy`.
5. **Close the governance gap** (M6): add `secret-scan.sh` to `ci:exact`; add a `.leads/`-not-tracked check.

### Phase 2 — Test the money path (≈1–2 days)
6. **Add `vitest`**; unit-test `lib/leads` (every `validateLead` rule, `buildLead` caps/normalization, `makeInquiryId` via injected `rand`, `normalizeDate`) and `lib/notify` (`persist` `wx`/path logic with a tmp dir, `deliverLead` accepted-iff-stored with mocked `fetch`).
7. **Add direct-to-route tests** (Playwright `request` fixture) for honeypot-no-persist, `429`, `422`, `413`, `400`, `502`. Wire unit + e2e into `ci:exact`.

### Phase 3 — DRY / single-source-of-truth (≈1–2 days)
8. **Collapse the two fact sources** (M1): `lib/seo.ts` imports brand/phone/areas from `lib/site.ts`; one phone value, derive formats.
9. **Route `$350` / `Ages 2–10` / `30+ years` copy through `FACTS`** (M2); add a capitalized-price helper; optionally a governance literal-ban.
10. **Extract shared UI** (M4/M5/L5): `<MediaPlaceholder>`, `<PageHero>`, `<FeatureCard>`.

### Phase 4 — Perf / boundary (≈0.5–1 day)
11. **Remove `"use client"`** from the 11 static blocks/primitives + re-check `Breadcrumb` (H4/M8); verify First Load JS drop via `pnpm build`.
12. **Decide on `next/link`** (H5/M-routing): add an internal `Link` wrapper used by `Button`/`Nav`/`Breadcrumb`/`Card` for internal hrefs (keep raw `<a>` for `tel:`/external) — restores client routing + prefetch.

### Phase 5 — Cleanup (hours)
13. **Env hygiene** (M7): remove/demote `GOOGLE_MAPS_API_KEY`, wire or drop `googleSiteVerification`, prune dead `.env.example` keys.
14. **Sweep stale comments** (L2), **tokenize glow gradients** (L3), **fix/accept footer year** (L4), **rename `relatedShows`** (L6), **fill/remove `AGENTS.md`** (L7), **drop `smoke.spec.ts`** (L8), **inquiry-id retry** (L1).

---

## 13. Follow-up tasks (bounded; each cites the finding it resolves)

| TUNG id (proposed) | Resolves | Bounded scope |
|---|---|---|
| `FIX_LEAD_STORE_PROD_DURABILITY_001` | B1 | Confirm deploy target; durable production sink; real prod e2e |
| `HARDEN_LEAD_RATE_LIMIT_IP_TRUST_001` | H1 | Trusted-IP derivation / edge limiter + SECURITY.md |
| `TEST_LEAD_PIPELINE_UNIT_AND_ROUTE_001` | H2 | vitest + lib/leads & lib/notify units + route reject-branch e2e + ci wiring |
| `RECONCILE_LAUNCH_STATE_DOCS_001` | H3, L2 | One authoritative launch state across code + STATUS/README/specs |
| `TRIM_CLIENT_BOUNDARIES_001` | H4, M8 | Remove needless `"use client"`; verify bundle |
| `DEDUPE_BRAND_FACTS_001` | M1, M2 | Single fact source; route copy through FACTS |
| `TIGHTEN_PROD_CSP_001` | M3 | Nonce CSP + form-action + Permissions-Policy |
| `EXTRACT_SHARED_UI_TEMPLATES_001` | M4, M5, L5 | MediaPlaceholder / PageHero / FeatureCard |
| `EXTEND_GOVERNANCE_AND_ENV_HYGIENE_001` | M6, M7 | secret-scan in CI, `.leads` check, env pruning |

---

## 14. Closure recommendation

**FOLLOWUP_REQUIRED.**

Rationale (evidence-based): the build is green and the codebase is well-engineered, but it is **LIVE** and collecting real PII through a path with (a) **unverified production durability** (B1, gating), (b) a **spoofable rate limiter** (H1), and (c) **no test coverage on any reject/abuse branch** (H2) — exactly the "security issue / serious missing verification / broken-contract risk" the severity model calls BLOCKER/HIGH. There is also a **canon-vs-code contradiction on launch state** (H3) that must be resolved before further launch steps. None of these block the *build*, but B1 should block *paid traffic* until proven, and H1–H3 should be cleared before the line is declared closed.

Recommended path: execute **Phase 0 (B1 + H3)** immediately, then **Phase 1–2 (security + tests)** before merging the line as done; Phases 3–5 are quality/maintainability and can follow as the bounded TUNG tasks above.

---

*Reviewer pass performed across correctness, regression, leakage/boundary, DRY/abstraction, canon/authority, tests, and security. Findings are severity-ranked and evidence-cited. No `PROJECT_PROGRESS` closure of any implementation line is implied — this is an audit deliverable.*
