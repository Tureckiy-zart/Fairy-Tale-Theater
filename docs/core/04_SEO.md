# 04 — SEO-каркас и локальная видимость

<!--
v2 (2026-06-22). Переписан под актуальную рамку: английский интент (RU-семантика
снята), идентичность «театрализованное шоу — живой + кукольный (смешанный)», команда украинская
(без русского/славянского кодирования), ребрендинг (имя/домен меняются), GBP в приоритете.
Заменяет прежнюю версию с RU-ключами и аргументом «сохранить домен». (2026-06-27: ключи «puppet» снова ВКЛючены — репертуар смешанный, live + puppet.)
-->

> Главная боль — упал поток без ручного обзвона. SEO + локальный профиль должны стать
> **постоянным каналом заявок**. Имя меняется на категориально-нейтральное — это **плюс
> для SEO** (бренд сверху, посадочные под интент снизу).

## Приоритет — локальное SEO (service-area business)

Театр выездной, без витрины. Модель — **service-area business**:
- **База:** Лос-Анджелес. **Зоны выезда:** Сан-Диего, Сакраменто, Сан-Хосе.
- Выигрыш — через **сервисные/посадочные страницы под интент**, каждая под свой запрос;
  бренд сверху объединяет.

## Семантика — английский интент (RU-ключи сняты)

**Первичка (EN):**
- children's theater Los Angeles
- children's theatre Los Angeles *(brand-spelling support variant; American `theater` keyword remains valid)*
- fairy tale show for preschools / daycare LA
- costumed character birthday party Los Angeles
- school assembly show Los Angeles
- kids show Los Angeles / live kids theater LA
- interactive kids show / bubble show LA *(наш формат — спектакль + интерактив/пузыри)*
- fairy tale show for kids [San Diego / Sacramento / San Jose]
- puppet show / puppet theater Los Angeles *(репертуар включает кукольные шоу — вторичный, но валидный интент; ре-активировано 2026-06-27)*
- puppet show for kids birthday party / preschools / daycare LA

**Опционально (вторичный общинный слой):** небольшой **украинский** слой
(украинские запросы) — **не русский**. Решить, нужен ли (см. `02_POSITIONING_AND_TONE.md`).

> RU-семантика и «русский детский театр LA» — **сняты** (команда украинская, бренд не
> ассоциируем с Россией; рынок англоязычный). Частотности/конкуренцию — подтвердить
> инструментом (Semrush/Ahrefs) или через Search Console после запуска.

## Технические основы SEO

- **Отдельный индексируемый URL на каждое шоу** и услугу (не один SPA-экран).
- `title`/`description`/OG на каждую страницу; чистые англ. слаги.
- **Schema.org:** `PerformingGroup`/`LocalBusiness` (areaServed = города выезда),
  `Event`/`TheaterEvent` для шоу, `BreadcrumbList`.
- **Язык:** английский — по умолчанию. Опциональный украинский слой — корректный `hreflang`
  (en/uk), если решат добавлять. *(Двуязычие RU/EN — снято.)*
- Sitemap.xml, robots.txt, быстрый Core Web Vitals (важно для локального ранга).

## Google Business Profile (критично — приоритетнее карты на сайте)

- Завести/заявить профиль как **service-area** (без публичного адреса), указать зоны.
- **Business name:** **Miss Lana's Fairy-Tale Theatre**.
- **Категории:** Children's theater / Entertainment / Event planner / **Puppet theater** (репертуар включает кукольные шоу — вторичная, но валидная категория).
- Фото/видео, primary phone **(323) 903-2039**, primary email `info@misslanatheatre.com`,
  ссылка на `https://misslanatheatre.com`. **Это часто главный источник локальных лидов** (map pack).
- **Проверить, нет ли уже профиля** (владелец «не знает») — возможно есть забытый.
- По Треку B: **GBP важнее встройки карты** — заводим в первую очередь.

## Имя и домен (обновляет прежний совет «домен не менять»)

- **Бренд (закреплён, `BRAND.md`):** зонтик **Miss Lana**, флагман — **Miss Lana's Fairy-Tale
  Theatre**. Зонтик категориально-нейтрален, а **секции-дескрипторы** (Birthday Parties / School
  Shows / Characters) несут интент-ключи → **сильно для SEO** (ранжируемся под разные форматы).
- **Canonical domain:** **`misslanatheatre.com`** — primary production domain, already live.
  `misslanatheater.com` — protective alternate only → **301** на primary. Старый
  `magic-castle-puppet-theater.com` SEO-капитала практически не несёт → **301** на релевантные
  новые URL, держать редиректящим, обновить GBP/листинги, пересабмитить sitemap. Не утверждать,
  что redirects/Search Console/GBP уже настроены, пока это отдельно не проверено. (Доменное
  «theatre» = идентичность; охват не сужает — birthday/characters/assembly ловят свои секции.)

## Конкуренты — карта (Трек A; владелец считал, что их нет)

- **Bob Baker Marionette Theater** — институция LA с 1963; выездная труппа делает частные
  праздники/шоу; сильный бренд/SEO-авторитет (держит «puppet theater LA»; мы тоже таргетим puppet-интент как вторичный, но дифференцируемся живым костюмированным + ценностями — в лоб по их ядру не бьём).
- **Puppet Theater on Wheels** — прямой выездной конкурент (дни рождения/сады/школы, от ~$395,
  сильный Yelp).
- **PollyBilly** — выездной (puppet), англоязычный сайт, публичные цены $350/$400.
- Маг-аниматорский слой (Giggle Factory, Rich Freeman) — тянет к клубу Magic Castle.
- **Наш дифференциатор:** профессиональная живая костюмированная подача + смешанный репертуар (живые и кукольные шоу),
  ценности, труппа, 30 лет — против чисто-кукольных/аниматорских конкурентов.
- Полная карта — отчёт Трека A ([../reports/competitors/2026-06-21-la-kids-puppet-theater-competitor-research.md](../reports/competitors/2026-06-21-la-kids-puppet-theater-competitor-research.md), архивный — старая рамка, но карта конкурентов и цены в силе).

## Следующие шаги по SEO

1. **Завести/проверить GBP** + статус домена.
2. **Имя/домен** закреплены (Miss Lana's Fairy-Tale Theatre / misslanatheatre.com); сайт уже
   на primary production domain. Проверить/настроить 301 для `misslanatheater.com` и
   `magic-castle-puppet-theater.com`, GBP/listings/Search Console, sitemap resubmit; trademark-clearance остаётся отдельным gate.
3. **Подтвердить семантику** инструментом (EN-интент).
4. **Заложить URL-структуру** (страница на шоу/услугу) в сборку; посадочные под интент
   (ассамблеи, дни рождения, костюмированные шоу, bubble/интерактив).

## Changelog

- **2026-06-25:** canon sync — public brand/GBP/schema name changed to Theatre; canonical
  domain set to live `misslanatheatre.com`; `misslanatheater.com` documented only as protective
  alternate redirect; primary email/phone added; valid American `theater` SEO keywords preserved.
