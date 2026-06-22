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
  Готова **токен-основа** (Tailwind v4 `@theme`, `next/font` Fraunces+Nunito, `phosphor-react` — единый
  источник) и **продакшн-библиотека примитивов** `components/ui/` (`Button`/`Field`/`Card`/`Nav` —
  типизированные, WCAG-AA, motion-safe, token-driven; usage-док `components/ui/README.md`). Внутренний
  **noindex**-маршрут `/design` = живая галерея: рендерит реальные примитивы (+ 9 секций DS v1.0).
  Гейт `ci:exact` + e2e зелёные (6/6). Превью-находки — `docs/2026-06-22-design-preview-build-findings.md`;
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
- **NOTE** — `phosphor-react@1.4.1` — устаревший пакет (преемник `@phosphor-icons/react`); зафиксирован
  каноном `DESIGN_SYSTEM.md` §6 и стоит в `package.json` от превью — оставил как есть (не менял зависимость).
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
`docs/2026-06-22-home-and-shell-build-findings.md`.

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
