# Closure Report — Durable Lead Store (MongoDB Atlas)

- **Report ID:** `IMPLEMENT_MISS_LANA_DURABLE_LEAD_STORE_MONGODB_001`
- **Plan:** `docs/operations/MISS_LANA_PRODUCTION_LEAD_PIPELINE_PLAN.md`
- **Date:** 2026-06-28
- **Branch:** `feat/miss-lana-durable-lead-store`
- **Base commit:** `e5d95bc1d5cfd5b98d0bddce76ae76496553373b`
- **Resolves:** full-repo review finding **B1 (BLOCKER, conditional)** — durable
  lead-store previously wrote to local disk; on serverless/read-only FS every lead
  risked a 502 / silent loss.

---

## 1. Scope of this session

**Implemented (code + tests + docs):** plan Phases A (prep/inventory), C (schema +
idempotency), D (durable storage code), D2 (demote local file to dev-only), E (delivery
orchestration + notification-status persistence), F (automated tests), I (technical
docs). The `.env.example`, runbook, `STATUS.md`, and `PROJECT_PROGRESS.md` are updated.

**NOT done — requires external infrastructure / owner action (still launch-blocking):**
plan Phases **B** (create the Atlas project/cluster/user), **G** (Preview deploy +
Preview happy/failure-path E2E), **H** (Production secrets, deploy, Production E2E),
**J** (final launch gate), and the open owner decisions in plan §10 (retention period,
Telegram recipients, email-in-Telegram, Production email provider, Atlas network
hardening). These cannot be performed from the repository.

---

## 2. Final architecture

```text
Visitor submits booking form (LeadForm: crypto.randomUUID submissionId)
          ↓
POST /api/lead — honeypot → rate-limit (per-IP) → authoritative validation
          ↓
buildLead (inquiry id ML-XXXXX + sanitized submissionId + receivedAt)
          ↓
deliverLead:
  1. persist → MongoDB Atlas (insert-only; submissionId unique → idempotent)
  2. email + telegram in parallel
  3. accepted = mongo.ok || email.ok   (Telegram NEVER an acceptance signal)
  4. patch notificationStatus on the stored lead (best-effort)
          ↓
Honest JSON: { ok:true, id } only when accepted; else 502 / 4xx
```

- **Durable authority:** MongoDB Atlas, db `misslana`, collection `leads`.
- **Acceptance rule:** `mongo.status === "ok" || email.status === "ok"`.
- **Dev/e2e fallback:** when `MONGODB_URI` is unset, a real local-disk copy under
  `LEAD_STORE_DIR` is the record (genuine durability on a dev disk). Production always
  sets `MONGODB_URI`, so the local file is never the production authority.

---

## 3. Files changed

| File | Change |
|---|---|
| `lib/leadStore.ts` | **New.** Cached self-healing `MongoClient`, idempotent indexes, insert-only `storeLead`, `updateNotificationStatus`, PII-free error reasons, `__resetForTests`. |
| `lib/leads.ts` | `+submissionId` on `Lead`; `buildLead` takes `submissionId`; `+sanitizeSubmissionId`; `+StoredLead`/`LeadStatus`/`ChannelStatus`/`NotificationStatus` types; `+toStoredLead`. |
| `lib/notify.ts` | `deliverLead` persists to Mongo (primary) then email/telegram; `accepted = mongo||email`; local file demoted to dev-only `writeDevCopy`; Telegram rewritten to short PII-free alert; notification-status patched best-effort; error reasons hardened to category-only. |
| `lib/env.ts` | `+mongodbUri` (lazy, server-only secret); `+leadRateLimitPerMinute` (default 5). |
| `app/api/lead/route.ts` | Reads + sanitizes `submissionId` (fallback `randomUUID`); rate limit reads `env.leadRateLimitPerMinute`. |
| `components/shell/LeadForm.tsx` | Generates `crypto.randomUUID()` submissionId once per attempt, reuses on retry, resets after success. |
| `tests/unit/leadStore.test.ts` | **New.** Store in isolation (mongodb mocked). |
| `tests/unit/notify.test.ts` | Rewritten — store mocked; full acceptance matrix + status + PII. |
| `tests/unit/leads.test.ts` | `+submissionId` threading; `+sanitizeSubmissionId`/`+toStoredLead` cases. |
| `tests/e2e/lead-api.spec.ts` | `+`idempotency cases; rate-limit test isolated via unique `X-Forwarded-For`. |
| `playwright.config.ts` | e2e webServer sets `LEAD_RATE_LIMIT_PER_MINUTE=50`. |
| `.env.example`, `docs/operations/LEAD_PIPELINE_RUNBOOK.md`, `STATUS.md`, `docs/PROJECT_PROGRESS.md` | Documentation. |
| `package.json` / `pnpm-lock.yaml` | `+mongodb@7.4.0`. |

---

## 4. Schema & indexes

`StoredLead` (db `misslana`, coll `leads`): `id`, `submissionId`, `receivedAt`,
`updatedAt`, `status` (`new`→…), customer fields (name, phone, optional email,
eventType, date, optional time, city, optional childCount/show/notes), `source`
(path/UTM), `notificationStatus` (email/telegram/lastAttemptAt). **Never stored:** IP,
user-agent, geo, raw bodies, provider tokens/responses (verified by a unit test).

Indexes (ensured idempotently): `id` unique, `submissionId` unique, `receivedAt` desc,
`status` asc. **No** unique index on email/phone — a repeat customer may book twice.

---

## 5. Environment variables added

- `MONGODB_URI` — **secret**, server-only, the durable production store. Lazy getter;
  build succeeds when absent, a request fails cleanly (falls back to email/dev-file).
- `LEAD_RATE_LIMIT_PER_MINUTE` — optional, default 5; raised to 50 in e2e only.

`.env.example` ships placeholders only; no real value committed.

---

## 6. Test commands & results

| Command | Result |
|---|---|
| `pnpm lint` | ✅ clean |
| `pnpm typecheck` | ✅ clean |
| `pnpm governance` | ✅ 0 issues |
| `pnpm secret-scan` | ✅ OK — no real secrets (404 files) |
| `pnpm test:unit` | ✅ 65 passed (3 files) |
| `pnpm build` | ✅ `/api/lead` dynamic; no build-time `MONGODB_URI` dependency |
| `pnpm run ci:exact` | ✅ exit 0 |
| `pnpm test:e2e` | ✅ 63 passed |
| `git diff --check` | ✅ clean |

Acceptance matrix (F2) verified in `notify.test.ts`:

| MongoDB | Email | Telegram | Result |
|---|---|---|---|
| ok | * | * | accepted |
| error | ok | * | accepted (email fallback) |
| error | error/skipped | ok | **rejected** (Telegram never accepts) |
| error | error | error | rejected |

Store behaviour (F1) verified in `leadStore.test.ts`: fresh insert, duplicate
`submissionId`→idempotent, two distinct submissions both insert, missing URI,
connection failure→clean reason, **self-heal** (failed connect cleared → next call
reconnects), idempotent indexes, no PII in reasons.

---

## 7. Security & privacy review

- No secret value committed; `MONGODB_URI` is a placeholder in `.env.example`,
  read only via the lazy `lib/env` getter (governance: 0 issues).
- Logs carry inquiry id + channel status only — verified by PII tests in both
  `notify.test.ts` and `leadStore.test.ts`.
- Store error reasons mapped to coarse categories (`atlas unreachable`, `timeout`,
  `auth failed`) — never the raw driver message (which can embed host/query fragments).
- Telegram payload contains id/type/date/city only — never name/phone/email/notes.
- `noindex` removal and paid traffic were **not** touched by this task. (Note: the
  site was already publicly indexed by a prior owner decision on 2026-06-27, recorded
  in STATUS.md — that pre-dates and is independent of this work.)

---

## 8. Remaining risks / open items

1. **Infra not provisioned** — no Atlas cluster, no Vercel Preview/Production secrets,
   no Preview/Production E2E, no owner confirmation. Lead delivery is **not**
   launch-verified until plan Phases B/G/H/J pass.
2. **Owner decisions open** (plan §10): retention period, Telegram recipients,
   email-in-Telegram (default: no), Production email provider, Atlas network hardening.
3. **Privacy copy (plan I2)** — public privacy statement update depends on the owner
   decisions above; not written here to avoid inventing answers.
4. **In-memory rate limiter** is per-instance — fine for current single-instance
   deploy; front with an edge limiter for multi-instance (documented).

---

## 9. Verdict

**DO NOT CLOSE** the overall plan yet — the code/test/docs deliverable is complete and
verified (`CLOSE`-ready on its own), but the plan's P0 launch gate (Phase J) depends on
infrastructure provisioning, Preview/Production E2E, and owner confirmation that are
out of repository scope. Hand off the infra checklist (plan Phases B, G, H, J + §10
decisions) to the technical/business owner. **Do not remove `noindex` or start paid
traffic on the basis of this code alone** — the live end-to-end verification gates
remain open.
