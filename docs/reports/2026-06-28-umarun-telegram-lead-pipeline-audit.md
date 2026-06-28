# Аудит Umarun: MongoDB + Telegram lead pipeline → применимость для Miss Lana's Fairy-Tale Theatre

- **TUNG:** `AUDIT_UMARUN_TELEGRAM_LEAD_PIPELINE_FOR_MISS_LANA_001` (hermes-tung-lite-1.0)
- **Режим:** audit · technical-research · **READ-ONLY** (код не менялся)
- **Дата:** 2026-06-28
- **Автор:** агент (Claude Opus 4.8, 1M)
- **Язык отчёта:** русский (по требованию задачи)

> **Условные обозначения уверенности и природы доказательства.**
> Каждый ключевой вывод помечен: **HIGH / MEDIUM / LOW**.
> Источник: **[CURRENT CODE]** — текущий код рабочего дерева (главное
> доказательство); **[HISTORICAL]** — git-история / прошлые коммиты;
> **[DOCUMENTED]** — заявление в документации/отчёте; **[INFERENCE]** — вывод
> из анализа, не прямое наблюдение.
>
> **PII / секреты:** в этом отчёте нет ни одного реального токена, chat id,
> MongoDB URI, пароля или email клиента. Все ссылки на секреты — только по имени
> переменной. `.env`/`.env.local` обоих проектов не читались.

---

## 1. Executive summary

**Главный вывод (HIGH).** В Umarun заявка из waiting-list сохраняется
**постоянно во внешней MongoDB Atlas** (`db "umarun"`, collection `waitlist`),
и **именно успешный upsert в Mongo является единственным условием success
state**. Telegram — это **строго fire-and-forget уведомление**: его сбой
никогда не валит signup и не влияет на success/failure. Это «правильная»
архитектура: durable storage отделён от оперативного канала оповещения.
Источник: [`src/lib/db.ts`](#), [`src/lib/notify.ts`](#),
[`src/app/waiting-list/actions.ts`](#).

**Неожиданный, но решающий вывод для решения (HIGH).** **Miss Lana НЕ нужно
копировать Umarun.** Текущая lead pipeline Miss Lana
([`app/api/lead/route.ts`](../../app/api/lead/route.ts),
[`lib/notify.ts`](../../lib/notify.ts), [`lib/leads.ts`](../../lib/leads.ts))
**архитектурно зрелее** Umarun: у неё уже есть server-side validation,
honeypot, rate-limit, нормализация, inquiry id, разделение «accepted» от
доставки провайдеров, проверка HTTP-ответа webhook и timeouts. Umarun же — это
форма с **одним полем email**.

**Единственное место, где Umarun объективно сильнее Miss Lana (HIGH).** У
Umarun durable storage — это **внешняя БД (MongoDB Atlas)**, переживающая
любой serverless-цикл. У Miss Lana durable storage по умолчанию — **локальный
каталог `.leads/` на файловой системе** ([`lib/env.ts:65`](../../lib/env.ts),
[`lib/notify.ts:42-78`](../../lib/notify.ts)), что **на Vercel/serverless
ненадёжно** (эфемерная ФС, нет общего тома между инстансами). Сам код Miss Lana
это честно признаёт и предлагает email-webhook как «acceptance signal of last
resort», но **email-webhook ещё не сконфигурирован в проде** (launch gate,
[`IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001.md`](./IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001.md)).

**Что реально стоит перенести из Umarun в Miss Lana — это не Telegram, а
паттерн внешнего durable store (MongoDB Atlas) на месте `.leads/`.** Telegram у
Miss Lana уже реализован и уже корректно подчинён (secondary, с проверкой
HTTP-ответа и timeout). Перенос «как в Umarun» означает: добавить
`persist()`-адаптер в внешнюю БД, чтобы `accepted` опирался на запись, которая
переживает serverless. Это закрывает риск «потери заявки за $350+».

**Главный риск, если ничего не делать (HIGH).** На serverless-хосте без
настроенного email-webhook валидная заявка может попасть только в эфемерный
`.leads/` и **не сохраниться надёжно**, хотя пользователь увидит «accepted».
Это и есть запрещённый сценарий «ложный success + потеря заявки». Сейчас он
сдержан только тем, что (а) код пытается также писать в `tmpdir`, (б) при
полном провале возвращает честный 502. Но `tmpdir` на serverless тоже
эфемерен — это **не** durable. (MEDIUM по фактическому риску потери: зависит от
хостинга, который сейчас в проде не подтверждён.)

---

## 2. Scope, repositories and inspected revision

| Репозиторий | Путь | Git-корень | Ветка | HEAD (1 строка) | Состояние рабочего дерева |
|---|---|---|---|---|---|
| **Umarun** (источник) | `/home/tureckiy/Projects/umarun` | `.git` живёт в **`/web`** | `main` | `349171c D2: remove dead Telegram social link (footer + JSON-LD sameAs)` | uncommitted: `src/lib/db.ts` (staged), плюс новые отчёты/runbook (D3/D4) |
| **Miss Lana** (цель) | `/home/tureckiy/Projects/Fairy-Tale-Theater` | корень репо | `chore/tung-prelaunch-pipeline-ordering` | `9e210bd feat(miss-lana): prelaunch pipeline tasks 06–08…` | большой набор изменений прелонча (см. git status) |

**Важно про revision Umarun (HIGH).** Главным доказательством взят **текущий
код рабочего дерева** (`src/lib/db.ts` в его актуальном виде с уже применённым
D3-фиксом self-heal кэша). `git diff src/lib/db.ts` пуст → файл застейджен, и
прочитанное мной содержимое = текущая истина. Историю (commit
`e8afb6e P1_T6: waiting-list form (Mongo + Telegram) + privacy page`,
`a093d94`) использую только как **подтверждающее** доказательство, не как
первичное.

**Метод.** Только read-only: `git status/branch/log/show/diff`, `rg`, `find`,
`Read`. Никаких записей, миграций, отправок в Telegram/Mongo, чтения реальных
`.env`. Прочитан только `.env.example` (placeholder-шаблон) обоих проектов.

**Покрытие источников (минимум по задаче — выполнено).** Прямых источников
прочитано ≥ 8: Umarun `db.ts`, `notify.ts`, `actions.ts`, `page.tsx`,
`.env.example`, `package.json`, `RUNBOOK.md`, `P1_T6_WAITLIST_REPORT.md`,
`D3_…REPORT.md`; Miss Lana `route.ts`, `notify.ts`, `leads.ts`, `env.ts`,
`.env.example`, `LeadForm.tsx`, `lead-api.spec.ts`, `leads.test.ts`,
`notify.test.ts`, `LEAD_PIPELINE_RUNBOOK.md`,
`IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001.md`.

---

## 3. Umarun architecture diagram

```
Посетитель → <form action={joinWaitlist}> (React 19 server action, работает без JS)
                     │
                     ▼
          joinWaitlist(formData)        [src/app/waiting-list/actions.ts]
                     │
   ┌─────────────────┼──────────────────────────────────────────────┐
   │ 1. HONEYPOT     │  поле "company" заполнено? → redirect ?submitted=ok
   │                 │  (ничего не пишем — тихий fake success боту)
   │ 2. VALIDATE     │  email trim+lowercase, ≤254, regex → иначе ?submitted=invalid
   │ 3. PERSIST      │  getWaitlistCollection().updateOne(
   │   (DURABLE)     │     {email}, {$setOnInsert:{email,createdAt,source:"site"}}, {upsert:true})
   │                 │     ── успех? stored=true ; иначе catch → log(message), НЕ email
   │                 │  если !stored → redirect ?submitted=error   ← ЕДИНСТВЕННЫЙ источник провала
   │ 4. NOTIFY       │  try { total=countDocuments(); notifyTelegram(email,total) }
   │   (fire&forget) │  catch → log; сбой Telegram НЕ влияет на success
   │ 5. SUCCESS      │  redirect ?submitted=ok
   └─────────────────┴──────────────────────────────────────────────┘
                     │
        ┌────────────┴───────────────┐
        ▼                            ▼
  MongoDB Atlas (DURABLE)      Telegram Bot (NOTIFY-ONLY)
  db "umarun".waitlist         api.telegram.org/bot<token>/sendMessage
  doc: {email,createdAt,source}  → личный чат / группа maker'а
  unique index {email:1}         3s AbortController timeout
  client кэшируется на globalThis
  (serverless reuse + self-heal)
```

**Семантика порядка (HIGH):** honeypot → validate → **DB write/upsert (durable)**
→ **Telegram notify (fire-and-forget)** → redirect. Это в точности порядок,
который требовалось установить.

---

## 4. Exact request lifecycle (Umarun)

Дословно по [`actions.ts`](#) `joinWaitlist(formData)`:

1. **Honeypot** (`actions.ts:28-31`): `formData.get("company")`; если непустое →
   `redirect("/waiting-list?submitted=ok")`, **ничего не сохраняется** —
   тихий fake-success для бота. **[CURRENT CODE, HIGH]**
2. **Validate** (`actions.ts:33-37`): `email = raw.trim().toLowerCase()`;
   проверка `!email || length>254 || !EMAIL_RE.test`. Невалидно →
   `redirect("…?submitted=invalid")`. Regex — одна разрешающая
   `^[^\s@]+@[^\s@]+\.[^\s@]+$` (намеренно без библиотеки). **[CURRENT CODE, HIGH]**
3. **Persist / upsert** (`actions.ts:39-51`): `getWaitlistCollection()` →
   `updateOne({email}, {$setOnInsert:{email, createdAt:new Date(), source:"site"}}, {upsert:true})`.
   Успех → `stored=true`. **Любая** ошибка ловится `catch`, логируется
   **только** `(error).message` (никогда сам email), `stored` остаётся `false`.
   **[CURRENT CODE, HIGH]**
4. **Решение об отказе** (`actions.ts:53-55`): `if (!stored) redirect("…?submitted=error")`.
   → **success state определяется исключительно успешной записью в Mongo.**
   **[CURRENT CODE, HIGH]**
5. **Notify** (`actions.ts:57-64`): отдельный `try` — снова берёт коллекцию,
   `countDocuments()`, `notifyTelegram(email, total)`. Любой сбой —
   `catch → console.error(message)`, **не** меняет исход. **[CURRENT CODE, HIGH]**
6. **Success** (`actions.ts:66`): `redirect("/waiting-list?submitted=ok")`.

> Тонкость, которую авторы вынесли в комментарий и которая подтверждается кодом:
> `redirect()` в Next работает **через throw**, поэтому каждый `redirect()`
> вызывается **вне** `try/catch` — иначе catch-all проглотил бы его.
> Подтверждено структурой: `redirect` стоит после `catch`-блоков. **[CURRENT CODE, HIGH]**

---

## 5. MongoDB persistence analysis (Umarun)

Файл [`src/lib/db.ts`](#).

- **Где хранится постоянно:** внешняя **MongoDB Atlas**, `client.db("umarun").collection("waitlist")`
  (`db.ts:50-52`). Документ строго `{ email, createdAt, source:"site" }`
  (тип `WaitlistDoc`, `db.ts:8-12`). **[CURRENT CODE, HIGH]** Подтверждено
  RUNBOOK §1 и P1_T6-отчётом (живой write проверен). **[DOCUMENTED]**
- **Durable?** Да — Atlas внешний по отношению к serverless-функции, переживает
  recycle/redeploy. RUNBOOK прямо называет Atlas системой хранения. **[HIGH]**
- **Lazy env access:** `process.env.MONGODB_URI` читается **внутри**
  `clientPromise()` (`db.ts:23`), не на import-time. Отсутствие URI на build не
  валит сборку; на runtime → `throw` → честный error state. **[CURRENT CODE, HIGH]**
- **Connection reuse / global cache:** промис клиента паркуется на
  `globalThis._umarunMongo` (`db.ts:17-19, 25-40`) — переиспользуется между
  инвокациями (serverless warm reuse) и переживает HMR в dev. **Подключение НЕ
  пересоздаётся на каждый запрос.** **[CURRENT CODE, HIGH]**
- **Self-heal на сбое (важно):** `.catch` на `connect()` обнуляет кэш
  (`_umarunMongo = undefined`) и best-effort закрывает полу-открытый клиент,
  затем **ре-throw** (`db.ts:34-38`). То есть rejected-промис **не остаётся в
  кэше** — следующий запрос строит свежий клиент. Это закрытие реального
  инцидента 2026-06-13 (Atlas TLS abort), описанного в
  `D3_DB_CONNECTION_CACHE_RESET_REPORT.md`. **[CURRENT CODE + HISTORICAL, HIGH]**
- **Timeouts:** `serverSelectionTimeoutMS: 3000`, `connectTimeoutMS: 3000`
  (`db.ts:27-28`) — запрос не висит при недоступной БД. **[CURRENT CODE, HIGH]**
- **Unique index:** `collection.createIndex({email:1},{unique:true})` один раз
  на процесс через флаг `indexReady` (`db.ts:53-56`) — идемпотентно, дёшево,
  не на каждый запрос. **[CURRENT CODE, HIGH]**

---

## 6. Telegram notification analysis (Umarun)

Файл [`src/lib/notify.ts`](#), функция `notifyTelegram(email, total)`.

- **Только уведомление, не storage (HIGH).** Документация и код согласованы:
  «A failure here must NEVER fail the signup». Telegram **никогда не является
  системой хранения**. Подтверждается тем, что success state определён до и
  независимо от вызова (`actions.ts:53-55` vs `57-64`). **[CURRENT CODE]**
- **Конфиг по env, мягкий no-op:** `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`;
  если хоть один не задан — `return` (тихо, без ошибки) — `notify.ts:15-17`.
  Локально/preview без Telegram signup всё равно работает. **[CURRENT CODE, HIGH]**
- **Timeout есть:** `AbortController` + `setTimeout(abort, 3000)`, очистка в
  `finally` (`notify.ts:21-32`). **[CURRENT CODE, HIGH]**
- **Проверка HTTP-ответа — НЕТ (важная слабость, HIGH).** Код делает
  `await fetch(...)` и **не проверяет** `res.ok`, не читает body, не смотрит
  `ok:false` от Telegram API (`notify.ts:24-29`). То есть Telegram API,
  ответивший `HTTP 401/400` или `{"ok":false}` (например, протухший токен,
  неверный chat_id), **не воспринимается как ошибка** внутри `notifyTelegram`.
  Это «успокаивает» вызывающего: исключение возникнет только при сетевой
  ошибке/таймауте (abort), но не при логической ошибке Telegram.
  **[CURRENT CODE, HIGH]** Для durable-архитектуры это **не критично** (Telegram
  здесь вторичен и fire-and-forget), но как канал оповещения он может **молча не
  доставлять**, и код этого не заметит. P1_T6-отчёт утверждает «a bad token still
  returns ?submitted=ok (failure isolation)» — это подтверждает, что плохой токен
  не валит signup, но **не** доказывает, что отправка realtime-надёжна. **[DOCUMENTED]**
- **Fire-and-forget, но request ждёт завершения (нюанс, HIGH).** Несмотря на
  ярлык «fire-and-forget», вызывающий **`await notifyTelegram(...)`**
  (`actions.ts:61`) — то есть HTTP-запрос к Telegram **ожидается** (до 3s
  таймаута) **до** финального `redirect`. «Fire-and-forget» здесь относится к
  **изоляции ошибки** (сбой не валит signup), а не к тому, что ответ не
  ожидается. Пользователь платит латентностью Telegram (или его таймаутом) перед
  success-редиректом. **[CURRENT CODE]**

---

## 7. Success and failure truth table (Umarun)

| Условие | MongoDB | Telegram | Что видит пользователь | Заявка сохранена? |
|---|---|---|---|---|
| Happy path | upsert ok | отправлен | `?submitted=ok` (success) | **Да** (HIGH) |
| Honeypot заполнен | не трогаем | не шлём | `?submitted=ok` (fake) | Нет (намеренно) |
| Невалидный email | не трогаем | не шлём | `?submitted=invalid` | Нет |
| **Mongo недоступна / URI не задан** | throw → `stored=false` | не доходим | `?submitted=error` (честный) | **Нет** (HIGH) |
| Mongo ok, **Telegram упал/таймаут** | upsert ok | сетевой сбой/abort → catch+log | `?submitted=ok` | **Да** (HIGH) |
| Mongo ok, **Telegram вернул `ok:false`/HTTP-ошибку** | upsert ok | **не распознано как ошибка** | `?submitted=ok` | **Да**, но оповещение могло не дойти (HIGH) |
| Дубликат email | upsert collapse | шлём снова | `?submitted=ok` (тот же) | Да (одна запись) |

**Ответы на обязательные вопросы (Umarun):**
- **Где хранится постоянно?** В MongoDB Atlas `umarun.waitlist`. **[HIGH]**
- **MongoDB обязательна для success?** **Да** — `stored` зависит только от неё. **[HIGH]**
- **Telegram обязателен для success?** **Нет** — изолирован. **[HIGH]**
- **Mongo недоступна → пользователь видит?** Честный `?submitted=error`. **[HIGH]**
- **Telegram недоступен → пользователь видит?** `?submitted=ok` (заявка сохранена). **[HIGH]**
- **Код проверяет HTTP-ответ Telegram?** **Нет.** **[HIGH]**
- **Есть ли timeout Telegram?** Да, 3s AbortController. **[HIGH]**

---

## 8. Duplicate submission and idempotency behavior (Umarun)

- **Механизм:** уникальный индекс `{email:1}` + `updateOne(..., {$setOnInsert}, {upsert:true})`.
  Повторная отправка того же email **обновляет/совпадает с существующим
  документом, новой записи не создаёт** (`$setOnInsert` пишет поля только при
  вставке). `createdAt` первой заявки сохраняется. **[CURRENT CODE, HIGH]**
- **Нормализация для дедупа:** email приводится к `trim().toLowerCase()` до
  upsert (`actions.ts:34`), поэтому `A@x.com` и `a@x.com` — один документ.
  Подтверждено P1_T6-отчётом («three submits incl. mixed-case → one doc»). **[DOCUMENTED]**
- **Анти-энумерация:** дубликат возвращает **тот же** success, что и новая
  заявка — нет утечки «этот email уже есть». **[CURRENT CODE, HIGH]**
- **Идемпотентность записи:** да, по email. Нет отдельного идемпотентного ключа
  на «попытку» (повторный POST с тем же email — это снова upsert, безопасно).

---

## 9. Serverless compatibility (Umarun)

| Критерий | Статус | Доказательство |
|---|---|---|
| Lazy env access | ✅ | `process.env.MONGODB_URI` внутри `clientPromise()` (`db.ts:23`) |
| Connection reuse (нет connect-per-request) | ✅ | парковка промиса на `globalThis` (`db.ts:17-40`) |
| Global cache переживает HMR (dev) | ✅ | `globalForMongo` на `globalThis` (`db.ts:17-19`) |
| Timeouts | ✅ | 3s server-selection + 3s connect (`db.ts:27-28`) |
| Self-heal после сбоя | ✅ | `.catch` обнуляет кэш + close + rethrow (`db.ts:34-38`) |
| Index не на каждый запрос | ✅ | `indexReady` guard (`db.ts:53-56`) |
| Durable вне инстанса | ✅ | внешний Atlas, не локальная ФС |

**Вывод (HIGH):** Umarun MongoDB-клиент **serverless-совместим по всем
пунктам**, проверенным в задаче. Это эталон для адаптации Miss Lana. Известный
эксплуатационный нюанс (Hobby-план Vercel без статического egress IP → пришлось
открыть Atlas `0.0.0.0/0` под сильным паролем) задокументирован в RUNBOOK §3-5 и
вынесен в Phase-2 hardening (Vercel↔Atlas integration, least-privilege роль).
**[DOCUMENTED]**

---

## 10. Security and privacy review (Umarun)

- **Privacy-by-design:** документ строго `{email, createdAt, source}` —
  **нет IP, user-agent, geo** (`db.ts:3-12`, комментарий «Adding a field here is
  a privacy regression»). **[CURRENT CODE, HIGH]**
- **Логи без PII:** при ошибке логируется только `(error).message`, **никогда
  email** (`actions.ts:50, 63`). **[CURRENT CODE, HIGH]**
- **Секреты:** только в gitignored `.env`; `.env.example` — placeholders; RUNBOOK
  ссылается на секреты **по имени переменной**. Phase1-Lock-отчёт фиксирует «0
  hits» по секрет-сканам. **[DOCUMENTED]**
- **Email уходит в Telegram:** message содержит email, но идёт в **приватный
  чат/группу владельца** (data controller), не в лог и не третьей стороне
  (`notify.ts:1-10, 19`). Это осознанное проектное решение. **[CURRENT CODE]**
- **Замечание (LOW):** на serverless Telegram-получатель — **группа** (RUNBOOK
  §2: «negative chat id = group, несколько получателей»). Это расширяет круг лиц,
  видящих email подписчика. Для Umarun приемлемо (по решению владельца), но для
  **Miss Lana с более чувствительной PII (имя, телефон, заметки) это важный
  фактор** — см. §15.

---

## 11. Verification and end-to-end evidence found (Umarun)

- **P1_T6_WAITLIST_REPORT.md (DOCUMENTED, прямое E2E):** 6 flow-тестов + Telegram
  против **реального Atlas-кластера и живого бота**: (1) valid→stored, документ
  ровно 3 поля, unique index присутствует; (2) дубликат→один документ; (3)
  invalid→`invalid`, БД не тронута; (4) honeypot→fake success, не сохранено; (5)
  env missing→`error`, без краша; (6) JS off→полный POST round-trip; (7)
  Telegram доставлен «New waiting-list signup: … Total: 1»; плохой токен всё
  равно `?submitted=ok`. Тест-документы удалены (collection→0). Есть артефакты:
  `t6_flow_evidence.md`, скриншоты `t6_screens/` (390px mobile-first). **[DOCUMENTED, MEDIUM]**
- **D3_DB_CONNECTION_CACHE_RESET_REPORT.md + RUNBOOK §3 (HISTORICAL):** реальный
  прод-инцидент 2026-06-13 (Atlas TLS handshake abort, SSL alert 80, egress IP
  не в Access List), операционно устранён + code self-heal. **Это сильнейшее
  доказательство, что pipeline реально работал в проде и тестировался под
  отказом.** **[HISTORICAL + DOCUMENTED, HIGH]**

> **Оговорка по правилам задачи (HIGH):** документация — **подтверждающее**, а не
> первичное доказательство. Я не запускал форму и не писал в Mongo/Telegram. То,
> что **локальный код корректен**, доказано чтением; то, что **прод сейчас
> работает**, я не утверждаю (хотя инцидент-репорт показывает, что он работал на
> 2026-06-13). Артефакты `t6_flow_evidence.md`/скриншоты я не открывал построчно
> (они вне минимального scope и могли бы содержать данные) — полагаюсь на
> структуру отчёта.

---

## 12. Weaknesses and technical debt in Umarun implementation

Честно, без сглаживания (требование задачи):

1. **Telegram не проверяет HTTP-ответ (HIGH).** `notify.ts` игнорирует `res.ok`
   и `{ok:false}`. Логическая ошибка Telegram (битый токен/chat_id) **молча
   проглатывается** — оповещение может не дойти, код «думает», что всё хорошо.
   Для durable-архитектуры некритично (Telegram вторичен), но как канал алертов
   ненадёжен/ненаблюдаем.
2. **Двойной заход в коллекцию (LOW/perf).** Success-ветка снова вызывает
   `getWaitlistCollection()` и делает `countDocuments()` ради числа для текста
   уведомления (`actions.ts:59-60`). Лишний round-trip + `countDocuments` на
   большой коллекции дороже, чем нужно ради косметического «Total: N».
3. **Telegram ожидается синхронно перед redirect (LOW/UX).** До 3s латентности
   Telegram добавляется ко времени до success (см. §6).
4. **`0.0.0.0/0` на Atlas (MEDIUM, операционно).** Hobby-Vercel без static IP →
   БД открыта всему интернету под паролем. Известный долг, вынесен в Phase-2
   (Vercel↔Atlas integration, least-privilege). [DOCUMENTED]
5. **Нет статусов/жизненного цикла заявки (NOTE).** Документ хранит только факт
   подписки (`email, createdAt, source`) — нет `status`, нет истории обработки.
   Для waiting-list это намеренно; для **booking-lead Miss Lana этого мало**.
6. **Success достижим прямым переходом на `?submitted=ok` (NOTE, косметика).**
   Зафиксировано в P1_T6 как NOTE-2 — ничего не сохраняется без реального POST.

---

## 13. Current Miss Lana implementation comparison

Текущая Miss Lana lead pipeline (на ветке `chore/tung-prelaunch-pipeline-ordering`)
— **это не «голая» форма, а уже зрелый конвейер**. Ключевые файлы:
[`app/api/lead/route.ts`](../../app/api/lead/route.ts),
[`lib/notify.ts`](../../lib/notify.ts), [`lib/leads.ts`](../../lib/leads.ts),
[`lib/env.ts`](../../lib/env.ts), [`components/shell/LeadForm.tsx`](../../components/shell/LeadForm.tsx).

**Архитектура Miss Lana (HIGH):**
```
LeadForm (client) — validate(UX) → POST JSON /api/lead
        │
        ▼
route.ts: parse(≤16KB) → honeypot("company") → rate-limit(5/60s per-IP)
        → validateLead (authoritative) → buildLead(+inquiry id ML-XXXXX)
        → deliverLead(lead)
                 │
   notify.ts deliverLead:
     1. persist() → JSON-файл в LEAD_STORE_DIR (.leads) ИЛИ fallback tmpdir/ml-leads
     2. Promise.all[ emailOwner(webhook), telegramAlert ]
     accepted = (store ok) ИЛИ (email ok)        ← durable-условие
        │
        ▼
   route: accepted? → 200 {ok:true,id}  ; иначе 502 {ok:false}
   LeadForm: success-панель ТОЛЬКО при res.ok && data.ok
```

**Семантика success (HIGH):** `accepted = store.status==="ok" || email.status==="ok"`
([`notify.ts:139`](../../lib/notify.ts)). Success на клиенте показывается только
после `{ok:true}` от сервера ([`LeadForm.tsx:201-206`](../../components/shell/LeadForm.tsx))
— **ложного success нет**, и это многократно покрыто тестами (unit `notify.test.ts`,
e2e `lead-api.spec.ts`).

**Сравнение Umarun ↔ Miss Lana:**

| Аспект | Umarun (waiting-list) | Miss Lana (booking lead) | Кто сильнее |
|---|---|---|---|
| Транспорт | React **server action** + `redirect ?submitted=` (без JS) | **JSON API** `/api/lead` + клиентский `fetch` | разные парадигмы |
| Поля формы | **1** (email) | **11** (name, phone, email?, type, date, time?, city, count?, show?, notes?, + source/utm) | Miss Lana сложнее |
| Durable storage | **внешняя MongoDB Atlas** ✅ | **локальный `.leads/`** (+ tmpdir fallback) ⚠️ + email как acceptance | **Umarun** |
| Условие «accepted» | upsert в Mongo ok | store ok **или** email webhook ok | Miss Lana гибче, но опирается на ненадёжный store |
| Server-side validation | минимальная (email regex) | **полная** (`validateLead`, allow-list типов, US-date, длины) | **Miss Lana** |
| Honeypot | ✅ `company` | ✅ `company` | паритет |
| Rate-limit | ❌ нет | ✅ per-IP 5/60s, token bucket | **Miss Lana** |
| Inquiry id | ❌ (нет, только `_id`) | ✅ `ML-XXXXX`, безопасные символы | **Miss Lana** |
| Email-канал | ❌ нет | ✅ provider-agnostic webhook + auth + 8s timeout + `res.ok` check | **Miss Lana** |
| Telegram | ✅ fire-and-forget, **без** `res.ok` | ✅ secondary, **с** `res.ok` check + 8s timeout | **Miss Lana** |
| Проверка HTTP non-2xx | Telegram — нет | email **и** telegram — да (`res.ok`) | **Miss Lana** |
| Timeout исходящих | Telegram 3s (Abort) | email 8s + telegram 8s (`AbortSignal.timeout`) | паритет/Miss Lana |
| Дедуп/идемпотентность | ✅ unique index email + upsert | ❌ **нет** (каждый POST — новый файл/запись) | **Umarun** |
| PII в хранилище | 1 email (минимум) | name, phone, email?, notes (**больше PII**) | Umarun «легче» |
| Логи без PII | ✅ | ✅ (логируется только `id`) | паритет |
| Прод-проверка | ✅ живой Atlas + инцидент 2026-06-13 | ⚠️ только локально; email inbox **не** проверен | **Umarun** |
| Тесты | flow-доказательства (doc) | **unit + e2e в репозитории** (51 passed) | **Miss Lana** (по форме доказательства) |

---

## 14. What can be reused unchanged (из Umarun → Miss Lana)

| Элемент Umarun | Перенос | Обоснование |
|---|---|---|
| **Паттерн MongoDB-клиента** (`db.ts`): lazy env, парковка промиса на `globalThis`, 3s timeouts, **self-heal `.catch`**, `createIndex` один раз | **Reuse как образец** (не копипаст: подогнать имена/типы) | Это эталон serverless-совместимого клиента; именно его нет у Miss Lana |
| Принцип «durable write FIRST, notify SECOND» | **Reuse концептуально** | У Miss Lana уже так в `deliverLead`, но «durable» = ненадёжный `.leads/` |
| Принцип «Telegram fire-and-forget, не валит success» | **Уже есть** у Miss Lana | копировать нечего |
| Unique-index + upsert `$setOnInsert` для дедупа | **Reuse идею** | у Miss Lana дедупа нет; для booking ключ дедупа сложнее (см. §15) |
| Privacy-минимализм документа | **Reuse принцип** | у Miss Lana PII больше — нельзя «минимизировать до email», но принцип «не хранить лишнего (IP/UA/geo)» применим |

**Дословно «как есть» переносить нечего** — это разные репозитории и разные
парадигмы (server action vs JSON API). Переносится **архитектурный паттерн
внешнего durable store**, а не конкретные строки.

---

## 15. What must be adapted for Miss Lana

1. **Схема документа (HIGH).** Вместо `{email,createdAt,source}` — полный
   booking-lead: уже есть готовый тип `Lead` в
   [`lib/leads.ts:14-32`](../../lib/leads.ts) (`id, receivedAt, name, phone,
   email?, eventType, date, time?, city, childCount?, show?, notes?, source{path,utm}`).
   Документ внешней БД = сериализованный `Lead`. **Никакой новой схемы изобретать
   не нужно — она уже спроектирована.**
2. **Статусы заявки (HIGH).** Для booking нужен жизненный цикл, которого нет у
   Umarun: добавить поле `status` (напр. `new | contacted | booked | declined`)
   и, желательно, `updatedAt`. Это будущая основа для admin/CRM (но **сам admin
   вне scope** этой и следующей задачи).
3. **Ключ дедупа/идемпотентности (MEDIUM).** Email у booking **необязателен**, и
   один человек может слать **несколько разных** заявок (разные даты/события) —
   поэтому **нельзя** делать unique index по email, как в Umarun. Безопасный
   вариант: **первичный ключ — внутренний `id` (`ML-XXXXX`)**, запись с
   `flag:"wx"`-семантикой (insert-only, без перезаписи) — ровно как уже делает
   `persist()` в файловом адаптере. Дедуп «повторный клик» лучше решать
   идемпотентным ключом запроса на клиенте, а не unique-индексом по PII.
4. **Telegram-получатель (MEDIUM, privacy).** В booking-уведомлении больше PII.
   У Miss Lana Telegram-текст уже **намеренно урезан** (только `id, eventType,
   date, city` + «Check <email>», без имени/телефона/заметок —
   [`notify.ts:116`](../../lib/notify.ts)). Это **лучше**, чем Umarun (тот шлёт
   сам email). Адаптация: при выборе чата избегать широкой группы для полной PII;
   полную карточку оставлять в email/БД, в Telegram — только «есть новая заявка
   ML-XXXX, смотри почту/БД».
5. **`res.ok` для всех исходящих (уже сделано лучше Umarun).** Сохранить текущую
   проверку `res.ok` для email и telegram; **не** воспроизводить слабость Umarun
   (отсутствие проверки). Это «адаптация наоборот»: Miss Lana **не должна
   деградировать** до Umarun-уровня по Telegram.
6. **Acceptance signal (HIGH).** Перевести `accepted` на **внешнюю БД**:
   `accepted = (db write ok) || (email webhook ok)`. Тогда даже без email лид
   надёжно сохранён в БД, переживающей serverless — закрывается главный риск.

---

## 16. Recommended target architecture

**Рекомендация (HIGH): сохранить текущий конвейер Miss Lana и заменить ТОЛЬКО
durable-адаптер** `persist()` — с локального `.leads/` на **внешнюю БД (MongoDB
Atlas, паттерн Umarun)**, сохранив существующий контракт `DeliveryResult`.

```
LeadForm → POST /api/lead
   route.ts (БЕЗ изменений семантики):
     parse → honeypot → rate-limit → validateLead → buildLead(id)
        → deliverLead(lead)
   deliverLead (notify.ts) — минимальная правка:
     1. persistDurable(lead):
          • НОВЫЙ адаптер: insert в MongoDB Atlas (db "misslana", coll "leads")
            - документ = Lead + {status:"new", _id: lead.id (или ML-id как ключ)}
            - insert-only по id (никакой перезаписи)
            - клиент: lazy env, globalThis-cache, self-heal .catch, timeouts  ← из Umarun db.ts
          • (опционально) сохранить файловый `.leads/` как ВТОРОЙ best-effort на
            persistent-хосте; на serverless он не durable и в acceptance не входит
     2. Promise.all[ emailOwner(webhook), telegramAlert ]  ← без изменений
     accepted = (db insert ok) || (email webhook ok)       ← durable теперь = БД
   route: accepted ? 200{ok,id} : 502{ok:false}            ← БЕЗ изменений
```

**Почему именно так (HIGH):**
- Минимальное вмешательство: меняется **один** модуль (`persist`→`persistDurable`),
  контракт `DeliveryResult`/`route.ts`/`LeadForm` не трогается → низкий риск
  регрессии «ложный success».
- Берём из Umarun **самое ценное и проверенное** (serverless-устойчивый Mongo
  client с self-heal — буквально переживший прод-инцидент), **не** деградируя
  сильные стороны Miss Lana (validation, rate-limit, email, `res.ok`-проверки).
- Telegram остаётся вторичным и **уже** реализован лучше Umarun — переносить из
  Umarun по Telegram **нечего**, и его слабость (нет `res.ok`) **не** воспроизводим.

**Минимальный безопасный вариант внедрения:** **MongoDB (durable) + email
(notify, основной) + Telegram (notify, опц.)** — то есть текущая тройка каналов
Miss Lana, где «store» становится внешней БД вместо `.leads/`. Email остаётся
запасным acceptance-сигналом (полезно, пока БД не настроена). См. decision matrix
в §20.

---

## 17. Minimal environment variables and services required

Сервисы: **MongoDB Atlas** (free M0 достаточно для старта; выбор платного
тарифа — **вне scope**) + уже существующий **email-webhook** + опц. **Telegram**.

| Env var | Назначение | Обязательность |
|---|---|---|
| `MONGODB_URI` | строка подключения Atlas (db `misslana`, coll `leads`) | **Да** (для durable БД) |
| `LEAD_EMAIL_WEBHOOK_URL` (+ `_TOKEN`) | owner-email (уже в `env.ts`) | желательно (acceptance fallback + основное оповещение) |
| `LEAD_NOTIFY_EMAIL` | адрес владельца (есть default `info@misslanatheatre.com`) | нет |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | опц. вторичный алерт (уже в `env.ts`) | нет |
| `LEAD_STORE_DIR` | оставить как best-effort на persistent-хосте | нет |

> Все читаются **только** через `lib/env.ts` (governance это требует). Добавить
> getter `mongodbUri` по существующему lazy-паттерну. **Секреты — только в
> deployment secrets, никогда в репозитории.**

---

## 18. Production acceptance test checklist

(Расширение go-live чеклиста из `LEAD_PIPELINE_RUNBOOK.md` под внешнюю БД.)

- [ ] Реальная заявка с **mobile** и **desktop** → запись появилась в Atlas
      `misslana.leads` с правильным `id` и всеми полями; success-панель показала тот же `id`.
- [ ] **Forced failure (БД недоступна / неверный `MONGODB_URI`) при выключенном
      email-webhook** → пользователь видит **502/retry, НЕ false success**; в логах
      только `id`, без PII.
- [ ] **БД недоступна, email-webhook рабочий** → `accepted` через email, success
      честный, в логах warning «accepted via email; store=error».
- [ ] **Telegram с битым токеном** → `res.ok=false` зафиксирован как `telegram=error`
      (в отличие от Umarun!), но не влияет на accepted.
- [ ] **Дубль-клик / повторный POST того же `id`** → одна запись (insert-only по id), без дубля.
- [ ] **Honeypot** заполнен → `ok` без записи в БД и без оповещений.
- [ ] **Rate-limit** 6+ запросов/мин с одного IP → ≥1 ответ 429.
- [ ] Serverless-проверка: после redeploy/recycle инстанса первая заявка
      сохраняется (self-heal клиента, нет «залипшего» rejected-промиса).
- [ ] `security/secret-scan.sh` зелёный; `git diff --check` чистый; в репозитории
      нет URI/токенов/PII.
- [ ] `pnpm run ci:exact` зелёный; unit/e2e лид-тесты обновлены под БД-адаптер.

---

## 19. Recommended next canonical implementation TUNG (outline — НЕ выполнять)

**`IMPLEMENT_MISS_LANA_DURABLE_LEAD_STORE_MONGODB_001`** (task_mode: `fix`/`feature`,
priority: high). Outline:

- **Цель:** заменить durable-адаптер `persist()` в [`lib/notify.ts`](../../lib/notify.ts)
  на внешнюю MongoDB Atlas (insert-only по `id`), сохранив контракт
  `DeliveryResult` и поведение `route.ts`/`LeadForm` без изменений.
- **In scope:** новый `lib/leadStore.ts` (Mongo client по паттерну Umarun
  `db.ts`: lazy env, globalThis-cache, **self-heal `.catch`**, 3s timeouts,
  index по `id` unique); правка `deliverLead` → `accepted = (db ok) || (email ok)`;
  добавить поле `status:"new"`+`updatedAt` в документ; getter `mongodbUri` в
  `lib/env.ts` + строки в `.env.example`; обновить `LEAD_PIPELINE_RUNBOOK.md`;
  unit-тесты на адаптер (mock Mongo) + правка `notify.test.ts`.
- **Out of scope (явно):** admin dashboard/CRM; смена транспорта формы; смена
  email-провайдера; выбор платного тарифа Atlas; реальные прод-отправки;
  изменение Telegram-логики (она уже корректна).
- **Acceptance:** чеклист §18; `pnpm run ci:exact` зелёный; нет регрессии «ложный
  success»; нет PII в логах/репозитории.
- **Risk guard:** не воспроизводить слабость Umarun (Telegram без `res.ok`); не
  делать unique index по email (booking ≠ waiting-list); insert-only, без
  перезаписи существующего лида.

---

## 20. Evidence matrix

### 20.1 CURRENT CODE evidence — Umarun

| Утверждение | Файл | Функция | Строки | Уверенность |
|---|---|---|---|---|
| Durable storage = MongoDB Atlas `umarun.waitlist` | `src/lib/db.ts` | `getWaitlistCollection` | 48-58 | HIGH |
| Документ = `{email,createdAt,source}`, без IP/UA/geo | `src/lib/db.ts` | `WaitlistDoc` | 8-12 | HIGH |
| Lazy env (`MONGODB_URI` внутри функции) | `src/lib/db.ts` | `clientPromise` | 22-24 | HIGH |
| Connection reuse через globalThis | `src/lib/db.ts` | `clientPromise` | 17-40 | HIGH |
| Self-heal: `.catch` обнуляет кэш + rethrow | `src/lib/db.ts` | `clientPromise` | 34-38 | HIGH |
| Timeouts 3s | `src/lib/db.ts` | `clientPromise` | 27-28 | HIGH |
| Unique index `{email:1}` один раз/процесс | `src/lib/db.ts` | `getWaitlistCollection` | 53-56 | HIGH |
| Success определяется ТОЛЬКО успехом Mongo | `src/app/waiting-list/actions.ts` | `joinWaitlist` | 39-55 | HIGH |
| Honeypot `company` → fake success, не пишем | `src/app/waiting-list/actions.ts` | `joinWaitlist` | 28-31 | HIGH |
| Upsert `$setOnInsert` (дедуп) | `src/app/waiting-list/actions.ts` | `joinWaitlist` | 42-46 | HIGH |
| Логи без email | `src/app/waiting-list/actions.ts` | `joinWaitlist` | 50, 63 | HIGH |
| Telegram fire-and-forget, не валит signup | `src/lib/notify.ts` | `notifyTelegram` | 11-33 | HIGH |
| Telegram timeout 3s (AbortController) | `src/lib/notify.ts` | `notifyTelegram` | 21-32 | HIGH |
| **Telegram НЕ проверяет `res.ok`/`{ok:false}`** | `src/lib/notify.ts` | `notifyTelegram` | 24-29 | HIGH |
| Telegram no-op если env не задан | `src/lib/notify.ts` | `notifyTelegram` | 15-17 | HIGH |

### 20.2 CURRENT CODE evidence — Miss Lana

| Утверждение | Файл | Функция | Строки | Уверенность |
|---|---|---|---|---|
| `accepted = store ok ИЛИ email ok` | `lib/notify.ts` | `deliverLead` | 136-141 | HIGH |
| Durable store = локальный `.leads/` (+ tmpdir fallback) | `lib/notify.ts` | `storeDirs`/`persist` | 42-78 | HIGH |
| Default `LEAD_STORE_DIR=".leads"` | `lib/env.ts` | `leadStoreDir` | 65-67 | HIGH |
| Email webhook: проверка `res.ok` + 8s timeout | `lib/notify.ts` | `emailOwner` | 81-103 | HIGH |
| Telegram: проверка `res.ok` + 8s timeout | `lib/notify.ts` | `telegramAlert` | 106-126 | HIGH |
| Telegram-текст урезан (id/type/date/city, без имени/тел) | `lib/notify.ts` | `telegramAlert` | 116 | HIGH |
| Success только при `{ok:true}` | `app/api/lead/route.ts` | `POST` | 94-114 | HIGH |
| Не-accepted → честный 502, лог только id | `app/api/lead/route.ts` | `POST` | 94-100 | HIGH |
| Honeypot `company` → ok без записи | `app/api/lead/route.ts` | `POST` | 70-72 | HIGH |
| Rate-limit per-IP 5/60s | `app/api/lead/route.ts` | `rateLimited` | 22-34 | HIGH |
| Authoritative server validation | `lib/leads.ts` | `validateLead` | 71-103 | HIGH |
| Полная схема booking-lead (11 полей) | `lib/leads.ts` | `Lead` | 14-32 | HIGH |
| Inquiry id `ML-XXXXX` | `lib/leads.ts` | `makeInquiryId` | 152-158 | HIGH |
| Клиент: success-панель только после `{ok:true}` | `components/shell/LeadForm.tsx` | `onSubmit` | 201-218 | HIGH |
| Нет дедупа (каждый POST — новый файл) | `lib/notify.ts` | `persist` | 55-78 | HIGH |

### 20.3 Historical / documented evidence

| Утверждение | Источник | Природа | Уверенность |
|---|---|---|---|
| Прод-инцидент Atlas TLS 2026-06-13 + self-heal фикс | `umarun/web/docs/tasks/phase1/reports/D3_DB_CONNECTION_CACHE_RESET_REPORT.md`; `docs/ops/RUNBOOK.md §3` | HISTORICAL+DOCUMENTED | HIGH |
| 6 flow-тестов + Telegram против живого Atlas/бота | `umarun/web/docs/tasks/phase1/reports/P1_T6_WAITLIST_REPORT.md` | DOCUMENTED | MEDIUM |
| Изначальный waitlist-коммит (Mongo+Telegram) | `git log` → `e8afb6e P1_T6…` | HISTORICAL | HIGH |
| Miss Lana lead pipeline закрыта 2026-06-27, email inbox НЕ проверен (launch gate) | `docs/reports/IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001.md`; `docs/operations/LEAD_PIPELINE_RUNBOOK.md` | DOCUMENTED | HIGH |
| Miss Lana e2e/unit лид-тесты существуют в репо | `tests/e2e/lead-api.spec.ts`, `tests/unit/{leads,notify}.test.ts` | CURRENT CODE | HIGH |

### 20.4 Failure-modes table (целевая Miss Lana с внешней БД)

| Сбой | Поведение (рекоменд.) | Что видит пользователь |
|---|---|---|
| MongoDB недоступна, email есть | `accepted` через email | success (лид в почте) |
| MongoDB недоступна, email не настроен | оба провалены | **502 / retry, НЕ false success** |
| Email webhook 500/timeout, БД ok | `accepted` через БД | success (лид в БД) |
| Telegram битый токен (`res.ok=false`) | `telegram=error`, не влияет | success |
| Server timeout/исключение в deliver | route ловит, не фейкует success | 502 / retry |
| Дубль POST того же id | insert-only, одна запись | success (тот же id) |
| Malformed/oversized body | 400 / 413 | сообщение об ошибке |

### 20.5 Reuse / adapt / do-not-copy

| Элемент | Вердикт |
|---|---|
| Serverless Mongo client (lazy/globalThis/self-heal/timeouts) | **REUSE как образец** |
| «durable FIRST, notify SECOND» | REUSE (концепт; у Miss Lana уже есть) |
| insert-only / уникальность по ключу | ADAPT (ключ = `id`, **не** email) |
| Privacy-минимализм | ADAPT (PII больше, но не хранить IP/UA/geo) |
| Telegram **без** `res.ok` | **DO NOT COPY** (слабость; у Miss Lana уже лучше) |
| `countDocuments()` ради текста уведомления | DO NOT COPY (лишний round-trip) |
| Server-action `?submitted=` транспорт | DO NOT COPY (Miss Lana — JSON API) |

### 20.6 Decision matrix (≥3 варианта)

| Вариант | Durability на serverless | Потеря лида | Оповещение realtime | Сложность/стоимость | Вердикт |
|---|---|---|---|---|---|
| **Telegram-only** | ❌ (Telegram — НЕ архив, нет восстановления/истории/поиска) | **высокий** | да | низкая | **Отклонить** — Telegram это не durable storage |
| **MongoDB + Telegram** | ✅ (БД durable) | низкий | да (TG), но без email-следа | средняя | хорошо; но без email теряется привычный inbox-канал |
| **MongoDB + Telegram + email** (рекоменд.) | ✅ (БД durable, email — fallback acceptance) | **минимальный** | да (email основной + TG) | средняя | **Рекомендуется** — durable БД + двойной канал оповещения + честный acceptance |

---

## 21. Final verdict

1. **Как реально устроено в Umarun (HIGH):** заявка надёжно сохраняется во
   **внешней MongoDB Atlas** (это единственное условие success), а **Telegram —
   только fire-and-forget уведомление** (его сбой не влияет на success и он даже
   не проверяет HTTP-ответ). Архитектура «durable DB + оповещение» — **верная**.

2. **Подходит ли паттерн для Miss Lana?** **Частично, и не «как есть».**
   Принцип «**сначала надёжно сохранить во внешней БД, потом оповестить**» —
   **да, подходит и рекомендуется**. Но **Telegram переносить не нужно** (у Miss
   Lana он уже есть и реализован лучше), и **копировать код между репозиториями
   нельзя**. Более того, **Miss Lana уже архитектурно зрелее Umarun** во всём,
   кроме durability хранилища. Брать из Umarun следует **один элемент — паттерн
   serverless-устойчивого внешнего durable store** (взамен ненадёжного `.leads/`).

3. **Главные риски (HIGH):**
   - **`.leads/` + tmpdir не durable на Vercel/serverless** → при отсутствии
     настроенного email-webhook возможна **потеря лида при «accepted»** (ложный
     успех). Это и есть бизнес-риск «−$350 за заявку».
   - Email-webhook в проде **ещё не подтверждён** (launch gate) → сейчас система
     опирается на нестойкий локальный store.
   - При наивном копировании Umarun есть риск **деградировать** Telegram до
     версии без `res.ok` и ошибочно сделать **unique index по email**, что для
     booking неверно.

4. **Что должно стать следующей implementation TUNG:**
   **`IMPLEMENT_MISS_LANA_DURABLE_LEAD_STORE_MONGODB_001`** — заменить
   durable-адаптер `persist()` на внешнюю **MongoDB Atlas** (паттерн Umarun
   `db.ts`: lazy env, globalThis-cache, **self-heal `.catch`**, timeouts;
   insert-only по `id`; поле `status`), сделать `accepted = (db ok) || (email
   ok)`, добавить getter `mongodbUri` в `lib/env.ts`, обновить runbook и тесты —
   **без** изменения контракта `route.ts`/`LeadForm` и **без** деградации
   текущих сильных сторон. Admin/CRM, смена транспорта, выбор тарифа — вне scope.

---

### Closure (read-only audit)

- **Scope:** выполнен **только read-only** аудит; создан **один** новый файл —
  этот отчёт. Код, конфиг, env, git-история, ветки, БД, боты — **не менялись**.
- **Evidence:** ключевые утверждения снабжены точными `file:function:lines` и
  помечены HIGH/MEDIUM/LOW + природой (CURRENT CODE / HISTORICAL / DOCUMENTED /
  INFERENCE); current code и история **не смешаны**.
- **Failure paths:** проверены Mongo-fail, Telegram-fail (вкл. отсутствие
  `res.ok`), duplicate, validation, serverless-кэш — для обоих проектов.
- **Security:** реальные `.env`/`.env.local` **не читались**; ни один токен,
  chat id, URI, пароль или email клиента в отчёт **не попал**.
- **Repo integrity:** Umarun (`/web`, ветка `main`) — без изменений от аудита;
  Fairy-Tale — добавлен только этот отчёт, кода/конфига не тронуто.
- **Honesty:** Telegram **не назван** durable storage; локальный `.leads/`
  **не назван** durable для serverless; слабости Umarun описаны прямо; «прод
  работает» по локальному коду **не** утверждается.
- **Что остаётся непроверенным:** реальное состояние прод-окружений обоих
  проектов; live email inbox Miss Lana; содержимое Umarun flow-артефактов
  построчно (вне минимального scope).
