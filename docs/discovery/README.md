# Phase −1 — Discovery skeleton

Runs **before** Phase 0 (doc-architecture). Its job: **harvest positioning, tone,
pain, competitors and SEO from language that already exists** — so Phase 0 builds
on a positioning that was *found*, not guessed. Source: the discovery method audit
(`HERMES_DISCOVERY_METHOD_AUDIT_004 §9`) and the pipeline playbook's Phase −1.

> Core principle (both modes): positioning and tone are **harvested**, never
> invented. Inside-out — the maker's own words. Outside-in — the language of
> customer + competitor reviews. One engine, two intakes.

## What's in this module

**The 5 deliverable docs** (templates — fill, don't ship blank):

1. `DISCOVERY_PAIN.template.md` — the market's pain in its own **quoted** words.
2. `COMPETITOR_MAP.template.md` — rivals + where they're weak + the gap to own.
3. `POSITIONING_ONE_LINER.template.md` — one recommendable sentence + the dilution it avoids.
4. `TONE_VOICE.template.md` — voice calibration from real language + a copy test.
5. `SEO_SCAFFOLD.template.md` — keyword/discovery layer tuned to how *this* buyer searches.

**The intake method** (how you gather the language that fills the 5 docs):

- `CLIENT_INTAKE_QUESTIONNAIRE.md` — the first-contact questionnaire, in **two
  modes**: A (outside-in, you answer for yourself before research) and B
  (inside-out, you ask the business owner). Mode B includes a **site/design vision**
  block (B7: look, example links, colors, must-haves, anti-examples). The
  `bootstrap-project` skill's Step 0 emits mode B as a ready-to-send
  **`CLIENT_QUESTIONS.md`** at the project root, written in the client's language —
  send that to the owner; their answers come back into this method.
- `INTAKE_PLAYBOOKS.md` — the **two intake playbooks**, step by step:
  outside-in (cold, public data only) and inside-out (owner on contact).
- `OUTSIDE_IN_EXAMPLE.md` — a worked, anonymised outside-in report showing what
  "all checklist items covered" looks like (use as a structure template).

> The two sections below are the **condensed** playbooks. The full step-by-step
> method (with the U1–U5 amplifiers and the −1→0 gate) lives in
> [`INTAKE_PLAYBOOKS.md`](INTAKE_PLAYBOOKS.md); start there for real intake work.

## Intake playbook — inside-out (own brand, a living voice-source exists)

Confidence **HIGH** (mirrors a real own-brand launch):

1. Interview / read the maker — record literal phrases, do not paraphrase.
2. Web-validate the category — comparable brands, price band, proven mechanics.
3. Assemble blocks 3→4→5 — one-line positioning → tone from their words → SEO scaffold.

The voice-source is a living person → intake is human; discovery tools not needed.

## Intake playbook — outside-in (external business, only public data)

> ⚠️ **MED-confidence / operator-attested.** The tool-flow + ordering below come
> from an operator account of a chat that audit 004 could **not** read firsthand
> (`conversation_search`/`recent_chats` were unavailable). The block structure is
> HIGH-confidence; the exact tool sequence is not firsthand-verified. **Re-read the
> source chat firsthand before freezing this flow (raise MED→HIGH).**

1. `web_fetch` the client's site → funnel analysis.
2. `places_search` with geo offset (multi-query in one call) → direct + adjacent rivals.
3. `ask_user_input` — **after** fact-gathering, **before** the full audit → aim at the real pain. (Order: facts → pain-clarification → audit.)
4. Full audit → positioning from review-contrast → assemble report (HTML→PDF), ending with the fact/hypothesis boundary + a "numbers → quantified plan" hook.

> **Minimal anchor = city + business type.** No website / Google Maps / socials is
> **not** a blocker — it's a *finding* ("barely online → losing clients"), and the
> rivals are still mappable from `places_search` on type + city. Whatever's missing
> online becomes a question for the client (`CLIENT_QUESTIONS.md`). The flow degrades
> to "gather what exists + the rest via the client"; it does not stop for a missing URL.

Discipline: **fact before opinion, aim before audit.** Do not merge the modes — the
5 blocks are shared, the intake layer is genuinely different.

## Data layer (who supplies what)

- **Blocks 1 / 3 / 4 → human.** Reading the voice, compressing to one sentence,
  hearing the tone are not tool-replaceable.
- **Blocks 2 + 5 → one SEO connector** (Semrush **or** Ahrefs — operator's choice;
  not wired here). `places_search` gives the local rival map cheaply; the connector
  adds keyword volume/difficulty, competitor keyword/backlink gaps, rank tracking.

## Gate −1 → 0

- [ ] One-line positioning written + the dilution it avoids is named.
- [ ] Tone fixed from real language (+ a copy test).
- [ ] Competitor gap explicitly named.
- [ ] SEO scaffold exists.

Only then → Phase 0 builds the doc skeleton on **found** positioning.
