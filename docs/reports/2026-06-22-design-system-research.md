# Design System Research — Miss Lana's Fairy-Tale Theater

> **Формат:** Hermes TUNG Lite · `task_mode: audit` · `task_type: design-research` · задача `HERMES_DESIGN_SYSTEM_RESEARCH_001`
> **Дата:** 2026-06-22
> **Статус:** РЕСЁРЧ + СПЕКА (decision-ready). **Это НЕ реализация.** Код/Tailwind-конфиг/компоненты — отдельная каноническая задача **TUNG v2** (см. §15).
> **Каноническое место отчёта (Hermes Lite):** контейнер `/workspace/HermesResearch/reports/` → хост `/home/tureckiy/Projects/Magic-castle/HermesResearch/reports/`.
> **Авторитет:** `current_truth` задачи + `docs/core/BRAND.md`, `02_POSITIONING_AND_TONE.md` (v5), `01_CONTENT_INVENTORY.md`, `03_SITEMAP_AND_SCOPE.md`, `PROJECT_BRIEF.md`. Где старые формулировки расходятся — побеждает `current_truth`.
> **Метод тегирования:** каждая крупная рекомендация помечена **[HIGH/MEDIUM/LOW]** уверенности и разделена на **`web-evidence`** (подтверждено живыми источниками) vs **`designer-judgment`** (экспертное суждение).
> **Контраст:** все пары цветов проверены **детерминированно** (WCAG 2.x формула относительной яркости, расчёт скриптом), отдельные ratio указаны в §6. Ни одна пара не объявлена доступной без числа.
> **Caveat:** **лого/вордмарк НЕ финализируем** — только направление (trademark-clearance у юриста ещё не пройден, `BRAND.md`).

---

## 1. Executive summary — рекомендация с первого взгляда

**Рекомендуемое направление: «Lantern Light» (Фонарный свет).**
Тёплая палитра на основе **зелёных** (forest/grove/sage) на **кремовом** фоне, с тихой фирменной нитью **«тёплого света»** — *honey / lantern glow* (имя Svitlana = «свет»). Типографика — **Fraunces** (тёплый сторибук-сериф для заголовков и голоса персоны) + **Nunito** (мягкий гуманистический гротеск для текста и UI). Иллюстрации — **текстурная гуашь + тёплая линия-и-заливка** (line-and-wash), только как рамки/акценты вокруг **реальных фото/видео шоу** (фото всегда главные). Иконки — **Phosphor** (Regular + Duotone). Анимация — **мягкая, «дышащая»**: медленный float фонарика, тихий twinkle, плавные scroll-reveal, всё за `prefers-reduced-motion` и в бюджете Core Web Vitals.

**Почему именно это [HIGH]:**
- **Честно к бренду:** прямо отрабатывает три установки владельца — *тёплое + зелёное + свет/glow*, «ярко, но по-доброму».
- **Обходит оба анти-паттерна:** не «большие открытые рты» (мягкие выражения, sans без «крика», несатурированный цвет) и не «холодный корпоратив/шаблон» (кремовый фон, гуашь, реальные тёплые фото, редакторские отступы).
- **Уникальная ниша [web-evidence]:** из 7 аудированных сайтов **зелёный** используют только Lovevery и Polly & Billy, а мотив **«тёплый свет / фонарик / twinkle» — НИКТО**. Два главных имени LA (Bob Baker, Tonies) — красные. Зелёный + свет = свободная, занимаемая (ownable) полоса.
- **Двойная аудитория:** редакторское спокойствие в духе Lovevery → доверие B2B (директора садов/Монтессори); сказочная гуашь + фонарик-wonder → магия для семей.
- **Доступно и быстро:** все ключевые пары текста/фона проходят **WCAG AA** (числа в §6); шрифты — variable woff2 (один файл на семейство) для CWV (локальное SEO зависит от него).

**Ключевые токены (сводка):** `grove #256A4A` (primary/CTA), `forest #1E4D38` (deep/футер/заголовки), `cream #FBF6EC` (фон), `ink #26261F` (текст), `honey #E8A33D` (glow-акцент), `lantern #FFD27A` (twinkle, декор). Type: Fraunces 500–600 / Nunito 400, scale 1.250 (16px база). Radius: мягкий, 12–24px + pill для CTA. Motion: 100/200/320/480/640 ms, 4 easing-токена.

**Альтернативы (для выбора владельцем):** **B — «Lantern & Linen»** (теплее, «вечерний/свечной», amber-forward, сериф Lora — более «книжно/B2B»); **C — «Meadow Storybook»** (светлее/воздушнее, дневной, чуть больше игры и семейности, грот Bricolage). Обе тоже проверены на AA (§5–6).

**Главные caveat'ы:** (1) это **спека, не реализация**; (2) **лого/вордмарк — только направление** (TM pending); (3) категория «тёплый-пастель-sans» уже стандартна — дифференциация держится на *зелёный+свет + арт-дирекшн фото выше конкурентов + характерный логотип*, а не на самом факте «тепло».

---

## 2. Brand constraints recap (что нельзя нарушить)

Из `current_truth` + `docs/core/*` (авторитетно):

- **Идентичность:** профессиональный **живой костюмированный** детский театр сказок, который приезжает к вам. **НЕ кукольный театр.** Дети **2–10**. Принцип: «широко в услугах, узко в идентичности».
- **Тон:** тёплый, добрый, сказочный — «kind tales like the old days». **Ярко, но НЕ агрессивно.** Голос — от первого лица (Miss Lana как приветливое лицо, возможно дружелюбный иллюстрированный характер).
- **Цвет:** тёплая палитра; владелец **любит зелёные**; плюс мотив **«тёплый свет/glow»** (Svitlana = «свет» → фонарь/огонёк/twinkle как тихая нить).
- **Двойная аудитория:** должно читаться **надёжно/профессионально** для B2B (директора частных садов/Монтессори, закупщики школьных ассамблей) И **волшебно/тепло** для семей (дни рождения).
- **Образность:** реальные тёплые **фото/видео** шоу — центр; система обязана их обрамлять и возвышать.
- **Стек:** Next.js (App Router) + React + TypeScript + **Tailwind CSS**. Важны **WCAG AA** и **Core Web Vitals** (от него зависит локальное SEO).
- **4 линии услуг на ОДНОМ сайте** (общая система + опц. тонкий пер-секционный акцент): Fairy-Tale Theater (флагман) / Birthday Parties / School Shows / & Friends (костюмированные герои).

**ЖЁСТКИЕ анти-паттерны (must avoid):**
1. Кричащий американский стиль **«больших открытых ртов»**, агрессивный, пере-сатурированный, гиперактивный «kids-TV».
2. **Холодный корпоративный/шаблонный** (generic SaaS) вид.
3. **ЛЮБОЕ славянское/русское/украинское визуальное кодирование** (никаких матрёшек, фолк-орнамента, кириллицы, луковичных куполов, рушников). Украинское наследие — **тихий бэкстори**; бренд читается нейтрально/универсально для рынка США.

---

## 3. Method / references

- **Аудит дизайна конкурентов и эталонов:** живой fetch 7 сайтов (см. §4 и §18) — 3 прямых/смежных LA-игрока (Polly & Billy, Bob Baker, Puppet Theater on Wheels) + 4 best-in-class тёплых детских/семейных бренда (Lovevery, Tonies, Sago Mini, KiwiCo). Метка `web-evidence` = сайт реально открыт.
- **Типографика:** верификация кандидатов на `fonts.google.com/metadata` — лицензия (OFL), наличие **variable**-осей, покрытие языков и веса. Анти-паттерн-фильтр на «кричащие» гарнитуры.
- **Цвет + доступность:** палитра задана здесь; **контраст посчитан детерминированно** (формула относительной яркости WCAG 2.x, скрипт stdlib) для всех ролевых пар — числа в §6. Целевые пороги: **≥4.5:1** обычный текст, **≥3:1** крупный текст и UI-компоненты/границы/иконки.
- **Motion + перформанс:** best-practices из Material 1/3 (токены длительности/easing), web.dev/CWV, MDN/W3C (prefers-reduced-motion, WCAG 2.2.2), CSS scroll-driven animations / IntersectionObserver.
- **Иллюстрация/иконки:** обзор современных сторибук-стилей, мотивных систем, open-source иконотек (Phosphor/Lucide/Heroicons/Tabler), правил сосуществования иллюстрации и документальной фотографии.
- **Опора на прошлый артефакт:** `HermesResearch/reports/2026-06-21-la-kids-puppet-theater-competitor-research.md` (карта конкурентов/цены — в силе; старая рамка «puppet/RU» — снята).

---

## 4. Competitor / adjacent design audit — что эмулировать / что обогнать

Все наблюдения ниже — `web-evidence` (сайты открыты), синтез помечен `designer-judgment`.

| Сайт | Палитра | Типографика | Фото vs илл. | Тон | Эмулировать | Обогнать |
|---|---|---|---|---|---|---|
| **Polly & Billy** (прямой LA) | cream + sky-blue + рисованный grass-green + warm browns | чистый sans | ~50/50 | тёплый, **handmade/boutique** | теплоту, фото-достоверность детской радости, спокойный темп | арт-дирекшн: «прищепки/облака/трава» держат на уровне «милый локальный хоббист»; нужна дисциплина типографики, воздух, редакторское обрамление фото |
| **Bob Baker** (институция LA) | **красный** + cream, чёрный текст | винтажный театральный **логотип с характером** | фото-вперёд | тёплый/винтаж, авторитет наследия | уверенный рукотворный логотип (не generic sans), кремовый фон, вынос наследия/доверия | палитру (он владеет красным → нам свободен **зелёный+свет**) и свежесть (он ностальгичен, нам нужно timeless-но-современно) |
| **Puppet Theater on Wheels** (прямой LA) | warm earth tones + акценты | чистый sans | фото + рисов. персонажи | тёплый, но **generic/template** | candid-фото реальных реакций детей, фрейминг «magic + world-class» | связность: нет памятной цветовой подписи и единой системы → наша возможность = одна когерентная система на 4 линии |
| **Lovevery** ⭐ (эталон B2B-тепла) | **sage greens + neutrals + cream** | чистый современный sans | staged-natural | спокойный, «премиум+доверие» | **золотой стандарт «профессионально, но тепло»**: sage-green+cream, редакторский воздух, спокойный темп, копи «доказательство рядом с теплом», сдержанные рисованные акценты (мазок-галочка) | — (это образец, а не соперник) |
| **Sago Mini** (анти-крик образец) | мягкие тёплые пастели | чистый современный sans | илл. + фото | скандинавское спокойствие | **как делать характер БЕЗ гиперактива:** мягкие добрые выражения, спокойная энергия (если будет маскот Miss Lana — это модель) | у нас фото должны лидировать (Sago — илл.-вперёд) |
| **Tonies** | **красный**, яркий/энергичный | чистый sans | фото-вперёд, тёплый мягкий свет | тёплый, но бодрый | **тёплый мягкий свет в обрамлении реальных фото**, dual-audience копирайт | без бодрого стекинга ярких акцентов (риск пере-стимуляции); нет зелёного/света |
| **KiwiCo** | пастели | sans | **илл.-вперёд** (crate-cards) | продуктовый каталог | dual-audience reassurance | **не давать иллюстрации вытеснять реальное фото** (у нас фото = доверие) |

**Сквозные выводы:**
- **Категория сошлась на одном рецепте [HIGH, web-evidence]:** cream/пастель-фон, дружелюбный sans, мягкий несатурированный цвет, реальная фотография детской радости как якорь доверия. Никто из сильных не падает в анти-паттерны. → Риск для нас не «скатиться в крик», а **недо-дифференциация**.
- **Зелёный+свет — свободная полоса [HIGH]:** зелёный — только у Lovevery (как нейтраль) и Polly; мотива «тёплый свет/фонарь/twinkle» — **ни у кого**. Это одновременно on-brand (любимое владельцем) и неоспорено.
- **Окно по арт-дирекшн [HIGH]:** прямые LA-конкуренты выглядят самодельно. Выигрыш = (а) владение палитрой зелёный+свет, (б) фото-арт-дирекшн выше уровнем, (в) характерный логотип с личностью (уверенность уровня Bob Baker, но «зелёный-и-свет», не «красный-и-винтаж»).
- **Нейтральность — путь наименьшего сопротивления [web-evidence]:** ни один эталон не использует фолк-кодирование; «нейтрально/универсально» — категорийная норма, а не компромисс.

---

## 5. Design direction(s) — 1 primary + 2 alternates

### ★ PRIMARY — «Lantern Light» (рекомендуется) [HIGH]
**Mood:** тёплая роща на рассвете — кремовая бумага, зелень разной глубины, тёплый огонёк фонарика. Спокойно-редакторское (Lovevery) + сказочно-рукотворное (гуашь).
**Палитра:** forest/grove/sage greens + cream/sand, **honey/lantern** как glow-акцент.
**Типографика:** Fraunces (display, SOFT-ось вверх для тепла) + Nunito (body).
**Иллюстрация:** гуашь + тёплая line-and-wash, только рамки/акценты; фото лидируют.
**Анти-паттерны, которых избегает:** «крик» — несатурированный цвет, мягкие выражения, sans без «толстого живота»; «холод» — кремовый фон, гуашь, реальные фото, тёплые тени; «славянское» — ноль фолк-кодов, мотивы универсальные (фонарь/звезда/занавес).
**Кому служит:** B2B — редакторское спокойствие, дисциплина, доверие; семьи — фонарик-wonder, добрые существа, тёплые фото.

### ALT B — «Lantern & Linen» (теплее, «вечерний/свечной») [MEDIUM]
**Mood:** уютный вечер историй при свече — льняной тёплый фон, зелень глубокая, **amber/honey почти как со-первичный**, терракота вторична.
**Палитра:** linen `#F5E8D2`, ink `#2A2318`, CTA green `#235A44`, accent amber `#E0922A`, terracotta text `#9A4A22`, deep `#1C3A30` (числа AA — §6).
**Типографика:** **Lora** (display, книжно/тёплый сериф) + **Plus Jakarta Sans** (body) — крен в B2B-доверие/«established».
**За:** максимально «kind tales like the old days», камерно, премиально.
**Риск [designer-judgment]:** amber-forward слегка уводит от лида «владелец любит зелёные»; «вечерний» mood может ощущаться менее свежо и менее «дневным-радостным» для дней рождения.

### ALT C — «Meadow Storybook» (светлее/воздушнее, дневной) [MEDIUM]
**Mood:** солнечный луг — почти белый зелёно-белый фон, **более яркая весенняя зелень**, мягкий coral + sky-blue как «дневные» акценты; больше игры/whimsy.
**Палитра:** meadow `#F4F8F0`, ink `#222A22`, CTA green `#2F7D55`, coral text `#B5532F`, gold `#F2B441`, sky link `#2D6E8E`, deep `#23402F` (числа AA — §6).
**Типографика:** **Bricolage Grotesque** (display, дружелюбный гротеск с «рукотворными» неровностями) + **Nunito** (body) — теплее/современнее, all-sans.
**За:** ярче и радостнее для семей/дней рождения, более «детски-волшебно».
**Риск [designer-judgment]:** крен в семейность чуть снижает B2B-гравитас; sky-blue уводит от чистой ownable-полосы «зелёный+свет».

> **Рекомендация:** взять **Primary «Lantern Light»** как ядро; держать B и C как «ручки настройки тона» (если владелец захочет теплее/камернее → сместить акцент к B; если ярче/дневнее для B2C → к C). Все три используют ОДНУ архитектуру токенов — переключение это смена значений, не пересборка системы.

---

## 6. Color palette & tokens (+ WCAG AA contrast table)

Палитра **Primary «Lantern Light»**. Имена токенов — английские (идентификаторы), мапятся на CSS-переменные и `tailwind.config` (см. §15).

### 6.1 Токены (роль → hex)

```css
:root {
  /* warm neutrals / surfaces */
  --color-bg:              #FBF6EC; /* page background (warm ivory) */
  --color-surface:         #FFFFFF; /* cards */
  --color-surface-sand:    #F2E8D5; /* secondary surface / dividers */
  --color-surface-mist:    #E4EFE6; /* green-tinted surface */
  --color-surface-peach:   #F7DCBE; /* warm accent surface */

  /* ink / text */
  --color-ink:             #26261F; /* body text (warm near-black) */
  --color-ink-muted:       #5C5648; /* secondary text (warm taupe) */
  --color-on-dark:         #FBF6EC; /* text on deep-green surfaces */

  /* greens (brand primary) */
  --color-forest:          #1E4D38; /* deepest: footer bg, strong headings */
  --color-grove:           #256A4A; /* PRIMARY: CTA bg, links, focus ring */
  --color-grove-hover:     #1C5239; /* CTA hover (darker) */
  --color-sage:            #3E8E6B; /* mid sage — LARGE headings/UI only */
  --color-mist:            #E4EFE6; /* alias of surface-mist */

  /* warm glow accent (the "light"/lantern thread) */
  --color-honey:           #E8A33D; /* glow accent; INK-text buttons only */
  --color-amber-ink:       #9A6512; /* accessible amber for TEXT on cream/white */
  --color-lantern:         #FFD27A; /* twinkle / glow highlight — DECORATIVE */

  /* semantic (warm-leaning) */
  --color-success:         #1F7A52;
  --color-warning:         #8A5A12; /* warning TEXT */
  --color-warning-surface: #FBEBCB;
  --color-error:           #B23A2B;
  --color-error-surface:   #FBE3DE;

  /* lines */
  --color-border-subtle:   #BFD8C7; /* DECORATIVE dividers only (not a sole boundary) */
  --color-border-strong:   #5E8A70; /* FUNCTIONAL border for inputs (passes 3:1) */
  --color-focus:           #256A4A; /* = grove */
}
```

### 6.2 Контраст-таблица (проверено детерминированно, WCAG 2.x)

Порог: **AA** = 4.5:1 (обычный текст) · **AA-large** = 3:1 (крупный ≥24px/≥18.66px bold) · **UI** = 3:1 (границы/иконки/фокус). **Все пары проходят свой порог.**

| Роль / пара | FG → BG | Ratio | Порог | ✓ |
|---|---|---:|---|---|
| Body на фоне | `ink` → `bg` | **14.13** | AA | ✓ |
| Body на карточке | `ink` → `surface` | **15.22** | AA | ✓ |
| Текст на sand | `ink` → `sand` | **12.53** | AA | ✓ |
| Текст на mist | `ink` → `mist` | **12.90** | AA | ✓ |
| Текст на peach | `ink` → `peach` | **11.55** | AA | ✓ |
| Вторичный текст на фоне | `ink-muted` → `bg` | **6.77** | AA | ✓ |
| Вторичный текст на карточке | `ink-muted` → `surface` | **7.29** | AA | ✓ |
| Зелёный заголовок на фоне | `forest` → `bg` | **8.97** | AA | ✓ |
| Ссылка/зелёный заголовок на фоне | `grove` → `bg` | **6.02** | AA | ✓ |
| Ссылка на карточке | `grove` → `surface` | **6.48** | AA | ✓ |
| **CTA: белый текст на зелёном** | `#FFF` → `grove` | **6.48** | AA | ✓ |
| CTA hover: белый на тёмно-зелёном | `#FFF` → `grove-hover` | **9.07** | AA | ✓ |
| Cream-текст на тёмно-зелёном футере | `on-dark` → `forest` | **8.97** | AA | ✓ |
| Белый текст на тёмно-зелёном футере | `#FFF` → `forest` | **9.66** | AA | ✓ |
| **Ink-текст на honey-кнопке** | `ink` → `honey` | **7.06** | AA | ✓ |
| Amber-текст на фоне | `amber-ink` → `bg` | **4.59** | AA | ✓ |
| Amber-текст на карточке | `amber-ink` → `surface` | **4.95** | AA | ✓ |
| Honey-акцент на тёмно-зелёном | `honey` → `forest` | **4.48** | AA-large | ✓ |
| Lantern-glow на тёмно-зелёном | `lantern` → `forest` | **6.79** | AA-large | ✓ |
| Sage как крупный заголовок/UI | `sage` → `bg` | **3.69** | AA-large | ✓ |
| Success-текст на фоне | `success` → `bg` | **4.92** | AA | ✓ |
| Success-текст на карточке | `success` → `surface` | **5.30** | AA | ✓ |
| Warning-текст на warning-фоне | `warning` → `warning-surface` | **5.02** | AA | ✓ |
| Warning-текст на фоне | `warning` → `bg` | **5.49** | AA | ✓ |
| Error-текст на фоне | `error` → `bg` | **5.52** | AA | ✓ |
| Error-текст на карточке | `error` → `surface` | **5.94** | AA | ✓ |
| Error-текст на error-фоне | `error` → `error-surface` | **4.85** | AA | ✓ |
| Фокус-кольцо на фоне | `focus` → `bg` | **6.02** | UI | ✓ |
| Фокус-кольцо на карточке | `focus` → `surface` | **6.48** | UI | ✓ |
| Граница инпута на фоне | `border-strong` → `bg` | **3.65** | UI | ✓ |
| Граница инпута на карточке | `border-strong` → `surface` | **3.93** | UI | ✓ |
| Зелёная иконка на mist | `grove` → `mist` | **5.49** | UI | ✓ |

**Правила использования (важно для AA) [HIGH]:**
- `honey` / `lantern` / `sage` (светлые/средние) — **НЕ для обычного текста на светлом**. Для amber-текста использовать `amber-ink`; для зелёных заголовков — `forest`/`grove`; `sage` — только крупный текст/UI.
- **На honey-кнопках текст — `ink`** (7.06:1), не зелёный и не белый.
- `border-subtle` (1.41:1) — **только декоративные разделители**, где поверхность сама несёт границу (WCAG 1.4.11 не требует 3:1 для не-несущей границы). Для **инпутов/функциональных границ** — `border-strong` (≥3:1).
- Тема — **светлая**. Тёмная не нужна на старте (фото-лед бренд, тёплый свет на кремовом — суть айдентики). Если позже захотят dark — собрать отдельным набором токенов и заново прогнать контраст.

### 6.3 Альтернативы (ключевые пары проверены)
**B «Lantern & Linen»:** body `ink#2A2318→linen#F5E8D2` 12.84 · CTA `#FFF→#235A44` 8.02 · heading `#1C4A38→linen` 8.32 · terracotta `#9A4A22→linen` 5.14 · ink на amber `#2A2318→#E0922A` 6.15 · cream на deep `#F5E8D2→#1C3A30` 10.23 — **все ✓ AA**.
**C «Meadow Storybook»:** body `#222A22→#F4F8F0` 13.73 · CTA `#FFF→#2F7D55` 5.02 · heading `#1F5C3E→meadow` 7.35 · coral `#B5532F→meadow` 4.60 · ink на gold `#222A22→#F2B441` 8.00 · sky-link `#2D6E8E→meadow` 5.23 · cream на deep `#F4F8F0→#23402F` 10.58 — **все ✓ AA**.

---

## 7. Typography & type-scale tokens (+ wordmark direction note)

**Источник: web-verified на fonts.google.com/metadata (OFL + variable).**

### 7.1 Гарнитуры
- **PRIMARY [HIGH, web-evidence]:** **Fraunces** (display/заголовки + голос персоны) + **Nunito** (body/UI/captions).
  - *Fraunces* — тёплый old-style сериф со сторибук-характером (ball terminals, лёгкий каллиграфический контраст), но читается как настоящий редакторский сериф (не «кричит»). Оси: `opsz 9–144`, `wght 100–900`, **`SOFT 0–100`**, `WONK 0–1`. **Тепло берём из `opsz`+`SOFT`, а не из жирности** — заголовки остаются мягкими и кредибельными для B2B.
  - *Nunito* — гуманистический sans с мягко скруглёнными терминалами: «kind», но с большой x-height и доказанной экранной читаемостью для длинных родительских и B2B-текстов (цены, политики). `wght 200–1000` variable.
- **ALT-1:** **Bricolage Grotesque** (display) + Nunito — теплее/современнее, all-sans (`opsz 12–96`, `wdth 75–100`, `wght 200–800`).
- **ALT-2:** **Lora** (display, `wght 400–700`) + **Plus Jakarta Sans** (body, `wght 200–800`) — крен в редакторское B2B-доверие.
- **ACCENT (очень дозированно):** **Caveat** (`wght 400–700` variable, OFL) — ≤1 короткая рукописная фраза на экран (подпись «Miss Lana», тэглайн про «свет»). **Никогда** для body/B2B-блоков. (Mali — НЕ variable и тайский-первичный → только запасной акцент.)

**Анти-паттерн (НЕ использовать для заголовков) [HIGH]:** **Fredoka, Baloo 2** — «большой круглый жирный» регистр = риск «кричащего kids-TV», подрывает B2B-доверие. **Caution:** Quicksand (низкая x-height, плох для чтения), Outfit (холодный геометрический, Latin-only, без италика).

### 7.2 Type-scale (1.250 major-third, база 16px) [HIGH, designer-judgment]

```css
:root {
  /* font families */
  --font-display: "Fraunces", ui-serif, Georgia, "Times New Roman", serif;
  --font-body:    "Nunito", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-accent:  "Caveat", "Segoe Script", cursive;

  /* sizes (rem) — wrap each heading in clamp() for fluid mobile→desktop */
  --text-caption:  0.80rem;  /* 12.8px */
  --text-small:    0.875rem; /* 14px   */
  --text-body:     1rem;     /* 16px   */
  --text-lead:     1.25rem;  /* 20px   */
  --text-h4:       1.563rem; /* 25px   */
  --text-h3:       1.953rem; /* 31px   */
  --text-h2:       2.441rem; /* 39px   */
  --text-h1:       3.052rem; /* 49px   */
  --text-display:  3.815rem; /* 61px — cap ~64–72px desktop, clamp down mobile */

  /* line-heights */
  --leading-display: 1.07;  --leading-h1: 1.1;  --leading-h2: 1.18;
  --leading-h3: 1.2;        --leading-h4: 1.3;  --leading-body: 1.6;
  --leading-lead: 1.55;     --leading-caption: 1.4;

  /* weights */
  --weight-display: 600; /* Fraunces — gentle; lift warmth via SOFT, NOT 800/900 */
  --weight-heading: 600;
  --weight-body: 400;     --weight-emphasis: 600;   --weight-label: 700;

  /* tracking */
  --tracking-display: -0.015em;  --tracking-body: 0em;  --tracking-label: 0.04em; /* all-caps only */
}
```
- **Fluid:** оборачивать каждый заголовок в `clamp()` — мобайл ~1.2-ratio, десктоп полный 1.25.
- **Перформанс [HIGH]:** self-host оба как **variable woff2** через `next/font` (App Router), subset `latin + latin-ext`, выбросить неиспользуемые оси/скрипты (WONK, Cyrillic), `font-display: swap`, preload двух семейств, метрик-оверрайды (`size-adjust`/`ascent-override`) → CLS≈0. Один variable-файл на семейство вместо 6–8 статичных весов.

### 7.3 Wordmark direction note (НЕ финал — TM pending) [designer-judgment]
- **Направление, не знак.** Целевой характер — **уверенный логотип с личностью** (урок Bob Baker), но «зелёный-и-свет», не «красный-и-винтаж». Generic-sans вордмарк (как у LA-конкурентов) — упущенная дифференциация.
- Возможная отправная точка: кастомный/настроенный **Fraunces**-логотип (мягкая `SOFT`-ось) со словами «Miss Lana's» рукописным грейс-нотом (Caveat-подобный) и «Fairy-Tale Theater» спокойным сетом; тихая **glyph-нить фонарика/огонька** рядом (точка над «i», апостроф-как-искорка). 
- **Стоп:** не финализировать, не печатать, не заказывать финальную отрисовку до trademark-clearance (`BRAND.md`). Держать в редактируемом виде.

---

## 8. Spacing / radius / elevation tokens [designer-judgment, MEDIUM]

Мягко, дружелюбно, округло — но дисциплинированно (воздух = доверие B2B, Lovevery).

```css
:root {
  /* SPACING — 4px base, 8px rhythm */
  --space-0: 0; --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem; --space-5: 1.5rem; --space-6: 2rem; --space-7: 3rem;
  --space-8: 4rem; --space-9: 6rem; --space-10: 8rem;
  /* щедрые секционные отступы: desktop 96–128px (space-9/10), mobile 48–64px */

  /* RADIUS — soft & rounded, not pill-everywhere */
  --radius-xs: 6px;   /* chips, tags */
  --radius-sm: 10px;  /* inputs, small controls */
  --radius-md: 14px;  /* buttons (secondary), small cards */
  --radius-lg: 20px;  /* cards, media frames */
  --radius-xl: 28px;  /* hero panels, feature blocks */
  --radius-pill: 9999px; /* primary CTA, badges */

  /* ELEVATION — warm-tinted, low-opacity, large soft blur (не серый «материал») */
  --shadow-sm:  0 1px 2px rgba(38,38,31,0.06), 0 1px 3px rgba(38,38,31,0.05);
  --shadow-md:  0 4px 12px rgba(38,38,31,0.08), 0 2px 4px rgba(38,38,31,0.05);
  --shadow-lg:  0 12px 28px rgba(30,77,56,0.12), 0 4px 10px rgba(38,38,31,0.06);
  /* signature warm "lantern glow" — DECORATIVE only, motion-safe */
  --shadow-glow: 0 0 0 rgba(232,163,61,0), 0 8px 40px rgba(232,163,61,0.28);
}
```
- **Радиусы:** CTA — `pill`; карточки/фото-рамки — `lg`; герой-панели — `xl`; инпуты — `sm`. Скругление сигналит доброту, но не «пузырь».
- **Тени тёплые:** база — тёплый near-black `rgba(38,38,31,…)`; крупная тень с лёгким зелёным подтоном (`rgba(30,77,56,…)`). **`--shadow-glow`** — фирменный тёплый ореол вокруг hero-фото/CTA (honey), только декоративно и под `motion-safe`/hover.

---

## 9. Iconography & illustration style (incl. Miss Lana character) [HIGH; web-evidence для иконок]

### 9.1 Иллюстрация
**Стиль:** текстурная **гуашь** + тёплая **line-and-wash** (линия-и-заливка). Линия — **тёплая коричневая**, не чёрная; средний вес ~1.5–2px с лёгким сужением; низкоопаковый grain; мягкие, местами открытые края; одна тональная подсветка «из-за кадра» (фонарь). Премиально для B2B, волшебно для семей; избегает плоского vector-SaaS и высоко-сатурированного мультика.
**Цветовая дисциплина:** тёплые жёлто-зелёные (sage/moss/forest, **без сине-зелёных**), кремовая бумага, **один amber-glow как самое яркое значение**. Текст в иллюстрациях — `forest`/`ink` (AA); amber и светлая зелень — **декоративно**.

### 9.2 Мотив-кит (один стиль)
Фонарь (hero + CTA) · мягкий glow-ореол · скруглённая 4-конечная звезда (twinkle) · театральный занавес + просцениум-арка (буквальный театральный код И рамка для фото) · добрые мягкие существа (лиса/сова/ёжик) для **& Friends** — **спокойные глаза, закрытые/мягко-приоткрытые рты**.
**Guardrails:** одна толщина линии, один grain, одна палитра (text-safe vs decorative-only), **одно направление света** (из-за кадра), reference-библиотека; всё **редактируемо до TM-clearance**.

### 9.3 Иконки [HIGH, web-evidence]
- **Pick: Phosphor** (MIT, ~1248 икон, 6 весов, скруглённые caps — самый тёплый/округлый). **Regular** для UI/нав; **Duotone** (amber/green) — для «delight». Макс **2 веса на экран**. Сетка **24px** (16/20/24/32/48).
- **Избегать Heroicons** (корпоративный). **Lucide** — только для тонкого «chrome» при `strokeWidth ~1.5–1.75`.

### 9.4 Miss Lana — character DIRECTION (НЕ финал, TM pending) [designer-judgment]
Тёплый **хост/рассказчик** от первого лица. Скруглённый силуэт, читаемый в размере favicon. **Добрая полуулыбка, закрытый/мягко-приоткрытый рот, спокойные добрые глаза — НИКОГДА широко-открытый орущий рот** (анти-паттерн #1). Возраст-нейтральный гардероб рассказчика в sage/moss-зелёном, опц. шаль со звёздами. **Сигнатурный реквизит: маленький тёплый фонарь с тихим ореолом** (glow = имя = свет). **Ноль славянского кодирования** (никаких матрёшек, кокошников, фолк-орнамента, кириллицы, куполов). Тот же стиль гуашь+линия. На «О нас» — пара к реальной труппе (Miss Lana — лицо, 4 артиста — команда «за» ней).

---

## 10. Imagery treatment guidelines [HIGH; web-evidence + designer-judgment]

Реальные фото/видео шоу — **главный контент и доверие**.
- **Иерархия:** фото занимают **самые крупные, высоко-контрастные слоты**; иллюстрация **никогда не перекрывает лицо**. Иллюстрация — мягкий просцениум/скруглённые рамки (`radius-lg`), разделители (занавес-свэги, нити фонариков, россыпь звёзд), углы, delight у CTA, существо, «выглядывающее» из-за края.
- **Единый свет:** все фото грейдить к **одному тёплому «фонарному» свету** (тёплая температура, мягкие тени, лёгкий подъём midtones) → единая атмосфера, даже если исходники разные. Опц. тонкий `--shadow-glow` (honey) или мягкий зелёный halo за hero-фото.
- **Композиция:** сначала ставим иллюстрацию-рамку, потом фото; иллюстрация **легче по весу**, один регистр на экран.
- **Фрейминг:** редакторский (Tonies — тёплый мягкий свет; Polly — candid детская радость), **НЕ scrapbook/прищепки** (так обгоняем самодельность LA-конкурентов).
- **Видео:** hero-видео — **autoplay MUTED + кнопка паузы**, не анимировать как LCP (§11). Постеры-кадры в той же грейд-палитре.
- **Перформанс:** `next/image`, отдавать AVIF/WebP, правильные `sizes`, фиксированный aspect-ratio контейнер (защита CLS), lazy ниже первого экрана, hero — `priority`.
- **Do-not:** не смешивать два стиля иллюстрации/два регистра на экране; не «занятость»; не заменять иллюстрацией доверие-фото; не overlay на лица.

---

## 11. Motion / animation direction & tokens (reduced-motion + performance) [HIGH, web-evidence]

**Принцип:** мягкое «дыхание», не гиперактив. Мотив «свет» (Svitlana) = **медленный low-amplitude float + тихий twinkle** как фоновое тепло, не «буря частиц».

### 11.1 Motion-токены
```css
:root {
  --dur-instant: 100ms;  --dur-fast: 200ms;  --dur-base: 320ms;
  --dur-slow: 480ms;     --dur-ambient: 640ms;  /* + ambient loops 4000–7000ms */
  --ease-standard:      cubic-bezier(0.2, 0, 0, 1);
  --ease-decelerate:    cubic-bezier(0.05, 0.7, 0.1, 1); /* enter/reveal — gentlest */
  --ease-accelerate:    cubic-bezier(0.3, 0, 1, 1);       /* exit */
  --ease-gentle-spring: cubic-bezier(0.34, 1.2, 0.64, 1); /* soft settle — overshoot dialed WAY down, NOT a bounce */
}
```
Зеркалить в `tailwind.config` → `theme.extend.transitionDuration` / `transitionTimingFunction` (семантические классы, не «магические числа»).

### 11.2 Одобренные интеракции (property → токен) — **только `transform`/`opacity`/`filter`/`color`**
- **Hover/focus (кнопки/карточки):** `translateY(-2px)` + box-shadow/`filter:brightness` → `--dur-fast` + `--ease-gentle-spring`.
- **Press/active:** `scale(0.97)` → `--dur-instant`.
- **Ссылка/текст hover:** `color` + `opacity` → `--dur-fast`.
- **Scroll-reveal (ниже первого экрана):** `opacity 0→1` + `translateY(16px→0)` → `--dur-slow` + `--ease-decelerate`, **one-shot** (unobserve после). Элемент всегда в потоке (`opacity:0`, НЕ `display:none`/`height`) → нулевой CLS. Дистанция малая (12–24px).
- **Section/page transition:** `opacity` cross-fade → `--dur-base`.
- **Lightbox фото:** `opacity` + `scale(0.98→1)` → `--dur-base` + `--ease-decelerate`.
- **Ambient «фонарь»:** `translateY(0→-6px→0)` loop **5–7s** ease-in-out (едва заметное дыхание).
- **Twinkle (1–3 звезды):** `opacity 0.6→1→0.6` + `scale 1→1.06`, **staggered, 3–5s, НЕ синхронно** (синхрон = механично).

### 11.3 Reduced-motion + перформанс (жёстко)
- **No-motion-first архитектура [HIGH]:** дефолт — статичная финальная вёрстка; **каждую** анимацию/переход — внутрь `@media (prefers-reduced-motion: no-preference)` (Tailwind `motion-safe:`). Это безопаснее «reduce-to-disable»: старые браузеры и reduced-motion-юзеры по умолчанию получают рабочую статику.
- **Backstop:** глобальный гард `@media (prefers-reduced-motion: reduce){ *,*::before,*::after{ animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important } }`.
- **Reduced ≠ ноль фидбэка:** убираем движение/scale/parallax/twinkle/float; **оставляем** `opacity`-кросс-фейды/цвет/highlight-fade (W3C C39). Любой loop < 5s изменения + пауза (WCAG 2.2.2).
- **CWV-бюджет [HIGH]:** анимировать **только** compositor-only `transform`/`opacity` (+ `filter` дозированно). **НИКОГДА** `width/height/top/left/margin/padding/font-size`, **никогда `transition: all`** (тихо анимирует layout → главный источник CLS). `will-change` только на активном элементе, снимать после.
- **LCP неприкосновенен [HIGH]:** hero-фото/видео/H1 рендерятся в финальной позиции сразу — **без** fade/reveal/slide. Reveal — только ниже первого экрана. Ambient float/twinkle стартует **после** LCP.
- **Реализация reveal:** нативный `animation-timeline: view()` за `@supports` (off-main-thread) + статичный фолбэк; ИЛИ маленький **IntersectionObserver** (`rootMargin '0px 0px -10% 0px'`, threshold ~0.15), добавляющий `.is-visible` один раз. **Без** JS scroll-листенеров и тяжёлых либ (GSAP/AOS/Lottie/большой Framer-Motion) для того, что делает CSS+IO.
- **Stagger:** дети грид-reveal по 60–90ms, последний ≤~400ms.
- **Do-not:** parallax сверх шёпота, scroll-jacking, autoplay-звук, «bounce большого рта», overshoot >~1.2, confetti/частицы, спиннеры/вихри, неоновый пульс, ре-триггер reveal при скролле назад.

---

## 12. Component styling notes (привязка к токенам) [designer-judgment, MEDIUM–HIGH]

### Primary CTA — «Book Miss Lana»
- BG `--color-grove`, текст `#FFF` (6.48:1 ✓), `--radius-pill`, padding `--space-3 --space-5`, `--font-body` weight 700.
- Hover: BG `--color-grove-hover` (9.07:1 ✓) + `translateY(-2px)` + `--shadow-md`, `--dur-fast` `--ease-gentle-spring`. Active: `scale(0.97)`.
- Focus: `outline: 3px solid --color-focus; outline-offset: 2px` (6.02/6.48:1 ✓) — **видимый фокус всегда**.
- **Honey-вариант** (вторичный «delight»-CTA, напр. Birthdays): BG `--color-honey`, текст `--color-ink` (7.06:1 ✓), опц. `--shadow-glow` на hover.
- Цель тапа **≥44×44px**. Иконка-фонарь (Phosphor Duotone) опц. слева.

### Booking form (критичная конверсия — её сейчас нет)
- Поля: name, phone/email, тип (сад/школа/день рождения/праздник), дата/время, город/адрес, число детей, шоу (опц.), коммент (см. `03_SITEMAP_AND_SCOPE.md`).
- Инпуты: BG `--color-surface`, граница `--color-border-strong` (3.65/3.93:1 ✓), `--radius-sm`, текст `--color-ink`. **Всегда видимый `<label>`** (не только placeholder). Focus — 3px `--color-focus` ring + offset.
- Валидация: error-текст `--color-error` (5.52:1 ✓) на `--color-error-surface`, иконка + текст (не только цвет). Success — `--color-success`. `aria-describedby`, `aria-invalid`, `aria-live` для ошибок.
- Тёплый, приглашающий: мягкие радиусы, щедрый `--space`, дружелюбный микрокопирайт от Miss Lana, подтверждение на экране. Не «холодная анкета».

### Show cards (репертуар, 8 шоу)
- `--color-surface`, `--radius-lg`, `--shadow-sm` → hover `--shadow-md` + `translateY(-2px)`. Фото шоу сверху (фикс. aspect-ratio, CLS-safe), заголовок `--font-display` `--color-forest`, мета (возраст/длит.) `--color-ink-muted`, CTA-ссылка `--color-grove`.
- Опц. иллюстрированная просцениум-рамка/уголок (легче по весу, не на лицо). Per-line тинт — §13.

### Navigation
- BG `--color-bg`/`--color-surface`, прозрачная на hero → solidify при скролле (только `opacity`/`background`, без сдвигов). Лого слева, 4 линии + «Book» CTA справа.
- Линки `--color-ink` → hover `--color-grove`; активный — подчёркивание `--color-grove` (мазок-стиль). Мобайл — крупная доступная off-canvas, фокус-trap, `aria-expanded`. Sticky-CTA «Book Miss Lana» на мобайле.

---

## 13. Cross-section consistency (4 service lines) [designer-judgment, MEDIUM]

**ОДНА система** на весь сайт (один набор токенов, одни шрифты, один стиль иллюстрации/иконок, один motion). Различие линий — **только тонкий пер-секционный акцент** (цвет/мотив/`SOFT`-ось Fraunces), НЕ смена гарнитур и не отдельные «темы». Связность — это то, чего не хватает Puppet Theater on Wheels (быстрый кредибилити-вин для B2B).

| Линия | Акцент (поверх общей системы) | Mood-нюанс |
|---|---|---|
| **Fairy-Tale Theater** (флагман) | `grove` + `lantern`-twinkle, Fraunces `SOFT` чуть выше | сказочно-волшебный якорь бренда |
| **Birthday Parties** (B2C) | `honey`/`peach` теплее, чуть больше delight-акцентов | праздничный, тёплый, радостный |
| **School Shows** (B2B) | `forest`/`sage` сдержаннее, Fraunces `SOFT` ниже, меньше декора | солидный, «assembly-ready», доверие |
| **& Friends** (персонажи) | `sage` + добрые существа из мотив-кита | дружелюбно-игривый, но не зашумлённый |

Правило: акцент = смена 1–2 токенов и плотности декора, **не** новой палитры. Так бренд читается единым, а директор сада и родитель видят одно профессиональное лицо.

---

## 14. Accessibility baseline (WCAG 2.1/2.2 AA) [HIGH]

- **Контраст:** все ключевые пары текста/UI проверены и проходят AA — таблица §6.2 (≥4.5 текст, ≥3 крупный/UI). Декоративные `honey/lantern/sage` ограничены не-текстовыми ролями.
- **Фокус:** видимый фокус на всех интерактивных элементах — 3px `--color-focus` ring + `outline-offset:2px` (6.02/6.48:1 ✓). Логичный порядок табуляции; `:focus-visible`.
- **Reduced motion:** no-motion-first + `prefers-reduced-motion` (§11.3); loops < 5s + пауза (WCAG 2.2.2).
- **Читаемость:** body ≥16px, line-height 1.6, измеримая длина строки ~60–75ch; не полагаться только на цвет (иконка+текст в статусах/ссылках).
- **Таргеты:** интерактив ≥44×44px (WCAG 2.5.8). Формы — видимые `<label>`, описания ошибок, `aria-live`.
- **Семантика:** корректная структура заголовков (h1→h6), landmark-роли, alt у фото шоу, подписи/треки у видео, `lang="en"` (опц. `hreflang en/uk` позже).
- **Контент-движение:** видео — muted autoplay + pause; никаких мигающих эффектов (>3 вспышек/с запрещены).

---

## 15. Implementation-readiness notes (Tailwind / CSS-vars) + next TUNG v2

**Это спека.** Ниже — как она ляжет в код (НЕ реализовано здесь).

### 15.1 Маппинг на Tailwind
- Объявить все токены §6–8, 11 как **CSS custom properties** в `globals.css` (`:root`).
- В `tailwind.config.ts` → `theme.extend`: `colors` ссылаются на vars (`grove: 'var(--color-grove)'`, …), `fontFamily` (`display`/`body`/`accent`), `fontSize` (с line-height из scale §7.2), `borderRadius`, `boxShadow`, `transitionDuration`, `transitionTimingFunction`, `spacing` (при необходимости расширить).
- **Шрифты:** `next/font/google` (или local) для Fraunces+Nunito как variable, subset latin+latin-ext, `display:swap`, метрик-оверрайды; CSS-переменные шрифтов в `<html>`.
- **Motion:** утилиты через `motion-safe:`/`motion-reduce:`; reveal — IntersectionObserver-хук или `@supports (animation-timeline: view())`.
- **Темизация линий (§13):** пер-секционные акценты через data-атрибут/класс на секции, переопределяющий 1–2 vars — без дублирования системы.

### 15.2 Рекомендуемая следующая задача — **TUNG v2 (BUILD)**
> **`HERMES_DESIGN_SYSTEM_IMPLEMENTATION_002`** (`task_mode: build`): реализовать токены этого отчёта в кодовой базе Next.js + Tailwind. Объём: (1) CSS-vars + `tailwind.config` из §6–8/§11; (2) подключение Fraunces+Nunito через `next/font` (variable, subset, метрик-оверрайды, preload); (3) базовые примитивы (Button/CTA, Input/Form-field, Card, Nav) на токенах; (4) motion-утилиты + reduced-motion + IntersectionObserver-reveal; (5) гейт: Lighthouse/PageSpeed CLS≈0, axe/контраст-аудит = 0 нарушений AA, проверка с OS «reduce motion». **Гейтить дизайн-выбор на одобрении владельцем (Primary vs B/C).** **Не включать лого/печать** до trademark-clearance.

---

## 16. Risks / do-not

- **СПЕКА, НЕ КОД.** Не реализовывать сайт/конфиг/компоненты в этой задаче.
- **Лого/вордмарк — только направление.** Не финализировать, не печатать, не заказывать финальную отрисовку до **trademark-clearance** (`BRAND.md`).
- **Ноль славянского/русского/украинского кодирования** — наследие тихий бэкстори; мотивы универсальные (фонарь/звезда/занавес), не фолк.
- **Не оба анти-паттерна:** не «большие открытые рты» (без Fredoka/Baloo, без пере-сатурации, без орущих выражений); не «холодный шаблон» (кремовый фон, гуашь, реальные фото, тёплые тени).
- **Недо-дифференциация — главный реальный риск:** «тёплый-пастель-sans» уже стандарт категории. Держать преимущество на *зелёный+свет + фото-арт-дирекшн выше конкурентов + характерный логотип*.
- **Не выдавать тренд за обязательное:** timeless-теплота важнее моды.
- **Контраст не на глаз:** любую новую пару прогонять через реальный расчёт перед заявлением о доступности.
- **CWV не нарушать:** никаких layout-анимаций, `transition: all`, анимации LCP, тяжёлых motion-либ — локальное SEO зависит от CWV.

---

## 17. Evidence gaps

- **Color/accessibility research-агент не завершился** (зациклился на StructuredOutput). **Митигировано:** палитра и **весь контраст посчитаны автором детерминированно** (§6.2) — это сильнее, чем оценка агентом; цветовые best-practices частично покрыты выводами competitor- и illustration-агентов. Риск низкий.
- **Реальные фото/видео владельца ещё не получены** — грейд/фрейминг (§10) задан как guidelines; финальная палитра-грейда уточнится на реальных ассетах.
- **Live-рендер конкурентов** снят агентом текстово (не скриншоты в этом отчёте) — наблюдения по цвету/типу — добросовестное чтение, не пиксель-замер.
- **Шрифты:** оси/лицензии web-verified на Google Fonts metadata; **точные размеры payload** (KB после subset) подтвердятся на сборке (v2).
- **Вордмарк/Miss Lana** — только направление; финал гейтится на TM-clearance.
- **Dark-тема** не специфицирована (по решению — не нужна на старте); при необходимости — отдельный прогон контраста.

---

## 18. Sources used

**Competitor / эталоны (live-verified):** pollybilly.com · bobbakermarionettetheater.com · puppettheateronwheels.com · lovevery.com · us.tonies.com · sagomini.com · kiwico.com · voyagela.com (Puppet Theater on Wheels интервью).
**Типографика:** fonts.google.com/metadata — Fraunces, Nunito, Bricolage Grotesque, Lora, Plus Jakarta Sans, Caveat, Mali, Fredoka, Baloo 2, Quicksand, Outfit, Source Serif 4, Source Sans 3.
**Motion / перформанс:** m1.material.io & m3.material.io (motion tokens) · web.dev/articles/css-web-vitals · corewebvitals.io (scroll-triggered CLS) · tatianamac.com/prefers-reduced-motion · MDN prefers-reduced-motion & IntersectionObserver · w3.org WCAG21 C39 · css-tricks.com scroll-driven-animations.
**Иллюстрация / иконки:** lumonovastudio (childrens-book styles) · smashingmagazine (brand illustration systems) · pkgpulse (Lucide vs Heroicons vs Phosphor) · github.com/phosphor-icons · designshack & graphiceagle (mixing photo+illustration) · wiseowlmarketing & inclusivecolors (accessible color) · indieradar & mascots.com (mascot/persona).
**Внутренние:** `docs/core/BRAND.md`, `02_POSITIONING_AND_TONE.md`, `01_CONTENT_INVENTORY.md`, `03_SITEMAP_AND_SCOPE.md`, `PROJECT_BRIEF.md`; `HermesResearch/reports/2026-06-21-la-kids-puppet-theater-competitor-research.md`.

---

## 19. Final verification summary (mandatory closure)

- **Step 1 — Scope:** ✅ Только ресёрч/спека. Код/конфиг/компоненты НЕ написаны; сайт не тронут; лого НЕ финализирован (только направление). Рекомендована отдельная TUNG v2 (§15.2). Non-goals не нарушены.
- **Step 2 — Evidence:** ✅ Контраст проверен детерминированно с ratio для **всех** ключевых пар (§6.2, все ✓ AA). Уверенность HIGH/MEDIUM/LOW проставлена; `web-evidence` отделено от `designer-judgment`. ≥5 эталонов аудировано (7 сайтов + 13 шрифтов).
- **Step 3 — Design review:** ✅ Направление чтит **тёплое + зелёное + свет/glow**; избегает обоих анти-паттернов и любого славянского кодирования; служит И B2B (редакторское спокойствие/доверие), И семьям (сказочная гуашь/фонарик).
- **Step 4 — File:** ✅ Отчёт создан, date-prefixed, читаем (проверка ниже).
- **Step 5 — Closure:** **Spec (готово к одобрению):** Primary «Lantern Light» + 2 альтернативы; токены color (AA-verified) / type / spacing / radius / elevation / motion; иллюстрация+иконки+Miss Lana direction; imagery; компоненты; кросс-секционная связность; a11y baseline. **To-build (v2):** реализация токенов в Next.js+Tailwind. **Gated:** финал лого/печать — после trademark-clearance.

*Конец отчёта. Report-only. Реализация — каноническая TUNG v2 (§15.2); финализация визуальной идентики гейтится на TM-clearance.*
