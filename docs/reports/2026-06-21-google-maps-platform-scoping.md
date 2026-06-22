# Google Maps Platform — техническое скоупинг-исследование для сайта Magic Castle

- **Задача:** `HERMES_GOOGLE_MAPS_PLATFORM_RESEARCH_001` (audit / technical-research — отчёт, без реализации)
- **Проект:** Magic Castle — выездной детский кукольный театр, Лос-Анджелес (service-area business: база LA + Сан-Диего, Сакраменто, Сан-Хосе). Стек редизайна: Next.js (App Router) + React 19 + TypeScript + Tailwind 4 + pnpm.
- **Дата исполнения / верификации цен:** 2026-06-21
- **Метод:** мульти-агентный ресёрч (6 «искателей» + adversarial-верификация 21 высокорискового утверждения против официальных страниц Google).
- **Легенда достоверности:** **[HIGH]** — подтверждено с официальной страницы Google (часто двумя независимыми источниками); **[MEDIUM]** — официальная позиция/практика, но не переподтверждена дословно в этой сессии либо это инженерная рекомендация; **[LOW]** — не удалось подтвердить из официального источника, требует проверки.

> ⚠️ **Главное, что нужно усвоить:** модель цен Google Maps Platform поменялась с **1 марта 2025**. Старый «плоский кредит $200/мес» **больше не действует** — теперь у каждого SKU свой **бесплатный месячный лимит** (Essentials 10 000 / Pro 5 000 / Enterprise 1 000 вызовов на SKU в месяц). Для небольшого локального бизнеса это почти всегда означает **$0/мес** при корректной архитектуре. **[HIGH]**

---

## 1. Executive summary (резюме для решения)

**Что включать.** Для сайта Magic Castle достаточно небольшого набора API из новой линейки Google Maps Platform:

| Нужда сайта | Рекомендуемый API | Почему |
|---|---|---|
| Карта «зоны выезда» (LA / Сан-Диего / Сакраменто / Сан-Хосе) | **Maps Embed API** (iframe) — если карта простая; **Maps JavaScript API (Dynamic Maps)** — только если нужны кастомные полигоны зон | Embed **бесплатен и без лимита**, не грузит JS → лучший LCP/INP |
| Автодополнение адреса в форме брони | **Places API (New) — Autocomplete** через web-компонент **`PlaceAutocompleteElement`** | Текущий рекомендуемый виджет; старый `Autocomplete` закрыт для новых клиентов с 2025-03-01 |
| Геокодинг адреса (адрес → координаты для калькулятора доплаты) | **Geocoding API** (server-side) | GA, Essentials, дешёвый; часто координаты уже приходят из Place Details |
| Доплата за расстояние от базы LA | **Routes API — `computeRoutes`** (server-side) | Преемник Directions + Distance Matrix; обе legacy с 2025-03-01 |
| Картинка карты в письме/карточке (опц.) | **Maps Static API** | Один `<img>`, без JS |
| USPS-валидация адреса (опц., по желанию владельца) | **Address Validation API** | Дороже (Pro-tier); как правило избыточно — Autocomplete (New) уже даёт чистый структурированный адрес |

**Сколько это стоит.** При реальном трафике локального театра (десятки–сотни заявок в месяц) использование почти наверняка **уложится в бесплатные месячные лимиты каждого SKU** → ожидаемая стоимость **$0–около $0 в месяц**. **[HIGH по модели бесплатных лимитов; MEDIUM по выводу «$0», т.к. зависит от фактического трафика]** Главный риск перерасхода — случайно «уехать» в платные Pro-tier SKU (Address Validation, расширенные поля Place Details, traffic-aware-маршруты).

**Как интегрировать в Next.js.** Карта/автокомплит — только клиентские (`"use client"`) компоненты, лениво подгружаемые; геокодинг/маршруты — только на сервере (route handler / server action) с серверным ключом, который **никогда** не попадает в браузер. Лучшая поддерживаемая React-обёртка — **`@vis.gl/react-google-maps`** (разработана вместе с командой Google Maps, React 19-ready), но при этом формально open-source, не «официально поддерживаемая» как Core Service. **[HIGH]**

**Безопасность ключей.** Минимум **4 ключа** (browser-prod, browser-dev, server-prod, server-dev), каждый с ограничениями: браузерные — по **HTTP-referrer** на домен, серверные — по **IP** (где возможно) + всегда **API-restriction** на конкретные API + **квотные лимиты** как реальный «тормоз» расходов. Бюджет-алерты только уведомляют, они **не** останавливают траты.

**Доплата за расстояние — выполнима технически.** Один серверный вызов `computeRoutes` (origin = база LA, destination = адрес события) возвращает `distanceMeters` и `duration`. **Сумма доплаты в долларах — решение владельца** и в этом отчёте не назначается; правило «мили/минуты → доллары» хранить в конфиге/БД, чтобы владелец мог его править.

**Google Business Profile — это НЕ Maps Platform API.** GBP — бесплатный локальный листинг (поиск/карты), критичен для локального SEO, но это **отдельный** актив и **вне рамок** этой задачи.

---

## 2. Scope исследования и исключения

**В рамках:** подбор API под нужды сайта (карта зон, геокодинг/валидация, автокомплит адреса, дистанция/время в пути, статичные карты); статус каждого API (GA / legacy / deprecated + преемник); рекомендуемый путь интеграции в Next.js App Router (server vs client, ленивая загрузка, библиотеки); текущая модель цен и бесплатных лимитов (проверенная по официальным страницам); чек-лист безопасности ключей и защиты от перерасхода; оценка осуществимости доплаты за расстояние; cookie/consent-импликации для Калифорнии; разъяснение различия GBP и Maps Platform.

**Вне рамок (по ТЗ):** настройка/заявка Google Business Profile (отдельная SEO-задача); выбор конкретных сумм доплаты за расстояние (решение владельца); реализация карты/формы/калькулятора (отдельная каноническая TUNG v2-задача); прочие Google-продукты (Ads, Analytics, Search Console) кроме точечного упоминания; конкурентный/рыночный ресёрч.

---

## 3. Метод и стратегия источников

- **Первичные источники (приоритет):** `developers.google.com/maps/*`, `mapsplatform.google.com/pricing/`, `cloud.google.com` / `docs.cloud.google.com` (биллинг, квоты, ключи). Вторичные источники — только для корроборации и обнаружения изменений.
- **Процесс:** 6 параллельных агентов-«искателей» (pricing, каталог API, distance, Next.js, security/billing, cookie/GBP); затем для трёх самых рисковых направлений (цены, статусы API, distance) — **adversarial-верификация**: отдельные агенты пытались **опровергнуть** каждое ценовое/статусное утверждение по официальной странице. Всего проверено **21 высокорисковое утверждение**.
- **Маркировка:** каждая цена, бесплатный лимит, квота и статус API помечены HIGH/MEDIUM/LOW; «подтверждено из официального источника сегодня» отделено от фоновых знаний.
- **Что верификация поймала:** 3 ценовых утверждения были **опровергнуты** — но только в части привязки ставки к диапазону объёма (см. §6). Сами ставки **первой платной ступени** (10 001–100 000) подтверждены; ошибка была в названии диапазона у более высоких объёмов. Это для проекта несущественно (он внутри бесплатного лимита), но в таблице цен ниже всё приведено к корректным диапазонам.

---

## 4. Рекомендуемый набор API (таблица)

Все API ниже — из текущей (новой) линейки Maps Platform; статусы и ставки проверены 2026-06-21.

| API | Назначение в проекте | Статус (2026) | Когда использовать | Драйвер стоимости (первая платная ступень, после бесплатного лимита) |
|---|---|---|---|---|
| **Maps Embed API** | Простая карта «зоны выезда» / «где мы» (iframe) | **GA**, Essentials | Когда хватает неинтерактивной встроенной карты | **Бесплатно, без лимита** (нет поштучной оплаты) **[HIGH]** |
| **Maps JavaScript API (Dynamic Maps)** | Интерактивная карта зон с **кастомными полигонами**/маркерами | **GA**, Essentials. (Класс `google.maps.Marker` deprecated 02.2024 → `AdvancedMarkerElement`; сам API не deprecated) | Только если нужны полигоны зон, инфо-окна, обработчики кликов | **$7.00 / 1 000** загрузок; **10 000/мес бесплатно** **[HIGH]** |
| **Places API (New) — Autocomplete** | Автодополнение адреса в форме брони | **GA**, Essentials. Legacy `Autocomplete`/`AutocompleteService` закрыты для новых клиентов с **2025-03-01** | Поле адреса в форме; через `PlaceAutocompleteElement` | Per-request **$2.83 / 1 000**, 10 000/мес бесплатно; **session-usage SKU — бесплатно** при использовании session-token **[HIGH]** |
| **Places API (New) — Place Details** | Структурированный адрес + координаты после выбора | **GA**, Essentials (есть Pro/Enterprise SKU при «жирных» полях) | Завершение сессии автокомплита; уже отдаёт lat/lng | Essentials **$5.00 / 1 000**, 10 000/мес бесплатно **[HIGH]** |
| **Geocoding API** | Адрес → координаты для расчёта дистанции | **GA**, Essentials, без активных deprecation | Server-side, когда нужен только lat/lng подтверждённого адреса | **$5.00 / 1 000**, 10 000/мес бесплатно **[HIGH]** |
| **Routes API — `computeRoutes`** | Расстояние и время в пути от базы LA до адреса | **GA**. Преемник Directions + Distance Matrix (обе **Legacy с 2025-03-01**) | Server-side калькулятор доплаты за расстояние | Essentials **$5.00 / 1 000**, 10 000/мес бесплатно; **Pro $10.00/1 000** (5 000/мес) если включить `TRAFFIC_AWARE` **[HIGH]** |
| **Maps Static API** | Картинка карты для письма/карточки/OG (опц.) | **GA**, Essentials, без deprecation | Контексты без JS (email, соц-карточки) | **$2.00 / 1 000**, 10 000/мес бесплатно **[HIGH]** |
| **Address Validation API** *(опционально)* | USPS-валидация/нормализация адреса | **GA** (Pro-tier) | Только если нужно отбраковывать недоставляемые адреса; вызывать **редко** (на финальном сабмите) | **Pro $17.00 / 1 000**, лишь **5 000/мес** бесплатно — дороже Essentials **[HIGH]** |

**Минимальный рекомендуемый набор для запуска:** Maps Embed API (карта зон) + Places API (New) Autocomplete/Place Details (адрес в форме) + Geocoding API + Routes API (доплата). Maps JavaScript API — только если дизайн требует рисованных полигонов зон. Address Validation и Maps Static — опциональны.

> Примечание про legacy: **Places API (legacy)**, **Directions API**, **Distance Matrix API** переведены в статус **Legacy 2025-03-01**, не включаются в новых Cloud-проектах, «заморожены» по фичам, но поддерживаются для существующих; **даты выключения нет**, Google обещает **минимум 12 месяцев предупреждения**. Для нового проекта Magic Castle их, скорее всего, **нельзя включить** — и это правильно, нужно строить на новых API. **[HIGH]**

---

## 5. Рекомендуемый подход интеграции в Next.js (App Router)

**Принцип границ server/client.** Maps JavaScript API и web-компоненты Places работают **только в браузере** → любой компонент с картой/автокомплитом должен быть **`"use client"`** и не рендерится при SSR. Держите их в **листовых** клиентских компонентах, чтобы остальная страница (герой, тексты, SEO-разметка) оставалась серверной и быстро стримилась. **[HIGH]**

**Производительность (Core Web Vitals — важно для локального ранжирования).**
- Карту грузить **лениво**: `next/dynamic` c `{ ssr: false }` + монтирование по `IntersectionObserver` (когда карта попадает в вьюпорт) или по клику-заглушке «Показать карту». Это убирает тяжёлый Maps-JS с критического пути → лучше **LCP** и **INP**. **[MEDIUM — инженерная практика]**
- Для карты «зоны выезда» в большинстве случаев **полноценный JS-SDK не нужен**: **Maps Embed API** (бесплатно, `<iframe loading="lazy">`, ноль JS) или **Static Maps** (одна картинка) дают лучшую производительность. JS-SDK — только под реальную интерактивность (рисованные полигоны 4 зон). **[HIGH]**

**Библиотека.** Рекомендуется **`@vis.gl/react-google-maps`** (на 2026-06: v1.8.x, активно поддерживается, React 19-ready, разработана совместно с командой Google Maps, передана в OpenJS Foundation). Важная оговорка: формально это open-source (MIT), Google заявляет, что она **«не поддерживается официально»** и не покрыта SLA/Deprecation Policy. **[HIGH]** Альтернатива низкого уровня — `@googlemaps/js-api-loader` (Google-owned, активна). `@react-google-maps/api` — поддерживается, но медленнее и с большим бэклогом; для greenfield не рекомендуется. **[HIGH]** `<APIProvider>` из vis.gl грузит API через Dynamic Library Import (`importLibrary`), т.е. подтягивает только нужные библиотеки (`maps`, `places`, `marker`) — легче монолитного скрипта. **[HIGH]**

**Загрузка скрипта.** Предпочтительно — через `<APIProvider>`. Если грузить «вручную» (например, чтобы смонтировать голый `PlaceAutocompleteElement`) — `@googlemaps/js-api-loader` или `next/script` со `strategy="lazyOnload"`/`afterInteractive` + современный inline-bootstrap (`loading=async`). **Избегать `beforeInteractive`** для Maps — блокирует гидрацию и бьёт по LCP. **[MEDIUM]**

**Автокомплит адреса в форме.** Использовать **`PlaceAutocompleteElement`** (Autocomplete New): это HTML web-component, который сам управляет **session-token** (бандлит запросы автокомплита + финальный Place Details в одну сессию = дешевле). Он эмитит событие **`gmp-select`**; по выбору вызвать `place.fetchFields(...)` и записать `formattedAddress` + `location` (lat/lng) в состояние формы (React Hook Form `setValue`/`useState`). Держать скрытый контролируемый `<input>` с каноническим адресом и `place_id`/координатами, чтобы валидация и сабмит шли обычным контролируемым пайплайном. React 19 чище работает с custom-elements, чем 18. **[HIGH]**

**Server-side (геокодинг + дистанция).** Geocoding API и Routes API — это HTTP-сервисы (JS-SDK не нужен). Вызывать из **route handler / server action** с **серверным ключом**; адрес из формы уходит на ваш бэкенд, бэкенд зовёт Google. Так ключ не светится в браузере и не тянет вес SDK. **Кешировать/дебаунсить** — считать доплату один раз по подтверждённому адресу, а не на каждый ввод. **[HIGH]**

---

## 6. Цены и модель бесплатных лимитов / квот (проверено)

### Модель бесплатного использования (per-SKU, НЕ общий кредит) **[HIGH]**
- **Дата изменения: 1 марта 2025.** Плоский кредит $200/мес **заменён** на бесплатный месячный порог **для каждого Core Services SKU**.
- Бесплатный объём зависит от ценовой категории SKU:
  - **Essentials → 10 000** бесплатных вызовов / SKU / мес
  - **Pro → 5 000** / SKU / мес
  - **Enterprise → 1 000** / SKU / мес
  - Исключение: **Map Tiles (2D / Street View) → 100 000** / мес (к проекту не относится)
- Лимиты **не суммируются между SKU** (10k на Geocoding отдельно от 10k на Static Maps и т.д.). Сброс — 1-го числа месяца (полночь по тихоокеанскому времени).
- **Автоматические скидки за объём** действуют без переговоров и масштабируются до 5 000 000+ событий/мес. **[HIGH]**
- Для использования API **нужен активный биллинг-аккаунт (карта)** даже в пределах бесплатных лимитов. **[MEDIUM]**
- Источники: [billing-and-pricing/overview](https://developers.google.com/maps/billing-and-pricing/overview), [billing-and-pricing/faq](https://developers.google.com/maps/billing-and-pricing/faq), [march-2025](https://developers.google.com/maps/billing-and-pricing/march-2025), [mapsplatform.google.com/pricing](https://mapsplatform.google.com/pricing/).

### Поштучные ставки нужных SKU (после бесплатного лимита) **[HIGH]**
Источник: [Core services pricing list](https://developers.google.com/maps/billing-and-pricing/pricing). Цена за **1 000** вызовов. Колонка «1-я платная ступень» = диапазон **10 001–100 000/мес** (именно в нём окажется проект, если выйдет за бесплатный лимит). Ставки **снижаются** с ростом объёма.

| SKU | Категория | Бесплатно/мес | 1-я платная ступень (10 001–100 000) | Дальше (примерно) |
|---|---|---|---|---|
| Maps JavaScript — Dynamic Maps | Essentials | 10 000 | **$7.00** | $5.60 → $4.20 → $2.10 → $0.53 (5M+) |
| Maps Embed API | Essentials | **∞ (бесплатно)** | **$0** | $0 |
| Maps Static API | Essentials | 10 000 | **$2.00** | $1.60 → $1.20 → $0.60 → $0.15 |
| Geocoding API | Essentials | 10 000 | **$5.00** | $4.00 → $3.00 → $1.50 → $0.38 |
| Places Autocomplete — Per Request | Essentials | 10 000 | **$2.83** | ↓ до ~$0.21 (5M+) |
| Places Autocomplete — Session Usage | Essentials | **∞ (бесплатно)** | **$0** | $0 |
| Place Details (Essentials) | Essentials | 10 000 | **$5.00** | ↓ до ~$0.38 |
| Place Details (Pro) | Pro | 5 000 | **$17.00** | ↓ до ~$1.28 |
| Address Validation (Pro) | Pro | 5 000 | **$17.00** | ↓ до ~$1.28 |
| Routes — Compute Routes / Route Matrix (Essentials) | Essentials | 10 000 | **$5.00** | $4.00 → $3.00 → $1.50 → $0.38 |
| Routes — Compute Routes / Route Matrix (Pro) | Pro | 5 000 | **$10.00** | $8.00 → $6.00 → $3.00 → $0.75 |

> **Поправка верификации (важно для точности):** независимая проверка опровергла формулировки вида «$X в диапазоне 100 001–500 000». Корректно: указанные ставки ($7.00 Dynamic Maps, $2.00 Static, $5.00 Geocoding, $5.00 Routes Essentials) относятся к **первой платной ступени (10 001–100 000)**; в диапазоне 100 001–500 000 они ниже ($5.60 / $1.60 / $4.00 / $4.00 соответственно). Сами ставки первой ступени подтверждены как HIGH. **[HIGH]**

### Сессионный биллинг автокомплита (важно для формы брони) **[HIGH]**
Источник: [session-pricing](https://developers.google.com/maps/documentation/places/web-service/session-pricing).
- **Сессия** = серия запросов автокомплита + завершающий вызов **Place Details (New)** или **Address Validation**, связанные **session-token**.
- Сессия, завершённая Place Details Essentials: первые **12** запросов автокомплита тарифицируются по SKU «Autocomplete Requests» ($2.83/1k, 10k бесплатно); с **13-го** — по бесплатному SKU «Session Usage».
- Сессия, завершённая Address Validation или Place Details Pro: **все** запросы автокомплита идут по бесплатному Session Usage — платите только за завершающий вызов.
- **Брошенная сессия** (нет завершающего вызова) → автокомплит тарифицируется поштучно ($2.83/1k). **Правило:** всегда слать session-token и завершать сессию вызовом Place Details/Address Validation.

### Вывод по стоимости для Magic Castle
Один локальный театр с десятками–сотнями заявок в месяц практически наверняка **остаётся в бесплатных лимитах каждого SKU** → **$0–около $0/мес**. **[HIGH по механике лимитов; MEDIUM по «$0», зависит от трафика]** Риски удорожания: (1) Address Validation (Pro, всего 5k бесплатно, $17/1k) — вызывать только на финальном сабмите; (2) «жирные» field-mask в Place Details → переход в Pro/Enterprise SKU — держать маску минимальной (адрес-компоненты + lat/lng); (3) traffic-aware-маршруты (`TRAFFIC_AWARE`) → Pro-tier — для доплаты за **расстояние** трафик не нужен, оставайтесь на Essentials.

> Дополнительно существуют опциональные **подписочные планы** (Starter/Essentials/Pro фиксированной ценой) как альтернатива pay-as-you-go. Конкретные суммы и дата (предположительно ~ноябрь 2025) **не подтверждены** из одной официальной страницы в этой сессии — для низкого объёма они не нужны; проверять в консоли при необходимости. **[LOW]**

---

## 7. Чек-лист безопасности ключей и защиты от перерасхода

**Топология ключей (решить первым).** Минимум **4 ключа**, не один общий. Google: «используйте отдельный ключ на каждый источник; если ключ скомпрометирован — удалите/проротируйте его, не трогая остальные». **[HIGH]** ([restricting-keys](https://cloud.google.com/blog/products/maps-platform/google-maps-platform-best-practices-restricting-api-keys), [api-security-best-practices](https://developers.google.com/maps/api-security-best-practices))

| Ключ | Где работает | Тип ограничения | API-restriction (только что используется) |
|---|---|---|---|
| **Browser — PROD** | клиентский бандл (`NEXT_PUBLIC_…`) | **HTTP referrer** = прод-домен(ы) | Maps JavaScript API (+ Places Library, если автокомплит в браузере) + Static/Embed при использовании |
| **Browser — DEV** | dev/preview-бандл | **HTTP referrer** = `http://localhost:*`, preview-домен | те же API, что у prod-браузерного |
| **Server — PROD** | только route handlers / server actions | **IP address** (egress-IP сервера) | только web-service API: Geocoding, Routes, (Address Validation) |
| **Server — DEV** | локальный/dev-сервер | IP (или секрет на доверенной машине) | те же web-service API |

**Разделение client/server (категоризация Google) [HIGH]:**
- **Браузерный (HTTP-referrer) ключ для:** Maps JavaScript API, Maps Static API, Street View Static, Places **Library**, Elevation.
- **Только server-side (IP-ключ, не в браузере):** Address Validation, Directions, Distance Matrix, **Geocoding**, **Routes**, Map Tiles, Places (web service), Roads и т.д.
- Для Magic Castle: **калькулятор доплаты и геокодинг/валидация адреса ОБЯЗАНЫ идти через серверный ключ** в route handler/server action — никогда браузерным.

**Упорядоченный чек-лист:**
1. **Браузерный ключ → HTTP-referrer на домен.** Указывать **полную строку со схемой**: `https://example.com/*` (не `example.com/*`). Поддомены — `https://*.example.com`. Ограничивать на уровне **домена**, не пути (браузеры режут path в cross-origin). **[HIGH]**
2. **Почему referrer-ограничение — реальная защита:** браузерный ключ виден в исходниках/запросах по своей природе; Google считает его «публично раскрываемым» и защищает **ограничениями, а не секретностью**. Украденный ключ отклоняется, если referrer не ваш домен. (Формулировка «всегда виден в исходниках» — индустриальная, у Google она как «exposable». **[MEDIUM на формулировку, HIGH на модель]**)
3. **API-restriction на КАЖДЫЙ ключ** — ограничить ключ только теми API, что он реально вызывает. Не оставлять «Don't restrict key». **[HIGH]**
4. **Серверный ключ → ограничение по IP** (где платформа даёт статичный egress). На serverless (Vercel) с динамическим egress — основная защита: **секретность + API-restriction**, IP-ограничение добавить, где возможно. **[HIGH]**
5. **Серверный ключ — вне репозитория и вне клиентского бандла.** Хранить в `.env`/`.env.local`, коммитить только `.env.example` с плейсхолдерами, `.env*` — в `.gitignore`. **Next.js-факт:** в клиентский бандл инлайнятся только переменные с префиксом `NEXT_PUBLIC_` → серверный ключ **не должен** иметь имя `NEXT_PUBLIC_…` (иначе уедет в браузер). **[HIGH]** Перед коммитом — `security/secret-scan.sh` (в этом репо уже есть).
6. **Раздельные DEV и PROD ключи** — dev-ключ с localhost/preview-referrer и dev-IP; утёкший dev-ключ убивается без влияния на прод. **[HIGH]**
7. **Квотные лимиты на каждый API (req/day, req/min) — это ваш реальный «тормоз».** Console → APIs & Services → API → Quotas → Edit. «По достижении лимита сервис перестаёт отвечать на запросы». Это **не** общий потолок расходов проекта; ставить чуть ниже истинного предела (есть задержка enforcement). Для Magic Castle — консервативные дневные лимиты под ожидаемый объём заявок, чтобы скриптовый абуз упёрся в кап. **[HIGH]**
8. **Бюджет + алерты (50/90/100%) — но это только УВЕДОМЛЕНИЕ.** Официально: «бюджет **не** ограничивает использование/траты автоматически». Поэтому это шаг 8, а тормоз — квоты (шаг 7). **[HIGH]**
9. **(Опц., макс. паранойя) Жёсткий стоп через budget → Pub/Sub → Cloud Function**, отключающий биллинг. Предупреждение: отключение биллинга **гасит весь проект** (включая сайт) и может необратимо удалить ресурсы. Только если «остановить все траты» важнее «остаться онлайн». **[HIGH]**
10. **Гигиена:** периодическая ротация ключей, удаление неиспользуемых, секрет-скан перед каждым коммитом. **[HIGH]**

**Ментальная модель:** Браузерный ключ = публичен → защищён HTTP-referrer + API-restriction + квота. Серверный ключ = секрет → не `NEXT_PUBLIC_`, только в server-коде, IP-restriction где можно + API-restriction + квота. **Квоты останавливают запросы. Бюджет-алерты только уведомляют. Отключение биллинга — единственный жёсткий стоп, но кладёт сайт.**

---

## 8. Осуществимость доплаты за расстояние (Distance Matrix vs Routes; зависимость от владельца)

**Статусы [HIGH]:**
- **Routes API** — преемник, консолидирующий legacy **Directions API + Distance Matrix API**; «большая часть функциональности обратно совместима».
- **Distance Matrix API** и **Directions API** — **Legacy с 2025-03-01**; страница Distance Matrix несёт баннер *«This API is now in legacy mode. Use Compute Route Matrix instead.»* Не включаются в новых Cloud-проектах; даты выключения нет, минимум 12 мес предупреждения.
- Отдельно: JS-классы `google.maps.DistanceMatrixService` и `google.maps.DirectionsService` **deprecated с 2026-02-25** (≥12 мес до снятия). Но они **браузерные** — для серверной доплаты они и не нужны.

**Какой метод Routes API [HIGH]:**

| Метод | Что делает | Подходит «один origin → один адрес»? |
|---|---|---|
| **`computeRoutes`** | Маршрут между двумя точками; возвращает `routes.distanceMeters` и `routes.duration`. Биллинг **за запрос** | ✅ **Лучший выбор**: один вызов = расстояние + время в пути |
| **`computeRouteMatrix`** | Матрица origins × destinations (до 625 элементов). Биллинг **за элемент** | Избыточно для 1×1; нужен только для пакетной проверки многих адресов |

**Рекомендация:** строить доплату на **`computeRoutes`**, server-side, **Essentials-tier** (базовый маршрут без live-трафика), field-mask = `routes.duration,routes.distanceMeters` (минимальная маска держит дешёвый tier и не уводит в Pro). Это в пределах бесплатных 10 000/мес. `computeRouteMatrix` — на будущее, если понадобится батч. **[HIGH]**

**Архитектура (осуществимость, не цены):**
1. **Только server-side** — Routes API из бэкенда Next.js, ключ не светится в браузере.
2. **Правило доплаты — данные владельца.** API отдаёт **число** (мили или минуты); маппинг «мили/минуты → доллары» — **бизнес-правило, которое задаёт ВЛАДЕЛЕЦ** (например: бесплатно в радиусе X миль, далее $Y за диапазон). Эти **долларовые значения здесь НЕ выдумываются** — хранить в конфиге/БД для редактирования владельцем. 🔴 (см. PROJECT_BRIEF и `docs/core/03_SITEMAP_AND_SCOPE.md`: «Доплата за расстояние — конкретные суммы/правило нужно от владельца».)
3. **Связка с геокодингом/автокомплитом:** адрес события сначала резолвится в координаты (Autocomplete (New) → Place Details уже отдаёт lat/lng; либо Geocoding API), затем — вызов маршрута.
4. **Кеш/дебаунс:** считать доплату один раз по подтверждённому адресу, не на каждый ввод — экономия вызовов и удержание в бесплатном tier.

**Вывод:** доплата за расстояние **технически выполнима и чистая**; единственная незакрытая зависимость — **суммы/правило от владельца**.

---

## 9. Разъяснение: Google Business Profile ≠ Google Maps Platform API

Это **два разных** актива Google — не путать.

| | **Google Business Profile (GBP)** | **Google Maps Platform (API для разработчиков)** |
|---|---|---|
| Что это | **Бесплатный локальный листинг** в Поиске и на Картах (бывш. «Google My Business») | **Платные API/SDK**, встраиваемые в сайт/приложение (Maps JS, Places/Autocomplete, Embed, Geocoding, Routes…) |
| Назначение | Управлять тем, как бизнес показывается в поиске: имя, зоны обслуживания, часы, телефон, фото, отзывы | Рендерить карты, автодополнять адреса, геокодить, считать дистанцию **внутри вашего продукта** |
| Кто пользуется | Владелец (маркетинг/SEO) | Разработчики |
| Стоимость | **Бесплатно** | По использованию (Essentials/Pro/Enterprise, поштучно после бесплатного лимита) |
| Настройка | Заявка/верификация листинга в Business Profile manager | Cloud-проект, включение API, ключ + биллинг |
| Взаимозаменяемы? | **Нет.** Разные продукты, консоли, биллинг. |

**Почему GBP важен для service-area бизнеса (одна строка):** это ключевой локальный-SEO актив — источник данных для локального «map pack» и **показа зон обслуживания (LA, Сан-Диего, Сакраменто, Сан-Хосе) без публикации домашнего адреса**, что точно соответствует ситуации Magic Castle. **[MEDIUM — SEO-утверждение]** ([developers.google.com/my-business](https://developers.google.com/my-business))

**Граница:** настройка/оптимизация GBP — **вне рамок** этой Maps Platform-задачи (ключ, Cloud-биллинг и код не нужны). Отдельная маркетинг/SEO-задача (уже зафиксирована в `PROJECT_BRIEF.md` → «Google Maps/Business: владелец не знает → завести» и `docs/core/04_SEO.md`).

---

## 10. Заметка про cookie / consent (Калифорния)

**Какие продукты ставят cookie [HIGH/MEDIUM]:**
- **Maps SDK Android/iOS** — ставят cookie, но это мобильные SDK, **к сайту не относятся**. **[HIGH]**
- **Maps Embed API (iframe)** — **ставит cookie** (Google ToS §9.3 про «cookie-enabled Maps APIs»; список «iframe-генератор ставит cookie» восходит к докам Google). **[MEDIUM]**
- **Maps JavaScript API v3** (с `maps.googleapis.com`) — **не полагается на обмен cookie** с Google. **НО** даже без cookie загрузка JS API передаёт Google **IP-адрес** и данные запроса и допускает fingerprint-трекинг → это всё равно **раскрытие данных третьей стороне**. **[MEDIUM]**
- **Places/Autocomplete** — тот же web-stack, что JS API: не cookie-based, но раскрывает фрагменты вводимого адреса + IP. **[LOW по точному cookie-поведению]**

**Практический вывод:** предпочесть **Maps JavaScript API + Places Autocomplete** вместо **Embed-iframe** — Google не ставит cookie, история с согласием сильно упрощается. Iframe Embed — «cookie-тяжёлый» вариант.

**Откладывать загрузку до согласия / click-to-load — да, рекомендуется:**
- Если используется **Embed-iframe** (ставит cookie): **не** грузить на рендере — показывать заглушку «Показать карту» и инжектить iframe после клика/согласия (готовые плейсхолдеры есть в Cookiebot/Complianz). **[MEDIUM]**
- Если **JS API** (без cookie Google): click-to-load всё равно полезен по двум не-юридическим причинам — производительность (тяжёлый бандл) и минимизация раскрытия IP. **[MEDIUM]**
- **Consent Mode** — это механизм Google Tag/Analytics/Ads, **не** контроль для Maps; гейтинг Maps реализуется вручную (условный инжект скрипта / click-to-load). **[MEDIUM]**

**Калифорния (CCPA/CPRA) — модель opt-OUT, не EU opt-IN:**
- CCPA/CPRA применяется к коммерческому бизнесу в Калифорнии при выполнении **хотя бы одного** порога: **выручка > $25M/год**; ИЛИ покупка/продажа/«sharing» ПДн **100 000+** жителей/домохозяйств CA; ИЛИ **50%+** выручки от продажи ПДн калифорнийцев. **[HIGH]** ($25M индексируется к ~$26.6M на 2025/2026 — **[MEDIUM]**.) Небольшой выездной театр **почти наверняка не подпадает ни под один** → формально, вероятно, **не «business» по CCPA** (подтвердить с клиентом/юристом — не подавать как юридический совет).
- **Ссылка «Do Not Sell or Share My Personal Information»** обязательна только для покрытых бизнесов, которые реально **продают/шарят** ПДн; не продаёте/не шарите → не требуется. **[HIGH]** Под CPRA «share» включает раскрытие для **cross-context behavioral advertising** даже без денег — но обычная карта/автокомплит это функциональное использование, не таргетинг рекламы. Рекламные пиксели (Google Ads, Meta) — вот что создаёт экспозицию «share»; их держать выключенными/гейтить. **[MEDIUM]**

**Рекомендация для этого небольшого сайта (аудитория Калифорния):**
1. Предпочесть Maps JS API + Places Autocomplete вместо Embed-iframe (Google не ставит cookie).
2. Использовать click-to-load / lazy-load карты (обязательно-ish только для cookie-iframe; иначе — польза для перфоманса/приватности).
3. **Опубликовать Privacy Policy** — это **контрактно требуется Google** независимо от CCPA: приложения на Maps JS API «должны иметь публично доступные Terms of Use и Privacy Policy, инкорпорирующие условия и политику Google». Раскрыть, что сайт использует Google Maps и передаёт адрес/IP в Google. **[HIGH]**
4. **Не** добавлять рекламные/трекинговые пиксели бездумно — именно это превратило бы безобидную карту в обязанность «sale/share» по CPRA.
5. Ссылка «Do Not Sell or Share», вероятно, **юридически не требуется** (бизнес ниже порогов и не продаёт/шарит), но дёшева как жест доброй воли — по желанию клиента; пороги подтвердить с клиентом/юристом.

---

## 11. Риски / чего НЕ делать

- ❌ **Не строить новый проект на legacy API:** Places API (legacy), Directions API, Distance Matrix API — Legacy с 2025-03-01; в новом Cloud-проекте, вероятно, не включатся. Использовать **Places API (New)** и **Routes API**. **[HIGH]**
- ❌ **Не начинать с legacy-виджета `google.maps.places.Autocomplete` / `AutocompleteService`** — закрыты для новых клиентов с 2025-03-01. Использовать **`PlaceAutocompleteElement`** / `AutocompleteSuggestion`. **[HIGH]**
- ❌ **Не вызывать Geocoding / Routes / Address Validation из браузера** браузерным ключом — только server-side серверным ключом. **[HIGH]**
- ❌ **Не давать серверному ключу имя `NEXT_PUBLIC_…`** — уедет в клиентский бандл. **[HIGH]**
- ❌ **Не полагаться на бюджет-алерты как на стоп** — они только уведомляют; реальный тормоз — **квотные лимиты**. **[HIGH]**
- ❌ **Не оставлять ключи без ограничений** (referrer/IP + API-restriction обязательны на каждом). **[HIGH]**
- ❌ **Не выдумывать суммы доплаты за расстояние** — это решение владельца. 🔴
- ❌ **Не путать GBP и Maps Platform API** — разные продукты/консоли/биллинг. **[HIGH]**
- ⚠️ **Не уводить себя в Pro/Enterprise SKU незаметно:** широкий field-mask в Place Details, `TRAFFIC_AWARE` в Routes, Address Validation — у них меньше бесплатный лимит и выше ставка. Держать минимальные поля и Essentials. **[MEDIUM]**
- ⚠️ **Не светить реальный ключ** в коде/логах/коммитах; в репозиторий едет только `.env.example`. (В этом отчёте реального ключа нет.)
- ⚠️ **Производительность:** не грузить тяжёлый Maps-JS на первый рендер — это бьёт по Core Web Vitals, что важно для локального SEO (домен с 25-летней историей нужно беречь по CWV).

---

## 12. Пробелы доказательной базы (что переподтвердить перед запуском)

- **Суммы подписочных планов** (Starter/Essentials/Pro) и точная дата их ввода — **[LOW / UNVERIFIED]**; для низкого объёма не нужны, но если зайдёт речь — сверить на [subscriptions](https://developers.google.com/maps/billing-and-pricing/subscriptions).
- **Эскалация tier по field-mask в Place Details** — какие именно поля держат в Essentials, а какие уводят в Pro/Enterprise — **[MEDIUM]**, уточнить по [place-data-fields](https://developers.google.com/maps/documentation/places/web-service) перед версткой формы.
- **Точное cookie-поведение Places/Autocomplete** на first-party странице Google — **[LOW]**; рассуждение строилось по позиции JS API.
- **Cookie у Embed-iframe** — суть Google, но дословная фраза не переподтверждена на живой first-party-странице в этой сессии — **[MEDIUM]**.
- **Применимость CCPA к конкретному бизнесу** — нужно подтверждение клиента/юриста (пороги), это не юридический совет. **[MEDIUM]**
- **Высоковолюмные «полы» цен (5M+)** — приблизительны; проекту нерелевантны (он в первой ступени/бесплатном лимите). **[MEDIUM]**
- **Общая рекомендация:** перед запуском **подтвердить текущие цены и бесплатные лимиты прямо в Google Cloud Console** на момент сборки — модель уже менялась (март 2025), может меняться дальше.

---

## 13. Следующий шаг

Рекомендуется отдельная **каноническая TUNG v2 implementation-задача** на собственно интеграцию:
1. **Карта зон выезда** — начать с **Maps Embed API** (бесплатно, быстро); JS-SDK (`@vis.gl/react-google-maps`) — только если нужны рисованные полигоны зон.
2. **Адрес в форме брони** — `PlaceAutocompleteElement` (Places API New) в `"use client"`-компоненте, с session-token, запись `formattedAddress` + lat/lng в состояние формы.
3. **Калькулятор доплаты за расстояние** — server-side `computeRoutes` (Essentials), маппинг «мили → доллары» в конфиге; **активировать только после получения от владельца сумм/правила** 🔴.
4. **Хардненинг** — 4 ключа с ограничениями, квотные лимиты, бюджет-алерты, `.env.example` без реальных значений, secret-scan в гейте.
5. **Privacy Policy + click-to-load** для карты.

**Отдельные задачи (не разработка):**
- 🔴 **Суммы/правило доплаты за расстояние** — вход от владельца.
- **Настройка Google Business Profile** — отдельная маркетинг/SEO-задача (out of scope здесь, но критична для локального SEO).

---

## 14. Использованные источники

**Цены / биллинг / квоты (official Google):**
- https://mapsplatform.google.com/pricing/
- https://developers.google.com/maps/billing-and-pricing/overview
- https://developers.google.com/maps/billing-and-pricing/pricing
- https://developers.google.com/maps/billing-and-pricing/faq
- https://developers.google.com/maps/billing-and-pricing/march-2025
- https://developers.google.com/maps/billing-and-pricing/pricing-categories
- https://developers.google.com/maps/billing-and-pricing/manage-costs
- https://developers.google.com/maps/billing-and-pricing/subscriptions
- https://developers.google.com/maps/documentation/places/web-service/session-pricing

**Статусы / каталог API / deprecation:**
- https://developers.google.com/maps/deprecations
- https://developers.google.com/maps/legacy
- https://developers.google.com/maps/documentation/places/web-service/overview
- https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
- https://developers.google.com/maps/documentation/javascript/place-autocomplete-new
- https://developers.google.com/maps/documentation/javascript/legacy/places-migration-autocomplete
- https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
- https://developers.google.com/maps/documentation/embed/get-started
- https://developers.google.com/maps/documentation/embed/usage-and-billing
- https://developers.google.com/maps/documentation/maps-static/usage-and-billing
- https://developers.google.com/maps/documentation/address-validation/overview

**Distance / Routes:**
- https://developers.google.com/maps/documentation/routes/migrate-routes-why
- https://developers.google.com/maps/documentation/distance-matrix/overview
- https://developers.google.com/maps/documentation/routes/compute-route-over
- https://developers.google.com/maps/documentation/routes/compute-route-matrix-over
- https://developers.google.com/maps/documentation/routes/usage-and-billing
- https://developers.google.com/maps/documentation/javascript/reference/distance-matrix

**Next.js / библиотеки:**
- https://mapsplatform.google.com/resources/blog/streamline-the-use-of-the-maps-javascript-api-within-your-react-applications/
- https://developers.google.com/maps/documentation/javascript/examples/rgm-basic-map
- https://visgl.github.io/react-google-maps/docs/api-reference/components/api-provider
- https://github.com/visgl/react-google-maps
- https://www.npmjs.com/package/@vis.gl/react-google-maps
- https://registry.npmjs.org/@googlemaps/js-api-loader
- https://www.npmjs.com/package/@react-google-maps/api
- https://nextjs.org/docs/app/building-your-application/configuring/environment-variables

**Безопасность ключей / биллинг-гард:**
- https://developers.google.com/maps/api-security-best-practices
- https://docs.cloud.google.com/docs/authentication/api-keys-best-practices
- https://cloud.google.com/blog/products/maps-platform/google-maps-platform-best-practices-restricting-api-keys
- https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys
- https://docs.cloud.google.com/apis/docs/capping-api-usage
- https://docs.cloud.google.com/billing/docs/how-to/disable-billing-with-notifications

**Cookie / consent / California / GBP:**
- https://developers.google.com/maps/terms-20180207
- https://developers.google.com/maps/faq
- https://developers.google.com/maps/documentation/javascript/policies
- https://developers.google.com/maps/documentation/javascript/content-security-policy
- https://developers.google.com/tag-platform/security/guides/consent
- https://oag.ca.gov/privacy/ccpa
- https://developers.google.com/my-business
- (вторичные/корроборация) iubenda, cookiebot, clym, onetrust, brightlocal

---

## 15. Итог верификации (final verification summary)

- **Покрытие:** оценено **8 API** (минимум по ТЗ — 5); официальная модель цен и бесплатных лимитов **проверена**; чек-лист безопасности **составлен**; путь интеграции в Next.js **рекомендован**. Все цели `minimum_expected_coverage` выполнены.
- **Adversarial-верификация:** независимо перепроверено **21** высокорисковое утверждение (цены, бесплатные лимиты, статусы, distance). Большинство — **CONFIRMED [HIGH]**.
- **3 опровержения (REFUTED)** — все об одном: ставка была неверно привязана к диапазону 100 001–500 000. Исправлено: указанные ставки относятся к **первой платной ступени 10 001–100 000** (Dynamic Maps $7.00, Static $2.00, Geocoding $5.00; в след. диапазоне — $5.60 / $1.60 / $4.00). Сами ставки первой ступени и модель лимитов — **HIGH**.
- **Что доказано [HIGH]:** отмена кредита $200 и переход на per-SKU лимиты (2025-03-01); бесплатные пороги Essentials/Pro/Enterprise = 10k/5k/1k; ставки нужных Essentials-SKU; Embed API бесплатен/без лимита; Places legacy + Directions/Distance Matrix = Legacy с 2025-03-01, преемники — Places API (New) и Routes API; разделение client/server ключей и метод хардненинга; осуществимость доплаты через `computeRoutes`; GBP ≠ Maps Platform API.
- **Что остаётся неподтверждённым:** суммы подписочных планов **[LOW]**; точная эскалация tier по field-mask **[MEDIUM]**; дословное cookie-поведение Embed/Places на first-party Google **[MEDIUM/LOW]**; применимость CCPA к конкретному бизнесу (нужен клиент/юрист). **Рекомендация:** подтвердить актуальные цены/лимиты в Google Cloud Console на момент сборки.
- **Соответствие guardrails:** реальный API-ключ в отчёте **отсутствует**; ни один deprecated API не рекомендован без указания статуса и преемника; суммы доплаты за расстояние трактуются как вход владельца; существующие файлы не изменялись; цены не приводились без официального источника или пометки об отсутствии подтверждения.

---

*Отчёт подготовлен в режиме audit (research-only). Реализация — отдельной канонической TUNG v2-задачей. Источник истины по бизнес-фактам — `PROJECT_BRIEF.md` и `docs/core/`.*
