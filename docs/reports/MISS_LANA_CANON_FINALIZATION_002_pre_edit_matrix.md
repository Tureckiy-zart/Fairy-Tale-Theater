# MISS_LANA_CANON_FINALIZATION_002 — pre-edit canonical matrix

Date: 2026-06-25

This matrix records repository copies of the logical canon/operational documents before the
finalization edits for this task. It builds on the already-applied `MISS_LANA_CANON_SYNC_001`
working tree.

## Canonical document matrix

| Logical document | Repository paths found | Active canonical path | Status before edit | Intended action |
|---|---|---|---|---|
| Brand lock | `docs/core/BRAND.md` | `docs/core/BRAND.md` | Active; already synced to Theatre/domain/contact in prior task. | Retain; add/verify style rule and finalization consistency. |
| Business brief | `PROJECT_BRIEF.md`; `docs/core/PROJECT_BRIEF.md`; `.claude/skills/bootstrap-project/templates/PROJECT_BRIEF.md` | `docs/core/PROJECT_BRIEF.md` for facts; root `PROJECT_BRIEF.md` as active pointer | Root pointer is intentional, not duplicate fact canon. `.claude/.../templates/PROJECT_BRIEF.md` is a bootstrap skill template, not project canon. | Retain both active project files; ensure root points to core and current-site status is consistent. Leave template untouched. |
| Project instructions | `docs/core/00_PROJECT_INSTRUCTIONS.md` | `docs/core/00_PROJECT_INSTRUCTIONS.md` | Active; some current-site wording still describes legacy rebrand state. | Retain; correct current-vs-legacy and contact/form rules. |
| Content inventory | `docs/core/01_CONTENT_INVENTORY.md` | `docs/core/01_CONTENT_INVENTORY.md` | Active; reviews still marked not needed; legacy-site language needs clarification. | Retain; move reviews into launch trust scope and clarify legacy source material. |
| Positioning/tone | `docs/core/02_POSITIONING_AND_TONE.md` | `docs/core/02_POSITIONING_AND_TONE.md` | Active; several project-owned English marketing lines still use generic `theater`. | Retain; use Theatre in public-copy examples while preserving SEO/category exceptions. |
| Sitemap/scope | `docs/core/03_SITEMAP_AND_SCOPE.md` | `docs/core/03_SITEMAP_AND_SCOPE.md` | Active; `/for-preschools` appears as canonical route; reviews still excluded. | Retain; lock `/school-shows` and launch-required reviews. |
| SEO | `docs/core/04_SEO.md` | `docs/core/04_SEO.md` | Active; largely synced; keep American keywords and canonical domain status. | Retain; verify route/status/dependency neutrality. |
| Design system | `docs/core/DESIGN_SYSTEM.md` | `docs/core/DESIGN_SYSTEM.md` | Active; current package is `@phosphor-icons/react`, mentions deprecated package as predecessor. | Retain; make dependency rule explicit. |
| Build Claude instructions | `docs/core/05_BUILD_CLAUDE.md` | `docs/core/05_BUILD_CLAUDE.md` | Active; current package/contact facts mostly synced. | Retain; verify package/form/current-site rules. |
| Design research v2 | `docs/core/2026-06-22-design-system-research-v2.md` | `docs/core/2026-06-22-design-system-research-v2.md` | Active research/support doc; still prescribes `phosphor-react` in historical recommendations. | Retain; mark old package as superseded and prescribe `@phosphor-icons/react` for current implementation. |
| Site structure/block architecture | `docs/core/SITE_STRUCTURE_AND_BLOCKS.md` | `docs/core/SITE_STRUCTURE_AND_BLOCKS.md` | Active; reviews later/disabled; one current-site phrase still says site only has call flow. | Retain; lock reviews, form behavior, current-site status, and `/school-shows`. |

## Current indexes and status files

| File | Role | Status before edit | Intended action |
|---|---|---|---|
| `README.md` | Current project index | Active and already mostly synced. | Retain; update if route/reviews/current-site references require it. |
| `STATUS.md` | Current snapshot | Active; contains older status sections and historical notes. | Retain; update current snapshot only; preserve historical closure sections where clearly historical. |
| `CLAUDE.md` | Operational layer | Active; already mostly synced. | Retain; update generic project description to Theatre if public/project-owned. |
| `docs/PROJECT_PROGRESS.md` | Append-only chronology | Active append-only log; old 2026-06-22 line intentionally historical. | Retain; append 2026-06-25 finalization entry. Do not rewrite historical lines except title/current heading already synced. |
| `docs/2026-06-22-owner-checklist-materials.md` | Current owner checklist | Active checklist; partially synced in prior task. | Retain; add reviews requirement if needed. |

## Superseded/historical files

| File | Status | Intended action |
|---|---|---|
| `docs/2026-06-22-trademark-pre-screen-miss-lanas-fairy-tale-theater.md` | Historical dated pre-screen using old 2026-06-22 Theater/domain facts. | Preserve as historical artifact; do not treat as current canon. Current trademark/TM gate lives in `BRAND.md`. |
| `docs/reports/2026-06-22-design-system-research.md` | Older design-system research report; historical/supporting, not current canonical v2 report. | Preserve as historical report; current active design research is `docs/core/2026-06-22-design-system-research-v2.md`. |
| `docs/reports/2026-06-*` and `docs/reports/2026-06-23-*` build/audit reports | Historical task reports. | Preserve; do not rewrite old task evidence except current finalization reports. |
| `.claude/skills/bootstrap-project/templates/PROJECT_BRIEF.md` | Generic bootstrap skill template. | Not project canon; leave untouched. |

## External/manual cleanup

No external Claude/ChatGPT Project knowledge UI is available in this execution environment. If copies
of old `Theater`/`misslanatheater.com` documents exist only in external project knowledge, they require
manual removal by the operator. This task does not claim external deletion.
