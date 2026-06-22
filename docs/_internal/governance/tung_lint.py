#!/usr/bin/env python3
"""Portable TUNG v2-full linter — schema validator + task_mode classifier.

This is the factory canon's automatable TUNG linter. It realises the
"Статический анализ TUNG-файлов (TUNG Validator)" future-work item listed
in ``tung_system_specification.md`` §10 and recommended by audit 003 §8.5.

Provenance / generalization
---------------------------
Lifted and generalized from
``Research_AI/truth_engine/tung/{schema.py, mode.py}`` — the **schema +
validator + Q1–Q6 mode classifier only**. The Truth-Engine compiler,
REST API, signal extractor and dashboard UI are NOT lifted (they are
project-specific). The Research_AI originals are left untouched; this is a
standalone copy that lives with the canon, depends on nothing but the
Python standard library, and can be dropped into any project or CI.

Generalizations applied for the canon (consolidation 001):

* **task_mode is never a hard error.** Canonical primary/auxiliary modes
  validate cleanly; the *blessed extensions* (review → audit, bundle/master
  → meta, feature → fix) validate with a note recording their parent
  closure profile; anything else is a **warning**, not a rejection. The
  Research_AI original hard-rejected non-canonical modes — that is wrong for
  a canon linter that must not retroactively invalidate the corpus.
* **Execution-safety sections are warned, never errored.** A document
  missing ``non_goals`` / ``forbidden_execution_patterns`` /
  ``execution_guardrails`` gets a warning that points at the
  EXECUTION-RULE, but stays schema-valid — this is what preserves
  backward-compatibility with the ~582 pre-existing v2-core specs. The
  "3 sections are MUST for NEW TUNGs" rule is an authoring policy enforced
  by-construction through the canonical templates, not by failing legacy
  files in a batch lint.

The linter targets **TUNG v2-full** documents (``version == "2.0"``).
Hermes TUNG Lite uses its own lighter format and authoring checklist
(see ``HERMES_TUNG_LITE_UNIVERSAL_SPECIFICATION.md`` §5) and is not the
subject of this validator.

CLI
---
    python3 tung_lint.py path/to/TASK.json [more.json ...]

Exit code is 0 when every file is schema-valid (warnings are allowed),
1 when any file has errors, 2 on usage/IO problems.
"""

from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from typing import Any


TUNG_VERSION = "2.0"

# --- Canonical task_mode taxonomy (spec §3.3, §8.5) ----------------------

PRIMARY_TASK_MODES: frozenset[str] = frozenset({"audit", "fix", "cleanup", "lock"})
AUXILIARY_TASK_MODES: frozenset[str] = frozenset(
    {"stabilization", "canon-sync", "unlock", "meta"}
)
CANONICAL_TASK_MODES: frozenset[str] = PRIMARY_TASK_MODES | AUXILIARY_TASK_MODES

# Auxiliary → parent profile inheritance (spec §8.5.4). ``canon-sync`` is
# intentionally absent: its parent depends on whether the work touches code,
# resolved per-document in ``_resolve_parent``.
AUXILIARY_PARENT: dict[str, str] = {
    "stabilization": "fix",
    "meta": "meta",
    "unlock": "unlock",
}

# Blessed extensions (consolidation 001 / audit 003 §8.3): real modes seen in
# the corpus, accepted with a note that maps each to a canonical closure
# profile rather than being rejected. Authors should prefer the canonical
# mode; the extension is tolerated so existing habits do not fail the lint.
BLESSED_EXTENSIONS: dict[str, str] = {
    "review": "audit",   # review-only → audit closure profile
    "bundle": "meta",    # multi-task fan-out → meta closure profile
    "master": "meta",    # master/orchestration chain → meta closure profile
    "feature": "fix",    # feature build → fix (alias)
}

ALLOWED_CHANGE_CLASSES: frozenset[str] = frozenset(
    {
        "implementation",
        "verification",
        "docs-sync",
        "canon-clarification",
        "cleanup",
    }
)

# --- Execution-safety sections (spec §3.4.1, §3.5.1, §3.5.2) --------------
# Required for NEW TUNGs by EXECUTION-RULE; absence is a WARNING here so the
# linter never retroactively invalidates pre-existing v2-core (backward-compat).
_EXEC_SAFETY_SECTIONS: tuple[str, ...] = (
    "non_goals",
    "forbidden_execution_patterns",
    "execution_guardrails",
)

# --- Required schema shape (spec §2.1, §3.x) -----------------------------

_REQUIRED_TOP_LEVEL: tuple[str, ...] = (
    "task",
    "version",
    "task_mode",
    "description",
    "authority_scope",
    "steps",
    "success_criteria",
    "verification",
    "deliverables",
    "mandatory_closure",
)

_REQUIRED_AUTHORITY_SCOPE: tuple[str, ...] = (
    "must_read",
    "must_not_violate",
    "requires_unlock",
    "allowed_change_classes",
)

_REQUIRED_VERIFICATION: tuple[str, ...] = (
    "required_commands",
    "manual_checks",
    "regression_targets",
)

_REQUIRED_DELIVERABLES: tuple[str, ...] = (
    "reports",
    "progress_updates",
    "artifacts",
)

_REQUIRED_CLOSURE: tuple[str, ...] = (
    "required",
    "blocks_completion_until_passed",
    "closure_sequence",
)

_MIN_CLOSURE_STEPS = 5


@dataclass
class TungValidationResult:
    """Outcome of validating a TUNG v2-full document.

    ``errors`` make the draft non-canonical; ``warnings`` are advisory
    (e.g. missing execution-safety sections on a legacy spec, or a
    non-canonical ``task_mode``). The validator never raises for schema
    violations — only for non-dict input.
    """

    is_valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    task_mode: str | None = None
    parent_profile: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "is_valid": self.is_valid,
            "errors": list(self.errors),
            "warnings": list(self.warnings),
            "task_mode": self.task_mode,
            "parent_profile": self.parent_profile,
        }


def _is_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _is_string_list(value: Any) -> bool:
    return isinstance(value, list) and all(isinstance(x, str) for x in value)


def _validate_authority_scope(
    scope: Any, errors: list[str], warnings: list[str]
) -> None:
    if not isinstance(scope, dict):
        errors.append("authority_scope: must be an object")
        return
    for key in _REQUIRED_AUTHORITY_SCOPE:
        if key not in scope:
            errors.append(f"authority_scope.{key}: missing required field")
    must_read = scope.get("must_read")
    if must_read is not None and not _is_string_list(must_read):
        errors.append("authority_scope.must_read: must be a list of strings")
    elif isinstance(must_read, list) and len(must_read) == 0:
        warnings.append(
            "authority_scope.must_read: empty — author should list the "
            "authoritative documents the executor must consult"
        )
    must_not_violate = scope.get("must_not_violate")
    if must_not_violate is not None and not _is_string_list(must_not_violate):
        errors.append("authority_scope.must_not_violate: must be a list of strings")
    requires_unlock = scope.get("requires_unlock")
    if requires_unlock is not None and not isinstance(requires_unlock, bool):
        errors.append("authority_scope.requires_unlock: must be a boolean")
    change_classes = scope.get("allowed_change_classes")
    if change_classes is not None:
        if not _is_string_list(change_classes):
            errors.append(
                "authority_scope.allowed_change_classes: must be a list of strings"
            )
        else:
            unknown = [c for c in change_classes if c not in ALLOWED_CHANGE_CLASSES]
            if unknown:
                warnings.append(
                    f"authority_scope.allowed_change_classes: non-canonical "
                    f"entries {unknown!r} — canonical values are "
                    f"{sorted(ALLOWED_CHANGE_CLASSES)}"
                )


def _validate_steps(steps: Any, errors: list[str]) -> None:
    if not isinstance(steps, list):
        errors.append("steps: must be a list")
        return
    if len(steps) == 0:
        errors.append("steps: must contain at least one step")
        return
    for i, step in enumerate(steps):
        prefix = f"steps[{i}]"
        if not isinstance(step, dict):
            errors.append(f"{prefix}: each step must be an object")
            continue
        if not _is_nonempty_string(step.get("title")):
            errors.append(f"{prefix}.title: missing or empty")
        actions = step.get("actions")
        if not _is_string_list(actions) or len(actions) == 0:
            errors.append(f"{prefix}.actions: must be a non-empty list of strings")
        if not _is_nonempty_string(step.get("expectation")):
            errors.append(f"{prefix}.expectation: missing or empty")


def _validate_verification(
    verification: Any,
    errors: list[str],
    warnings: list[str],
    task_mode: str | None,
) -> None:
    if not isinstance(verification, dict):
        errors.append("verification: must be an object")
        return
    for key in _REQUIRED_VERIFICATION:
        if key not in verification:
            errors.append(f"verification.{key}: missing required field")
    for key in _REQUIRED_VERIFICATION:
        val = verification.get(key)
        if val is not None and not _is_string_list(val):
            errors.append(f"verification.{key}: must be a list of strings")
    required = verification.get("required_commands")
    if (
        isinstance(required, list)
        and len(required) == 0
        and task_mode in {"fix", "stabilization", "feature"}
    ):
        warnings.append(
            f"verification.required_commands: empty for task_mode={task_mode!r} — "
            "implementation tasks normally need at least one targeted command"
        )


def _validate_deliverables(deliverables: Any, errors: list[str]) -> None:
    if not isinstance(deliverables, dict):
        errors.append("deliverables: must be an object")
        return
    for key in _REQUIRED_DELIVERABLES:
        if key not in deliverables:
            errors.append(f"deliverables.{key}: missing required field")
    for key in _REQUIRED_DELIVERABLES:
        val = deliverables.get(key)
        if val is not None and not _is_string_list(val):
            errors.append(f"deliverables.{key}: must be a list of strings")


def _validate_closure(closure: Any, errors: list[str]) -> None:
    if not isinstance(closure, dict):
        errors.append("mandatory_closure: must be an object")
        return
    for key in _REQUIRED_CLOSURE:
        if key not in closure:
            errors.append(f"mandatory_closure.{key}: missing required field")
    for flag in ("required", "blocks_completion_until_passed"):
        val = closure.get(flag)
        if val is not None and not isinstance(val, bool):
            errors.append(f"mandatory_closure.{flag}: must be a boolean")
        elif isinstance(val, bool) and val is False:
            errors.append(
                f"mandatory_closure.{flag}: must be true for canonical v2 tasks"
            )
    sequence = closure.get("closure_sequence")
    if sequence is not None:
        if not _is_string_list(sequence):
            errors.append(
                "mandatory_closure.closure_sequence: must be a list of strings"
            )
        elif len(sequence) < _MIN_CLOSURE_STEPS:
            errors.append(
                f"mandatory_closure.closure_sequence: must describe at least "
                f"{_MIN_CLOSURE_STEPS} steps (got {len(sequence)}) — "
                "scope+execution-safety, automated verification, reviewer-grade "
                "review, closure resolution, PROJECT_PROGRESS update"
            )


def _validate_exec_safety(
    doc: dict, warnings: list[str], errors: list[str]
) -> None:
    """Execution-safety sections: warn-if-absent (backward-compat), type-check if present."""
    missing = [s for s in _EXEC_SAFETY_SECTIONS if s not in doc]
    if missing:
        warnings.append(
            f"execution-safety sections absent: {missing} — REQUIRED for new "
            "TUNGs per TUNG-EXECUTION-RULE (authored from the canonical "
            "templates these are present by construction). Pre-existing "
            "v2-core specs without them remain valid (backward-compatible)."
        )
    for section in _EXEC_SAFETY_SECTIONS:
        val = doc.get(section)
        if val is not None and not _is_string_list(val):
            errors.append(f"{section}: must be a list of strings")


def _resolve_parent(task_mode: str, doc: dict) -> str | None:
    """Map a task_mode to the primary closure profile it inherits."""
    if task_mode in PRIMARY_TASK_MODES:
        return task_mode
    if task_mode in BLESSED_EXTENSIONS:
        return BLESSED_EXTENSIONS[task_mode]
    if task_mode == "canon-sync":
        # Inheritance depends on whether the work touches code; use
        # ``allowed_change_classes`` as the clearest signal (spec §8.5.4).
        scope = doc.get("authority_scope", {})
        classes = (
            scope.get("allowed_change_classes", [])
            if isinstance(scope, dict)
            else []
        )
        if _is_string_list(classes) and "implementation" in classes:
            return "fix"
        return "cleanup"
    return AUXILIARY_PARENT.get(task_mode)


def _validate_task_mode(
    task_mode: Any, errors: list[str], warnings: list[str]
) -> str | None:
    """task_mode is advisory, never a hard error (consolidation 001).

    Returns the mode string if usable for parent-profile resolution, else None.
    """
    if task_mode is None:
        return None  # absence already reported by required-top-level check
    if not _is_nonempty_string(task_mode):
        errors.append("task_mode: must be a non-empty string")
        return None
    if task_mode in CANONICAL_TASK_MODES:
        return task_mode
    if task_mode in BLESSED_EXTENSIONS:
        warnings.append(
            f"task_mode={task_mode!r}: blessed extension — inherits the "
            f"{BLESSED_EXTENSIONS[task_mode]!r} closure profile. Prefer the "
            "canonical mode where practical."
        )
        return task_mode
    warnings.append(
        f"task_mode={task_mode!r}: non-canonical and not a blessed extension. "
        f"Canonical: {sorted(CANONICAL_TASK_MODES)}; blessed: "
        f"{sorted(BLESSED_EXTENSIONS)}. Map it to a canonical mode or reclassify."
    )
    return None


def validate_tung_v2(doc: Any) -> TungValidationResult:
    """Validate ``doc`` against the canonical TUNG v2-full schema."""
    if not isinstance(doc, dict):
        raise TypeError(f"TUNG document must be a dict, got {type(doc).__name__}")

    errors: list[str] = []
    warnings: list[str] = []

    for key in _REQUIRED_TOP_LEVEL:
        if key not in doc:
            errors.append(f"{key}: missing required top-level field")

    task = doc.get("task")
    if task is not None and not _is_nonempty_string(task):
        errors.append("task: must be a non-empty string")

    version = doc.get("version")
    if version is not None and version != TUNG_VERSION:
        errors.append(
            f"version: must be {TUNG_VERSION!r} (got {version!r}) — this linter "
            "validates TUNG v2-full; Hermes Lite docs use their own format and "
            "the §5 authoring checklist, not this validator"
        )

    resolved_mode = _validate_task_mode(doc.get("task_mode"), errors, warnings)

    description = doc.get("description")
    if description is not None and not _is_nonempty_string(description):
        errors.append("description: must be a non-empty string")

    _validate_authority_scope(doc.get("authority_scope"), errors, warnings)
    _validate_exec_safety(doc, warnings, errors)
    _validate_steps(doc.get("steps"), errors)

    success_criteria = doc.get("success_criteria")
    if success_criteria is not None:
        if not _is_string_list(success_criteria) or len(success_criteria) == 0:
            errors.append("success_criteria: must be a non-empty list of strings")

    _validate_verification(doc.get("verification"), errors, warnings, resolved_mode)
    _validate_deliverables(doc.get("deliverables"), errors)
    _validate_closure(doc.get("mandatory_closure"), errors)

    parent_profile = _resolve_parent(resolved_mode, doc) if resolved_mode else None

    return TungValidationResult(
        is_valid=(len(errors) == 0),
        errors=errors,
        warnings=warnings,
        task_mode=resolved_mode,
        parent_profile=parent_profile,
    )


# --- Q1–Q6 task_mode classifier (spec §8.5.5) ----------------------------
# Heuristic, deterministic. Exposes the matched signals so an author can audit
# the call. The author is always the authority — the classifier only proposes.

_CLASSIFIER_RULES: tuple[tuple[str, str, str, tuple[re.Pattern[str], ...]], ...] = (
    (
        "Q1",
        "meta",
        "orchestration or task/spec authoring with no product implementation",
        (
            re.compile(r"\bmeta[-\s]?task\b", re.IGNORECASE),
            re.compile(
                r"\b(produce|author|generate|draft|create)\s+"
                r"(tasks?|specs?|specification|pipelines?)\b",
                re.IGNORECASE,
            ),
            re.compile(r"\borchestrat(e|ion|or)\b", re.IGNORECASE),
            re.compile(r"\btask\s+chain\b", re.IGNORECASE),
        ),
    ),
    (
        "Q2",
        "unlock",
        "remove a lock or expand allowed scope",
        (
            re.compile(r"\bunlock\b", re.IGNORECASE),
            re.compile(r"\blift\s+(the\s+)?lock\b", re.IGNORECASE),
            re.compile(r"\bexpand\s+allowed\s+scope\b", re.IGNORECASE),
            re.compile(r"\bremove\s+(the\s+)?lock\b", re.IGNORECASE),
        ),
    ),
    (
        "Q3",
        "lock",
        "finalize / seal / freeze / relock an already-verified area",
        (
            re.compile(r"\b(lock|relock|seal|freeze)\s+(this|the)\b", re.IGNORECASE),
            re.compile(r"\bfreeze\b", re.IGNORECASE),
            re.compile(r"\bfinal(ize|ization)\b", re.IGNORECASE),
            re.compile(r"\bdeclare\s+canon\b", re.IGNORECASE),
        ),
    ),
    (
        "Q4",
        "audit",
        "evidence gathering / analysis / findings only (no code changes)",
        (
            re.compile(r"\baudit\b", re.IGNORECASE),
            re.compile(r"\breview\s+only\b", re.IGNORECASE),
            re.compile(r"\b(investigate|analy[sz]e|classify)\b", re.IGNORECASE),
            re.compile(r"\bgather\s+evidence\b", re.IGNORECASE),
            re.compile(r"\bno\s+code\s+changes?\b", re.IGNORECASE),
        ),
    ),
    (
        "Q5",
        "fix",
        "implementation with semantic effect: behavior, API, contracts, or tests",
        (
            re.compile(r"\b(implement|build|ship)\b", re.IGNORECASE),
            re.compile(r"\b(bug\s*fix|fix\s+(a\s+)?bug)\b", re.IGNORECASE),
            re.compile(r"\b(change|modify|update|alter)\b", re.IGNORECASE),
            re.compile(r"\brefactor\b", re.IGNORECASE),
            re.compile(r"\b(feature|new\s+feature)\b", re.IGNORECASE),
            re.compile(r"\b(stabili[sz]ation|harden(ing)?)\b", re.IGNORECASE),
            re.compile(r"\bintegrat(e|ion)\b", re.IGNORECASE),
            re.compile(r"\badd\s+tests?\b", re.IGNORECASE),
        ),
    ),
    (
        "Q6",
        "cleanup",
        "tidy / reorganize / align / remove dead material with zero semantic effect",
        (
            re.compile(
                r"\b(cleanup|clean\s+up|tidy(\s+up)?|reorganiz(e|ation))\b",
                re.IGNORECASE,
            ),
            re.compile(r"\bremove\s+dead\s+(code|material)\b", re.IGNORECASE),
            re.compile(r"\brenam(e|ing)\b", re.IGNORECASE),
            re.compile(r"\balign\s+(formatting|naming|style)\b", re.IGNORECASE),
            re.compile(r"\b(format(ting)?|lint)\s+only\b", re.IGNORECASE),
        ),
    ),
)

_STABILIZATION_CUE = re.compile(
    r"\b(stabili[sz]ation|harden(ing)?|flaky|robustness)\b", re.IGNORECASE
)


@dataclass
class ModeDecision:
    mode: str
    question: str
    reason: str
    signals: list[str] = field(default_factory=list)
    tie_break: bool = False

    def to_dict(self) -> dict:
        return {
            "mode": self.mode,
            "question": self.question,
            "reason": self.reason,
            "signals": list(self.signals),
            "tie_break": self.tie_break,
        }


def classify_task_mode(request: str) -> ModeDecision:
    """Propose a canonical task_mode for a request (first Q-match wins; default fix)."""
    if not isinstance(request, str):
        raise TypeError(f"request must be str, got {type(request).__name__}")
    text = request.strip()
    if not text:
        return ModeDecision(
            mode="fix",
            question="tie-break",
            reason="empty request — tie-breaker (spec §8.5.5) defaults to fix",
            tie_break=True,
        )
    for question_key, mode, rationale, patterns in _CLASSIFIER_RULES:
        matched = [m.group(0) for pat in patterns if (m := pat.search(text))]
        if not matched:
            continue
        if mode == "fix" and _STABILIZATION_CUE.search(text):
            return ModeDecision(
                mode="stabilization",
                question=question_key,
                reason=f"{rationale}; stabilization cue — inherits full `fix` closure",
                signals=matched,
            )
        return ModeDecision(
            mode=mode, question=question_key, reason=rationale, signals=matched
        )
    return ModeDecision(
        mode="fix",
        question="tie-break",
        reason="no decision-framework question matched — defaults to fix (spec §8.5.5)",
        tie_break=True,
    )


# --- CLI -----------------------------------------------------------------

def _lint_file(path: str) -> TungValidationResult:
    with open(path, encoding="utf-8") as fh:
        doc = json.load(fh)
    return validate_tung_v2(doc)


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: python3 tung_lint.py <TASK.json> [more.json ...]", file=sys.stderr)
        return 2
    any_errors = False
    for path in argv[1:]:
        try:
            result = _lint_file(path)
        except (OSError, json.JSONDecodeError) as exc:
            print(f"{path}: CANNOT READ/PARSE — {exc}", file=sys.stderr)
            any_errors = True
            continue
        status = "VALID" if result.is_valid else "INVALID"
        mode = result.task_mode or "?"
        profile = result.parent_profile or "?"
        print(f"{path}: {status}  (task_mode={mode}, closure_profile={profile})")
        for err in result.errors:
            print(f"  ERROR   {err}")
        for warn in result.warnings:
            print(f"  warning {warn}")
        if not result.is_valid:
            any_errors = True
    return 1 if any_errors else 0


__all__ = [
    "ALLOWED_CHANGE_CLASSES",
    "AUXILIARY_TASK_MODES",
    "BLESSED_EXTENSIONS",
    "CANONICAL_TASK_MODES",
    "PRIMARY_TASK_MODES",
    "TUNG_VERSION",
    "TungValidationResult",
    "ModeDecision",
    "classify_task_mode",
    "validate_tung_v2",
]


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
