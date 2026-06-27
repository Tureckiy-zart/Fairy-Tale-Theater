# Miss Lana — Page content-distribution matrix

<!--
Artifact of IMPLEMENT_MISS_LANA_LIGHTWEIGHT_CONTENT_STRUCTURE_001 (2026-06-27).
Authority: docs/core/OWNER_ANSWERS_DECISION_RECORD.md §5 (content-distribution rule)
+ §1 (confirmed public facts). Purpose: give each page ONE clear job, cap its
practical-detail level, and route every confirmed fact to exactly one primary
home so technical material is never duplicated across marketing pages.
-->

## Per-page content budget

| Page | Job (sells…) | Max practical detail | Must NOT duplicate |
|---|---|---|---|
| **Home** (`/`) | Emotion + trust + a quick "what it is" | Format explainer: ~30 play + ~30 games/dancing/bubbles, ~1 hour, ages 2–10, scenery/props/own sound, troupe of 3–4 — one proof treatment | setup, parking, power, weather, deposit, policies, price tiers |
| **Show cards** | The story (image, title, premise) | `Ages` + `~60 min` metadata only | format-per-show (owner-gated), logistics, troupe roster |
| **Show detail** (`/shows/{slug}`) | The story, first | One compact "Show Details" aside: theme, Ages, ~60 min, typical troupe (3–4) | setup/venue/weather/access, pricing tiers |
| **School Shows** (`/school-shows`) | Educational value + booking suitability | SEL/values, age-group scheduling, consecutive performances, recommended smaller-audience format (no hard max), turnkey one-liner | full setup rider, deposit/policies, price tiers, insurance/vendor/doc claims |
| **Birthdays** (`/birthdays`) | The birthday-child experience + celebration | Birthday-child block: name greeting, optional small role, song, finale, small gift (soft toy + balloons), optional costumed character — with availability qualifiers | full venue/setup rider, deposit mechanics, policies, price tiers |
| **Characters** (`/characters`) | Costumed character visits + the troupe-quality difference | Optional extras: face painting, standalone bubble show, character visits — optional, availability-based, inventory-neutral | named character inventory, guaranteed availability, price tiers |
| **Pricing** (`/pricing`) | The price is simple | "From $350" + what shapes a custom quote + travel by quote | audience-size tiers/tables/calculators, fixed travel fees |
| **Booking** (`/booking`) | Convert to a request | Form + one primary phone + service-area | setup rider, policies |
| **Planning Your Event** (`/planning-your-event`, **Task 04**) | The single home for logistics | setup ~15–20 min, ~20 m² / ~215 sq ft, own sound, no outlet, outdoor + indoor backup, weather, access, parking, photos, scheduling | — (this is where shared logistics live) |
| **Booking confirmation / runbook** (later) | Order-specific operations | deposit ($100), exact timing, address handling, post-show stay | public marketing copy |

## Fact → single primary home

| Confirmed fact (decision record §1) | Primary home | Notes |
|---|---|---|
| Duration ~1 hour (~30 + ~30) | Home FormatExplainer + show meta | approximate wording only |
| Ages 2–10 | Home + show meta | — |
| Troupe of 3–4 | Home FormatExplainer + show-detail aside | never a fixed single number |
| Scenery / props / own sound | Home FormatExplainer | one proof treatment |
| Games / dancing / bubbles | Home FormatExplainer + Birthdays | — |
| Birthday-child personalization | **Birthdays only** | availability qualifiers, never "mandatory" |
| Optional extras (face paint / bubbles / characters) | **Characters only** | optional, availability-based, inventory-neutral |
| SEL / values + scheduling | **School Shows only** | no unverified procurement/max claims |
| Setup / venue / weather / access / parking / photos / scheduling | **Planning Your Event (Task 04)** | NOT on marketing pages |
| Deposit / cancellation / payment | **Booking confirmation / runbook** | not ratified as public policy (§4) |
| Pricing | **Pricing only** | "From $350" + custom quote |
| Travel rule | Pricing + landing one-liners | no $ amounts |
| Owner = Svitlana, California 2022, heritage | **About only** | quiet backstory; Russia never named |

## Owner-gated / deferred (do not invent)

- **Per-show format** (live / puppet / combined) — `[OWNER]`, unresolved → no
  per-show format line; "puppets-inside" guardrail rewrite is a separate pass.
- **Planning Your Event link slot** — the route does not exist yet (Task 04
  creates it). Deferred to avoid a broken link; Task 04 wires it in.
- **Policies / deposit / insurance / vendor / documents / media permissions** —
  unresolved (§4); kept off marketing pages.
- **Exact birthday capacity** — "up to ~20 typical (more by arrangement)" is
  internal; public copy avoids a hard maximum.
