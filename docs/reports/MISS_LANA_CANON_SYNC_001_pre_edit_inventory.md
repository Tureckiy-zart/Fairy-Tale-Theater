# MISS_LANA_CANON_SYNC_001 — pre-edit inventory

Date: 2026-06-25

Scope reviewed: root `PROJECT_BRIEF.md`, `CLAUDE.md`, `docs/core/*.md`,
`docs/_internal/governance/*`, and existing `docs/reports/*.md` search results.
Edits are limited to canonical/operational docs, reports/review artifacts, and
`docs/PROJECT_PROGRESS.md`.

## Search strings reviewed

- `Miss Lana's Fairy-Tale Theater`
- `misslanatheater.com`
- `info@misslanatheater.com`
- `Fairy-Tale Theater` / `Fairy-Tale Theatre`
- `theater` / `Theater`
- `213-282-1054`, `213 282 10 54`, `(213) 282-1054`
- `323-903-2039`, `323 903 20 39`, `(323) 903-2039`
- Domain status wording: `free`, `available`, `proposed`, `purchase`, `buy`,
  `свободен`, `занять`, `купить домен`

## Obsolete project-owned occurrences to update

| File | Lines found before edit | Occurrence | Classification | Intended action |
|---|---:|---|---|---|
| `PROJECT_BRIEF.md` | 22-23 | `Miss Lana's Fairy-Tale Theater`, `misslanatheater.com` | PROJECT_BRAND / PROJECT_DOMAIN | Update to Theatre spelling and primary live domain status. |
| `CLAUDE.md` | 25, 124 | `Miss Lana's Fairy-Tale Theater` | PROJECT_BRAND / OPERATIONAL | Update operational references. |
| `docs/core/BRAND.md` | 5, 14, 17, 31-36, 46 | old brand/domain/free-domain wording | PROJECT_BRAND / PROJECT_DOMAIN / MIGRATION_STATUS | Rewrite brand lock first; preserve legacy domain only as redirect source. |
| `docs/core/PROJECT_BRIEF.md` | 12, 99-105, 135 | old brand/domain/free-domain wording | PROJECT_BRAND / PROJECT_DOMAIN / MIGRATION_STATUS | Update brand, live primary domain, protective alternate, and open questions. |
| `docs/core/00_PROJECT_INSTRUCTIONS.md` | 1, 4-5, 21, 39, 81-82 | old brand/domain | PROJECT_BRAND / PROJECT_DOMAIN / OPERATIONAL | Update future-agent instructions and contact facts. |
| `docs/core/01_CONTENT_INVENTORY.md` | 20, 80-84 | service-line name and old contact block | PROJECT_BRAND / PROJECT_CONTACT | Update service-line spelling and contact workflow. |
| `docs/core/02_POSITIONING_AND_TONE.md` | 1, 14, 21, 29, 97, 131-132, 141, 150 | old brand/domain/free-domain wording | PROJECT_BRAND / PROJECT_DOMAIN / MIGRATION_STATUS | Update public brand and domain; preserve search-language keywords. |
| `docs/core/03_SITEMAP_AND_SCOPE.md` | 71, 81-83 | two equal phones; old brand/domain/free-domain wording | PROJECT_CONTACT / PROJECT_BRAND / PROJECT_DOMAIN | Make `(323) 903-2039` primary, second phone reserve-only, update brand/domain. |
| `docs/core/04_SEO.md` | 60-65, 82 | old brand/domain/free-domain/migration wording | PROJECT_BRAND / PROJECT_DOMAIN / MIGRATION_STATUS | Update GBP/schema/canonical domain; retain SEO keyword `theater` examples and legacy redirect domains. |
| `docs/core/05_BUILD_CLAUDE.md` | 63-64 | old brand/domain | PROJECT_BRAND / PROJECT_DOMAIN / OPERATIONAL | Update build-agent instructions. |
| `docs/core/DESIGN_SYSTEM.md` | 1, 15, 173, 320 | old brand/service-line/wordmark descriptor | PROJECT_BRAND / SERVICE_LINE | Update public spelling without changing tokens/design values. |
| `docs/core/SITE_STRUCTURE_AND_BLOCKS.md` | 1, 17, 47-48, 176 | old brand/service line, equal phones, old launch wording | PROJECT_BRAND / PROJECT_CONTACT / MIGRATION_STATUS | Update structure/contact/form specs and migration status. |
| `docs/core/2026-06-22-design-system-research-v2.md` | 1, 11, 271, 414, 418 | old brand/service-line/wordmark descriptor | PROJECT_BRAND / SERVICE_LINE | Update public spelling; leave third-party names unchanged. |

## Contact workflow updates to apply

| Fact | Classification | Intended action |
|---|---|---|
| `(323) 903-2039` | PROJECT_CONTACT | Primary public phone in public-copy specs; technical examples may use `tel:+13239032039`. |
| `213-282-1054` / `213 282 10 54` | PROJECT_CONTACT | Remove from equal public presentation; document only as reserve-only if mentioned. |
| `info@misslanatheatre.com` | PROJECT_EMAIL | Add as primary public email where contact specs exist. |
| SMS/email/WhatsApp | PROJECT_CONTACT | Add as accepted written contact methods; written contact is preferred. |
| Svitlana replies herself | PROJECT_CONTACT | Add where form/contact workflow is specified. |
| `1-2 business days` | PROJECT_CONTACT | Add response window; do not invent exact hours. |
| Approved confirmation copy | PROJECT_CONTACT | Add exactly to form/success-state specs. |

Approved confirmation copy:

> Thank you! We've received your request. Miss Lana will reply by text, email, or WhatsApp within 1-2 business days.

## Preserved categories

| Category | Examples | Reason preserved |
|---|---|---|
| SEO keywords | `children's theater Los Angeles`, `live kids theater LA`, `children's theater` GBP category | Valid American search intent/category wording. |
| Schema vocabulary | `TheaterEvent` | Technical schema identifier, not brand spelling. |
| Third-party proper names | `Bob Baker Marionette Theater`, `Puppet Theater on Wheels` | Official competitor names. |
| Legacy URLs/domains | `magic-castle-puppet-theater.com`, report filenames with `puppet-theater` | Historical/legacy URL or file path; must remain intact. |
| Historical reports | older `docs/reports/2026-*` references | Existing historical artifacts outside declared modified deliverables; not canon-sync targets unless linked as current status. |
| Governance prose | `tung_system_specification.md` words such as `free-form` | Not project-owned brand/domain/contact. |

## Notes

- `info@misslanatheater.com` was not present before editing.
- `misslanatheater.com` may remain only where explicitly described as a protective alternate domain that should 301 redirect to `misslanatheatre.com`.
- No production code, DNS, email, redirects, GBP, schema implementation, or Search Console changes are part of this task.
