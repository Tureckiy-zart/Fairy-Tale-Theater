📘 TUNG SYSTEM — Полная Спецификация

(v2 — authority_scope, verification, deliverables, mandatory_closure)

> **Consolidation 001 (TUNG_FACTORY_CANON_CONSOLIDATION_001, per HERMES_TUNG_AUDIT_003 §8).** Канон сведён к **двум живым форматам**: Hermes TUNG Lite Universal (повседневный research/audit/meta) и **этот v2-full** (high-risk / контракт / мульти-файл / implementation). v1 и Tenerife-связанный Hermes Lite — DEPRECATED (архивные задачи на них остаются валидны). Добавлены: **blessed task_mode extensions** (§8.5.7), автоматический линтер `tung_lint.py` (реализует §10 «TUNG Validator»), и явная модель enforcement exec-safety (см. `TUNG-EXECUTION-RULE-(CANON).txt` §6–8). Backward-compatibility (§2.2, §7) **не ослаблена** и подтверждена: новые правила действуют только на НОВЫЕ задачи.

> **Local applicability (tenerife.music).** Этот документ — canonical TUNG v2 спецификация, применяемая к задачам в данном репозитории. Canonical paths в примерах приведены к локальному layout (см. `CLAUDE.md` § 11b, `docs/PROJECT_PROGRESS.md`). Historical wording "Engine UI" / "Cursor Tasks" в §0 / §5 сохранена как часть intro-текста автора спецификации и НЕ означает зависимости от sibling-репозиториев — структура, closure sequence, field set остаются без изменений. Нормативные правила Tenerife.music (package manager, сборки, стиль кода, git workflow, ограничения на out-of-scope rules сиблингов) живут в корневом [CLAUDE.md](../CLAUDE.md) и [docs/architecture/REPO_ARCHITECTURE_MAP.md](architecture/REPO_ARCHITECTURE_MAP.md).

🔥 Что такое TUNG (TUNG — Task Unification & Governance)

TUNG — это внутренняя система формализации задач для Cursor, созданная специально для твоего проекта.

Она представляет собой строго структурированный JSON-формат, позволяющий:

запускать сложные цепочки задач,

выполнять аудит проектов,

автоматизировать шаги разработки,

держать весь проект под контролем,

гарантировать предсказуемость результата.

TUNG = Task Unified Next-Gen — твой собственный стандарт, оптимизированный под Cursor Tasks и архитектуру Engine UI.

🧱 1. Цели TUNG-системы

Создать единый формат задач для всего проекта.

Обеспечить автоматическое выполнение многослойных пайплайнов.

Синхронизировать: Master Task, Subtasks, Readiness Checks, Reports.

Дать Cursor чёткий, формализованный язык инструкций.

Сделать каждую задачу:

предсказуемой,

проверяемой,

документированной,

встроенной в общую систему.

📚 2. Основная структура TUNG-документа

Каждая задача — это JSON-объект, состоящий из обязательных модулей.

2.1 Основной шаблон

```json
{
  "task": "NAME_OF_TASK",
  "version": "2.0",
  "task_mode": "audit | fix | cleanup | lock | stabilization | canon-sync | unlock | meta",
  "task_type": "описательный тип работы (опционально, см. 3.2.1)",
  "layer": "0 | 1 | 2 | ... (если нужно)",
  "description": "Подробное описание цели задачи",
  "non_goals": [ ... ],
  "authority_scope": {
    "must_read": [ ... ],
    "must_not_violate": [ ... ],
    "requires_unlock": false,
    "allowed_change_classes": [ ... ]
  },
  "forbidden_execution_patterns": [ ... ],
  "execution_guardrails": [ ... ],
  "prerequisites": { ... },
  "steps": [ ... ],
  "success_criteria": [ ... ],
  "verification": {
    "required_commands": [ ... ],
    "manual_checks": [ ... ],
    "regression_targets": [ ... ]
  },
  "deliverables": {
    "reports": [ ... ],
    "progress_updates": [ ... ],
    "artifacts": [ ... ]
  },
  "mandatory_closure": {
    "required": true,
    "blocks_completion_until_passed": true,
    "closure_sequence": [ ... ]
  },
  "post_actions": [ ... ]
}
```

2.2 Execution-safety поля (дополнение v2)

Три task-level поля — `non_goals`, `forbidden_execution_patterns`, `execution_guardrails` — добавлены как стандартное **дополнение** к v2-шаблону. Они предотвращают scope drift, over-execution, случайную реализацию и misleading closure. Они НЕ заменяют и НЕ ослабляют ни один существующий обязательный модуль (`authority_scope`, `verification`, `deliverables`, `mandatory_closure`).

- `non_goals` располагается сразу после `description` (перед `authority_scope`).
- `forbidden_execution_patterns` и `execution_guardrails` располагаются сразу после `authority_scope` (перед `prerequisites`).

**Backward-compatibility:** уже существующие TUNG v2-задачи, не содержащие этих полей, остаются валидными. Поля REQUIRED для **новых** задач, создаваемых после принятия этого дополнения (см. §3.4.1, §3.5.1, §3.5.2 и `TUNG-EXECUTION-RULE-(CANON).txt`). Семантика полей определена в секции 3; примеры заполнения по классам задач — в секции 8.6.

🧩 3. Модули TUNG-задачи
🔹 3.1 task

Уникальный ID задачи, например:

F0_CREATE_BASE_TOKEN_FILES

MASTER_TASK_READINESS_CHECK

STAGE10_ORGANIZER_PIPELINE

🔹 3.2 version

Версия формата задачи.

## 🔹 3.2.1 `task_type`

Опциональное описательное поле, указывающее характер работы в свободной форме (например, `"docs-canonization"`, `"token-audit"`, `"component-refactor"`).

**Важно:** `task_type` — это человекочитаемая метка для контекста. Она НЕ заменяет `task_mode` и НЕ влияет на routing, closure requirements или profile selection. Все нормативные решения (какой closure применять, какие constraints действуют) определяются исключительно полем `task_mode`.

Если `task_type` описывает работу, которая подразумевает implementation (например, `"docs-canonization"` с нормативным эффектом на систему), `task_mode` всё равно MUST быть выбран через decision framework в секции 8.5.

🔹 3.3 task_mode — Canonical Mode Taxonomy

Поле `task_mode` определяет классификацию задачи и задаёт ожидания по scope, допустимым изменениям и closure requirements.

Все значения `task_mode` делятся на две категории:

**Primary routing profiles** — четыре канонических профиля, покрывающих основные классы работы:

- `audit` — анализ, evidence gathering, findings (без изменений кода/поведения)
- `fix` — scoped implementation: bug fix, feature, refactor, любая работа с semantic effect
- `cleanup` — strictly non-semantic tidy-up: reorganизация, удаление dead code, formatting, alignment. CANNOT затрагивать логику, поведение, контракты или validation
- `lock` — finalization, freeze, canon declaration (seal verified area)

**Auxiliary/specialized modes** — modes для специфических контекстов, каждый из которых наследует closure requirements от ближайшего primary profile:

- `stabilization` — специализированный вариант `fix`. Применяется когда основная цель — стабилизация существующей системы (устранение flaky states, hardening, robustness). Наследует все requirements от `fix`, включая full reviewer-grade closure.
- `canon-sync` — alignment документации и contracts с текущим состоянием кода. Canon-sync — описательная метка, подчинённая фактическому характеру работы: если изменения чисто документационные без semantic effect → наследует от `cleanup`; если sync затрагивает код, API, contracts или нормативные правила → наследует от `fix`. Canon-sync CANNOT использоваться как rhetorical wrapper для смягчения routing или closure requirements underlying work.
- `unlock` — изменение authority/control state (снятие lock, расширение allowed scope). Это control-state operation, не substitute для underlying work. Unlock task снимает ограничение; фактическая работа после unlock MUST быть отдельной задачей с собственным routing.
- `meta` — задача, чей output — другие задачи, спецификации, orchestration. Не производит product implementation. Closure для meta задач требует verification полноты и consistency output, но не требует implementation-level code review.

Auxiliary modes CANNOT использоваться для обхода более строгих boundaries primary profiles. Если задача содержит implementation work, она MUST классифицироваться как `fix` (или `stabilization`), даже если часть работы выглядит как cleanup или sync.

**Правило:** `task_mode` выбирается человеком-автором до начала исполнения. Агенты/executors MUST NOT самостоятельно выбирать, переинтерпретировать или переключать task_mode в процессе выполнения.

Полные правила выбора task_mode — см. секцию 8: Task Mode Selection Canon.

### 🔹 3.3.1 `layer`

Если задача относится к Master Task:

Layer 0 — Orientation

Layer 1 — Foundation

Layer 2 — Core Components

Layer 3 — Advanced Features
и т.д.

🔹 3.4 description

Полное объяснение сути задачи.

## 🔹 3.4.1 `non_goals`

`non_goals` — task-level массив строк, явно перечисляющий **смежные проблемы, которые задача НЕ должна решать**. Это позитивно сформулированная граница scope: не «не сломай ничего», а конкретный список того, что намеренно исключено.

Назначение:

- предотвращает scope creep и opportunistic fixes («раз уж я здесь, заодно поправлю…»);
- даёт executor однозначный сигнал, что соседняя проблема — вне задачи, даже если она очевидна и легко чинится;
- даёт reviewer критерий для closure: затронутое в `non_goals` НЕ должно появиться в diff.

Нормативные правила:

- Обнаруженная во время исполнения проблема из `non_goals` MAY быть задокументирована как follow-up (в отчёте задачи / `deliverables`), но MUST NOT быть исправлена в рамках текущей задачи, **если только** отдельный явный пункт `authority_scope.allowed_change_classes` или прямое указание автора этого не разрешает.
- `non_goals` не расширяет права: он только сужает. Он не может разрешить работу, запрещённую `authority_scope`.
- Каждый элемент MUST быть конкретным и проверяемым в diff.

**Good (конкретно, проверяемо в diff):**

```json
"non_goals": [
  "Do not refactor the affiliate redirect resolver in app/api/out/[provider]",
  "Do not migrate event fixtures to a new schema",
  "Do not change Lighthouse budgets or CI gates"
]
```

**Bad (расплывчато, непроверяемо, бесполезно для reviewer):**

```json
"non_goals": [
  "Do not break anything",
  "Avoid unrelated changes",
  "Keep it clean"
]
```

## 🔹 3.5 `authority_scope`
Обязательный блок, фиксирующий архитектурные границы задачи.

Он определяет:
- какие документы обязательно прочитать перед началом,
- какие ограничения нельзя нарушать,
- требуется ли explicit unlock,
- какие классы изменений допустимы.

Пример:
```json
{
  "must_read": ["docs/architecture/FOUNDATION_LOCK.md"],
  "must_not_violate": ["No raw DOM bypass", "No Foundation API expansion"],
  "requires_unlock": false,
  "allowed_change_classes": ["implementation", "verification", "docs-sync"]
}
```

**Правило:** задача без `authority_scope` считается архитектурно неполной.

## 🔹 3.5.1 `forbidden_execution_patterns`

`forbidden_execution_patterns` — task-level массив строк, определяющий **запрещённые способы исполнения** задачи. В отличие от `authority_scope.must_not_violate` (который фиксирует архитектурные границы результата — *что* нельзя менять), этот блок фиксирует **процессные запреты** — *как* нельзя работать.

**Это не творческий negative prompt.** Блок MUST содержать конкретные, проверяемые процессные запреты, а не общие пожелания. «Не пиши плохой код» — невалидно; «не запускай repo-wide build для docs-only задачи» — валидно.

Типовые запреты (выбираются под конкретную задачу, список не исчерпывающий):

- no opportunistic refactor — не рефакторить код, попавшийся «по пути», вне объявленного scope;
- no repo-wide verification unless justified — не запускать full build / lint / typecheck / whole-suite tests, если scoped verification достаточно (см. §3.9.1);
- no runtime/product changes in audit-only tasks — в `audit` задачах не менять runtime-код, данные, конфигурацию;
- no new abstractions without scope permission — не вводить новые слои, обёртки, хелперы или абстракции без явного разрешения в `authority_scope`;
- no treating PROJECT_PROGRESS as a substitute for review — не подменять reviewer-grade review записью в `docs/PROJECT_PROGRESS.md` или closure summary;
- no silent scope expansion — не расширять change surface без эскалации к автору.

Нормативные правила:

- Каждый элемент MUST быть конкретным процессным запретом, наблюдаемым в diff или в логе выполненных команд.
- `mandatory_closure` каждой задачи MUST явно подтвердить, что ни один из перечисленных patterns не был нарушен (см. §3.11).
- Нарушение любого pattern делает closure невалидным независимо от того, прошли ли automated checks.

**Good:**

```json
"forbidden_execution_patterns": [
  "No opportunistic refactor of files outside the declared change surface",
  "No repo-wide build/lint/typecheck — this is a docs-only task; use changed-file review only",
  "Do not treat the PROJECT_PROGRESS entry as a substitute for the reviewer-grade closure review"
]
```

**Bad (творческий negative prompt, не процессный запрет):**

```json
"forbidden_execution_patterns": [
  "Don't write bad code",
  "Avoid mistakes",
  "Be careful"
]
```

## 🔹 3.5.2 `execution_guardrails`

`execution_guardrails` — task-level массив строк, определяющий **требуемое поведение executor в пограничных ситуациях**: при неопределённости, при incidental findings, при конфликте scope или при неоднозначности verification.

Если `forbidden_execution_patterns` говорит «чего нельзя делать», то `execution_guardrails` говорит «что делать, когда ситуация неоднозначна».

Типовые guardrails (выбираются под задачу):

- stop and report ambiguity — при неоднозначности требований/классификации остановиться и эскалировать автору, а не угадывать;
- document follow-ups instead of fixing out-of-scope issues — найденную вне scope проблему задокументировать как follow-up, не чинить (согласуется с `non_goals`);
- preserve existing contracts — при сомнении сохранять существующее поведение / API / сигнатуры, а не «улучшать» их;
- prefer narrow verification — при неоднозначности verification выбирать самый узкий достаточный surface (changed-file → targeted test → targeted script), а не blanket-проверки.

Нормативные правила:

- Guardrails описывают поведение, НЕ предоставляют новых прав. **Guardrail не разрешает расширять scope.** «Document follow-ups» означает именно задокументировать, а не реализовать.
- Если guardrail и `authority_scope` конфликтуют, побеждает `authority_scope` (более узкая граница).
- `mandatory_closure` MUST подтвердить, что при возникновении соответствующих ситуаций guardrails были соблюдены (или что таких ситуаций не возникло).

**Good:**

```json
"execution_guardrails": [
  "If the task classification appears wrong mid-execution, stop and escalate to the author — do not switch task_mode yourself",
  "If an out-of-scope data quality issue is found, record it as a follow-up in the report; do not fix it here",
  "When verification scope is ambiguous, prefer the narrowest sufficient command set over a full-repo run"
]
```

**Bad (маскированное расширение scope под видом guardrail):**

```json
"execution_guardrails": [
  "If you find related bugs, go ahead and fix them too",
  "Improve any code you touch",
  "Expand the change if it seems beneficial"
]
```

## 🔹 3.6 `prerequisites`
Условия для запуска:
- какие отчёты должны существовать,
- какие файлы должны быть на месте,
- какая задача должна быть выполнена.

Пример:
```json
{
  "must_have_completed": ["G0"],
  "must_be_ready": true,
  "readiness_report": "docs/reports/LAST_READINESS_RUN.md"
}
```

## 🔹 3.7 `steps`
Самая важная часть: **пошаговая инструкция для Cursor**.
Каждый шаг содержит:
- title
- actions
- logic (если нужно)
- expected outcome
- affected files

Пример:
```json
{
  "title": "Create tokens directory",
  "actions": ["Create /src/tokens/", "Add colors.ts, spacing.ts, radius.ts"],
  "expectation": "All token files exist"
}
```

## 🔹 3.8 `success_criteria`
Список условий, при которых задача считается функционально выполненной.

**Важно:** `success_criteria` сами по себе **не закрывают задачу**. Они подтверждают, что реализация достигла целевого результата, но не заменяют review, verification и regression-check.

## 🔹 3.9 `verification`
Обязательный блок проверки результата.

Он фиксирует:
- какие команды действительно нужны для подтверждения scoped результата,
- какие ручные проверки обязательны,
- какие зоны считаются регрессионными и должны быть проверены.

Пример:
```json
{
  "required_commands": [
    "pnpm test src/components/layout/Grid/grid.focus.spec.ts",
    "pnpm exec eslint src/components/layout/Grid"
  ],
  "manual_checks": ["Verify no visual regression in affected Grid states"],
  "regression_targets": ["src/components/layout/Grid", "Grid focus behavior"]
}
```

### 3.9.1 Scoped Verification Canon

`verification` определяет **полный разрешённый verification surface** задачи.

Нормативные правила:
- `required_commands` MUST содержать только команды, которые материально релевантны фактически изменённому или проверяемому scope.
- Материально релевантной считается только команда, которая напрямую подтверждает изменённые файлы, изменённое поведение, объявленный regression target или точный предмет audit-задачи.
- Repo-wide команды MUST NOT добавляться по умолчанию, если достаточно changed-file check, таргетного теста или узкого скрипта.
- Если `required_commands` пуст, command-line verification **не подразумевается**.
- `manual_checks` MUST закрывать оставшиеся review obligations, которые не требуют запуска команд.
- `regression_targets` MUST описывать конкретные файлы, модули, фичи, контракты или отчёты, которые задача обязана защитить от регрессии.

Порядок выбора verification-команд:
1. changed-file checks
2. targeted tests
3. targeted scripts
4. full-repo commands — только если это явно оправдано scope задачи или архитектурным риском

Полно-репозиторные команды допустимы только как исключение, если задача явно затрагивает:
- broad shared infrastructure,
- cross-cutting architecture,
- public exports или shared API surface,
- build graph, packaging или generation contracts,
- repo-wide lint/type rules,
- documented regression risk, который нельзя валидировать узко.

Запуск лишних команд является process violation: он тратит время, размывает сигнал и ухудшает reviewer-grade verification.

### 3.9.2 Anti-Oververification Policy

Oververification — это запуск команд, тестов, сборок, визуальных проверок или скриптов, не нужных для валидации scoped задачи.

Oververification canonically forbidden, потому что он:
- тратит человеческое и машинное время,
- добавляет нерелевантный шум,
- ослабляет точность review,
- закрепляет ложный паттерн, будто blanket verification всегда обязателен.

Кодовые проверки **не подразумеваются** для задач, которые являются только:
- docs-only,
- audit-only,
- report-only,
- canon-clarification-only.

## 🔹 3.10 `deliverables`
Явный список артефактов, которые задача обязана оставить после себя.

Сюда входят:
- отчёты,
- обновления прогресса проекта,
- иные обязательные артефакты.

Пример:
```json
{
  "reports": ["docs/reports/example/TASK_REPORT.md"],
  "progress_updates": ["docs/PROJECT_PROGRESS.md"],
  "artifacts": ["validation-summary.json"]
}
```

## 🔹 3.11 `mandatory_closure`
Ключевой обязательный блок закрытия задачи.

Этот блок делает review и verification **жёстким gate**, а не опциональным хвостом.
Задача **не может считаться завершённой**, пока `mandatory_closure` не выполнен полностью.

### Каноническая последовательность closure

Closure MUST выполняться в следующем строгом порядке. Шаги не могут быть переставлены, пропущены или объединены. Глубина review на Шаге 3 определяется классом задачи (см. "Closure requirements по классам задач" ниже).

**Шаг 1 — Scope Verification (проверка полноты реализации + execution-safety confirmation)**
Проверить, что все `steps`, `success_criteria` и `deliverables` задачи выполнены. Все затронутые файлы соответствуют ожиданиям задачи.

Дополнительно (если соответствующие поля присутствуют в задаче) Шаг 1 MUST явно подтвердить execution-safety compliance:

- ни одна проблема из `non_goals` не была исправлена в diff (только задокументирована как follow-up, если найдена);
- ни один из `forbidden_execution_patterns` не был нарушен — ни в diff, ни в логе выполненных команд;
- при возникновении ситуаций, описанных в `execution_guardrails`, executor повёл себя согласно guardrails (или явно зафиксировать, что таких ситуаций не возникло).

Это подтверждение — **дополнительная** closure-обязанность. Оно НЕ заменяет reviewer-grade review (Шаг 3) и не понижает его глубину.

**Шаг 2 — Automated Verification (автоматические проверки)**
Выполнить только те команды из блока `verification.required_commands`, которые явно перечислены в задаче и оправданы её written scope. Automated verification MUST следовать scoped verification canon: сначала changed-file checks, затем targeted tests, затем targeted scripts, и только в исключительных случаях — full-repo commands.

**Важное ограничение:** `mandatory_closure` НЕ даёт права расширять verification поверх написанного task scope. Успешное прохождение перечисленных required commands является НЕОБХОДИМЫМ, но НЕ ДОСТАТОЧНЫМ условием для закрытия задачи. Автоматические проверки подтверждают только тот verification surface, который прямо указан и обоснован задачей; они не заменяют инженерный анализ реализации.

**Шаг 3 — Reviewer-Grade Pre-Closure Code Review (MANDATORY)**

Для каждой значимой задачи REQUIRED провести полноценный reviewer-grade code review всех изменений, внесённых задачей. Этот review CANNOT быть заменён:
- прохождением автоматических проверок (typecheck/lint/tests),
- closure summary или status confirmation,
- пересказом выполненных шагов,
- констатацией отсутствия ошибок без детального анализа.

**Обязательные dimensions review:**

Review MUST покрывать каждую из следующих областей. Пропуск любой области делает review неполным, а closure — невалидным.

1. **Correctness and implementation integrity** — реализация корректно решает поставленную задачу, нет логических ошибок, не пропущены граничные условия.
2. **Architecture fit and canon alignment** — изменения соответствуют архитектурным контрактам проекта и не нарушают authority documents.
3. **Hidden risks, weak assumptions, brittle logic, and misuse risk** — нет неявных допущений, хрупкой логики, потенциальных точек отказа или API, провоцирующих неправильное использование.
4. **DRY integrity and duplication** — не введена дупликация кода или логики, существующие абстракции использованы корректно.
5. **Readability, maintainability, and extension safety** — код читаем, поддерживаем, безопасен для будущих расширений.
6. **Modern practices and idiomatic patterns** — код соответствует современным практикам и идиомам стека проекта (TypeScript, React, vitest и т.д.).
7. **Edge cases, failure modes, silent bad defaults, and misleading pass states** — обработаны граничные случаи, нет тихих ошибок или ложно-успешных состояний.
8. **Typing strictness, unsafe casts, unsafe escapes, and validation gaps** — типизация строгая, нет `as any`, необоснованных type assertions или пропущенных валидаций.
9. **Test adequacy and missing coverage** — тестовое покрытие адекватно реализованному scope, нет критических непокрытых путей.
10. **Unnecessary complexity, abstraction weakness, or overengineering** — нет избыточной сложности, слабых абстракций или преждевременного обобщения.

**Требования к результату review:**

- Review MUST зафиксировать явные findings по каждой области, даже если finding = "no material weaknesses found".
- Если обнаружены значимые weaknesses, они MUST быть либо исправлены в scope задачи до closure, либо задокументированы как explicit follow-up/deferred items с указанием severity.
- Review без findings (пустой или формальный) считается невыполненным и не удовлетворяет closure requirements.

**Шаг 4 — Closure Resolution (фиксация результата)**
Зафиксировать финальный verification summary, включая результаты review и список resolved/deferred findings. Обновить отчёты задачи (`deliverables.reports`).

**Шаг 5 — PROJECT_PROGRESS Update (финальный административный шаг)**
Обновить `docs/PROJECT_PROGRESS.md`. Этот шаг является ПОСЛЕДНИМ административным действием closure. Он выполняется ТОЛЬКО после того, как scope verification, automated verification, reviewer-grade code review и closure resolution полностью завершены. PROJECT_PROGRESS update — это фиксация факта завершения, а не механизм или замена технического review.

### Определение класса задачи для closure

Задача считается **значимой** (significant), если выполняется ЛЮБОЕ из следующих условий:

- Задача меняет код, поведение, контракты, API или runtime guarantees
- Задача меняет нормативные правила системы (спецификации, authority documents, canon declarations)
- Задача затрагивает более одного файла
- Задача имеет `task_mode` = `fix`, `stabilization`, `lock`, или `canon-sync` с code changes
- Задача явно помечена как significant в своём определении

Задача считается **тривиальной** (trivial), если выполняются ВСЕ следующие условия:

- Изменение не имеет semantic effect (typo fix, formatting, single-line rename, comment correction)
- Затронут один файл или минимальное количество файлов без structural impact
- Задача имеет `task_mode` = `cleanup` или `canon-sync` (docs-only)
- Автор явно классифицировал задачу как trivial

**Правило неопределённости:** если классификация неоднозначна, задача MUST считаться значимой.

### Closure requirements по классам задач

Каждый primary profile определяет обязательный уровень closure:

**`fix` / `stabilization`** — полный 5-шаговый closure. Все 10 review dimensions REQUIRED. Это baseline для любой задачи с semantic effect.

**`audit`** — шаги 1 (scope verification), 4 (closure resolution), 5 (PROJECT_PROGRESS update) REQUIRED. Шаг 2 (automated verification) допустим только если audit-задача специально проверяет конкретные команды, их outputs или проверяемые audit-артефакты. Audit-задачи MUST NOT по умолчанию запускать typecheck, lint, build или нерелевантные test suites. Для docs-only audit verification может ограничиваться manual consistency checks, completeness review и quality review findings. Шаг 3 (reviewer-grade review) — применяется к качеству анализа и findings, а не к коду: полнота покрытия, обоснованность выводов, отсутствие пропущенных областей. Review dimensions 1 (correctness), 2 (architecture fit), 3 (hidden risks), 9 (coverage adequacy) REQUIRED; остальные — N/A для audit.

**`cleanup`** — полный 5-шаговый closure. Review dimensions 1 (correctness — изменение не сломало поведение), 2 (architecture fit), 4 (DRY), 5 (readability), 10 (unnecessary complexity) REQUIRED. Dimensions 3, 6, 7, 8, 9 — N/A для cleanup, поскольку cleanup по определению не затрагивает логику, поведение, типизацию или validation. Verification для cleanup MUST оставаться узким и доказательным: changed-file checks, targeted formatter/linter/test commands или direct review там, где этого достаточно. Blanket typecheck/lint/build/whole-suite tests по умолчанию запрещены. Если при review обнаруживается, что изменения фактически затрагивают эти области, задача misclassified и MUST быть переклассифицирована как `fix`.

**`lock`** — шаги 1, 2, 4, 5 REQUIRED. Шаг 3 — review применяется к полноте evidence и корректности lock declaration: dimensions 1 (correctness of lock), 2 (architecture fit), 3 (hidden risks — нет ли незавершённой работы, которая будет заблокирована). Остальные dimensions — N/A. Verification для `lock` MUST подтверждать только lock target и ту dependency chain, которая может его инвалидировать. Repo-wide команды допустимы только если lock target сам repo-wide, например exports surface, package graph integrity или global generation contract.

**Тривиальные задачи** — шаги 1, 2, 5 REQUIRED. Шаг 3 сокращается до explicit confirmation: "Review: trivial change, [описание изменения], no semantic effect, no review dimensions applicable." Это MUST быть зафиксировано явно — пустой или отсутствующий review недопустим даже для trivial задач.

**Auxiliary modes** наследуют closure requirements от parent profile, как определено в секции 8.5.4. Наследование работает ТОЛЬКО в сторону ужесточения: auxiliary mode CANNOT снизить closure rigor ниже того, что требуется для underlying significant work. Если underlying work significant — полный closure обязателен независимо от auxiliary label.

### Нормативные правила closure

- **PROJECT_PROGRESS update MUST быть последним шагом closure**, никогда — механизмом, стоящим вместо технического review.
- **Reviewer-grade code review REQUIRED для всех значимых задач.** Глубина review определяется классом задачи (см. выше). Полный review с 10 dimensions — baseline для `fix`/`stabilization`.
- **Verification passes are necessary but not sufficient** для closure. Прохождение required_commands не заменяет инженерный анализ.
- **Closure review MUST проверять пропорциональность verification.** Overbroad command execution без task-level justification является non-compliant поведением даже если все команды прошли.
- **Closure MUST включать explicit engineering critique**, а не только status confirmation или summary выполненных шагов.
- **Любая значимая weakness, найденная при pre-closure review**, MUST быть либо resolved in-scope, либо задокументирована как explicit follow-up/deferred item с severity.
- **Отсутствие review findings (пустой Шаг 3) делает closure невалидным** для любого класса задач, включая trivial.
- **Execution-safety confirmation REQUIRED, когда задача объявляет `non_goals`, `forbidden_execution_patterns` или `execution_guardrails`.** Closure MUST явно подтвердить compliance с каждым присутствующим полем (см. Шаг 1). Это additional obligation: оно добавляется к reviewer-grade review, а не заменяет его. Нарушение любого `forbidden_execution_patterns` или исправление любого `non_goals` без явного разрешения делает closure невалидным, даже если все automated checks прошли.

Пример:
```json
{
  "required": true,
  "blocks_completion_until_passed": true,
  "closure_sequence": [
    "Step 1: Scope verification — confirm all steps, success_criteria, and deliverables are complete; confirm execution-safety compliance (no non_goals fixed, no forbidden_execution_patterns violated, execution_guardrails respected)",
    "Step 2: Automated verification — run only the required_commands explicitly listed for the scoped task, confirm all pass",
    "Step 3: Reviewer-grade pre-closure code review — analyze all changes against mandatory review dimensions, record findings",
    "Step 4: Closure resolution — resolve or defer findings, write final verification summary, update task reports",
    "Step 5: PROJECT_PROGRESS update — final administrative step, only after all above are complete"
  ]
}
```

## 🔹 3.12 `post_actions`
Что делать после полного закрытия задачи:
- продолжать цепочку,
- запускать следующую задачу,
- останавливать выполнение,
- инициировать follow-up.

**Правило:** `post_actions` выполняются **после** прохождения `mandatory_closure` и не заменяют его.

🛠 4. Поток выполнения TUNG-задачи

### 4.1 Алгоритм

1. Cursor проверяет `authority_scope` и `prerequisites`.
2. Определяет точный change surface или audit surface задачи.
3. До запуска команд выбирает **самый узкий достаточный verification surface** по канону: changed-file checks → targeted tests → targeted scripts → full-repo commands только при явном scope justification.
4. Выполняет `steps` один за другим.
5. Проверяет `success_criteria`.
6. Выполняет `mandatory_closure` в каноническом порядке:
   - 6a. Scope verification — подтверждение полноты реализации + execution-safety confirmation (`non_goals` / `forbidden_execution_patterns` / `execution_guardrails`, если объявлены).
   - 6b. Automated verification — выполнение только тех `verification.required_commands`, которые явно перечислены и релевантны task scope.
   - 6c. Reviewer-grade pre-closure code review — инженерный анализ всех изменений по обязательным dimensions.
   - 6d. Closure resolution — фиксация findings, обновление отчётов задачи.
   - 6e. PROJECT_PROGRESS update — финальный административный шаг.
7. Только после полного прохождения `mandatory_closure` выполняет `post_actions`.

**Критическое правило:** задача НЕ МОЖЕТ быть помечена как завершённая, если реализация существует, но не завершены reviewer-grade code review, verification, regression-check или обязательные обновления отчётов/прогресса. Прохождение автоматических проверок без reviewer-grade review НЕ ЯВЛЯЕТСЯ достаточным основанием для closure. Столь же недопустимо и обратное: blanket verification сверх written scope не может считаться признаком более качественного closure.

4.2 Отчёты

Каждая задача оставляет следы:

docs/reports/ — подробный отчёт

docs/PROJECT_PROGRESS.md — журнал проекта

**Нормативное уточнение:** требования к отчётам и журналам проекта MUST быть перечислены в блоке `deliverables` каждой конкретной TUNG-задачи. Если артефакт обязателен, он MUST быть указан явно — неформальные подразумевания недопустимы.

🧬 5. Типы TUNG-задач (Legacy Classification)

> **Примечание:** секция 5 описывает исторические категории задач из TUNG v1. Начиная с TUNG v2, каноническая классификация задач определяется полем `task_mode` и routing framework в секции 8. Типы ниже сохранены для справки и обратной совместимости. При создании новых задач MUST использоваться `task_mode` из секции 3.3 и decision framework из секции 8.5.

**Соответствие legacy типов каноническим profiles:**

- **Readiness Tasks** (определение состояния проекта перед запуском слоёв) → `audit`
- **Execution Tasks** (фактическая работа: код, модели, UI, API) → `fix` или `stabilization`
- **Repair Tasks** (исправление ошибок, сломанных конфигураций, миграции) → `fix`
- **Chain Tasks** (запуск цепочек подзадач) → `meta`
- **Meta Tasks** (создание других задач, обновление Master Task) → `meta`

Если legacy задача не укладывается в эту таблицу, маршрутизация MUST проводиться через decision framework в секции 8.5.

🧩 6. Пример эталонной TUNG-задачи (v2)
{
  "task": "F0_CREATE_BASE_TOKEN_FILES",
  "version": "2.0",
  "task_mode": "fix",
  "layer": "1. Foundation Layer",
  "description": "Create full tokens directory and implement base token files.",
  "non_goals": [
    "Do not migrate or rewrite existing consumers of token values",
    "Do not introduce a new token domain (e.g. motion, elevation)"
  ],
  "authority_scope": {
    "must_read": [
      "docs/architecture/FOUNDATION_LOCK.md",
      "docs/architecture/TOKEN_AUTHORITY.md"
    ],
    "must_not_violate": [
      "No new token domains without unlock",
      "No raw hardcoded visual values in public API"
    ],
    "requires_unlock": false,
    "allowed_change_classes": [
      "implementation",
      "verification",
      "docs-sync"
    ]
  },
  "forbidden_execution_patterns": [
    "No opportunistic refactor of files outside src/FOUNDATION/tokens",
    "No repo-wide build/lint — run only the targeted token lint and spec",
    "No new abstraction layer over the token files without scope permission"
  ],
  "execution_guardrails": [
    "If an existing token consumer looks broken, document it as a follow-up; do not fix it here",
    "If the canonical token structure is ambiguous, stop and escalate rather than guessing"
  ],
  "prerequisites": {
    "must_have_completed": ["G0"],
    "must_be_ready": true,
    "readiness_report": "docs/reports/LAST_READINESS_RUN.md"
  },
  "steps": [
    {
      "title": "Create token files",
      "actions": ["Create colors.ts", "Create spacing.ts"],
      "expectation": "All token files exist"
    }
  ],
  "success_criteria": [
    "Required token files exist",
    "Files conform to canonical token structure"
  ],
  "verification": {
    "required_commands": [
      "pnpm exec eslint src/FOUNDATION/tokens",
      "pnpm test src/FOUNDATION/tokens/token-structure.spec.ts"
    ],
    "manual_checks": [
      "Verify token structure matches canonical format"
    ],
    "regression_targets": [
      "src/FOUNDATION/tokens",
      "docs/PROJECT_PROGRESS.md"
    ]
  },
  "deliverables": {
    "reports": [
      "docs/reports/F0_CREATE_BASE_TOKEN_FILES_REPORT.md"
    ],
    "progress_updates": [
      "docs/PROJECT_PROGRESS.md"
    ],
    "artifacts": []
  },
  "mandatory_closure": {
    "required": true,
    "blocks_completion_until_passed": true,
    "closure_sequence": [
      "Step 1: Scope verification — confirm all steps, success_criteria, and deliverables are complete; confirm execution-safety compliance (no non_goals fixed, no forbidden_execution_patterns violated, execution_guardrails respected)",
      "Step 2: Automated verification — run only the required_commands explicitly listed for the scoped task, confirm all pass",
      "Step 3: Reviewer-grade pre-closure code review — analyze all changes against mandatory review dimensions, record explicit findings",
      "Step 4: Closure resolution — resolve or defer findings with severity, write final verification summary, update task reports",
      "Step 5: PROJECT_PROGRESS update — final administrative step, only after all above are complete"
    ]
  },
  "post_actions": [
    "Continue to the next task only if mandatory_closure passes"
  ]
}

---

# 7. Migration Note — TUNG v1 → v2 (Minimal Upgrade)

TUNG v2 is a **strict extension** of the earlier schema, not a replacement of the system concept.

## What changed

- Added `task_mode` with canonical mode taxonomy (primary profiles + auxiliary modes)
- Added `task_type` (optional descriptive label)
- Added `authority_scope`
- Added `verification`
- Added `deliverables`
- Added `mandatory_closure` with 5-step `closure_sequence` and reviewer-grade pre-closure code review
- Added Task Mode Selection Canon with decision framework and anti-misclassification rules (section 8.5)
- Added closure requirements per task class (significant vs trivial) with per-profile review dimension mapping
- Defined primary/auxiliary mode hierarchy and closure inheritance
- Reconciled legacy task types (section 5) with canonical routing profiles
- Clarified that `success_criteria` do not close a task by themselves
- Clarified that `post_actions` happen only after full closure
- Added execution-safety sections `non_goals`, `forbidden_execution_patterns`, `execution_guardrails` (sections 3.4.1, 3.5.1, 3.5.2) with per-class examples (section 8.6)
- Amended `mandatory_closure` Step 1 to require explicit execution-safety confirmation (additional obligation, does not replace reviewer-grade review)

## Backward-compatibility rule
Older TUNG tasks may still be readable as legacy tasks, but **all new canonical TUNG tasks MUST use the v2 schema**.

Execution-safety поля (`non_goals`, `forbidden_execution_patterns`, `execution_guardrails`) — strict, additive extension: существующие v2-задачи без них остаются валидными, новые задачи MUST их включать. Они не вводят второго конкурирующего формата и не меняют существующие обязательные модули.

## Core semantic upgrade
From TUNG v2 onward, **implementation complete ≠ task complete**.
A task is complete only when implementation, verification, review, regression checks, and mandatory deliverables are all closed.

📋 8. Canonical Task Profiles and Mode Selection Canon

The following four profiles are canonical templates for manual TUNG authoring. When creating a new TUNG task, the human author selects the correct task_mode using the decision framework in section 8.5, then fills in the task details using the matching profile skeleton.

These profiles are **not** for agent self-selection — the human author decides which profile applies. Agents and executors MUST NOT self-select, reinterpret, or switch task_mode during execution.

### 8.1 audit

Analysis, evidence gathering, and classification. An audit **does not implement changes** — it produces findings and recommendations only.

- Outputs are reports and classifications, never code changes
- Steps are investigative: read, check, compare, classify
- Audit tasks MUST NOT run typecheck, lint, build, or unrelated test suites unless the audit task explicitly targets those commands, their outputs, or a failure produced by them
- For docs-only audit work, verification may be limited to manual consistency, completeness, and evidence review
- `mandatory_closure` confirms all findings are documented and that verification stayed proportional to the audited scope

```json
{
  "task_mode": "audit",
  "authority_scope": {
    "must_read": ["<target documents/code>"],
    "must_not_violate": ["No implementation changes"],
    "allowed_change_classes": ["docs-sync"]
  },
  "steps": [{ "title": "...", "actions": ["Analyze...", "Classify..."], "expectation": "Findings documented" }],
  "verification": {
    "required_commands": [],
    "manual_checks": ["Confirm findings completeness and evidence quality"],
    "regression_targets": ["<audited artifact>"]
  },
  "deliverables": { "reports": ["docs/reports/<AUDIT_REPORT>.md"], "artifacts": [] }
}
```

### 8.2 fix

Scoped implementation work with mandatory verification and closure. Fix is the default profile for bounded code changes — a bug fix, a feature addition, a targeted refactor.

- Includes implementation steps with concrete expected outcomes
- `verification` block with required commands is mandatory
- Tests and scripts MUST target the changed component, module, feature, or regression surface whenever possible
- Executors MUST prefer the smallest command set that proves correctness for the scoped change
- Unrelated suites, unrelated visual checks, and unrelated scripts are forbidden unless the task documents a direct dependency or regression risk
- Task is not complete until `mandatory_closure` passes

```json
{
  "task_mode": "fix",
  "authority_scope": {
    "must_read": ["<relevant authority docs>"],
    "must_not_violate": ["<architectural constraints>"],
    "allowed_change_classes": ["implementation", "verification", "docs-sync"]
  },
  "steps": [{ "title": "...", "actions": ["Implement...", "Verify..."], "expectation": "Change works as specified" }],
  "verification": {
    "required_commands": [
      "pnpm test <targeted-spec-or-filter>",
      "pnpm exec eslint <touched-paths>"
    ],
    "regression_targets": ["<affected paths>"]
  },
  "deliverables": { "reports": ["docs/reports/<FIX_REPORT>.md"], "artifacts": ["<changed files>"] }
}
```

### 8.3 cleanup

Strictly non-semantic alignment, consistency, removal, and tidy-up work. Cleanup **CANNOT hide semantic or architectural changes** — if the change alters behavior, contracts, logic, validation, or responsibility boundaries in any way, it is `fix`, not cleanup. This holds regardless of the change's size, the author's stated intent, or the cosmetic appearance of the diff.

- Changes are cosmetic, structural, or organizational only — no behavioral effect
- `must_not_violate` explicitly forbids semantic/architectural changes
- No new features, no altered APIs, no shifted responsibilities
- If the correctness of the change requires reasoning about logic or behavior, the task is misclassified
- Verification MUST stay narrow: targeted formatter/linter/test commands for touched files only, or direct review where commands are unnecessary

```json
{
  "task_mode": "cleanup",
  "authority_scope": {
    "must_read": ["<relevant docs>"],
    "must_not_violate": ["No semantic changes", "No architectural changes", "No API alterations"],
    "allowed_change_classes": ["cleanup", "docs-sync"]
  },
  "steps": [{ "title": "...", "actions": ["Remove...", "Align...", "Reorganize..."], "expectation": "Codebase tidier, behavior unchanged" }],
  "verification": { "required_commands": ["pnpm exec eslint <touched-paths>"], "regression_targets": ["<affected paths>"] },
  "deliverables": { "reports": [], "artifacts": ["<cleaned files>"] }
}
```

### 8.4 lock

Finalization, freeze, relock, or canon declaration. A lock task confirms that a body of work is complete and seals it against further uncontrolled changes.

- Requires evidence that the target area is fully verified before locking
- `mandatory_closure` includes explicit confirmation of completeness
- Deliverables include a lock confirmation artifact or canon declaration
- Verification must confirm only the locked surface and the exact dependency chain that can invalidate it
- Repo-wide commands are allowed only if the lock target itself is repo-wide

```json
{
  "task_mode": "lock",
  "authority_scope": {
    "must_read": ["<lock target docs>", "<verification evidence>"],
    "must_not_violate": ["No changes beyond lock declaration"],
    "allowed_change_classes": ["canon-clarification", "docs-sync"]
  },
  "steps": [{ "title": "...", "actions": ["Verify completeness...", "Declare lock..."], "expectation": "Target area sealed" }],
  "verification": { "required_commands": ["<targeted lock validation command>"], "manual_checks": ["Confirm all prior verification passed"] },
  "deliverables": { "reports": ["docs/reports/<LOCK_REPORT>.md"], "artifacts": ["<lock declaration>"] }
}
```

### 8.5 Task Mode Selection Canon

This section defines the canonical rules for selecting `task_mode` when authoring a TUNG task. These rules are authoritative and MUST be followed by any human author creating a new TUNG task.

#### 8.5.1 Authority of Selection

- Task classification is decided by the **human author** before task execution begins.
- The author MUST select the task_mode that matches the **primary intent** of the work, not its smallest component.
- Agents and executors MUST NOT self-select, reinterpret, or switch task_mode/profile during execution. They execute the task as classified by the author.
- If an executor discovers during execution that the task was misclassified (e.g., a cleanup task requires semantic changes), the executor MUST stop and escalate to the author rather than silently proceeding under the wrong profile.

#### 8.5.2 Primary Profile Routing Rules

Each primary profile has a strict routing boundary. The following rules define what intent routes to which profile:

**audit** — routes here when the task:

- Gathers evidence, analyzes state, compares implementations, or produces findings
- Does NOT change code, behavior, contracts, or runtime guarantees
- Outputs reports, classifications, or recommendations only

**fix** — routes here when the task:

- Changes behavior, logic, validation, structure with semantic effect
- Alters public API, runtime guarantees, or contract semantics
- Adds new features, capabilities, or behavioral paths
- Performs targeted refactoring that changes responsibility boundaries
- Implements tests for changed or new behavior
- Changes documentation that reflects new or altered semantics (docs-canonization with normative effect — e.g., changing system rules, adding mandatory requirements, redefining closure semantics)

**cleanup** — routes here when the task:

- Tidies, aligns, reorganizes, or removes dead material
- Improves consistency, formatting, naming, or file structure
- Does NOT change semantics, architecture, contracts, or behavior
- Does NOT introduce new features, alter APIs, or shift responsibilities
- Does NOT require reasoning about changed logic, validation, branching, state transitions, or contract meaning — if reasoning about behavioral correctness is needed to verify the change, it is `fix`, not cleanup
- Docs-canonization that only aligns wording or structure without adding normative rules routes here (or to `canon-sync` docs-only)

**lock** — routes here when the task:

- Finalizes, freezes, relocks, or declares canon for an already-verified area
- Seals an area against further uncontrolled changes
- Requires evidence that the target area is fully verified before locking

#### 8.5.3 Anti-Misclassification Rules (HARD BOUNDARIES)

The following misclassifications are canonically prohibited:

1. A task that changes behavior, contracts, or semantics **CANNOT** be classified as `cleanup`. Size of the change is irrelevant — a one-line semantic change is still `fix`, not `cleanup`.
2. A task that performs implementation (writes or changes code with behavioral effect) **CANNOT** be classified as `audit`.
3. A task that locks an area without prior evidence of completeness and verification **is invalid** as `lock`.
4. A task that produces implementation changes **CANNOT** be classified as `meta`, even if it also produces tasking/specification output.
5. Auxiliary modes (`stabilization`, `canon-sync`, `unlock`, `meta`) **CANNOT** be used to bypass the stricter boundaries and closure requirements of primary profiles. If the work matches a primary profile, the primary profile MUST be used.

#### 8.5.3.1 Classification and Closure Precedence Rules

When signals conflict during task classification or closure-depth determination, the following precedence rules apply. These rules are deterministic and CANNOT be overridden by author preference, convenience, or framing.

**Classification precedence (what task_mode to use):**

1. **Semantic effect overrides all other signals.** If the task has ANY semantic effect (changed behavior, logic, contracts, validation, branching, state transitions, or normative rules), it routes to `fix` regardless of the task's name, stated intent, file count, diff size, or how cosmetic the change appears.
2. **Underlying work type overrides auxiliary labels.** An auxiliary mode (`canon-sync`, `stabilization`) describes context, not routing. The actual underlying work determines the parent profile and closure requirements.
3. **Ambiguity defaults to stricter classification.** If it is unclear whether a change is semantic, it MUST be classified as `fix`. If it is unclear whether a mode is `cleanup` or `fix`, it MUST be `fix`.

**Closure-depth precedence (significant vs trivial):**

1. **Any single significant signal makes the task significant.** The significant criteria use OR logic — one matching condition is sufficient.
2. **Trivial requires ALL conditions met.** The trivial criteria use AND logic — every condition must hold.
3. **Ambiguity defaults to significant.** If significance is unclear, the task MUST be treated as significant with full review depth.
4. **Auxiliary modes inherit upward in strictness, never downward.** An auxiliary mode CANNOT reduce closure rigor below what the underlying work's significance demands. If the underlying work is significant, the auxiliary label does not lower review depth.

#### 8.5.4 Auxiliary Mode Routing

Auxiliary modes are valid only within their defined semantic scope and inherit closure requirements from their parent primary profile:

- **`stabilization`** → parent: `fix`. Valid when primary goal is hardening/robustness of existing system, not new feature work. Closure: full `fix` closure including reviewer-grade code review.
- **`canon-sync` (docs-only)** → parent: `cleanup`. Valid when pure documentation alignment with no semantic effect on code or contracts. Closure: `cleanup` closure.
- **`canon-sync` (with code)** → parent: `fix`. Valid when sync requires code, API, or contract changes. Closure: full `fix` closure including reviewer-grade code review.
- **`unlock`** → parent: — (control-state). Valid when removing a lock or expanding allowed scope; actual work after unlock is a separate task. Closure: verification of unlock correctness; no implementation review needed.
- **`meta`** → parent: — (orchestration). Valid when output is tasks, specifications, or orchestration with no product implementation. Closure: verification of completeness and consistency; no implementation-level code review.

**Critical rule:** `canon-sync` is a descriptive label subordinate to the actual underlying work. It is NOT an independent routing mode that can soften or override primary profile boundaries. If a `canon-sync` task requires ANY code change with semantic effect, or adds/changes normative rules in system documents, it MUST inherit from `fix`, not from `cleanup`. The author determines this at authoring time. When in doubt, `fix` inheritance applies — canon-sync CANNOT be used as a rhetorical shortcut to avoid fix-level closure.

#### 8.5.5 Author Decision Framework

When classifying a new TUNG task, the author MUST answer the following questions in order. The first matching rule determines the task_mode:

```text
Q1: Does the task produce other tasks, specs, or orchestration
    WITHOUT implementing product changes?
    → YES: meta
    → NO: continue

Q2: Does the task only remove a lock or expand allowed scope,
    with actual work deferred to a follow-up task?
    → YES: unlock
    → NO: continue

Q3: Does the task seal/freeze/relock an already-verified area
    with evidence of prior completeness?
    → YES: lock
    → NO: continue

Q4: Does the task ONLY gather evidence, analyze, compare,
    or produce findings — with ZERO code/behavior changes?
    → YES: audit
    → NO: continue

Q5: Does the task change ANY of: behavior, logic, contracts,
    APIs, runtime guarantees, semantic structure, or tests
    for changed behavior?
    → YES: fix (or stabilization if primary goal is hardening)
    → NO: continue

Q6: Does the task ONLY tidy, reorganize, remove dead material,
    align formatting/naming, or improve consistency
    — with ZERO semantic effect?
    → YES: cleanup
    → NO: see tie-breaker below
```

**Tie-breaker / default rule:** if there is ANY uncertainty whether a change has semantic effect, the author MUST classify the task as `fix`, not `cleanup`. The cost of over-classifying as `fix` is a slightly more rigorous closure process. The cost of under-classifying as `cleanup` is missed review of behavioral changes. The system MUST bias toward safety.

#### 8.5.6 Profile Usage Workflow

After selecting the correct task_mode using the decision framework above:

1. **Select** the matching canonical profile skeleton from sections 8.1–8.4
2. **Copy** the skeleton and fill in task-specific fields
3. **Extend** with additional `steps`, `success_criteria`, and `deliverables` as needed
4. **Verify** that the selected profile's `must_not_violate` constraints match the intended work scope
5. For auxiliary modes, **confirm** the parent profile and ensure closure requirements are inherited correctly

Agents executing TUNG tasks follow the task as written — they do not select or switch profiles. If the task classification appears incorrect during execution, the agent MUST stop and escalate rather than silently adjusting.

#### 8.5.7 Blessed task_mode Extensions (consolidation 001)

Practice minted 40+ free-form `task_mode` labels across the portfolio (audit 003 §6.4), which defeats class-based closure routing (§8.5.2). Rather than hard-reject every minted label, consolidation 001 (per audit 003 §8.3) adopts a **small blessed extension list** — real, recurring labels that are tolerated because each maps deterministically onto a canonical closure profile:

| Blessed `task_mode` | Maps to (closure profile) | Meaning |
|---|---|---|
| `review` | `audit` | review-only pass producing findings, no code changes |
| `bundle` | `meta` | a multi-task fan-out / sequential bundle of child tasks |
| `master` | `meta` | a master/orchestration chain authoring child specs |
| `feature` | `fix` | feature build (alias of `fix`; the canonical mode is `fix`) |

Normative rules:

- A blessed extension inherits the **full** closure rigor of its mapped profile — it CANNOT lower review depth below it (the §8.5.3.1 upward-only inheritance applies).
- Authors SHOULD prefer the canonical primary/auxiliary mode where practical; the blessed alias exists to absorb established habit, not to encourage new dialects.
- Any `task_mode` **outside** the canonical set (audit/fix/cleanup/lock + stabilization/canon-sync/unlock/meta) **and outside** this blessed list is a **linter WARNING, not a hard reject** (see §10 / `tung_lint.py`). The author must map it to a canonical mode or reclassify.
- This list is **not** retroactive: existing specs' modes are never reclassified (audit 003 §9 "do not re-classify authors' task_mode"). The blessing governs **new** authoring and the linter's verdict only.

### 8.6 Execution-Safety Sections — Examples by Task Class

Эти примеры показывают, как заполнять `non_goals`, `forbidden_execution_patterns` и `execution_guardrails` для трёх типичных классов задач. Они специфичны намеренно: копируйте паттерн, не сочиняйте собственную интерпретацию. Избегайте расплывчатых фраз вроде «do not break anything».

#### 8.6.1 audit-only task

Цель: собрать evidence о дубликатах venue-карточек, ничего не меняя.

```json
"non_goals": [
  "Do not fix any duplicate venue records found — this is evidence-gathering only",
  "Do not edit data/sites/**/*.json or any L2 fixture",
  "Do not change the venue resolver in lib/"
],
"forbidden_execution_patterns": [
  "No runtime/product/data changes — audit produces a report only",
  "No repo-wide build/lint/typecheck/test runs — verification is manual consistency and evidence review",
  "Do not run pnpm sync or pnpm publish-snapshots"
],
"execution_guardrails": [
  "If a fixable data bug is found, record it as a follow-up finding in the report with severity; do not fix it",
  "If the audited scope is ambiguous, narrow it explicitly in the report rather than expanding the search blindly"
]
```

#### 8.6.2 fix task

Цель: исправить broken venue image URLs в одном data-resolver и его тесте.

```json
"non_goals": [
  "Do not redesign the image fallback component",
  "Do not touch unrelated venue fields (hours, pricing, geo)",
  "Do not change next.config.mjs image remotePatterns"
],
"forbidden_execution_patterns": [
  "No opportunistic refactor outside the resolver and its spec",
  "No full-repo build — run only the targeted resolver test and eslint on touched paths",
  "Do not treat the PROJECT_PROGRESS entry as a substitute for the reviewer-grade closure review"
],
"execution_guardrails": [
  "Preserve the resolver's existing public signature; if a signature change seems required, stop and escalate",
  "If another broken-URL pattern is found outside the declared field, document it as a follow-up; do not fix it here",
  "When choosing verification, prefer the targeted spec over the whole test suite"
]
```

#### 8.6.3 master / meta task

Цель: master-задача, чей output — набор child-TUNG спецификаций (orchestration, без product implementation).

```json
"non_goals": [
  "Do not implement any of the child tasks — this task only authors their specs",
  "Do not modify runtime code, data, or package files",
  "Do not retrofit previously completed TUNG reports"
],
"forbidden_execution_patterns": [
  "No product implementation under a meta label (a meta task that writes product code is misclassified — see 8.5.3 rule 4)",
  "No repo-wide build/lint/test — meta output is documents; verify completeness and consistency only",
  "Do not collapse child task specs into vague placeholders"
],
"execution_guardrails": [
  "If a child task turns out to require implementation decisions beyond authoring, split it into its own fix task rather than implementing inline",
  "If two child specs overlap in scope, document the boundary explicitly instead of silently merging them",
  "If the master scope is ambiguous, stop and escalate to the author before generating child specs"
]
```

---

🏁 9. Зачем мы это сделали

TUNG-система позволяет:

строить многошаговые пайплайны,

автоматизировать разработку,

держать весь проект в единой структуре,

избежать хаоса,

превратить Cursor в внутренний CI/CD.

Теперь с обязательным verification, mandatory_closure и явными deliverables — это ещё на уровень выше.

🚀 10. Будущее TUNG

Автоматическая генерация задач.

TUNG-Orchestrator.json (центральный контроллер).

Визуализация пайплайна.

Генерация задач через AI-агентов.

Статический анализ TUNG-файлов (TUNG Validator) — ✅ **реализовано (consolidation 001):** `tung_lint.py` (factory canon, stdlib-only) валидирует v2-full структуру, резолвит closure-профиль task_mode и эмитит exec-safety / task_mode warnings. Generalized-lift из `Research_AI/truth_engine/tung/{schema,mode}.py` (только схема+валидатор+Q1–Q6 классификатор; без compiler/REST/dashboard). См. `TUNG-EXECUTION-RULE-(CANON).txt` §8.
