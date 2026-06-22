# Miss Lana's Fairy-Tale Theater — website

Сайт выездного детского **живого костюмированного театра сказок** (Лос-Анджелес,
30+ лет опыта), зонтик-бренд **Miss Lana**, домен `misslanatheater.com`. Цель сайта —
заявки + витрина + локальное SEO. Это **индекс проекта**: ориентирует и связывает;
при конфликте побеждает более строгий канон (`docs/core/`, `CLAUDE.md`).

> Идентичность — профессиональный **живой театр сказок** (НЕ «кукольный»). Команда
> украинская — тихий бэкстори, **ноль** славянского/русского визуального кодирования.
> Бренд не ассоциируем с Россией. Канон бренда — [docs/core/BRAND.md](docs/core/BRAND.md) (LOCK).

## Где что лежит

| Путь | Что это |
| --- | --- |
| [PROJECT_BRIEF.md](PROJECT_BRIEF.md) | Указатель на канонический бриф (факты — в `docs/core/`). |
| [STATUS.md](STATUS.md) | Текущее состояние проекта (snapshot, конвенция STATUS/ARCHIVE). |
| [CLAUDE.md](CLAUDE.md) | Операционный слой для агентов: стек, команды, границы, закрытие задач. |
| [CLIENT_QUESTIONS.md](CLIENT_QUESTIONS.md) | Готовый список вопросов владельцу (RU). |
| [docs/core/](docs/core/) | **Канон проекта**: BRAND · 00–05 (instructions/content/positioning/sitemap/SEO/build) · DESIGN_SYSTEM · SITE_STRUCTURE · PROJECT_BRIEF. |
| [docs/reports/](docs/reports/) | **Все отчёты** — ресёрч (конкуренты LA, Google Maps, дизайн-система) и build-репорты/findings по задачам. |
| [docs/PROJECT_PROGRESS.md](docs/PROJECT_PROGRESS.md) | Append-only хронология изменений. |
| [docs/discovery/](docs/discovery/) | Метод Phase −1 (анкеты/плейбуки). |
| [docs/assets/](docs/assets/) | Референс-материалы владельца. |
| `app/` · `components/ui/` · `lib/` | Код: маршруты App Router · UI-примитивы · доступ к env. |
| `security/` | `.env.example`, secret-scan, pre-commit hook, SECURITY.md. |

## Стек

Next 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind 4 (`@theme`) ·
ESLint 9 · Playwright · **pnpm** (один пакетный менеджер — не смешивать lockfiles).

## Команды

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint
pnpm typecheck    # tsc --noEmit
pnpm governance   # scripts/governance.mjs — инвариант-гейт
pnpm run ci:exact # VERIFY-ГЕЙТ: lint → typecheck → governance → build
pnpm test:e2e     # Playwright (один раз: npx playwright install)
```

`pnpm run ci:exact` — гейт слияния, проверен зелёным.

## Дизайн-система

Источник истины по визуалу — [docs/core/DESIGN_SYSTEM.md](docs/core/DESIGN_SYSTEM.md)
(DS v1.0, **«Lantern Light»**: лесные зелёные + золотое свечение на кремовом). Токены
зашиты в [app/globals.css](app/globals.css) (Tailwind v4 `@theme`), шрифты Fraunces +
Nunito через `next/font`, иконки Phosphor. Продакшн-примитивы — в
[components/ui/](components/ui/) (`Button` / `Field` / `Card` / `Nav`,
[usage-док](components/ui/README.md)).

### `/design` — внутренняя галерея (noindex)

`pnpm dev` → `http://localhost:3000/design` — живая галерея дизайн-системы и примитивов.
Только внутренняя (`robots: noindex, nofollow`), **не реальная страница**.
**Env-guard'ить или удалить перед продакшеном.**

## Состояние и что дальше

- ✅ Discovery, канон (`docs/core/`), ребрендинг, ресёрч.
- ✅ Токен-основа + библиотека примитивов + `/design`-галерея (`ci:exact` + e2e зелёные).
- ⏭ **Дальше:** реальные страницы (home + 4 линии услуг) из этих примитивов, когда готовы
  copy/IA. Детали и открытые вопросы — в [STATUS.md](STATUS.md) и [docs/core/PROJECT_BRIEF.md](docs/core/PROJECT_BRIEF.md).
- 🔒 **За trademark-гейтом:** финальные лого/вордмарк/персонаж/иллюстрации — пока плейсхолдеры.

## Секреты / env

`cp .env.example .env`, вписать реальные значения. Читать env **только** через
[lib/env.ts](lib/env.ts) (ленивый типобезопасный ридер; governance запрещает прямой
`process.env` в другом месте). `.env` git-ignored — в репозиторий едет лишь `.env.example`.
Подробности — [security/SECURITY.md](security/SECURITY.md).
