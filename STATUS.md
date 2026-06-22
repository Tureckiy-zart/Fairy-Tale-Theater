# STATUS — Miss Lana's Fairy-Tale Theater (редизайн сайта)

**State:** LIVE · **Phase:** discovery завершён → канон документации собран; сборка сайта стартовала (внутренний дизайн-превью `/design`).
**Last real work:** 2026-06-22 · **Brand:** Miss Lana's Fairy-Tale Theater (см. `docs/core/BRAND.md`).

> Этот репозиторий — **factory-starter-kit, переиспользованный под проект Magic Castle / Miss Lana**.
> Это файл прогресса/состояния **проекта** (как требует `CLAUDE.md` §7: «Прогресс/состояние
> репозитория фиксируется в `STATUS.md`»). Конвенция STATUS/ARCHIVE кита — ниже, она в силе.

## Где проект сейчас

- ✅ **Discovery / бриф** — собран; источник истины по фактам: `docs/core/PROJECT_BRIEF.md`.
- ✅ **Ребрендинг** — имя/домен закреплены: **Miss Lana's Fairy-Tale Theater**, зонтик **Miss
  Lana**, домен `misslanatheater.com` (свободен). Старый `magic-castle-puppet-theater.com` → 301.
  Канон бренда — `docs/core/BRAND.md` (LOCK).
- ✅ **Кор-документация** — `docs/core/` (BRAND + 00–05 + PROJECT_BRIEF); индекс — корневой `README.md`.
- ✅ **Ресёрч** — карта конкурентов (`docs/reports/2026-06-21-la-kids-puppet-theater-competitor-research.md`,
  архивная рамка) + Google Maps Platform scoping (`docs/reports/2026-06-21-google-maps-platform-scoping.md`).
- 🟡 **Сборка сайта** — идёт в `baselines/js-next/` (единственное Next.js-приложение репо).
  Готова **токен-основа** (Tailwind v4 `@theme`, `next/font` Fraunces+Nunito, `@phosphor-icons/react` — единый
  источник) и **продакшн-библиотека примитивов** `components/ui/` (`Button`/`Field`/`Card`/`Nav` —
  типизированные, WCAG-AA, motion-safe, token-driven; usage-док `components/ui/README.md`). Внутренний
  **noindex**-маршрут `/design` = живая галерея: рендерит реальные примитивы (+ 9 секций DS v1.0).
  Гейт `ci:exact` + e2e зелёные (6/6). Превью-находки — `docs/reports/2026-06-22-design-preview-build-findings.md`;
  закрытие/находки примитивов — ниже (раздел «Закрытие IMPLEMENT_MISS_LANA_DESIGN_TOKENS_001»).
  Перед продом `/design` env-guard'ить. Дальше: **реальные страницы** (home + 4 линии-секции) из этих
  примитивов, когда готовы copy/IA; за trademark-гейтом — финальные лого/вордмарк/персонаж/иллюстрации.

## Открытые вопросы (блокируют часть сборки)

trademark-clearance (до лого/печати) · доплата за расстояние (суммы/правило — за владельцем) ·
ссылки на соцсети · статус оплаты старого домена · стратегия по гос. школам · подача 2 названий
шоу (Morozko, «Well Red Bow wait») · редизайн лого 2026 · фото/видео-активы. Полный список — в
`docs/core/PROJECT_BRIEF.md` и корневом `README.md`.

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
- **NOTE (исправлено в `CLEANUP_MISS_LANA_POST_PHASE1_001`)** — `phosphor-react@1.4.1` (устаревший) заменён
  на поддерживаемый преемник `@phosphor-icons/react@2.1.10` (тот же набор Phosphor, React 19); по-прежнему
  одна библиотека. Duotone-нить (`path[opacity]` → `glow-400`) рендерится без изменений селектора.
- **NOTE (gated)** — финальные лого/вордмарк/персонаж/продакшн-иллюстрации — за trademark-clearance;
  примитивы работают на плейсхолдерах (text-вордмарк + Phosphor-glyph), финальных ассетов не вшивал.

**Дальше:** реальные страницы (home + 4 линии-секции) из этих примитивов, когда готовы copy/IA;
отдельной задачей за TM-гейтом — финальные ассеты вместо плейсхолдеров. `/design` env-guard'ить перед продом.

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
(1) **Иконки** — `phosphor-react@1.4.1` → `@phosphor-icons/react@2.1.10` (поддерживаемый преемник,
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
  всё ещё упоминают `phosphor-react`/старый путь как **исторические** артефакты — не канон-зависимости,
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
