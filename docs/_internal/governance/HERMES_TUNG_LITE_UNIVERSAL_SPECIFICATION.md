# HERMES TUNG LITE — Universal Specification

Version: `hermes-tung-lite-1.0`
Status: operational specification for Hermes research/audit tasks
Purpose: create compact, repeatable, evidence-based Hermes tasks without the full weight of canonical TUNG v2.

> **Frozen as one of two live TUNG formats (consolidation 001, per HERMES_TUNG_AUDIT_003 §8).** This Universal Lite spec is the **everyday** authoring format (research / audit / meta whose output is a report or spec set); **v2-full** (`tung_system_specification.md` + `TUNG-EXECUTION-RULE-(CANON).txt`) is the high-risk / contract / multi-file / implementation escalation. The older **Tenerife/Domainify-coupled** `HERMES_TUNG_LITE_SPECIFICATION.md` is **deprecated** in favor of this Universal one (tasks already authored on it stay valid). Escalation criteria are in §8. Note: the automated linter `tung_lint.py` validates **v2-full** documents; Lite tasks are checked against the §5 authoring checklist, not that linter.

---

## 0. What this document is

Hermes TUNG Lite is a lightweight task format for Hermes Agent profiles, especially research, audit, market analysis, competitor analysis, source verification, commercial analysis, SEO research, and technical investigation.

It is designed for fast operational work where the output is a report, evidence matrix, recommendation, or verification summary.

It is not a replacement for canonical TUNG v2.

Canonical TUNG v2 remains the authority for full project execution, coding, implementation, lock, cleanup, stabilization, and production tasks.

Use Hermes TUNG Lite when you need clear scope, evidence discipline, non-goals, guardrails, file output, and closure — but you do not need a full Cursor-grade implementation task.

---

## 1. Relationship to canonical TUNG v2

Canonical TUNG v2 requires full task structure, including:

- `authority_scope`
- `verification`
- `deliverables`
- `mandatory_closure`

Hermes TUNG Lite keeps these concepts but compresses them for Hermes execution.

Rules:

- Full canonical TUNG v2 is required for implementation, code changes, runtime behavior changes, architectural changes, production locks, and repository tasks.
- Hermes TUNG Lite is allowed for research/audit/report-only work.
- Hermes TUNG Lite must not be used to bypass canonical TUNG v2 where implementation is involved.
- If a Hermes Lite task discovers that implementation is required, it must stop and recommend a separate canonical TUNG task.

---

## 2. Supported task modes

Hermes TUNG Lite should normally use:

- `audit` — evidence gathering, analysis, comparison, findings, recommendations, no code changes.
- `meta` — creation of future tasks, specs, prompts, frameworks, or orchestration plans, no product implementation.

Use full canonical TUNG v2 instead for:

- `fix`
- `stabilization`
- `cleanup`
- `lock`
- `canon-sync`
- `unlock`

Hard rule:

If the task changes code, behavior, contracts, API, UI, database, business logic, published copy, schemas, production configuration, or runtime guarantees, Hermes TUNG Lite is not enough.

---

## 3. Universal Hermes TUNG Lite structure

Every Hermes TUNG Lite task should use this structure:

```json
{
  "task": "HERMES_TASK_NAME_001",
  "version": "hermes-tung-lite-1.0",
  "task_mode": "audit | meta",
  "task_type": "research | competitor-research | pricing-research | source-verification | commercial-analysis | seo-research | technical-research | prompt-library | meta-task",
  "priority": "low | medium | high",
  "description": "Short description of what must be researched or produced and why.",

  "context": {
    "project": "Project or domain name",
    "business_context": "Short practical context for the task.",
    "current_truth": [
      "Facts, constraints, or assumptions the agent must preserve."
    ],
    "decision_needed": "What decision this research should help make."
  },

  "scope": {
    "in_scope": [
      "What to include."
    ],
    "out_of_scope": [
      "What to exclude."
    ]
  },

  "authority_scope": {
    "must_read_or_use": [
      "Current operator context from the chat",
      "Uploaded documents if provided",
      "Official/current external sources where possible"
    ],
    "must_not_violate": [
      "Do not invent facts, prices, dates, metrics, partnerships, APIs, source authority, traffic, revenue, or legal claims.",
      "Do not present planned/future products as current/live unless explicitly proven.",
      "Do not claim official partnership, guaranteed results, guaranteed traffic, guaranteed sales, guaranteed ROI, or verified authority unless sourced.",
      "Do not modify existing files unless explicitly asked."
    ],
    "allowed_change_classes": [
      "external research",
      "source verification",
      "competitor mapping",
      "benchmark analysis",
      "commercial recommendation",
      "report generation"
    ]
  },

  "non_goals": [
    "Do not implement code.",
    "Do not create UI, database, schema, public page, runtime logic, or production configuration.",
    "Do not create a public final rate card unless explicitly asked.",
    "Do not expand into adjacent topics unless directly relevant.",
    "Do not use weak secondary sources as confirmed facts."
  ],

  "forbidden_execution_patterns": [
    "No invented prices or guessed facts presented as evidence.",
    "No single-source conclusion for important recommendations when more evidence can reasonably be found.",
    "No mixing of different monetization tracks unless explicitly requested.",
    "No generic analogies unless clearly marked as weak or secondary benchmark.",
    "No copied competitor marketing text except short evidence fragments.",
    "No overconfident wording when evidence is weak."
  ],

  "execution_guardrails": [
    "Prefer primary/current sources first.",
    "If exact data is not public, say: not publicly disclosed / not verified.",
    "Separate primary evidence, secondary evidence, inference, and unverified claims.",
    "Every important price, metric, commission, package, feature, API, partnership, or recommendation must have HIGH / MEDIUM / LOW confidence.",
    "If evidence is weak, recommend a conservative pilot, second-pass verification, or direct outreach instead of a final decision.",
    "Keep the report compact but decision-useful."
  ],

  "research_targets": {
    "primary_targets": [
      "Target/source group 1",
      "Target/source group 2"
    ],
    "search_angles": [
      "pricing",
      "media kit",
      "rate card",
      "advertise",
      "sponsorship",
      "partner page",
      "API docs",
      "terms",
      "case study"
    ],
    "minimum_expected_coverage": {
      "competitors_or_sources": 5,
      "direct_sources": 2,
      "local_or_domain_relevance_attempted": true
    }
  },

  "output_requirements": {
    "always_create_report_file": true,
    "default_report_folder": "/workspace/HermesResearch/reports/",
    "filename_rule": "YYYY-MM-DD-short-kebab-case-title.md",
    "report_sections": [
      "Executive summary",
      "Research scope and exclusions",
      "Method / source strategy",
      "Findings matrix",
      "Direct evidence",
      "Indirect evidence",
      "Inferences and confidence levels",
      "Recommendations",
      "Risks / do not do",
      "Evidence gaps",
      "Next research step",
      "Sources used",
      "Final verification summary"
    ],
    "final_chat_response_must_include": [
      "Container path",
      "Host path",
      "One-line summary",
      "Major evidence gaps"
    ]
  },

  "success_criteria": [
    "The report answers the exact research question.",
    "The report separates facts, source claims, assumptions, inferences, and recommendations.",
    "Every important recommendation has evidence basis and confidence level.",
    "Unsupported claims are marked as unverified or excluded.",
    "The report does not violate current project truth.",
    "The report includes practical next steps."
  ],

  "verification": {
    "required_commands": [],
    "manual_checks": [
      "Verify every exact price, metric, or important claim has a source or is marked unverified.",
      "Verify recommendations are not overconfident.",
      "Verify out-of-scope topics were not used as main evidence.",
      "Verify current/live vs planned/future statuses are clearly separated where relevant.",
      "Verify the final report file exists and is readable."
    ],
    "file_check_command": "test -f <report_path> && test -r <report_path> && stat -c \"%U:%G %a %n\" <report_path> && echo EXISTS_READABLE || echo MISSING_OR_NOT_READABLE"
  },

  "mandatory_closure": {
    "required": true,
    "closure_sequence": [
      "Step 1: Scope verification — confirm the report answers the requested scope and no non_goals were violated.",
      "Step 2: Evidence verification — confirm sources, confidence levels, and unsupported claims are clearly marked.",
      "Step 3: Research review — identify weak assumptions, risky conclusions, missing evidence, and overconfident recommendations.",
      "Step 4: File verification — confirm the report file exists, is readable, and follows date-prefixed naming.",
      "Step 5: Closure summary — state what is proven, what remains unverified, and the recommended next step."
    ]
  },

  "post_actions": [
    "Do not continue into implementation.",
    "Do not create public-facing materials unless explicitly requested.",
    "If findings are weak, recommend a second-pass verification task."
  ]
}
```

---

## 4. Required field meanings

### `task`

Unique task identifier. Use uppercase snake case where possible.

Example:

```json
"task": "HERMES_COMPETITOR_PRICING_RESEARCH_001"
```

### `version`

Always use:

```json
"version": "hermes-tung-lite-1.0"
```

### `task_mode`

Use `audit` for research and analysis.

Use `meta` only when the output is a new task, template, prompt library, or specification.

### `task_type`

Human-readable category. It does not override `task_mode`.

Allowed examples:

- `research`
- `competitor-research`
- `pricing-research`
- `source-verification`
- `commercial-analysis`
- `seo-research`
- `technical-research`
- `prompt-library`
- `meta-task`

### `context`

The business/project situation that makes the task meaningful.

Must include:

- project/domain
- business context
- current truths that must not be violated
- decision needed

### `scope`

Defines the exact research boundary.

`in_scope` = what the agent should investigate.

`out_of_scope` = what the agent must avoid.

### `authority_scope`

The lightweight equivalent of canonical TUNG authority boundaries.

Must define:

- what the agent should use/read
- what the agent must not violate
- what kind of work is allowed

### `non_goals`

Things the task is explicitly not doing.

This is important for Hermes because research agents often drift into nearby topics.

### `forbidden_execution_patterns`

Bad behavior patterns that invalidate the task result.

Use this to prevent:

- invented evidence
- weak sources becoming facts
- overconfident claims
- unrelated research padding
- implementation drift

### `execution_guardrails`

Operational research rules.

Use this to enforce:

- primary-source preference
- confidence levels
- separation of evidence classes
- conservative conclusions when evidence is weak

### `research_targets`

A search plan, not a fixed source list.

This keeps Hermes focused and reduces token waste.

### `output_requirements`

Defines what the agent must create.

For the `research` profile, report files should be created by default.

Default paths:

- container path: `/workspace/HermesResearch/reports/`
- host path: `~/HermesResearch/reports/`

Every report filename must start with the current date:

```text
YYYY-MM-DD-short-kebab-case-title.md
```

### `success_criteria`

What makes the research useful.

Important: success criteria do not close the task by themselves.

### `verification`

For Hermes research/audit tasks:

- command verification is usually empty
- manual checks are mandatory
- file check is mandatory if a report is created

### `mandatory_closure`

A compressed closure sequence for Hermes.

It is lighter than full canonical TUNG v2, but still requires:

- scope check
- evidence check
- research review
- file verification
- closure summary

### `post_actions`

What should happen after the task.

Usually:

- do not implement
- recommend second pass if weak
- do not create public-facing material unless asked

---

## 5. Universal task authoring checklist

Before sending a Hermes TUNG Lite task, check:

- Is this report/research/audit only?
- Is `task_mode` set to `audit` or `meta`?
- Are current truths listed?
- Are out-of-scope topics explicit?
- Are forbidden execution patterns explicit?
- Does the output require a dated report file?
- Is the report path under `/workspace/HermesResearch/reports/`?
- Are confidence levels required?
- Is primary vs secondary evidence required?
- Is there a closure check?

If any answer is no, fix the task before sending.

---

## 6. Minimal prompt wrapper for Hermes

Use this wrapper before the JSON:

```text
Execute this Hermes TUNG Lite task.

Rules:
- Follow the task as written.
- Do not expand scope.
- Do not implement code or modify existing files.
- Create the required report file by default.
- Use the configured report workspace.
- Verify the file exists and is readable.
- In the final reply, show container path, host path, one-line summary, and major evidence gaps.

TASK:
<PASTE_JSON_HERE>
```

---

## 7. Minimal blank task template

Use this when starting quickly.

```json
{
  "task": "HERMES_RESEARCH_TASK_001",
  "version": "hermes-tung-lite-1.0",
  "task_mode": "audit",
  "task_type": "research",
  "priority": "medium",
  "description": "Research [topic] to support [decision].",
  "context": {
    "project": "[project/domain]",
    "business_context": "[short context]",
    "current_truth": [
      "[known constraint/fact 1]",
      "[known constraint/fact 2]"
    ],
    "decision_needed": "[decision this research should support]"
  },
  "scope": {
    "in_scope": [
      "[include 1]",
      "[include 2]"
    ],
    "out_of_scope": [
      "[exclude 1]",
      "[exclude 2]"
    ]
  },
  "authority_scope": {
    "must_read_or_use": [
      "Current operator context from this chat",
      "Official/current external sources where possible"
    ],
    "must_not_violate": [
      "Do not invent facts, prices, metrics, dates, partnerships, APIs, or source authority.",
      "Do not modify existing files unless explicitly asked."
    ],
    "allowed_change_classes": [
      "external research",
      "source verification",
      "report generation"
    ]
  },
  "non_goals": [
    "Do not implement code.",
    "Do not create public-facing materials unless explicitly asked.",
    "Do not expand into adjacent topics unless directly relevant."
  ],
  "forbidden_execution_patterns": [
    "No invented evidence.",
    "No weak secondary claims presented as confirmed facts.",
    "No overconfident recommendations from low-confidence evidence."
  ],
  "execution_guardrails": [
    "Prefer primary/current sources.",
    "Separate primary evidence, secondary evidence, inference, and unverified claims.",
    "Every important claim must have HIGH / MEDIUM / LOW confidence.",
    "If evidence is weak, recommend second-pass verification."
  ],
  "research_targets": {
    "primary_targets": [
      "[target group 1]",
      "[target group 2]"
    ],
    "search_angles": [
      "pricing",
      "documentation",
      "media kit",
      "case study",
      "official source"
    ],
    "minimum_expected_coverage": {
      "competitors_or_sources": 5,
      "direct_sources": 2,
      "local_or_domain_relevance_attempted": true
    }
  },
  "output_requirements": {
    "always_create_report_file": true,
    "default_report_folder": "/workspace/HermesResearch/reports/",
    "filename_rule": "YYYY-MM-DD-short-kebab-case-title.md",
    "report_sections": [
      "Executive summary",
      "Research scope and exclusions",
      "Findings matrix",
      "Direct evidence",
      "Indirect evidence",
      "Inferences and confidence levels",
      "Recommendations",
      "Risks / do not do",
      "Evidence gaps",
      "Next research step",
      "Sources used",
      "Final verification summary"
    ],
    "final_chat_response_must_include": [
      "Container path",
      "Host path",
      "One-line summary",
      "Major evidence gaps"
    ]
  },
  "success_criteria": [
    "The report answers the exact research question.",
    "Important claims have sources or are marked unverified.",
    "Recommendations include confidence levels.",
    "The report includes practical next steps."
  ],
  "verification": {
    "required_commands": [],
    "manual_checks": [
      "Verify important claims have sources or are marked unverified.",
      "Verify recommendations are not overconfident.",
      "Verify out-of-scope topics were not used as main evidence.",
      "Verify final report file exists and is readable."
    ],
    "file_check_command": "test -f <report_path> && test -r <report_path> && stat -c \"%U:%G %a %n\" <report_path> && echo EXISTS_READABLE || echo MISSING_OR_NOT_READABLE"
  },
  "mandatory_closure": {
    "required": true,
    "closure_sequence": [
      "Step 1: Scope verification — confirm the report answers the requested scope and no non_goals were violated.",
      "Step 2: Evidence verification — confirm sources, confidence levels, and unsupported claims are clearly marked.",
      "Step 3: Research review — identify weak assumptions, risky conclusions, missing evidence, and overconfident recommendations.",
      "Step 4: File verification — confirm the report file exists, is readable, and follows date-prefixed naming.",
      "Step 5: Closure summary — state what is proven, what remains unverified, and the recommended next step."
    ]
  },
  "post_actions": [
    "Do not continue into implementation.",
    "If findings are weak, recommend a second-pass verification task."
  ]
}
```

---

## 8. When to escalate from Hermes Lite to canonical TUNG v2

Escalate to full canonical TUNG v2 when the next task will:

- change code
- modify UI
- alter schemas
- update runtime behavior
- touch production configuration
- create public commercial pages
- change SEO contracts or structured data output
- alter canonical documentation
- create locks/unlocks
- require repository-level verification

Hermes Lite can recommend the next full TUNG task, but it must not execute it.

---

## 9. Standard final response format for Hermes

Every completed Hermes Lite task should end with:

```text
Report saved.

Container path:
/workspace/HermesResearch/reports/YYYY-MM-DD-report-name.md

Host path:
~/HermesResearch/reports/YYYY-MM-DD-report-name.md

Summary:
[one sentence]

Major evidence gaps:
- [gap 1]
- [gap 2]

Recommended next step:
[next action]
```

---

## 10. Core principle

Hermes TUNG Lite exists to prevent research chaos without turning every research task into a heavy production TUNG.

It should be:

- scoped
- evidence-based
- file-producing
- confidence-labeled
- compact
- non-implementing
- closure-checked

If it becomes huge, split the task into discovery pass, verification pass, and final synthesis pass.
