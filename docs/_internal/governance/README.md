# Governance core

The frozen TUNG governance set (consolidation 001). Copy this folder into a new
project's `docs/_internal/` (or keep it referenced from the kit) and author every
task against it.

## Two live formats — pick one per task

| Format | File | Use for |
|---|---|---|
| **Hermes TUNG Lite Universal** | `HERMES_TUNG_LITE_UNIVERSAL_SPECIFICATION.md` | everyday research / audit / market-analysis / source-verification / meta work whose output is a report or spec set (`task_mode: audit \| meta`) |
| **TUNG v2-full** | `tung_system_specification.md` + `TUNG-EXECUTION-RULE-(CANON).txt` | high-risk, contract-changing, multi-file, or any implementation work (code, runtime, schema, UI, locks, production config, canonical-doc edits) |

Default to Lite Universal for non-implementing work; escalate to v2-full the moment
the task changes code/behavior/contracts/canon. (Deprecated, do **not** author new
tasks on them: TUNG v1, the Tenerife-coupled Hermes Lite.)

## Drop-in template

`TASK_TEMPLATE.json` — the canonical v2-full JSON skeleton. It already carries the
three execution-safety sections (`non_goals` / `forbidden_execution_patterns` /
`execution_guardrails`) **by construction**, a canonical `task_mode`, and the
5-step `mandatory_closure`. Fill the `<...>` placeholders with real project data.

## Automated linter

`tung_lint.py` — stdlib-only, no dependencies. Validates v2-full structure,
resolves the `task_mode` closure profile, and warns (never hard-fails) on missing
execution-safety sections or non-canonical modes (preserves backward-compat).

```bash
python3 governance/tung_lint.py docs/tasks/MY_TASK.json
# exit 0 = schema-valid (warnings allowed); exit 1 = errors
```

Wire it into CI to make "INVALID by canon" a gate instead of a manual judgment.

## task_mode policy

Primary: `audit / fix / cleanup / lock`. Auxiliary: `stabilization / canon-sync /
unlock / meta`. Blessed extensions (tolerated, mapped to a closure profile):
`review → audit`, `bundle/master → meta`, `feature → fix`. Anything else is a
linter warning — map it to a canonical mode or reclassify. The author picks the
mode; executors must not switch it mid-run.

> Provenance: this is the frozen output of `TUNG_FACTORY_CANON_CONSOLIDATION_001`
> (per `HERMES_TUNG_AUDIT_003 §8`). The linter is a generalized lift of
> Research_AI's `validate_tung_v2` + Q1–Q6 classifier (schema + validator only).
