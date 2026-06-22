# Build report — Shows hub + 8 show pages + School Shows / Birthdays landings

**Task:** `BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001` (Phase 2)
**Date:** 2026-06-22
**Status:** ✅ Closed — `pnpm run ci:exact` green + `pnpm test:e2e` green (32 passed).

---

## 1. What shipped

| Route / file | What it is |
|---|---|
| `app/shows/page.tsx` | Shows hub — SectionHeader + intro + `ShowCardGrid` (all 8) + BookingCTABand. SEO hub linking to each show. |
| `app/shows/[slug]/page.tsx` | Show-detail template (×8 via `generateStaticParams`, `dynamicParams=false`): hero (title + meta + "Book this show" + placeholder photo) → synopsis + theme/value → photo/video placeholder → related shows → areas + "from $350" → BookingCTABand. **TheaterEvent** (JsonLd) + **BreadcrumbList** (Breadcrumb) + unique metadata per page. |
| `app/school-shows/page.tsx` | B2B landing: hero → "what your school gets" (SEL, troupe, turnkey, age-appropriate, from $350) → FAQ (Accordion + **FAQPage**) → TrustStrip → LeadForm + BookingCTABand. Sage line accent. |
| `app/birthdays/page.tsx` | B2C landing: hero ("a magical party without the hassle") → what's included → popular party shows (→ /shows) → from $350 → how to book → FAQ (**FAQPage**) → LeadForm + BookingCTABand. Coral line accent. |
| `lib/shows.ts` | The 8-show data module (slug/title/teaser/synopsis/theme/ages/length/featured). Single source for hub, detail, related, and Home Featured. |
| `components/blocks/ShowCardGrid.tsx` | Reusable repertoire grid (client; Card + Phosphor meta icons) — used by hub, related shows, and Home Featured. |
| `components/blocks/FaqSection.tsx` | Reusable FAQ band (server) — SectionHeader + Accordion + matching FAQPage JSON-LD from the **same** items, so list and schema never drift. |
| `components/blocks/FeaturedShows.tsx` | Re-wired to `FEATURED_SHOWS` (real titles, cards link to `/shows/{slug}`); placeholder titles retired. |
| `lib/site.ts` | Removed the now-dead `PLACEHOLDER_SHOWS` array (repertoire lives in `lib/shows.ts`). |
| `tests/e2e/site.spec.ts` | +Phase-2 coverage: 6 routes 200+H1, TheaterEvent/BreadcrumbList present, FAQPage + FAQ keyboard, card→detail link, unknown-slug 404, new routes noindex. |

The 8 slugs (canonical, from `01_CONTENT_INVENTORY.md` + approved renames):
`donkeys-birthday`, `little-red-riding-hood`, `the-bunnys-little-house`, `cinderella`,
`the-magic-castle`, `the-winters-gift` (Father Frost), `the-gingerbread-man`, `suzy-bee`.

## 2. Verification

- `pnpm run ci:exact` → lint ✓ · typecheck ✓ · governance (0 issues) ✓ · build ✓ (8 show pages prerendered SSG).
- `pnpm test:e2e` → **32 passed**.

## 3. Temporary vs final

- **Copy (temporary, refinable, NOT owner-blocked):** the task's referenced content file
  `docs/reports/2026-06-22-phase2-content-shows-and-landings.md` was **not present in the
  repo**. The 8 titles/slugs/themes/ages/lengths are canonical (`01_CONTENT_INVENTORY.md`);
  the **synopses and landing copy were authored here as temporary placeholder English**,
  clearly marked in code comments and on-page ("Temporary copy", "Synopsis is placeholder
  copy"). Titles/slugs were **not** invented — only prose. Final copy review is later.
- **Photos (temporary → placeholder treatment):** the locked decision was to pull temporary
  imagery from the live site. **Deviation (conscious):** no image-processing tooling is
  available (no sharp/imagemagick to "crop/resize as needed"), the CSP restricts images to
  `img-src 'self'`, and committing scraped third-party binaries is a repo-hygiene/IP concern.
  Per the task's own fallback clause ("fall back to the existing marked placeholder
  treatment"), all media renders the design-system's marked **"Photo — pending" / "Asset
  pending"** treatment, with the `image` field wired into `lib/shows.ts` so real graded
  assets drop in without page changes (Phase 4 [ASSET]).
- **Lead form:** demo only (on-screen confirmation; no backend) — unchanged from Phase 1.

## 4. Scope adherence

Built only Phase-2 pages. **NOT** built (correctly): /services, /characters, /gallery,
/about (stay stubs); /blog; the **format filter** (owner-gated); distance-surcharge amounts
(kept "on request"); lead-form backend; live map; final logo/character/illustrations; real
photos; indexing (whole site stays **noindex**). No "puppet"/Slavic coding; no
"25 years"/"only-first"; JSON-LD via the safe `JsonLd` (no `dangerouslySetInnerHTML`).

## 5. Reviewer-grade review

- **BLOCKER / HIGH:** none.
- **MEDIUM:** none.
- **LOW:** show-detail primary "Book this show" CTA sits in the hero (prominent) rather than
  mid-page after the video block; conversion intent preserved and BookingCTABand still closes
  the page.
- **NOTE:** a parallel session was concurrently running a separate "preview-polish/screenshots"
  task and touched a few shared files (`lib/site.ts` titles, test date-format, stub
  formatting). Per operator direction ("I own this build"), the Phase-2 implementations here
  are authoritative for the routes/files listed in §1. **Not committed** (operator commits).

## 6. 🔴 Red gaps carried forward

- 🔴 Real graded owner photos/video — replace the marked placeholder treatment (Phase 4 [ASSET]).
  *(Absorbs the "temporary live-site pull" — deferred to the placeholder treatment per §3.)*
- 🔴 Distance-surcharge rule + amounts — then publish on /pricing + landings (owner).
- 🔴 Real social links — replace placeholder chips (owner).
- 🔴 Format-split of the 8 shows — then add the /shows filter + per-show format tag (owner).
- 🔴 Final EN copy review/approval — synopses + landing prose are temporary placeholders.
- 🔴 Confirm Svitlana Grygoryshyna = owner — for /about (Phase 3).

## 7. Recommended next

Phase 3 — `BUILD_MISS_LANA_SHOWCASE_AND_ABOUT_001` (/services + /characters + /gallery +
/about). Keep noindex until Phase 5.
