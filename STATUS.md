# STATUS — Miss Lana's Fairy-Tale Theatre (редизайн сайта)

**Deployment: LIVE** · **Launch state: LAUNCHED (publicly indexable)** · **Phase:** MVP-набор страниц и
финальный копирайт собраны; site-wide **noindex снят 2026-06-27** (`STABILIZE_MISS_LANA_PRELAUNCH_001`,
явное решение владельца) — публичный сайт **индексируется**. Остаются пост-лонч задачи (ниже).
**Last real work:** 2026-07-01 · **Brand:** Miss Lana's Fairy-Tale Theatre (см. `docs/core/BRAND.md`).
**Domain/contact:** `misslanatheatre.com` is the live primary production domain; `misslanatheater.com`
is protective alternate only → 301 to primary. Primary contact: `info@misslanatheatre.com`
(**inbox live & monitored — owner-confirmed 2026-06-29**), **(323) 903-2039**; SMS/email/WhatsApp
accepted; Svitlana replies in **1-2 business days**.
**Post-launch tasks (open):** verified reviews/testimonials (`[OWNER/CONTENT]`, target ≥5 with
permission/source), **lead pipeline — `MONGODB_URI` + Telegram provisioned & verified on prod
(2026-06-29); email inbox `info@misslanatheatre.com` live. Remaining: optional automated lead-email
delivery (`LEAD_EMAIL_WEBHOOK_URL` sending provider) + the Preview→Production E2E gate**
(`MISS_LANA_PRODUCTION_LEAD_PIPELINE_PLAN`), redirect/DNS verification, GBP/Search Console submission,
QA, and real media. (Site-wide **noindex removal — done** 2026-06-27.)

> **Репертуар восстановлен до 8 шоу (2026-07-01, `MISS_LANA_REPERTOIRE_OWNER_CANON_RECONCILE_001`,
> ветка `fix/repertoire-owner-canon`).** Прошлый заход (`ab7bdd8`) ошибочно сократил публичный
> репертуар до 7; по прямым ответам владельца восстановлены **8 действующих шоу**: добавлен
> **Three Little Pigs**; **Two Sisters** заменило ошибочную «The Winter's Gift / Father Frost»;
> **The Rabbit House** = owner-confirmed имя (было «The Bunny's Little House»). Старые URL
> `/shows/the-winters-gift` и `/shows/the-bunnys-little-house` — **301** на новые slug. Per-show
> возрасты по владельцу; featured = Three Little Pigs · The Rabbit House · Little Red Riding Hood ·
> Two Sisters. **Donkey's Birthday** остаётся вне репертуара; дубля Suzy Bee/Maya the Bee нет.
> `ci:exact` **exit 0** (8 SSG-страниц шоу); ручная проверка 8 маршрутов + redirects + sitemap —
> зелёная; e2e Phase-2 shows 16/16. Отчёт — `docs/reports/MISS_LANA_REPERTOIRE_OWNER_CANON_RECONCILE_001.md`,
> ревью — `docs/reviews/MISS_LANA_REPERTOIRE_OWNER_CANON_RECONCILE_001_code_review.md`. Открыто
> только публичное имя пчелиного шоу (Suzy Bee vs Maya the Bee). **PR открыт, не смёржен.**

> **Durable lead store implemented (2026-06-28, `feat/miss-lana-durable-lead-store`).** Booking inquiries
> now persist to **MongoDB Atlas** (db `misslana`, coll `leads`) as the production system of record;
> `accepted = mongo.ok || email.ok` (Telegram never an acceptance signal); `submissionId` unique index
> makes retries idempotent; `notificationStatus` is persisted. Code/tests/docs are **CLOSE**-ready (128
> tests green, `ci:exact` green). **Blocked on infra:** Atlas cluster + Vercel Preview/Prod secrets +
> Preview/Prod E2E + owner confirmation are not yet done — see the closure report and the plan's Phase
> B/G/H/J. **Until those pass, do not treat lead delivery as launch-verified.**

> **Lead output-channels normalized (2026-06-28, `claude/normalize-miss-lana-outputs-k1cye1`, TUNG
> `NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001`).** Telegram + Google Sheets **output** hardened without
> touching architecture/acceptance/form/schema. Telegram: deterministic plain-text formatter, stable
> field order, empty optionals omitted, **event date keeps its calendar day** (no UTC shift), received
> time in **America/Los_Angeles** (PST/PDT), guaranteed under the Bot-API limit (only Notes trimmed, with
> a marker). Google Sheets: **fixed column contract**, formula-injection neutralized (phone stays text),
> full notes stored; **hardened Apps Script** (Script Properties, token auth, server-side `submissionId`
> dedupe under `LockService`, JSON `{ok,duplicate,errorCode}`); `appendToSheet` success = 2xx AND JSON AND
> `ok===true`. A **duplicate `submissionId` suppresses** all secondary delivery (no second Telegram/row/
> email). `notificationStatus` carries the `sheets` channel status. **107 unit tests green (+35), `ci:exact` green.**
> Report: `docs/reports/NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001.md`. **Still owner/operator-gated:**
> live synthetic prod + duplicate test, Telegram-chat membership & Sheet permissions confirmation, and
> **lead-retention period (OPEN OWNER DECISION)**.

> **Финальный копирайт применён (2026-06-23).** Удалены все плейсхолдер-литералы; 8 синопсисов финал;
> прайс-флор `$350` везде (вкл. таблицу); правило расстояния = бесплатно ≤30 миль от LA, далее по расстоянию
> (без $-сумм); `/about` явно называет украинские корни (тепло, нейтрально в бренде/SEO); alt «founder» убран.
> Остаётся 🔴: мини-история Miss Lana (владелец), реальные graded фото/видео, соцссылки, формат-сплит шоу.
> Находки — `docs/reports/2026-06-23-copy-fixes-build-findings.md`.

> **Owner-answers canon-sync применён (2026-06-27, TUNG `CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001`).**
> Канон фактов синхронизирован с ответами владелицы: длительность → **около часа** (~30 мин спектакль +
> ~30 мин интерактив), труппа → **3–4 артиста**, публичная цена → **только «From $350»** (градация по
> числу детей — внутренняя, не публикуется), правило расстояния подтверждено (greater LA/Orange County
> free, дальние — по расстоянию), сетап/площадка зафиксированы (~20 м², ~15–20 мин, свой звук),
> **Svitlana Grygoryshyna = владелец и директор**, California с 2022. Решение «куклы внутри» подтверждено
> и записано, но переписывание «no puppet» guardrails — **отдельным пассом**. Новый артефакт фактов —
> `docs/core/OWNER_ANSWERS_DECISION_RECORD.md`; единый отчёт пайплайна —
> `docs/reports/CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001.md`. **Кода/сайта не меняли.**
> ⚠️ Note: в коде (`lib/shows.ts` и др.) длительность «35–50 min» ещё стоит — это применит Task 02
> (`FIX_MISS_LANA_GLOBAL_PUBLIC_COPY_001`), а не canon-sync.

---

> Этот репозиторий — **factory-starter-kit, переиспользованный под проект Magic Castle / Miss Lana**.
> Это файл прогресса/состояния **проекта** (как требует `CLAUDE.md` §7: «Прогресс/состояние
> репозитория фиксируется в `STATUS.md`»). Конвенция STATUS/ARCHIVE кита — ниже, она в силе.

## Где проект сейчас

- ✅ **Discovery / бриф** — собран; источник истины по фактам: `docs/core/PROJECT_BRIEF.md`.
- ✅ **Ребрендинг** — имя/домен закреплены: **Miss Lana's Fairy-Tale Theatre**, зонтик **Miss
  Lana**, primary production domain `misslanatheatre.com` уже live. `misslanatheater.com` —
  protective alternate only → 301 на primary. Старый `magic-castle-puppet-theater.com` → 301
  на релевантные новые URL.
  Канон бренда — `docs/core/BRAND.md` (LOCK).
- ✅ **Кор-документация** — `docs/core/` (BRAND + 00–05 + PROJECT_BRIEF); индекс — корневой `README.md`.
- ✅ **Ресёрч** — карта конкурентов (`docs/reports/2026-06-21-la-kids-puppet-theater-competitor-research.md`,
  архивная рамка) + Google Maps Platform scoping (`docs/reports/2026-06-21-google-maps-platform-scoping.md`).
- 🟡 **Сборка сайта** — активное Next.js-приложение находится в **repository root**
  (`app/`, `components/`, `lib/`, `public/`, `tests/`). `baselines/js-next/` — исторический путь из ранней
  фазы и не является текущим местом разработки. MVP-набор страниц собран, финальный copy pass применён,
  production deployment на `misslanatheatre.com` live; публичный сайт **индексируется** (site-wide
  noindex снят 2026-06-27). `/design` остаётся внутренним (noindex) — перед публичным трафиком
  env-guard'ить/убрать; за trademark-гейтом — финальные лого/вордмарк/персонаж/иллюстрации.

## Открытые вопросы (блокируют часть сборки)

trademark-clearance (до лого/печати) · ссылки на соцсети · verified reviews/testimonials
(target ≥5, permission/source) · 301/оплата protective/legacy domains · стратегия по гос. школам ·
публичное имя пчелиного шоу (Suzy Bee vs Maya the Bee) · редизайн лого 2026 · фото/видео-активы ·
формат-сплит 8 шоу + переписать «no puppet» guardrails (формат «куклы внутри» подтверждён) ·
финализация политик (отмена/депозит/перенос — owner дал ориентиры, как публичная политика не
закреплены). Доплата за расстояние — ✅ правило подтверждено (greater LA/Orange County free, дальние
по расстоянию). Полный список — в `docs/core/PROJECT_BRIEF.md`, `docs/core/OWNER_ANSWERS_DECISION_RECORD.md`
(§4 unresolved) и корневом `README.md`.

## Prelaunch pipeline — порядок задач (`tasks/miss-lana-prelaunch-pipeline/`)

1. ✅ `CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001` (canon-sync; этот заход)
2. `FIX_MISS_LANA_GLOBAL_PUBLIC_COPY_001` — бренд/телефон/длительность/travel wording в коде
3. `IMPLEMENT_MISS_LANA_LIGHTWEIGHT_CONTENT_STRUCTURE_001` — распределение контента по страницам
4. `BUILD_MISS_LANA_EVENT_PLANNING_FAQ_001` — страница `/planning-your-event`
5. `IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001` — реальная отправка формы (∥ с 3–4 после 2)
6. `FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001` — canonical/metadata/schema/sitemap/301
7. `STABILIZE_MISS_LANA_PRELAUNCH_001` — реальные фото, отзывы, QA, снятие noindex, запуск

Единый отчёт пайплайна — `docs/reports/CANON_SYNC_MISS_LANA_OWNER_ANSWERS_001.md` (по каждой задаче
дописывается своя секция). Очередность/правила параллелизации — `tasks/miss-lana-prelaunch-pipeline/README.md`.

## Закрытие IMPLEMENT_MISS_LANA_DESIGN_TOKENS_001 (2026-06-22)

**Сделано:** `components/ui/` — `Button`, `Field`, `Card`, `Nav` (+ `cx`, `index`, `README.md`);
repoint `/design` (components-section → реальные примитивы; `page.tsx` → реальный `Nav`); hardening
`:focus-visible` в `globals.css`; e2e расширен. Токен-основа — единый источник (не форкал/не дублировал),
все значения из `DESIGN_SYSTEM.md`. `pnpm run ci:exact` + `pnpm test:e2e` зелёные (6/6 e2e).

**Находки (severity):**

- **NOTE** — `BUILD_MISS_LANA_DESIGN_PREVIEW_001` и эта задача шли **параллельно в одном дереве** (две
  Claude-сессии); параллельная сессия удаляла файлы примитивов на лету — восстановлены. На будущее: одна
  задача = одна сессия в одном рабочем дереве (или изолированный worktree), как требует `CLAUDE.md` §7.
- **LOW (исправлено в этой задаче)** — `:focus-visible` задавал `border-radius:2px`, что «квадратило» pill/
  карточки при фокусе; убрано, чтобы outline следовал форме элемента.
- **LOW (пред-существующее, НЕ чинил — вне scope)** — CSP в `next.config.ts` без `'unsafe-eval'` даёт dev-only
  предупреждения React в консоли (`eval() is not supported`); на прод не влияет, тесты зелёные.
- **NOTE (исправлено в `CLEANUP_MISS_LANA_POST_PHASE1_001`)** — legacy Phosphor React package (устаревший) заменён
  на поддерживаемый преемник `@phosphor-icons/react@2.1.10` (тот же набор Phosphor, React 19); по-прежнему
  одна библиотека. Duotone-нить (`path[opacity]` → `glow-400`) рендерится без изменений селектора.
- **NOTE (gated)** — финальные лого/вордмарк/персонаж/продакшн-иллюстрации — за trademark-clearance;
  примитивы работают на плейсхолдерах (text-вордмарк + Phosphor-glyph), финальных ассетов не вшивал.

**Дальше:** исторически этот блок вёл к сборке страниц; текущее состояние см. в верхнем разделе STATUS.
Отдельной задачей за TM-гейтом — финальные ассеты вместо плейсхолдеров. `/design` env-guard'ить перед продом.

## Закрытие EXTEND_MISS_LANA_PRIMITIVES_001 (2026-06-22)

**Сделано:** расширена UI-библиотека `components/ui/` под сборку страниц + SEO. **Card** —
опциональная Button-CTA (`cta`), service-line `accent` (§12: верхний бордер + тинт тега), `tag`
(show-card текст-ссылка сохранена). Новые примитивы: **Breadcrumb** (+ BreadcrumbList JSON-LD),
**Tag**, **Accordion** (FAQ, без layout-анимации §10.4), **Container/Section/SectionHeader**
(layout §5.1/§11), **JsonLd** (без `dangerouslySetInnerHTML` — экранирование `<`), `accent.ts`
(§12 карты). **lib/seo.ts** — `buildMetadata` + схемы `PerformingGroup`/`LocalBusiness`,
`TheaterEvent`, `BreadcrumbList`, `FAQPage`. Барелл/README/`/design`-галерея/e2e обновлены.
`pnpm run ci:exact` + `pnpm test:e2e` зелёные (e2e 19/19 на интегрированном дереве).

**Находки (severity):**

- **NOTE** — параллельная сессия (Phase 1: `components/shell/`, `components/blocks/`, `brand/`,
  `motion/`, `lib/site.ts`, реальная `app/page.tsx` Home) шла **одновременно в одном дереве**.
  Был рассинхрон расположения примитивов (она ждала `SectionHeader`/`Breadcrumb` в `shell/`,
  тип акцента в `lib/site`). По решению владельца сведено к **`components/ui/`** как единому
  источнику: все потребители импортируют из `@/components/ui`, `lib/site` использует мой
  `Accent` из `@/components/ui/accent`. На будущее: параллельные сессии — в изолированных
  worktree (CLAUDE.md §7).
- **LOW (исправлено)** — `Breadcrumb` рендерил Phosphor-иконку в server-компоненте →
  `createContext only works in Client Components` (падал e2e). Добавлен `"use client"`.
- **LOW (исправлено)** — `scripts/governance.mjs` ловит подстроку `dangerouslySetInnerHTML`;
  она была в комментарии `JsonLd.tsx` (описание «не используем») → ложное срабатывание.
  Комментарий перефразирован; реальный `dangerouslySetInnerHTML` не используется.
- **NOTE (scope)** — этот коммит содержит **только** примитивы (`components/ui/*`, `lib/seo.ts`,
  `/design`-галерею, `tests/e2e/design.spec.ts`). Phase-1 файлы параллельной сессии в коммит
  **не** включены — их фиксирует её сессия.

**Дальше:** Phase 1 (Home + shell + booking/pricing) собирается параллельной сессией на этих
примитивах; страницы шоу/линий (Phase 2) и SEO-разметка (organization/event/breadcrumb/faq) —
подключать через `lib/seo` + `<JsonLd>` по мере сборки.

## Закрытие BUILD_MISS_LANA_HOME_AND_SHELL_001 (2026-06-22)

**Сделано:** Phase 1 реального сайта на плейсхолдерах. Глобальный каркас `components/shell/`
(`SiteShell`/`SiteHeader`/`SiteFooter`/`BookingCTABand`/`LeadForm` — клиентская валидация +
on-screen confirmation, без бэкенда/`StubPage`); блоки Home `components/blocks/` (Hero=LCP без
анимации, TrustStrip, FormatExplainer, ServiceLineCards, FeaturedShows, B2B/B2C-тизеры,
PersonaIntro, GalleryTeaser, HowItWorksAreas); helpers `motion/Reveal` + `brand/Glyphs`; факты
`lib/site.ts`. Маршруты: **Home** (`app/page.tsx`, полный стек §4.1) · **Booking** (`app/booking`,
§4.7) · **Pricing** (`app/pricing`, §4.4) + 6 stub'ов (nav без 404). Композиция целиком из
**`@/components/ui`** (без форков/дублей) + `lib/seo buildMetadata`. Site-wide **noindex**
(`app/layout.tsx` + per-page). e2e `tests/e2e/site.spec.ts` (12). `pnpm run ci:exact` +
`pnpm test:e2e` зелёные (**19/19**). Полная заметка (placeholder→финал + находки) —
`docs/reports/2026-06-22-home-and-shell-build-findings.md`.

**Находки (severity):** нет BLOCKER/HIGH/MEDIUM.

- **NOTE** — координация с параллельной примитивной сессией: единый источник сведён к
  `@/components/ui`, удалены мои дубли `shell/SectionHeader`/`Breadcrumb`/`PlaceholderTag`,
  `ServiceLineCards` переведён на расширенный `Card` (accent/tag), `lib/site` выровнен по `Accent`.
- **NOTE** — вордмарк `Nav` ведёт на `#` (не Home); фикс — `homeHref`-проп примитива (отдельно, не форкал).
- **NOTE** — два fact-модуля: `lib/site` (UI/контент) и `lib/seo` (SEO); пересечение по назначению.
- **LOW (пред-сущ., не чинил — вне scope)** — CSP в `next.config.ts` без `'unsafe-eval'` → dev-only
  React `eval() is not supported` в консоли; на прод не влияет, гейт/тесты зелёные.
- **NOTE (gated)** — вся копия/образы — плейсхолдеры (помечены); финал лого/вордмарка/персонажа/
  иллюстраций — за trademark-clearance.

**Дальше:** Phase 2 `BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001` (/shows hub + show-detail ×8 +
/school-shows + /birthdays), затем Phase 3 (`SHOWCASE_AND_ABOUT`). Сайт остаётся **noindex** до
Phase 5; `/design` env-guard'ить/удалить перед продом. Owner-входы: формат-сплит + 2 переименования
шоу, суммы доплаты, соцссылки, фото/видео; TM-гейт — финальные ассеты.

---

## Закрытие CLEANUP_MISS_LANA_POST_PHASE1_001 (2026-06-22)

**Сделано:** четыре ограниченных пункта долга после Phase 1, без новых страниц/блоков/редизайна.
(1) **Иконки** — legacy Phosphor React package → `@phosphor-icons/react@2.1.10` (поддерживаемый преемник,
React 19); мигрированы все 18 импортов (UI-примитивы, блоки, `/design`); по-прежнему **одна** библиотека.
Duotone-нить рендерится без правки селектора (v2 тоже метит вторичный путь `opacity="0.2"`, CSS
`[data-icon="duotone-brand"] … path[opacity]` → `glow-400` цел). (2) **Nav** — добавлен проп
`homeHref` (default `/`); вордмарк теперь ведёт Home (а не `href="#"`), добавлен `aria-label`;
`SiteHeader` передаёт `homeHref="/"`; остальное поведение Nav без изменений. (3) **APP_BASE_URL** —
пламбинг уже был (`lib/env.baseUrl` → `lib/seo.absoluteUrl` → canonical/OG/BreadcrumbList);
задокументирован прод-пример в `.env.example` (origin не зашит в код). (4) **Канон** — `DESIGN_SYSTEM.md`
§6/§14.3 имя пакета + §2 принцип **mobile-first**; `SITE_STRUCTURE_AND_BLOCKS.md` §1 mobile-first;
`components/ui/README.md` — имя пакета. e2e расширен (вордмарк → Home; Duotone-нить рендерится).
`pnpm run ci:exact` + `pnpm test:e2e` зелёные (e2e **21/21**).

**Находки (severity):**

- **NOTE (параллельная сессия)** — во время задачи другая Claude-сессия одновременно правила
  `components/ui/Nav.tsx` (добавила strict-null хардненинг: `!!entry &&`, `if (!first || !last) return;`)
  и автоматически стейджила файлы в индекс. Изменения благие и ортогональны моим; не откатывал чужую
  работу. **Не коммитил** (задача не просила). Индекс смешивает мои правки, файлы другой сессии
  (перенос `docs/…build-findings.md` в `docs/reports/`, `next.config.ts`, `PROJECT_PROGRESS.md`) и
  build-генерат (`tsconfig.json`, `next-env.d.ts` от `next build`). Перед любым коммитом — `git diff --cached`
  и стейдж по явному пути. Напоминание `CLAUDE.md` §7: одна задача = одна сессия в одном дереве.
- **LOW (пред-существующее, НЕ чинил — вне scope)** — CSP в `next.config.ts` без `'unsafe-eval'` даёт
  dev-only предупреждение React (`eval() is not supported`); на прод не влияет, тесты зелёные. Остаётся
  трекнутой находкой (тюнить при харднинге CSP с реальными страницами).
- **NOTE (вне scope)** — `STATUS.md` строка про `baselines/js-next/` и `2026-06-22-design-system-research-v2.md`
  всё ещё упоминают старый Phosphor package/старый путь как **исторические** артефакты — не канон-зависимости,
  оставлены как запись истории. Консолидация `lib/site`↔`lib/seo` — отдельная опциональная задача.

**Дальше:** Phase 2 `BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001`, построенная **mobile-first** (теперь канон).
Сайт остаётся **noindex** до запуска.

## Закрытие FIX_MISS_LANA_PREVIEW_POLISH_001 (2026-06-22)

**Сделано:** пять preview-правок (без новых страниц/токенов/дизайна): (1) US-даты — `<html lang="en-US">`
+ booking date-поле маскированное `mm/dd/yyyy` (controlled, без либы) + валидация формата (`LeadForm`);
(2) brand-глиф `Lantern` (силуэт фонаря, server-safe SVG в `Glyphs.tsx`) вместо bulb-подобного `Lightbulb`
в `BookingCTABand`/`LeadForm` — плейсхолдер, Phosphor остаётся либой иконок; (3) канонические названия
featured-шоу (`lib/site.ts` из `01_CONTENT_INVENTORY`: Little Red Riding Hood · The Bunny's Little House
· Father Frost · The Gingerbread Man); (4) `«Storybook Grove»` → `«Lantern Light»` в `PROJECT_PROGRESS` +
research-отчёте; (5) дружелюбный «Coming soon» в `StubPage` (убран phase-жаргон + проп `phaseNote`).
`ci:exact` + `pnpm test:e2e` зелёные (21/21); `file_check` EXISTS_READABLE. Заметка —
`docs/reports/2026-06-22-preview-polish-findings.md`.

**Находки:** нет BLOCKER/HIGH/MEDIUM.

- **NOTE** — параллельно шла Phase-2 сессия: `/shows` и `/school-shows` стали реальными страницами
  (`lib/shows`/`ShowCardGrid`/`FaqSection`), мои stub-эдиты там перетёрты (они больше не stub). `LeadForm`
  переиспользуется — маскированная дата + lantern едут и на новые страницы. Остальные правки целы.
- **NOTE** — `lib/site.PLACEHOLDER_SHOWS` ↔ новый `lib/shows.SHOWS` — дублирование данных шоу; Home
  `FeaturedShows` стоит позже перевести на `lib/shows`.
- **NOTE** — PersonaIntro использует портрет `UserCircle` (не bulb) — оставлен корректным.

**Отложено (вне scope, владельцу/Phase-2):** price-floor ($300 vs «from $350») — единый публичный пол +
выровнять таблицу/копи; nav «Pricing» и сокращение Home-формы (UX); суммы доплаты/соцссылки/ассеты — гейты.

## Закрытие BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001 (2026-06-22)

**Сделано:** Phase 2 — репертуар + два приоритетных лендинга на примитивах, mobile-first.
Дата-модуль `lib/shows.ts` (8 шоу: slug/title/teaser/synopsis/theme/ages/length/featured — титулы/слаги
**канон** из `01_CONTENT_INVENTORY` + утверждённые переименования `the-winters-gift`/`little-red-riding-hood`;
синопсисы — **временный** плейсхолдер-копирайт). Маршруты: `app/shows/` (хаб: SectionHeader + `ShowCardGrid`(8)
+ BookingCTABand) · `app/shows/[slug]/` (детальный шаблон ×8, `generateStaticParams` + `dynamicParams=false`;
**TheaterEvent** + **BreadcrumbList** + уникальная metadata; hero «Book this show» → synopsis/theme →
photo/video placeholder → related → areas/«from $350») · `app/school-shows/` (B2B, sage) · `app/birthdays/`
(B2C, coral) — оба с FAQ (Accordion + **FAQPage**) + LeadForm + BookingCTABand (заменили stub'ы). Новые блоки
`components/blocks/ShowCardGrid.tsx` + `FaqSection.tsx`. Home `FeaturedShows` → `FEATURED_SHOWS` (реальные
титулы, ссылки на `/shows/{slug}`); мёртвый `PLACEHOLDER_SHOWS` удалён из `lib/site.ts`. e2e +Phase-2.
`pnpm run ci:exact` + `pnpm test:e2e` зелёные (**32 passed**; 8 страниц шоу — SSG). Полная заметка/🔴 —
`docs/reports/2026-06-22-shows-and-landings-build-findings.md`.

**Находки (severity):** нет BLOCKER/HIGH/MEDIUM.

- **LOW** — на детальной странице primary-CTA «Book this show» в hero (а не по §4.2 после видео); конверсия
  сохранена, BookingCTABand закрывает страницу.
- **NOTE (отступление, осознанно)** — фото: вместо скрейпа live-сайта — помеченный placeholder-трит
  («Photo — pending»). Причины: нет image-тулинга (sharp/imagemagick) под «crop/resize», CSP `img-src 'self'`,
  гигиена/IP бинарей; задача сама разрешает fallback. Поле `image` в `lib/shows` готово под реальные ассеты
  (Phase 4 [ASSET]).
- **NOTE (контент)** — указанный в задаче файл `docs/reports/2026-06-22-phase2-content-shows-and-landings.md`
  **отсутствовал** в репо; синопсисы/копи лендингов написаны как временный плейсхолдер (титулы/слаги — канон,
  не выдуманы). Финальный copy-review — позже.
- **NOTE (параллельная сессия)** — одновременно шла отдельная задача `FIX_MISS_LANA_PREVIEW_POLISH_001`
  (скриншоты/preview); по решению владельца («I own this build») мои Phase-2 реализации авторитетны для
  перечисленных маршрутов/файлов. **Не коммитил** (задача не просила; индекс смешан — перед коммитом
  `git diff --cached` + стейдж по явному пути).

**Дальше:** Phase 3 `BUILD_MISS_LANA_SHOWCASE_AND_ABOUT_001` (/services + /characters + /gallery + /about).
Сайт остаётся **noindex** до Phase 5. Owner-гейты: формат-сплит → фильтр на /shows; суммы доплаты;
соцссылки; реальные graded-фото; финальный EN-copy.

---

## Закрытие BUILD_MISS_LANA_SHOWCASE_AND_ABOUT_001 (2026-06-22)

**Сделано:** Phase 3 — четыре оставшиеся MVP-страницы на примитивах, mobile-first (заменили stub'ы).
**MVP-набор страниц завершён.** `app/services/` (зонтик §4.3: hero + 4 service-line `Card` из
`SERVICE_LINES` с посекционным акцентом §12 + CTA на свою линию → TrustStrip → BookingCTABand;
достижима через новую footer-ссылку «Services») · `app/characters/` («& Friends», **berry** §12: hero
placeholder → отстройка от генерик-аниматоров → how-it-works → BookingCTABand) · `app/gallery/` +
`components/blocks/GalleryGrid.tsx` + `lib/gallery.ts` (§4.5: masonry на CSS-columns, 4 канон-категории
Shows/Troupe/Children/Backstage, встроенное **muted+captioned видео**; медиа-вайринг как в `lib/shows.ts`,
до ассетов — помеченный «Photo/Video — pending», без скрейпа, reserved aspect = без CLS) · `app/about/`
(§4.6: миссия → 30+ лет → труппа 4 артиста+роли **канон** из `01_CONTENT` → **тихий flagged бэкстори** →
`PersonaIntro` → ценности → TrustStrip + BookingCTABand). `lib/site.ts`: + `TROUPE` (канон-имена/роли),
`VALUES`, footer-ссылка «Services». Каждая страница — один `h1`, уникальная `buildMetadata`, `Breadcrumb`
(+ BreadcrumbList JSON-LD). e2e +Phase-3 (200+H1 ×4, noindex ×4, BreadcrumbList ×4, /services→4 линии,
gallery scaffold, about troupe/30+, reduced-motion).

**Верификация:** `pnpm run ci:exact` — **зелёный** (lint+typecheck+governance+build; 22 маршрута, +4 новых).
`pnpm test:e2e` — **не выполнить в контейнере**: egress заблокирован (403 на все хосты, вкл. `cdn.playwright.dev`),
браузер Playwright не скачать и в кэше нет. Тесты написаны, гоняются в CI. Замещающая проверка: `pnpm dev` +
`curl` по 4 маршрутам — 200, верный H1, `noindex`, `BreadcrumbList`; /services линкует 4 линии; /gallery — 4
category-заголовка «… — pending assets» + плейсхолдеры; /about — 4 имени труппы.

**Находки (severity):** нет BLOCKER/HIGH/MEDIUM.
- **LOW** — captions в `lib/gallery.ts` — временный generic alt; финал в Phase 4 [ASSET].
- **NOTE (контент)** — указанный файл `docs/reports/2026-06-22-phase3-content-...md` **отсутствовал**
  (как в Phase 2); вся проза — временный плейсхолдер из канона; имена/роли труппы — канон `01_CONTENT`.
- **NOTE (e2e env)** — браузер не скачать (403); CI выполняет.
- **NOTE (медиа)** — только placeholder-трит; без скрейпа; CSP не трогали; поля под ассеты готовы.

**🔴 Открытые гейты:** реальные graded фото/видео (галерея — скелет) · подтвердить Svitlana = владелец →
финал /about (сейчас только роль Director) · heritage-формулировка /about (soft default, страна не названа) ·
финал портрета Miss Lana/персонажей · суммы доплаты + соцссылки + формат-сплит (из Phase 2) · финальный EN-copy.

**Дальше:** MVP-набор страниц закрыт → Phase 4 (реальный copy + ассеты + правило доплаты + финал бренда —
owner/TM), затем Phase 5 (a11y/CWV/тех-SEO, снять `/design`, запуск). Сайт остаётся **noindex** до Phase 5.
Полная заметка — `docs/reports/2026-06-22-showcase-and-about-build-findings.md`.

---

## Конвенция STATUS (из кита — copy into every new project)

Every repo gets a top-level `STATUS.md` declaring exactly one state, so duplicate
and dead variants stop accumulating unrecognised:

```md
# STATUS — <project>
**State:** LIVE | ARCHIVE | SUPERSEDED | EXPERIMENT
**Superseded-by:** <path or repo>   # if SUPERSEDED
**Reason:** <one line>
**Last real work:** <YYYY-MM-DD>
```

- **LIVE** — actively maintained; the canonical copy.
- **ARCHIVE** — kept for reference, not maintained. Move it under `ARCHIVE/` or
  mark it clearly; do not bootstrap an operating layer onto it.
- **SUPERSEDED** — replaced; point at the replacement.
- **EXPERIMENT** — throwaway; never promoted without a fresh STATUS.

### Rule

Before creating a "v2"/"clean"/"rescue"/"final" copy of a repo, set the old one's
`STATUS.md` to SUPERSEDED/ARCHIVE **first**. A new agent session must be able to
tell the live copy from the dead one in one read — not guess from mtimes.

### ARCHIVE/

Dead variants live under `ARCHIVE/<name>/` (or are deleted). Keeping them at the
top level next to live code is how the portfolio accumulated archival noise.
</content>
