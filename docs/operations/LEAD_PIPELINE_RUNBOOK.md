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
3. **Delivery** (`lib/notify.ts`) — in order:
   1. **Persist** a durable JSON record to the lead store **first** (the recovery
      guarantee). A lead is "accepted" once persisted.
   2. **Email** the owner via the provider-agnostic webhook (primary notification).
   3. **Telegram** short alert (optional secondary), if configured.
4. The route returns `{ ok: true, id }` only if the durable persist succeeded.
   Provider (email/Telegram) failures are **logged with the id only** (no PII) so
   the operator can recover from the store — the visitor still sees success because
   the lead is safely recorded.

## Configuration (set in deployment secrets — never commit)

All access goes through `lib/env.ts`. Keys mirror `.env.example`:

| Env var | Purpose | Required? |
|---|---|---|
| `LEAD_NOTIFY_EMAIL` | Owner email. Defaults to `info@misslanatheatre.com`. | No (has default) |
| `LEAD_EMAIL_WEBHOOK_URL` | POST `{to, subject, text}` → sends the owner email. Use Resend / Postmark / SES relay / a serverless fn. | **Yes for inbox delivery** |
| `LEAD_EMAIL_WEBHOOK_TOKEN` | Optional `Authorization: Bearer …` for the webhook. | No |
| `LEAD_STORE_DIR` | Durable store path. Default `.leads` (git-ignored). | No |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Optional secondary alert (both required to enable). | No |

> **The email webhook is the one piece that needs live credentials.** Until
> `LEAD_EMAIL_WEBHOOK_URL` is set and verified in production, every valid lead is
> still **durably stored** (nothing is lost) and the owner can be alerted via
> Telegram — but no email lands in the inbox. See "Go-live checklist".

## Durable store

- One JSON file per inquiry: `<LEAD_STORE_DIR>/<yyyy-mm-dd>_<id>.json`.
- Written with `flag: "wx"` (never overwrites an id).
- Contains PII (name, phone, optional email, notes) → the directory is
  **git-ignored** (`.leads/`) and must be access-controlled on the host. Never
  serve it, never commit it, never copy it into reports/screenshots.
- On a persistent host, point `LEAD_STORE_DIR` at a durable volume. On ephemeral
  serverless filesystems, configure the email webhook (and/or Telegram) so the
  notification — not the local file — is the system of record, and/or swap the
  store adapter for an object store / DB (see "Extending").

## Provider ownership & recovery

- **Email provider account:** _record owner/login location here (no passwords)._
- **Telegram bot/chat:** _record bot owner + chat here (no token)._
- **If the owner stops receiving emails:** check provider dashboard deliverability;
  meanwhile leads are in the store (`LEAD_STORE_DIR`) and can be replayed.
- **If the store fills/errors:** the route returns an honest failure (HTTP 502,
  `ok:false`) so the visitor is told to retry or call — no silent loss.

## Go-live checklist (before paid traffic)

- [ ] Set `LEAD_EMAIL_WEBHOOK_URL` (+ token) in production secrets.
- [ ] Submit one real inquiry from **mobile** and **desktop**; confirm it lands in
      `info@misslanatheatre.com` and a store record exists.
- [ ] Force a provider failure (bad webhook URL) and confirm the visitor sees a
      retry message, **not** a false success, and the lead is still stored.
- [ ] Confirm `LEAD_STORE_DIR` is on durable, access-controlled storage.
- [ ] Confirm no secrets are in the repo (`security/secret-scan.sh`).
- [ ] Only **after** the above: the LeadForm's "we'll reply in 1–2 business days"
      copy is accurate end to end.

## Extending later (out of scope here)

- Swap the file store for a DB / object store by replacing `persist()` in
  `lib/notify.ts` (same `DeliveryResult` contract).
- Front the in-memory rate limiter with an edge/provider limiter for multi-instance
  deploys.
- A customer acknowledgement email is intentionally **not** sent yet — only add it
  once sender reputation/deliverability is proven (don't promise what isn't sent).
