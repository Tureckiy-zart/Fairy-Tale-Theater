# Lead Pipeline — Operations Runbook

> Booking inquiries from the site's LeadForm. **No secrets in this file.** Owner
> notification target: `info@misslanatheatre.com`. Owner (Svitlana) replies within
> 1–2 business days. Built by `IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001`.

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
   3. **Telegram** short alert (optional secondary), if configured — id/type/date/city
      only, never name/phone/email/notes.
   4. **Patch** the stored lead's `notificationStatus` (best-effort; never flips
      acceptance).
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
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Optional secondary alert (both required to enable). | No |

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

## Provider ownership & recovery

- **Atlas project/cluster:** _record owner/login location + recovery details here (no
  passwords/URI)._ Dedicated Miss Lana project — not shared with any other app.
- **Email provider account:** _record owner/login location here (no passwords)._
- **Telegram bot/chat:** _record bot owner + chat here (no token)._
- **If the owner stops receiving emails:** check provider deliverability; leads are
  still in MongoDB and `notificationStatus.email` shows the failure — replay safely.
- **If Telegram is missing:** check the lead exists in MongoDB + `notificationStatus.
  telegram`; Telegram failure never means a lost lead.
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
      in `info@misslanatheatre.com`, Telegram alert (short fields only).
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
