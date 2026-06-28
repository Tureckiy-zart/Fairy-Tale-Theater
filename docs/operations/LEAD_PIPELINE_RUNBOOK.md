# Lead Pipeline — Operations Runbook

> Booking inquiries from the site's LeadForm. **No secrets in this file.** Owner
> notification target: `info@misslanatheatre.com`. Owner (Svitlana) replies within
> 1–2 business days. Built by `IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001`;
> output channels normalized by `NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001`.

## Channel roles (current reality)

| Channel | Role | Holds PII? | Accepts the lead? |
|---|---|---|---|
| **MongoDB Atlas** | Durable source of truth | Yes | **Yes** |
| **Email** (`info@…`) | Full owner notification + emergency fallback record | Yes | **Yes** |
| **Telegram** | Full owner notification (act-from-chat) | **Yes** (name, phone, email, notes) | No |
| **Google Sheets** | Private operational mirror / browsable cloud log | **Yes** (same fields) | No |

`accepted = mongo.status === "ok" || email.status === "ok"`. Telegram and Google Sheets
are **never** acceptance signals — a success on either cannot create a false accept, and
a failure on either cannot reject a durable lead.

## Privacy decisions (owner-controlled)

- **Telegram group is closed and owner-controlled.** It receives the **full inquiry incl.
  PII** (the owner approved this so she can act from the chat). _Who may be in that chat
  is an **owner decision** — record approved members outside the repo._
- **Google Sheet is private/restricted** to the owner; never public. The append webhook
  is authenticated with a shared secret (`WEBHOOK_SECRET` ↔ `GOOGLE_SHEETS_WEBHOOK_TOKEN`).
- **PII never enters** technical logs, analytics, reports, screenshots or Git — only the
  inquiry id + coarse channel status are loggable (see "Logs & privacy" below).
- **Retention period: OPEN OWNER DECISION** (not yet approved — do not invent one).
- Whether customer **email** may appear in Telegram: **approved** (full inquiry is sent
  to the closed owner chat).

## What happens when a visitor submits

1. **Client** (`components/shell/LeadForm.tsx`) validates for UX, then POSTs JSON to
   `/api/lead`. The success panel renders **only** after the server returns
   `{ ok: true }` — never a fake success.
2. **Server** (`app/api/lead/route.ts`):
   - rejects non-JSON / oversized (>16 KB) bodies,
   - drops **honeypot** hits (hidden `company` field) — returns a benign `ok` but
     persists/notifies nothing,
   - **rate-limits** per IP (5 / 60 s, in-memory),
   - **re-validates + normalizes** every field (`lib/leads.ts` — authoritative),
   - builds a normalized `Lead` with an internal id (e.g. `ML-XNB5P`).
3. **Delivery** (`lib/notify.ts` + `lib/leadStore.ts`) — in order:
   1. **Persist** the lead to **MongoDB Atlas** (db `misslana`, collection `leads`) —
      the production system of record. Insert-only; a unique index on `submissionId`
      makes a double-click/retry idempotent (one record).
   2. **Email** the owner via the provider-agnostic webhook (primary notification AND
      the emergency fallback record when MongoDB is down).
   3. **Telegram** alert (optional secondary), if configured — the **full inquiry**
      (every field the visitor filled, **including PII**: name, phone, email, notes) so
      the owner can act from the chat without DB access. Sent only to the owner's
      **private, closed, owner-controlled** bot/chat. Normalized, deterministic, plain
      text (no `parse_mode`): the event date keeps its calendar day, the received time
      is shown in **America/Los_Angeles** (PST/PDT), empty optional fields are omitted,
      and an over-long **Notes** is the only field trimmed (with a marker; full text
      stays in MongoDB + Sheets). See `lib/leads.ts` → `formatLeadTelegram`.
   4. **Google Sheets** append (optional secondary), if configured — one row per lead
      to a **private** spreadsheet (a browsable cloud log for the owner, **contains the
      same PII**). Fixed column contract; formula-injection-neutralized; deduped
      server-side by `submissionId`. Never an acceptance signal.
   5. **Patch** the stored lead's `notificationStatus` (`email`/`telegram`/`sheets`
      + `lastAttemptAt`; best-effort; never flips acceptance).

   **Idempotent retry suppression:** if MongoDB reports the `submissionId` is a
   duplicate (the same submission already stored), `deliverLead` returns a safe success
   **without re-sending** Telegram, Sheets or email — so a retry produces no second
   message, row or email. A genuinely new `submissionId` always delivers once.
4. **Acceptance rule:** `accepted = mongo.ok || email.ok`. Telegram is **never** an
   acceptance signal. The route returns `{ ok: true, id }` only when accepted. A
   stored lead survives any notification failure; a confirmed email is the fallback
   record when MongoDB is down. Only when **both** durable channels fail does the
   visitor see an honest error (HTTP 502). Provider failures are **logged with the id
   only** (no PII).

> **Local dev / e2e:** when `MONGODB_URI` is unset, the store falls back to a real
> local-disk copy under `LEAD_STORE_DIR` (a genuine durable record on a dev disk).
> Production **always** sets `MONGODB_URI`, so the local file is never the production
> authority — see `lib/notify.ts` (`writeDevCopy`).

## Configuration (set in deployment secrets — never commit)

All access goes through `lib/env.ts`. Keys mirror `.env.example`:

| Env var | Purpose | Required? |
|---|---|---|
| `MONGODB_URI` | Atlas connection string — the **durable production store** (db `misslana`, coll `leads`). SECRET. | **Yes in production** |
| `LEAD_NOTIFY_EMAIL` | Owner email. Defaults to `info@misslanatheatre.com`. | No (has default) |
| `LEAD_EMAIL_WEBHOOK_URL` | POST `{to, subject, text}` → sends the owner email. Use Resend / Postmark / SES relay / a serverless fn. Also the **fallback record** when Mongo is down. | **Yes for inbox delivery** |
| `LEAD_EMAIL_WEBHOOK_TOKEN` | Optional `Authorization: Bearer …` for the webhook. | No |
| `LEAD_STORE_DIR` | **Dev-only** local copy path. Default `.leads` (git-ignored). Not used in production. | No |
| `LEAD_RATE_LIMIT_PER_MINUTE` | Max submissions/IP/60 s. Default 5. Raise **only** in e2e. | No |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Optional secondary alert (both required to enable). Sends the **full inquiry** to the owner's private chat. | No |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Optional. POST `{token, lead}` → appends one row to a Google Sheet (cloud log). Use a deployed Apps Script Web App (snippet below). Never an acceptance signal. | No |
| `GOOGLE_SHEETS_WEBHOOK_TOKEN` | Shared secret the Apps Script checks (must equal its `WEBHOOK_SECRET` Script Property) so only our app can append. Required if the URL is set. | No |

> **Two pieces need live credentials in production:** `MONGODB_URI` (durable store)
> and `LEAD_EMAIL_WEBHOOK_URL` (owner inbox + fallback record). With Mongo set, every
> valid lead is durably stored even if email is down. With email set but Mongo down, a
> delivered email is the fallback record. Only if **both** are missing/failing does a
> valid lead get an honest 502 (never a false success).

## Durable store (MongoDB Atlas)

- **Production system of record.** Database `misslana`, collection `leads`. One
  document per inquiry (`lib/leads.ts` → `StoredLead`).
- **Insert-only.** Indexes (ensured idempotently by `lib/leadStore.ts`): `id` unique,
  `submissionId` unique, `receivedAt` desc, `status` asc. The `submissionId` unique
  index is what makes a double-click/retry idempotent (one record, reported as an
  idempotent success). There is intentionally **no** unique index on email/phone — a
  repeat customer legitimately books more than once.
- **Privacy:** stores only validated customer fields with a business reason. Never IP,
  user-agent, geo, raw request bodies, or provider tokens/responses. Contains PII
  (name, phone, optional email, notes) → access-control the Atlas project; never copy
  records into reports/screenshots/public channels.
- **Connection:** one cached `MongoClient` per serverless instance (`globalThis`),
  self-healing — a failed connect is cleared so the next request reconnects (no
  poisoned cache). `serverSelectionTimeoutMS`/`connectTimeoutMS` fail fast.
- **Dev-only fallback:** when `MONGODB_URI` is unset (local/e2e), a real local-disk
  JSON copy is written under `LEAD_STORE_DIR` (`<yyyy-mm-dd>_<id>.json`, `flag:"wx"`).
  Production always sets `MONGODB_URI`, so this file is never the production authority.

## Google Sheets cloud log (optional)

A zero-dependency way to give the owner a **browsable cloud copy** of every lead with no
database access. The app POSTs `{ token, lead }` to `GOOGLE_SHEETS_WEBHOOK_URL`; a
deployed **Google Apps Script Web App** appends one row. It is a **secondary** channel —
never an acceptance signal — so a Sheets failure never affects whether a lead is accepted.

**Fixed column contract** (from `lib/leads.ts` → `GOOGLE_SHEETS_COLUMNS` / `toSheetRow`).
This order is **frozen** — append new columns at the end, never reorder:

```text
submissionId, id, receivedAtUtc, receivedAtLosAngeles, status, eventType, eventDate,
eventTime, city, name, phone, email, childCount, show, notes, sourcePath, utmSource,
utmMedium, utmCampaign
```

Put these exact names as the header row (row 1) of the sheet, left to right.

**Row hardening (`toSheetRow`):**

- every cell is a **string**, with a stable cell count that always matches the header;
- `null`/`undefined` → empty cell (never the text "null");
- **formula injection neutralized** — any value whose first non-space char is `= + - @`
  is prefixed with a single quote so Sheets stores it as text, not a live formula
  (`=IMPORTXML(...)`, `+44…`, `-12`, `@x`). Phone numbers therefore stay text;
- the **full** `notes` is stored (never the Telegram-trimmed copy);
- `receivedAtUtc` is the canonical ISO; `receivedAtLosAngeles` is the human-readable
  America/Los_Angeles mirror; `status` is `new` at submission time.

**Server-side dedupe + concurrency:** the Apps Script also dedupes by `submissionId`
under a `LockService` lock (find → check → append are atomic), so even a timeout/retry
that re-POSTs after the row was written never creates a second row. It returns a small
**JSON** contract — `{ok:true,duplicate:false}`, `{ok:true,duplicate:true}` or
`{ok:false,errorCode:"…"}` — and never echoes the lead, a secret, or a stack trace. The
app's `appendToSheet` treats success as **2xx AND JSON parsed AND `ok===true`**.

**Setup:**

1. Create a Google Sheet; add the header row above. Note the tab name (e.g. `Leads`).
2. **Extensions → Apps Script**, paste the script below.
3. **Project Settings → Script Properties** — add (NEVER hard-code these in the script):
   - `WEBHOOK_SECRET` = a random string (must equal `GOOGLE_SHEETS_WEBHOOK_TOKEN`);
   - `SPREADSHEET_ID` = the sheet's id (from its URL);
   - `SHEET_NAME` = the tab name (e.g. `Leads`).
4. **Deploy → New deployment → Web app**: execute as *Me*, access *Anyone*. Copy the
   `/exec` URL.
5. Set production secrets: `GOOGLE_SHEETS_WEBHOOK_URL=<the /exec URL>` and
   `GOOGLE_SHEETS_WEBHOOK_TOKEN=<the same WEBHOOK_SECRET>`.
6. Submit a clearly-marked test inquiry → confirm exactly one new row appears; re-POST
   the same `submissionId` → confirm **no** second row.

```javascript
// Google Apps Script — Miss Lana lead → Google Sheets append. Deploy as a Web App.
// Production-safe: WEBHOOK_SECRET / SPREADSHEET_ID / SHEET_NAME come from Script
// Properties (Project Settings → Script Properties), NEVER hard-coded. Dedupes by
// submissionId under a lock so a retried POST never adds a second row. Responds with a
// small JSON contract only — never the lead, a secret, the row, or a stack trace.
const COLS = [
  "submissionId", "id", "receivedAtUtc", "receivedAtLosAngeles", "status",
  "eventType", "eventDate", "eventTime", "city", "name", "phone", "email",
  "childCount", "show", "notes", "sourcePath", "utmSource", "utmMedium", "utmCampaign"
];

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty("WEBHOOK_SECRET");
  var spreadsheetId = props.getProperty("SPREADSHEET_ID");
  var sheetName = props.getProperty("SHEET_NAME") || "Leads";

  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return json_({ ok: false, errorCode: "BAD_REQUEST" });   // never log the body
  }

  // Authorize. On a bad/absent secret: add nothing, log nothing (no token, no body).
  if (!secret || body.token !== secret) {
    return json_({ ok: false, errorCode: "INVALID_TOKEN" });
  }

  var lead = body.lead || {};
  var submissionId = String(lead.submissionId || "");
  if (!submissionId) return json_({ ok: false, errorCode: "MISSING_SUBMISSION_ID" });

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);                                    // serialize check + append
  } catch (err) {
    return json_({ ok: false, errorCode: "LOCKED" });
  }

  try {
    var ss = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId)
                           : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return json_({ ok: false, errorCode: "SHEET_NOT_FOUND" });

    // Server-side dedupe: submissionId is column 1. A retry after the row was written
    // must NOT add a second row (Next.js dedupe alone can't cover a post-write retry).
    var subCol = COLS.indexOf("submissionId") + 1;           // 1-based
    var last = sheet.getLastRow();
    if (last >= 2) {
      var existing = sheet.getRange(2, subCol, last - 1, 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (String(existing[i][0]) === submissionId) {
          return json_({ ok: true, duplicate: true });
        }
      }
    }

    sheet.appendRow(COLS.map(function (k) { return lead[k] != null ? lead[k] : ""; }));
    return json_({ ok: true, duplicate: false });
  } catch (err) {
    return json_({ ok: false, errorCode: "APPEND_FAILED" }); // coarse only, no stack/PII
  } finally {
    lock.releaseLock();
  }
}
```

> **Privacy:** the sheet holds the same PII as the email/DB (name, phone, email, notes).
> Keep the spreadsheet **private/restricted** to the owner; never make it public or paste
> rows into public channels. The `token` (checked against `WEBHOOK_SECRET`) keeps
> anonymous POSTs from writing junk rows.

## Logs & privacy

Loggable (no PII): the **inquiry id**, the **channel name**, the **status**, a **coarse
error category**, and an HTTP status that contains no PII. **Never** logged: name, phone,
email, city/address, notes, show, the full Telegram text, the Sheet row, the webhook
request/response body, the Telegram token/chat id, the Sheets token, the Spreadsheet id,
or the MongoDB URI. Full data lives **only** in MongoDB, the closed Telegram chat, the
private Google Sheet, and the owner email. The Apps Script likewise returns coarse JSON
(`ok`/`duplicate`/`errorCode`) and never echoes the lead, a secret, or a stack trace.

## Provider ownership & recovery

- **Atlas project/cluster:** _record owner/login location + recovery details here (no
  passwords/URI)._ Dedicated Miss Lana project — not shared with any other app.
- **Email provider account:** _record owner/login location here (no passwords)._
- **Telegram bot/chat:** _record bot owner + chat here (no token)._
- **If the owner stops receiving emails:** check provider deliverability; leads are
  still in MongoDB and `notificationStatus.email` shows the failure — replay safely.
- **If Telegram is missing:** check the lead exists in MongoDB + `notificationStatus.
  telegram`; Telegram failure never means a lost lead.
- **If a Google Sheets row is missing:** check `notificationStatus.sheets`; verify the
  Apps Script deployment is live and the token matches. The lead is still in MongoDB +
  email — Sheets failure never means a lost lead.
- **If MongoDB is unavailable:** confirm whether email accepted the lead (the fallback
  record). The self-heal clears a rejected cached client automatically; verify Atlas
  network access, credentials, and service status. Never weaken security as a quick fix.
- **If both durable channels fail:** the route returns an honest 502 (`ok:false`) so
  the visitor is told to retry or call — no silent loss.

## Go-live checklist (before paid traffic)

- [ ] Set `MONGODB_URI` (dedicated Miss Lana Atlas cluster) in production secrets.
- [ ] Set `LEAD_EMAIL_WEBHOOK_URL` (+ token) in production secrets.
- [ ] Confirm `LEAD_NOTIFY_EMAIL=info@misslanatheatre.com`.
- [ ] Submit one **clearly-marked test** inquiry from **mobile** and **desktop**;
      confirm: success panel + id, one matching MongoDB record (`status:"new"`), email
      in `info@misslanatheatre.com`, Telegram alert (full fields), and — if configured —
      a new Google Sheets row.
- [ ] Force MongoDB failure (bad credential) with email working → visitor sees success
      via the email fallback.
- [ ] Force MongoDB **and** email failure → visitor sees an honest error + call CTA,
      **no** success panel.
- [ ] Submit the same `submissionId` twice → exactly one MongoDB record.
- [ ] Confirm logs contain **no PII** (id + channel status only).
- [ ] Confirm no secrets are in the repo (`security/secret-scan.sh`).
- [ ] Only **after** the above: the LeadForm's "we'll reply in 1–2 business days"
      copy is accurate end to end, and `noindex`/paid traffic may be reconsidered.

## Extending later (out of scope here)

- An admin/CRM view over the `leads` collection (currently operators read via the
  email + Atlas console).
- Front the in-memory rate limiter with an edge/provider limiter for multi-instance
  deploys.
- A customer acknowledgement email is intentionally **not** sent yet — only add it
  once sender reputation/deliverability is proven (don't promise what isn't sent).
