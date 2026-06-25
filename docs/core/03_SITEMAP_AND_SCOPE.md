# 03 — Структура сайта (IA) и объём работ

<!--
v2 (2026-06-22). Переписан под актуальную рамку: английский-первый (двуязычие RU снято),
идентичность «театрализованное шоу» (не «puppet»), 30+ лет, ребрендинг, GBP в приоритете,
доплата за расстояние — зональная модель. Заменяет прежнюю версию (RU-ядро, «25 лет», puppet).
-->

> Цель сайта: **заявки + витрина + SEO**. Заменить ручной обзвон постоянным каналом.

## Цели (приоритет)

1. **Заявки/брони** — превратить посетителя в заявку на выезд (главная конверсия).
2. **Витрина** — солидно показать репертуар, команду, **30+ лет**, фото/видео.
3. **SEO/находимость** — локальный поиск по LA и зонам выезда (см. [04_SEO.md](04_SEO.md)).

## Карта сайта (предлагаемая)

```
/ (Главная)
├── /shows               Репертуар (8 театрализованных шоу, карточки)
│   └── /shows/{slug}    Страница шоу (синопсис, возраст, длит., фото/видео, CTA «заказать»)
├── /services            Витрина форматов: театрализованное шоу → анимация/персонажи → праздники
├── /school-shows        Для садов и школ (оффер B2B: пакеты, как заказать)
├── /birthdays           Дни рождения и частные праздники (оффер B2C)
├── /pricing             Цены и пакеты (логика «от числа детей» + доплата за расстояние)
├── /gallery             Галерея фото/видео
├── /about               О театре и команда (30+ лет, украинская труппа, миссия)
├── /booking (/contact)  Онлайн-заявка + телефоны + зоны выезда + карта
└── /blog (опц.)         Статьи под SEO (праздник в саду, развитие через сказку и т.п.)
```

**Язык:** сайт **английский (первичный)**. Опциональный украинский слой — позже, по решению
владельца (`hreflang` en/uk). *(Прежняя установка «двуязычие RU/EN, RU-ядро» — снята.)*

## Требования к функциям

### 1. Онлайн-заявка / бронь
- Форма: имя, телефон/email, тип (сад/школа/день рождения/праздник), дата/время,
  город/адрес выезда, число детей, выбранное шоу (опц.), комментарий.
- UI заявки уже реализован с клиентской валидацией и on-screen success state. **Production delivery**
  to `info@misslanatheatre.com` / primary phone **(323) 903-2039** is unverified/not connected unless
  separately proven; это launch dependency, а не закрытый факт.
- Клиент может выбрать/использовать SMS, email или WhatsApp; written contact preferred. Svitlana
  сейчас отвечает сама; окно ответа — **1-2 business days**.
- Подтверждение на экране обязательно; полная email-копия заявки клиенту не требуется.
  Success copy: “Thank you! We've received your request. Miss Lana will reply by text, email, or WhatsApp within 1-2 business days.”
- CTA «Заказать выезд» на каждой странице шоу и в шапке.

### 2. Прайс и логика цены
- Базовая логика **от числа детей** (от владельца):
  до ~15 детей → **$300–350**; ~40 → **~$400**; 50 → **$500**; 60 → **$600**; далее линейно.
- **Доплата за расстояние** — сейчас её нет, нужно ввести. Рекомендация (Трек B):
  **бесплатно в радиусе X миль от LA; Сан-Диего — фикс. доплата; Сакраменто/Сан-Хосе — «по запросу».**
  **Конкретные суммы/правило — за владельцем** (open question). До этого на сайте — «от $350».
- Отобразить понятно: пакеты (сад / школа / день рождения) + калькулятор/ориентир цены.

### 3. Галерея фото/видео
- Раздел с реальными материалами владельца (шоу, актёры, дети). Видео — встроенные.

### 4. Репертуар
- 8 страниц театрализованных шоу (см. [01_CONTENT_INVENTORY.md](01_CONTENT_INVENTORY.md)),
  каждая — отдельный SEO-URL, с CTA на заявку. Универсальная подача названий.

### 5. Язык (английский-первый)
- **Английский — по умолчанию и основной** (массовый рынок). Опциональный украинский слой —
  позже (переключатель + `hreflang`), если решат добавлять. *(Двуязычие RU/EN — снято.)*

### 6. Локальный профиль и карта
- **Google Business Profile** (service-area, без витрины-адреса) — **приоритетный локальный
  канал**, заводим в первую очередь (см. [04_SEO.md](04_SEO.md)). Категории Children's
  theater / Entertainment (не «Puppet theater»).
- Блок «зоны выезда» с картой (LA + Сан-Диего/Сакраменто/Сан-Хосе). По Треку B карта на
  сайте — вторично после GBP; для встройки — Maps Embed/Static, server-side Routes для расчёта.

### 7. Контакты
- Primary phone **(323) 903-2039** (`tel:+13239032039`), primary email
  `info@misslanatheatre.com`, SMS/email/WhatsApp, форма, соцсети (по ссылкам).
- Второй телефон из старых материалов — **reserve-only**; не выводить как равный primary contact.

## Launch dependencies

- **Verified reviews/testimonials** — launch trust requirement `[OWNER/CONTENT]`: собрать и
  опубликовать только реальные отзывы с разрешением/источником. Initial target: **at least five**
  strong verified reviews, ideally from both parents and preschool/school representatives. Не
  придумывать review copy, имена, рейтинги, школы или permissions.
- Подтвердить production delivery формы, реальные медиа, редиректы, Google Business Profile/Search
  Console, QA, noindex removal.

## Вне объёма (пока)

- Онлайн-оплата/продажа билетов — модель B2B-выездная, оплата вне сайта (можно позже).
- Личный кабинет/CRM — на старте достаточно лида на email.

## Открытые вопросы (блокируют часть сборки)

- ✅ **Имя/домен закреплены (`BRAND.md`):** **Miss Lana's Fairy-Tale Theatre** (зонтик **Miss
  Lana**), primary production domain **`misslanatheatre.com`** уже live. `misslanatheater.com` —
  protective alternate only → 301 на primary. **ОДИН сайт:** навигация = 4 линии-секции
  под Miss Lana (Theatre · Birthdays · School Shows · Characters), не отдельные сайты. Остаётся:
  **trademark-clearance у юриста** до лого/печати.
- 🔴 **Доплата за расстояние** — конкретные суммы/правило (зональная модель — рекомендация).
- 🔴 **Подача 2 названий шоу** — «Morozko» (→ Father Frost / заменить) и «Well Red Bow wait»
  (→ Little Red Riding Hood); см. [01_CONTENT_INVENTORY.md](01_CONTENT_INVENTORY.md).
- 🟡 **Соцсети** — ссылки. **Protective/legacy domains** — 301 и статус оплаты на период миграции.
- 🟡 **Гос. школы** — нужен ли отдельный лендинг/оффер (отдельная go-to-market).
- 🟡 **Фото/видео, лого 2026** — активы от владельца.
- 🟡 **Verified reviews/testimonials** — launch-required trust layer; at least five real verified
  reviews target, not yet collected/verified in canon.

## Changelog

- **2026-06-25:** canon sync — Theatre spelling, live primary domain, protective alternate domain,
  primary email/phone, reserve-phone rule, SMS/email/WhatsApp, Svitlana responder, and approved
  form success copy added.
- **2026-06-25 finalization:** `/school-shows` locked as canonical B2B route; reviews moved into
  launch-required `[OWNER/CONTENT]` scope with no invented content.
