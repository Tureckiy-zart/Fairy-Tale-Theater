# Build report — EXTEND_MISS_LANA_PRIMITIVES_001

**Дата:** 2026-06-22 · **Версия канона TUNG:** v2-full · **Тип:** ui-implementation
**Статус:** ✅ закрыта · **Коммит:** `cc05d42` (`86fd990..cc05d42`, ветка `main`)
**Verify:** `pnpm run ci:exact` зелёный · `pnpm test:e2e` 19/19 · secret-scan OK
**Канон:** `docs/core/DESIGN_SYSTEM.md` (§3–§14), `docs/core/SITE_STRUCTURE_AND_BLOCKS.md` (§3, §6), `docs/core/04_SEO.md`

---

## 1. Запрос и цель

Пользовательский запрос (дословно по смыслу): «Card не имеет кнопки — добавь её как
опциональную; создай все необходимые примитивы, чтобы дальше юзать спокойно, учитывая
специфику проекта; бредкрампс и всё, что нужно для SEO».

**Цель:** довести библиотеку `components/ui/` до набора, которым **без добора примитивов**
собираются блоки Phase 1–3 (`SITE_STRUCTURE_AND_BLOCKS.md` §3) и закрываются SEO-требования
(`04_SEO.md` §"Технические основы": уникальные `title`/`description`/OG, `BreadcrumbList`,
`PerformingGroup`/`LocalBusiness`, `TheaterEvent`, `FAQPage`).

**Scope определён каноном, а не на глаз:** список глобальных блоков §3 показывает, какие
низкоуровневые примитивы недостают; целые блоки (LeadForm, Footer, TrustStrip…) — это уже
Phase 1, вне этой задачи.

---

## 2. Что сделано — по примитивам

### 2.1 Card — расширен (запрос №1) · `components/ui/Card.tsx`
- **Опциональная Button-CTA** (`cta: { label, href, variant? }`) — рендерит реальный `Button`
  вместо текст-ссылки. Это и был запрос «добавь кнопку».
- **Service-line `accent`** (`forest|coral|sage|berry`, §12) — верхний цветной бордер + тинт тега.
- **`tag`** — лейбл-чип над тайтлом (через примитив `Tag`).
- Обратная совместимость: show-card текст-ссылка «See this show →» сохранена (когда задан
  `href` без `cta`). Медиа 3:2 / `radius-lg` / `object-cover`, заголовок Fraunces `forest-800`,
  мета с Phosphor-иконками, hover-lift, equal-height — как в §11/§9/§10.

### 2.2 Breadcrumb (+ BreadcrumbList JSON-LD) · `components/ui/Breadcrumb.tsx`
- Запрос «бредкрампс». `nav>ol`, последний пункт — текущая страница (`aria-current`, не ссылка),
  Phosphor-разделитель. Встроенный `BreadcrumbList` JSON-LD (отключается `noSchema`).
- Источник данных — `Crumb[]` и `breadcrumbSchema()` из `lib/seo` (единый источник, без дублей).
- Client Component (рендерит Phosphor-иконку — context); SSR-разметка + JSON-LD на первом рендере.

### 2.3 SEO-слой (запрос «всё, что нужно для SEO»)
- **`components/ui/JsonLd.tsx`** — `<script type="application/ld+json">` **без**
  `dangerouslySetInnerHTML` (governance запрещает): JSON сериализуется и `<` экранируется в
  `<` (XSS-safe, lint-clean).
- **`lib/seo.ts`:**
  - `buildMetadata({ title, description, path, image?, noindex? })` → Next `Metadata`
    (canonical, Open Graph, Twitter, robots) — уникальные мета на страницу.
  - `organizationSchema()` — `PerformingGroup` + `LocalBusiness`, `areaServed` = LA / San Diego /
    Sacramento / San Jose, телефоны из `SITE_STRUCTURE` §2 (service-area, без публичного адреса).
  - `theaterEventSchema()` — `TheaterEvent` для страницы шоу.
  - `breadcrumbSchema()` — `BreadcrumbList` (используется `Breadcrumb`).
  - `faqSchema()` — `FAQPage` (пара к `Accordion`).
  - `SITE` (бренд/зоны/телефоны) + `absoluteUrl()` (из `lib/env.baseUrl`).

### 2.4 Контент-примитивы
- **`Tag.tsx`** — pill-лейбл, 3 тона (`neutral` / `accent` текст / `solid` заливка), тинт по §12.
  Белый текст — только на заливке линии, никогда на золоте (§3.2).
- **`Accordion.tsx`** — FAQ-раскрытие (§11). Каждая строка — `<button>` c `aria-expanded` +
  `aria`-controlled `region`. **Без layout-анимации** (§10.4): панель показывается/скрывается
  мгновенно, анимируется только шеврон (transform, motion-safe). Пара к `faqSchema()`.

### 2.5 Layout-примитивы
- **`Container.tsx`** — центрированный `max-w-7xl` (1280px) + гаттер `px-4 md:px-6` (§5.1);
  `prose` для читаемой меры; полиморфный `as`.
- **`Section.tsx`** — full-width бэнд, `py-clamp(4rem,8vw,8rem)` (§5.1), опц. `tone="surface"`
  (чередование §3), оборачивает контент в `Container` (если не `bleed`).
- **`SectionHeader.tsx`** — eyebrow (янтарный `glow-700` — единственный янтарный-текст токен §3.2,
  или линия-accent) + заголовок (`as` h1/h2/h3, Fraunces clamp §4.2) + подзаголовок + опц.
  lantern-marker (§2 сигнатура).

### 2.6 Общее
- **`accent.ts`** — карты §12 (`ACCENT_TEXT`/`ACCENT_FILL`/`ACCENT_BORDER_TOP` + тип `Accent`),
  один источник тинтов для Card/Tag/SectionHeader. Все гексы — токены из `globals.css` (§12 table).

---

## 3. Файлы

**Созданы (10):** `components/ui/{accent.ts, Tag.tsx, Container.tsx, Section.tsx, SectionHeader.tsx,
Accordion.tsx, JsonLd.tsx, Breadcrumb.tsx}`, `lib/seo.ts`, *(этот отчёт)*.

**Изменены (6):** `components/ui/Card.tsx` (cta/accent/tag), `components/ui/index.ts` (барелл),
`components/ui/README.md` (usage + server/client заметка), `app/design/_components/components-section.tsx`
(демо новых примитивов в галерее), `tests/e2e/design.spec.ts` (+2 теста), `STATUS.md` +
`docs/PROJECT_PROGRESS.md` (закрытие).

**`/design`** остаётся внутренней noindex-галереей; добавлены секции: service-line cards
(Button-CTA + accent + tag), Tag, Accordion (FAQ), Breadcrumb, SectionHeader.

---

## 4. Соответствие канону (чек)

| Требование | Источник | Статус |
| --- | --- | --- |
| Card: опциональная кнопка | запрос | ✅ `cta` → `Button` |
| Breadcrumbs + schema | §3 / 04_SEO | ✅ `Breadcrumb` + `BreadcrumbList` |
| SEO: уникальные meta/OG/canonical | 04_SEO | ✅ `buildMetadata` |
| Schema PerformingGroup/LocalBusiness, TheaterEvent, FAQPage | 04_SEO §Schema | ✅ `lib/seo` фабрики |
| Все значения — токены (без ad-hoc/дублей) | §14 | ✅ `accent.ts` + `globals.css` |
| Одна икон-библиотека (Phosphor) | §6 | ✅ только `phosphor-react` |
| A11y: focus-visible, aria, тач ≥44px, цвет не единственный сигнал | §13 | ✅ |
| Motion-safe-first, без layout-анимации | §10.4 | ✅ Accordion/Card/иконки |
| WCAG-контраст (белый не на золоте, янтарный текст = glow-700) | §3.2/§3.3 | ✅ `Tag`/`SectionHeader` |

---

## 5. Находки (severity)

- **NOTE — параллельная сессия в одном дереве.** Phase 1 (`components/shell/`, `components/blocks/`,
  `brand/`, `motion/`, `lib/site.ts`, реальная `app/page.tsx` Home) строилась **одновременно**
  другой сессией. Был рассинхрон расположения примитивов (она ждала `SectionHeader`/`Breadcrumb`
  в `shell/`, тип акцента в `lib/site`). **Разрешение (по решению владельца):** единый источник —
  `components/ui/`; все потребители импортируют из `@/components/ui`, `lib/site` использует мой
  тип `Accent` из `@/components/ui/accent`. *Рекомендация на будущее:* параллельные сессии —
  в изолированных git-worktree (CLAUDE.md §7: одна задача = одна сессия).
- **LOW (исправлено) — Breadcrumb падал в server-рендере.** Рендерил Phosphor-иконку в
  server-компоненте → `createContext only works in Client Components` (ронял e2e). Добавлен
  `"use client"`; разметка + JSON-LD по-прежнему SSR-рендерятся.
- **LOW (исправлено) — ложное срабатывание governance.** `scripts/governance.mjs` ловит подстроку
  `dangerouslySetInnerHTML`; она была в комментарии `JsonLd.tsx` («не используем»). Комментарий
  перефразирован; реальный `dangerouslySetInnerHTML` не используется (JSON-LD через экранирование).
- **NOTE (scope коммита).** Коммит `cc05d42` содержит **только** примитивы (`components/ui/*`,
  `lib/seo.ts`, `/design`-галерея, `design.spec.ts`, closure-доки) — 16 файлов. Phase-1 файлы
  параллельной сессии в коммит **не** включены (стейдж явными путями, не `-A`) — их фиксирует
  её сессия. `.env` не в индексе; secret-scan чист.
- **NOTE (gated).** Финальные лого/вордмарк/персонаж/иллюстрации — за trademark-clearance;
  примитивы работают на плейсхолдерах (text-вордмарк, Phosphor-glyph, «Photo — pending»).

---

## 6. Verify

| Шаг | Результат |
| --- | --- |
| `pnpm lint` | 0 errors |
| `pnpm typecheck` | 0 ошибок |
| `pnpm governance` | 0 issues (после фикса ложного срабатывания) |
| `pnpm build` | ✓ (`/`, `/_not-found`, `/design`) |
| `pnpm test:e2e` | **19/19** (8 design + smoke + 10 site от параллельной сессии — на интегрированном дереве) |
| `security/secret-scan.sh` | OK |

---

## 7. Что дальше

- **Phase 1** (Home + shell + Booking + Pricing) — собирается параллельной сессией на этих
  примитивах (`app/page.tsx` уже использует `buildMetadata` + блоки).
- **Phase 2** (`/shows` hub + `/shows/{slug}` ×8, `/school-shows`, `/birthdays`) — страницы шоу
  подключают `theaterEventSchema` + `Breadcrumb`, линии — `Card` с `accent`/`cta`.
- **SEO-разметка** на страницах: `organizationSchema` (глобально), `breadcrumbSchema`/`faqSchema`
  по месту — через `<JsonLd data={…} />`; `buildMetadata` в каждом `export const metadata`.
- **`/design`** env-guard'ить/удалить перед продом.
- **Gated:** замена плейсхолдеров на финальные ассеты — после trademark-clearance.

*Связанные документы: `docs/core/DESIGN_SYSTEM.md` (визуальный канон), `docs/core/SITE_STRUCTURE_AND_BLOCKS.md`
(блоки/страницы), `docs/core/04_SEO.md` (SEO), `components/ui/README.md` (usage/props), `STATUS.md`
(snapshot), `docs/PROJECT_PROGRESS.md` (хронология).*
