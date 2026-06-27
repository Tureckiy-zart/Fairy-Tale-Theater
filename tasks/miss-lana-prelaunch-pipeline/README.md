# Miss Lana — Seven TUNG v2-full Tasks

Created: 2026-06-27  
Repository target: `Tureckiy-zart/Fairy-Tale-Theater`

## Locked commercial constraint

The public website may show only **“From $350”**.  
Do not publish audience-size price tiers, fixed travel fees, discount tables, or a pricing calculator until a separate owner decision and canon-sync task authorize them.

## Execution order

File names are prefixed `01_`…`07_` to reflect this order. The in-file `task`
IDs (and every `prerequisites.must_have_completed` reference) keep their original,
unprefixed names — the prefix lives on the filename only.

1. `01_CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001` — P0
2. `02_FIX_MISS_LANA_GLOBAL_PUBLIC_COPY_001` — P0
3. `03_IMPLEMENT_MISS_LANA_LIGHTWEIGHT_CONTENT_STRUCTURE_001` — P1
4. `04_BUILD_MISS_LANA_EVENT_PLANNING_FAQ_001` — P1
5. `05_IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001` — P0 (may run parallel to 3–4)
6. `06_FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001` — P1
7. `07_STABILIZE_MISS_LANA_PRELAUNCH_001` — P0 (final launch gate)

## Parallelization rule

After Task 1 closes:

- Tasks 3 and 4 may run in separate isolated worktrees after Task 2.
- Task 5 may run in parallel with Tasks 3–4 after Task 2.
- Task 6 should begin after the public route set is stable, including `/planning-your-event`.
- Task 7 is the final launch gate and requires all prior tasks to close.

One task = one session/worktree. Do not run multiple implementation tasks in the same working tree.

## Content distribution rule

- Home: emotion, trust, concise format explanation.
- Show cards/pages: story first; minimal shared facts only.
- School Shows: educational value and booking suitability.
- Birthdays: birthday-child experience and celebration.
- Pricing: “From $350” only, custom quote language.
- Planning Your Event: shared setup, venue, weather, access, photos, and scheduling details.
- Booking confirmation/runbook: order-specific operational details.
