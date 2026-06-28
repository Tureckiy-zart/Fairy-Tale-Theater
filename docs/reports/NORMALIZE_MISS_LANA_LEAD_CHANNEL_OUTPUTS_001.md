# NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001 — Closure Report

- **Task:** `NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001` (v2.0, mode `fix`, P0)
- **Layer:** Miss Lana / lead delivery outputs / Telegram + Google Sheets
- **Branch:** `claude/normalize-miss-lana-outputs-k1cye1`
- **Base commit:** `40744ac1e1688e0f924cf0170e53566b2f06411c`
- **Date:** 2026-06-28
- **Verdict:** **DO NOT CLOSE** — code, tests and docs are CLOSE-ready and green; the
  only open items are the **operator-gated live verification** (Step 9) and **owner
  privacy confirmations** (Telegram membership / Sheet permissions / retention period).

---

## 1. Objective

Normalize and harden the **output** of the two secondary working channels (Telegram
owner group + Google Sheets) **without** touching the architecture, the acceptance rule,
the form, or the durable schema. MongoDB Atlas remains the durable source of truth;
Telegram and Google Sheets remain secondary and **never** participate in acceptance.

**Acceptance contract — UNCHANGED:**

```ts
accepted = mongo.status === "ok" || email.status === "ok";
```

Telegram and Google Sheets are excluded from `accepted`.

---

## 2. Files changed

| File | Change |
|---|---|
| `lib/leads.ts` | Rewrote `formatLeadTelegram`; added `formatEventDate`, `formatReceivedLosAngeles`, `TELEGRAM_SAFE_LIMIT`, `TELEGRAM_TRUNCATION_MARKER`; rewrote `toSheetRow` + added `GOOGLE_SHEETS_COLUMNS`/`SheetColumn` + formula-injection neutralizer. |
| `lib/notify.ts` | `persist` surfaces the Mongo `duplicate` flag; `deliverLead` suppresses all secondary delivery on a duplicate `submissionId`; `appendToSheet` hardened (2xx AND JSON AND `ok===true`). |
| `tests/unit/leads.test.ts` | Full formatter + Sheets-row test coverage (§13.1, §13.2). |
| `tests/unit/notify.test.ts` | Sheets adapter hardening, idempotency/duplicate suppression, Sheets-inclusive acceptance matrix (§13.3–§13.5). |
| `docs/operations/LEAD_PIPELINE_RUNBOOK.md` | Channel roles, privacy decisions, Logs & privacy, fixed column contract, hardened Apps Script, recovery. |
| `docs/operations/MISS_LANA_PRODUCTION_LEAD_PIPELINE_PLAN.md` | §0 normalization addendum (supersedes the "short Telegram" §E4 content rule). |
| `.env.example` | Google Sheets webhook comments (Script Properties / `WEBHOOK_SECRET`). |
| `STATUS.md`, `docs/PROJECT_PROGRESS.md` | Snapshot + chronology. |
| `tasks/lead-pipeline/NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001.json` | Task record. |

No unrelated files were modified.

---

## 3. What changed, by requirement

### 3.1 Telegram (§6)

- **One pure, deterministic formatter** (`formatLeadTelegram`), no side effects.
- **Stable field order** (§6.1): ID, Type, Date and time, City, Name, Phone, Email,
  Children, Show, Notes, then Source, UTM Source/Medium/Campaign, Received. Empty
  optionals are **omitted entirely** (no `—` rows).
- **Event date keeps its calendar day** (§6.2): `2026-08-10` → `August 10, 2026`
  (+ ` at 11:25 AM` when a time is present) — formatted from the literal `yyyy-mm-dd`
  parts, never a UTC `Date` parse, so the day cannot shift in any timezone.
- **Received time in America/Los_Angeles** (§6.3): e.g. `June 28, 2026 at 11:25 AM PDT`
  via `Intl.DateTimeFormat` parts (DST-correct PST/PDT). The canonical UTC ISO stays in
  MongoDB.
- **Special characters** (§6.4): plain text, **no `parse_mode`**, so `* _ < > & \` ~ [ ]
  ( ) # + - = | { } . !`, emoji, Cyrillic and newlines render verbatim and can never
  break the request or be interpreted as markup.
- **Length** (§6.5): guaranteed `<= TELEGRAM_SAFE_LIMIT` (3900, well under the 4096 Bot
  API limit). Only **Notes** is trimmed (with the marker `[truncated — full text is
  stored in MongoDB and Google Sheets]`); id/name/phone/email/date/city/type are never
  cut, and the source `Lead.notes` is left intact (full text persists to the store).

### 3.2 Google Sheets row (§7)

- **Fixed column contract** `GOOGLE_SHEETS_COLUMNS` (frozen order): `submissionId, id,
  receivedAtUtc, receivedAtLosAngeles, status, eventType, eventDate, eventTime, city,
  name, phone, email, childCount, show, notes, sourcePath, utmSource, utmMedium,
  utmCampaign`.
- `toSheetRow` returns **every** column as a **string**, stable cell count matching the
  header; `null`/`undefined` → `""`; stores `submissionId`, the inquiry `id`, the **full**
  notes, the UTC ISO and the LA human-readable mirror.
- **Formula-injection neutralized** (§7.2): any value whose first non-space char is
  `= + - @` is prefixed with `'`, so `=IMPORTXML(...)`, `+44…`, `-12`, `@x` are stored as
  text. **Phone numbers stay text**, never a formula or number.

### 3.3 Apps Script (§8) — in the runbook

- Secret, Spreadsheet id and Sheet name from **Script Properties** (no hard-coding).
- **Token auth** vs `WEBHOOK_SECRET`; bad/absent token → `{ok:false,errorCode:"INVALID_TOKEN"}`,
  no token/body logging.
- **Server-side dedupe by `submissionId`** (a post-write retry never adds a second row).
- **`LockService`** spans find → check → append (no concurrent double-append).
- JSON responses only: `{ok:true,duplicate:false}` / `{ok:true,duplicate:true}` /
  `{ok:false,errorCode}`. Never returns lead/PII/secret/row/stack.

### 3.4 `appendToSheet` (§9)

Success = **HTTP 2xx AND JSON parsed AND `body.ok === true`**. Mapped outcomes:
config-missing → `skipped`; non-2xx → `error`; `ok:false` → `error`; malformed JSON →
`error`; timeout/abort/network → `error`; `duplicate:true` → `ok`. No response body, URL
or token is logged.

### 3.5 Orchestration + notification status (§10, §11)

- `deliverLead` inspects the Mongo result. On a **duplicate** `submissionId` it returns a
  **safe success** and suppresses Telegram, Sheets **and** email (all `skipped` —
  "duplicate submission"), and does **not** re-patch the first submission's statuses.
- A genuinely new `submissionId` delivers once across all channels.
- `notificationStatus` carries `email` / `telegram` / `sheets` (the Google Sheets
  channel) + `lastAttemptAt`; the patch stays best-effort and never flips
  acceptance.

---

## 4. Automated verification (§16)

```text
git status --short        clean before edits; only in-scope files after
pnpm lint                 0 errors, 1 pre-existing warning (unused `_init` in a test mock)
pnpm typecheck            clean
pnpm governance           governance: 0 issues
pnpm secret-scan          OK — no real secrets detected (407 files scanned)
pnpm test:unit            107 passed (3 files) — was 72 at baseline (+35)
pnpm build                compiled successfully, 27/27 pages prerendered
pnpm run ci:exact         GREEN (lint && typecheck && governance && secret-scan && test:unit && build)
pnpm test:e2e             lead-api spec: ALL GREEN (honeypot, valid, idempotent retry,
                          distinct submissionIds, 400/413/422, rate-limit). site/design
                          browser specs FAIL TO LAUNCH the browser: "Executable doesn't
                          exist … chromium_headless_shell-1223" — a Playwright
                          browser-version mismatch in this sandbox (installed 1194,
                          required 1223), independent of this diff (server-side lib only,
                          confirmed by the green build prerendering all pages).
git diff --check          clean (no whitespace errors)
```

**Focused runs:** `formatLeadTelegram`, `formatEventDate`, `formatReceivedLosAngeles`,
`toSheetRow`, `appendToSheet` hardening, duplicate suppression and `notificationStatus`
are each covered by the unit suites above.

---

## 5. Output-contract proof (§ Step 4)

- **Field order / omission:** `formatLeadTelegram` tests assert the order and that empty
  optionals (email, show, notes, children, UTM) produce no rows (`/: *\n/` never matches).
- **Date safety:** `formatEventDate("2026-08-10")` === `"August 10, 2026"` across `UTC`,
  `America/Los_Angeles`, `Pacific/Kiritimati`, `Etc/GMT+12` (no day shift).
- **LA timezone + DST:** summer ISO → `… 11:25 AM PDT`; winter ISO → `… PST` (not PDT).
- **Length + truncation:** a ~24k-char Notes yields a message `<= 3900` containing the
  marker, with id/phone/email intact and the source `Lead.notes` unmutated.
- **Sheets columns:** `Object.keys(toSheetRow(lead))` deep-equals `GOOGLE_SHEETS_COLUMNS`;
  all values are strings; header length === row length.
- **Formula neutralization:** `=IMPORTXML(...)`, `+12345`, `-12345`, `@mention`,
  `+44123456789` (phone) each gain a leading `'`.
- **Apps Script contract:** documented JSON `{ok,duplicate,errorCode}`; never returns PII.

## 6. Idempotency proof (§ Step 5)

- **Fresh:** Telegram called once, Sheets called once, store ok (1 Mongo doc).
- **Duplicate `submissionId`:** `fetch` not called at all; Telegram/Sheets/email all
  `skipped`; `accepted === true`; `notificationStatus` not re-patched.
- **Two different `submissionId`s:** Telegram called twice, Sheets called twice.

## 7. Failure-matrix proof (§ Step 6, §13.5)

| MongoDB | Email | Telegram | Sheets | Expected | Result |
|---|---|---|---|---|---|
| ok | any | error | error | accepted | ✅ |
| error | ok | error | error | accepted | ✅ |
| error | error | ok | ok | rejected | ✅ |
| error | skipped | ok | ok | rejected | ✅ |
| error | error | error | error | rejected | ✅ |

Telegram/Sheets success never creates a false accept; their failure never rejects a
durable lead.

---

## 8. Privacy & secrets (§12, § Step 7)

- **No PII in logs/results:** the `deliverLead` result and channel reasons are asserted
  free of name/phone/email/notes; the Sheets adapter outcome is asserted free of PII, the
  token, and the webhook host.
- **No secrets in Git:** `secret-scan` clean (407 files); `.env.example` has placeholders
  only; the Apps Script reads secrets from Script Properties (none in the repo).
- **Closed/private channels:** Telegram group is closed + owner-controlled; the Google
  Sheet is private/restricted; the webhook is authenticated with a shared secret. Exact
  Telegram membership and Sheet ACLs are **owner-controlled facts to confirm out-of-repo**.

---

## 9. Reviewer-grade review (§17, § Step 8)

- **Acceptance unchanged** — `accepted = mongo || email`; Telegram/Sheets excluded. ✅
- **Duplicate → no secondary delivery** — verified by tests. ✅
- **Apps Script dedupe is server-side + LockService spans check+append** — code + docs. ✅
- **Formula injection closed**, **dates don't shift**, **Telegram length bounded**,
  **PII absent from logs**, **secrets absent from Git**, **unrelated files untouched**. ✅
- Findings: **no BLOCKER, no unresolved HIGH.**
  - **LOW:** one pre-existing eslint warning (unused `_init` arg in the notify test
    fetch mock) predates this task and is out of scope (CLAUDE.md §6).
  - **NOTE:** `formatLeadSummary` (email body) still shows raw ISO date/received — email
    is the existing fallback channel and out of this task's Telegram/Sheets scope; left
    unchanged intentionally.
  - **NOTE:** no public privacy page exists in `app/`; privacy decisions are recorded in
    the runbook/plan and remain owner-gated (retention OPEN).

---

## 10. Open items (why DO NOT CLOSE)

1. **Live verification (Step 9)** — synthetic production lead + duplicate test require
   explicit operator permission and live secrets; **not performed** (no deploy/secret
   changes were authorized).
2. **Owner privacy confirmations** — Telegram chat membership, Google Sheet permissions,
   and the **retention period (OPEN OWNER DECISION)** must be confirmed by the owner.

Everything code/test/doc-side is green and CLOSE-ready; closure is blocked only on the
above operator/owner gates.
