# 05 — CLAUDE.md для проекта сборки (готовый)

> **Как использовать:** в новом проекте Claude Code сохрани содержимое ниже (от
> разделителя) как **`CLAUDE.md`** в корне. Стек — JS-baseline (Next.js).

<!--
v3 (2026-06-25). Canon sync: сайт английский-первый (двуязычие RU
снято), идентичность «театрализованное шоу — живой + кукольный (смешанный)», команда украинская (без
русского/славянского кодирования), 30+ лет (не «25»), locked Theatre spelling, live
primary domain, and current contact workflow.
-->

---

# CLAUDE.md — выездной детский театр (сайт)

## 1. Что это за файл
Операционный помощник для сборки сайта, не канон. При конфликте побеждает кор-документация
в `docs/core/` и `PROJECT_BRIEF.md`.

## 2. Язык
Общение и контент-документы — **русский** (оператор). **Сайт — английский (первичный).**
Опциональный украинский слой — позже, по решению владельца. *(Прежняя установка «двуязычие
RU+EN, RU-ядро» — снята.)* Код и идентификаторы — английский.

## 3. Читать до работы
- `README.md` (корень) — обзор и индекс проекта.
- `docs/core/BRAND.md` — бренд/нейминг (LOCK): имя, домен, архитектура суб-брендов.
- `docs/core/01_CONTENT_INVENTORY.md` — формат (театрализованное шоу + интерактив), 7 шоу
  (универсальная подача), команда, контакты.
- `docs/core/02_POSITIONING_AND_TONE.md` — позиционирование, голос, визуал, анти-примеры.
- `docs/core/03_SITEMAP_AND_SCOPE.md` — структура и функции.
- `docs/core/04_SEO.md` — локальное SEO (англ. интент), домен/имя, GBP.
- `PROJECT_BRIEF.md` — источник истины по фактам.

## 4. Стек / реальность (одной строкой)
Сайт на **Next.js (App Router) + React + TypeScript + Tailwind CSS + pnpm**. Маркетинговый
сайт с онлайн-заявкой; **не** SPA без URL — у каждого шоу/услуги свой индексируемый маршрут
(SEO). **Английский-первый** (опциональный UA-слой — позже).

## 5. Команды
```bash
pnpm install          # установка
pnpm dev              # локальная разработка
pnpm build            # прод-сборка
pnpm typecheck        # tsc --noEmit
pnpm lint             # eslint
pnpm test:e2e         # playwright (smoke)
pnpm run ci:exact     # ГЕЙТ: lint + typecheck + governance + build
```
**Verify-гейт:** правка готова только после `pnpm run ci:exact` = зелёно (+ `pnpm test:e2e`,
если трогал поведение страниц).

## 6. Negative scope fences (границы)
- **Контент — из `docs/core/`, не выдумывать.** Названия шоу, цены, телефоны, факты берём
  из инвентаризации/брифа; новое — помечать как гипотезу.
- **Идентичность: театрализованное шоу — живой костюмированный И кукольный детский театр сказок (смешанный репертуар).**
  Живое костюмированное — ведущий формат, кукольное — равноправная часть. Формат: спектакль (~30 мин) + интерактив (напр. пузыри).
- **Команда украинская — НЕ ассоциировать с Россией.** Никакого русского/славянского
  кодирования (имя, тексты, SEO, визуал). Репертуар — общие/классические сказки с ценностями.
- **Опыт: «30+ лет» (в осн. Украина), НЕ «25 лет в LA».**
- **Тон/визуал:** добрый, тёплый, ярко-но-не-агрессивно; тёплые тона. **Анти-пример (запрет):**
  американский стиль «больших открытых ртов», кричащий; и холодный шаблонный вид.
- **Имя/домен (закреплены, см. `BRAND.md`).** Бренд — **Miss Lana's Fairy-Tale Theatre** (зонтик
  **Miss Lana**); primary production domain **`misslanatheatre.com`** уже live;
  `misslanatheater.com` — protective alternate only → 301 на primary; старый
  `magic-castle-puppet-theater.com` → 301 на релевантные новые URL.
  **ОДИН сайт**, суб-бренды (Birthday Parties / School Shows / & Friends) — секции, не отдельные сайты.
  До **trademark-clearance** у юриста — не делать финальный лого/печать.
- **Контакты/форма:** primary email `info@misslanatheatre.com`, primary phone **(323) 903-2039**,
  второй телефон reserve-only. Клиенты могут писать SMS/email/WhatsApp; Svitlana сейчас отвечает
  сама в течение **1-2 business days**. Success state:
  “Thank you! We've received your request. Miss Lana will reply by text, email, or WhatsApp within 1-2 business days.”
  On-screen confirmation is required; do not email the full submitted-form copy by default. A short
  confirmation email may be added later if operationally useful.
- **Verified reviews/testimonials:** launch-required `[OWNER/CONTENT]` trust layer; publish only real
  verified reviews with permission/source. Target at least 5 before launch; do not invent content.
- **Icons:** current React package is `@phosphor-icons/react`; do not prescribe deprecated `phosphor-react`
  for new implementation.
- **Цены — не публиковать догадки** про доплату за расстояние, пока владелец не дал значения.
  До этого — «от $350».
- Build-выходы не коммитить: `.next/`, `node_modules/`, `dist/`, `.tsbuildinfo`, реальный `.env`
  (едет только `*.env.example`).
- Не чинить пред-существующие проблемы вне задачи — фиксировать находкой.

## 7. Закрытие задачи
- **Одна задача = одна сессия.** Исполнить → verify-гейт (слот 5) → ревью → «коммит» →
  следующая сессия. «Реализация готова» ≠ «задача закрыта».
- Серьёзность находок: **BLOCKER / HIGH / MEDIUM / LOW / NOTE**.
- Открытые вопросы и решения фиксировать в `docs/core/` (не дублировать, ссылаться).
