# Miss Lana — Production Lead Pipeline Implementation Plan

- **Document ID:** `MISS_LANA_PRODUCTION_LEAD_PIPELINE_PLAN_001`
- **Status:** APPROVED IMPLEMENTATION PLAN
- **Priority:** P0 — launch blocker
- **Project:** Miss Lana’s Fairy-Tale Theatre
- **Target domain:** `misslanatheatre.com`
- **Primary contact:** `info@misslanatheatre.com`
- **Created:** 2026-06-28
- **Based on audit:** `2026-06-28-umarun-telegram-lead-pipeline-audit.md`
- **Recommended repository path:** `docs/operations/MISS_LANA_PRODUCTION_LEAD_PIPELINE_PLAN.md`

---

## 0. Addendum — channel-output normalization (2026-06-28)

> Task `NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001` normalized the **output** of the
> two secondary working channels. It does **not** change the architecture, the acceptance
> rule, the form, or the schema. It **supersedes** two earlier presentational decisions:
>
> 1. **Telegram is now the FULL inquiry, incl. PII** (name, phone, email, notes), by
>    explicit **owner approval**, sent only to the **closed, owner-controlled** chat — so
>    §E4 below ("short alert only / do not include full notes/phone/email") is superseded
>    for content. The HTTP/timeout/never-accept rules in §E4 still hold.
> 2. **Google Sheets** is a recognized secondary channel with a **fixed column contract**,
>    formula-injection protection, server-side `submissionId` dedupe (LockService), and a
>    JSON `{ok,duplicate,errorCode}` response contract. It remains **never** an acceptance
>    signal (it is **not** the "primary database" non-goal in §4).
>
> Normalization guarantees added: event date keeps its **calendar day** (no UTC shift);
> received time renders in **America/Los_Angeles** (PST/PDT); empty optional fields are
> omitted; Telegram stays under a safe length (only **Notes** is trimmed, with a marker;
> full text stays in MongoDB + Sheets); a **duplicate `submissionId` suppresses** all
> secondary delivery (no second message/row/email). `notificationStatus` carries the
> `sheets` channel status. Evidence: `docs/reports/NORMALIZE_MISS_LANA_LEAD_CHANNEL_OUTPUTS_001.md`.
> **Retention period remains OPEN OWNER DECISION** (§10).

---

## 1. Purpose

This document is the single execution checklist for making the Miss Lana booking form production-safe.

The objective is to ensure that:

1. every valid booking inquiry is stored in durable external storage;
2. the owner receives prompt email and Telegram notifications;
3. the visitor never sees a false success state;
4. a temporary notification-provider failure does not lose the inquiry;
5. duplicate retries do not create accidental duplicate leads;
6. secrets and customer personal data are handled safely;
7. the form is verified in Preview and Production before `noindex` is removed or paid traffic is started.

This plan must remain the source of truth until the lead pipeline is fully implemented, tested and closed.

---

## 2. Approved architecture

```text
Visitor submits booking form
          ↓
Server-side parsing, abuse checks and validation
          ↓
Create stable inquiry ID + submission ID
          ↓
Persist inquiry in MongoDB Atlas
          ↓
Send notifications
├── Email: complete inquiry to info@misslanatheatre.com
└── Telegram: short operational alert without full PII
          ↓
Return an honest result to the visitor
```

### Acceptance rule

```text
accepted =
  MongoDB write succeeded
  OR
  email provider confirmed acceptance
```

Telegram must never be used as an acceptance signal.

### Channel roles

| Channel | Role | Can determine success? |
|---|---|---:|
| MongoDB Atlas | Durable source of truth | Yes |
| Email | Primary owner notification and emergency fallback | Yes |
| Telegram | Fast secondary alert | No |
| `.leads/` or `/tmp` | Development/debug best-effort copy only | No |

---

## 3. Decisions locked by this plan

- [x] Use an external durable database.
- [x] Use MongoDB Atlas, following the proven serverless connection pattern from Umarun.
- [x] Keep the existing Miss Lana API route, validation, honeypot, rate limiting, email and Telegram structure.
- [x] Replace the local filesystem as the production persistence authority.
- [x] Keep email as the primary full-detail notification.
- [x] Keep Telegram as a short secondary notification.
- [x] Do not deduplicate booking requests by email.
- [x] Use a dedicated request/submission identifier for idempotency.
- [x] Keep full PII out of Telegram and logs.
- [x] Do not launch paid traffic until the production end-to-end test is complete.

---

## 4. Explicit non-goals

The implementation task must not expand into unrelated work.

Do not include:

- admin dashboard;
- CRM interface;
- Google Sheets as the primary database;
- redesign of the booking form;
- rewrite from JSON API to React server actions;
- new public pricing;
- changes to brand copy;
- analytics dashboard;
- automatic sales follow-up;
- payment/deposit processing;
- migration of Umarun data or credentials;
- reuse of the Umarun bot, database user or MongoDB connection string;
- public removal of `noindex` before launch gates pass.

---

## 5. Safety rules

- Never commit real environment variable values.
- Never print or log MongoDB URIs, Telegram tokens or email-provider tokens.
- Never log a full lead object.
- Never log customer name, phone, email, address or notes.
- Never use `git add .`.
- Never mix this implementation with unrelated site changes.
- Never use `.leads/` or `/tmp` as proof that a production lead is durable.
- Never show success merely because Telegram accepted a message.
- Never use customer email as a unique booking key.
- Never run destructive database commands against Production.
- Never send a production test inquiry without clearly marking it as a test.
- Never remove `noindex` or start ads before the final launch gate is signed off.

---

# PHASE A — Repository and implementation preparation

## A1. Establish a clean work area

- [ ] Record current branch.
- [ ] Record current commit SHA.
- [ ] Run `git status --short`.
- [ ] Confirm unrelated pre-launch changes are not mixed into this task.
- [ ] Create a dedicated branch or worktree:

```text
feat/miss-lana-durable-lead-store
```

- [ ] Confirm no secrets exist in the working tree.
- [ ] Confirm the audit report is available for reference.

### Exit criterion

- [ ] The implementation begins from a known commit.
- [ ] Only lead-pipeline files will be touched.
- [ ] Existing unrelated changes are preserved safely.

---

## A2. Inventory the current lead pipeline

Inspect and document the current behavior of:

```text
app/api/lead/route.ts
lib/leads.ts
lib/notify.ts
lib/env.ts
components/shell/LeadForm.tsx
tests/unit/leads.test.ts
tests/unit/notify.test.ts
tests/e2e/lead-api.spec.ts
docs/operations/LEAD_PIPELINE_RUNBOOK.md
.env.example
```

Confirm:

- [ ] server-side body-size limit;
- [ ] honeypot behavior;
- [ ] rate-limit behavior;
- [ ] authoritative server validation;
- [ ] inquiry-ID generation;
- [ ] current `DeliveryResult` contract;
- [ ] current acceptance rule;
- [ ] email HTTP-status validation;
- [ ] Telegram HTTP-status validation;
- [ ] timeout behavior;
- [ ] client success/error UI;
- [ ] current production deployment target.

### Exit criterion

- [ ] The current behavior is written down before any code is changed.
- [ ] The implementation preserves all existing stronger Miss Lana protections.

---

# PHASE B — MongoDB Atlas setup

## B1. Create a dedicated Atlas project

Create a separate project for Miss Lana.

Recommended identifiers:

```text
Atlas project: Miss Lana
Database: misslana
Collection: leads
```

- [ ] Do not reuse the Umarun database.
- [ ] Do not reuse the Umarun database user.
- [ ] Do not reuse the Umarun connection string.
- [ ] Use a strong generated password.
- [ ] Give the application user `readWrite` access only to the `misslana` database.
- [ ] Record ownership and recovery details outside the repository.

### Exit criterion

- [ ] A dedicated database and least-privilege application user exist.

---

## B2. Configure network access

- [ ] Determine the actual Vercel/hosting network constraints.
- [ ] Prefer a supported Vercel–MongoDB integration or restricted egress configuration.
- [ ] If temporary broad access is necessary, record it as security debt.
- [ ] Never weaken database authentication to compensate for networking.
- [ ] Add a follow-up hardening item if `0.0.0.0/0` is temporarily used.

### Exit criterion

- [ ] Preview can connect to Atlas.
- [ ] The chosen network rule and its risk are documented.

---

## B3. Add environment configuration

Required server-only variable:

```text
MONGODB_URI
```

Existing variables to retain:

```text
LEAD_NOTIFY_EMAIL
LEAD_EMAIL_WEBHOOK_URL
LEAD_EMAIL_WEBHOOK_TOKEN
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

- [ ] Add only placeholders/comments to `.env.example`.
- [ ] Add Preview secrets in Vercel.
- [ ] Do not add Production secrets yet.
- [ ] Add a lazy `mongodbUri` getter to `lib/env.ts`.
- [ ] Ensure no client component can import the secret.

### Exit criterion

- [ ] Preview has valid secrets.
- [ ] Build succeeds when `MONGODB_URI` is absent at build time.
- [ ] Runtime fails cleanly when it is absent during a request.

---

# PHASE C — Data model and idempotency

## C1. Define the stored lead document

Use the existing validated Miss Lana lead fields as the basis.

Minimum document:

```ts
type StoredLead = {
  id: string;
  submissionId: string;

  receivedAt: string;
  updatedAt: string;
  status: "new" | "contacted" | "booked" | "declined" | "spam";

  name: string;
  phone: string;
  email?: string;
  preferredContactMethod?: string;

  eventType: string;
  date: string;
  time?: string;
  city: string;
  address?: string;
  childCount?: number;
  show?: string;
  notes?: string;

  source: {
    path?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };

  notificationStatus: {
    email: "pending" | "ok" | "error" | "skipped";
    telegram: "pending" | "ok" | "error" | "skipped";
    lastAttemptAt?: string;
  };
};
```

Rules:

- [ ] `status` starts as `new`.
- [ ] `updatedAt` initially equals `receivedAt`.
- [ ] Do not store IP address.
- [ ] Do not store user agent.
- [ ] Do not store geo data.
- [ ] Do not store raw unvalidated request bodies.
- [ ] Do not store provider tokens or provider response bodies.

### Exit criterion

- [ ] The schema is documented and represented by a TypeScript type.
- [ ] Every stored customer field has a business reason.

---

## C2. Add stable idempotency

A booking customer may send multiple legitimate requests using the same phone or email. Therefore:

- [ ] Do not create a unique index on email.
- [ ] Do not create a unique index on phone.
- [ ] Create a `submissionId` before the first network attempt.
- [ ] Reuse the same `submissionId` when the client retries the same submission.
- [ ] Create a unique index on `submissionId`.
- [ ] Keep the public/internal inquiry `id` unique.
- [ ] Use insert-only semantics.
- [ ] Treat duplicate-key on the same `submissionId` as an idempotent success, not as a second lead.

Recommended indexes:

```text
id            unique
submissionId  unique
receivedAt    descending
status        ascending
```

### Exit criterion

- [ ] A double click or browser retry produces one stored inquiry.
- [ ] Two separate bookings from the same customer produce two inquiries.

---

# PHASE D — Durable storage implementation

## D1. Create the storage module

Recommended path:

```text
lib/leadStore.ts
```

Required implementation characteristics:

- [ ] server-only module;
- [ ] lazy environment-variable access;
- [ ] `MongoClient` promise cached on `globalThis`;
- [ ] no connection created per request;
- [ ] `serverSelectionTimeoutMS` configured;
- [ ] `connectTimeoutMS` configured;
- [ ] rejected cached connection is cleared;
- [ ] partially opened client is closed best-effort;
- [ ] next request can reconnect;
- [ ] indexes ensured idempotently;
- [ ] insert-only lead write;
- [ ] duplicate `submissionId` handled safely;
- [ ] structured result returned instead of throwing uncontrolled errors;
- [ ] no PII in logs.

Suggested result:

```ts
type StoreOutcome =
  | { status: "ok"; duplicate: false }
  | { status: "ok"; duplicate: true }
  | { status: "error"; reason: string };
```

### Exit criterion

- [ ] The module passes isolated unit tests.
- [ ] A failed first connection does not poison all later requests.

---

## D2. Remove production authority from local files

- [ ] Stop treating `.leads/` as durable on Vercel.
- [ ] Stop treating `/tmp` as durable on Vercel.
- [ ] Optionally retain a local-file adapter for development only.
- [ ] Make the development-only role explicit in comments and documentation.
- [ ] Ensure a local file write cannot independently make Production return success.

### Exit criterion

- [ ] Production acceptance is based only on MongoDB or confirmed email acceptance.

---

# PHASE E — Delivery orchestration

## E1. Preserve existing API and validation

Do not rewrite the route unnecessarily.

Preserve:

- [ ] body-size check;
- [ ] JSON parsing;
- [ ] honeypot;
- [ ] rate limiting;
- [ ] authoritative validation;
- [ ] inquiry-ID generation;
- [ ] no-PII logging;
- [ ] honest 4xx/5xx responses;
- [ ] current client success/error states.

### Exit criterion

- [ ] Existing valid and invalid form behavior remains unchanged to the visitor.

---

## E2. Change `deliverLead`

Approved order:

```text
1. Persist in MongoDB.
2. Send email and Telegram.
3. Collect per-channel outcomes.
4. Compute accepted.
5. Return structured delivery result.
```

Approved acceptance formula:

```ts
accepted =
  mongo.status === "ok" ||
  email.status === "ok";
```

Telegram must not be included.

Recommended channel result:

```ts
channels: {
  store: ChannelOutcome;
  email: ChannelOutcome;
  telegram: ChannelOutcome;
}
```

- [ ] Mongo write starts before notification delivery.
- [ ] Email and Telegram may run in parallel after or alongside persistence, provided success semantics remain correct.
- [ ] Every provider response checks HTTP success.
- [ ] Timeouts remain in place.
- [ ] No provider failure throws past the delivery boundary unexpectedly.
- [ ] Logs contain only the inquiry ID and channel status.

### Exit criterion

- [ ] A stored lead survives notification failure.
- [ ] A confirmed email can serve as an emergency fallback when MongoDB fails.
- [ ] Telegram failure never changes accepted to false.

---

## E3. Email content

Email is the complete operational inquiry.

Required subject format:

```text
New booking inquiry — ML-XXXXX — <event type>
```

Required content:

- [ ] inquiry ID;
- [ ] received timestamp;
- [ ] name;
- [ ] phone;
- [ ] email, if supplied;
- [ ] preferred contact method, if supplied;
- [ ] event type;
- [ ] event date;
- [ ] event time, if supplied;
- [ ] city;
- [ ] address, if supplied;
- [ ] child count, if supplied;
- [ ] selected show, if supplied;
- [ ] notes, if supplied;
- [ ] source/UTM fields where available.

Recipient:

```text
info@misslanatheatre.com
```

- [ ] Email HTTP non-2xx is recorded as failure.
- [ ] Email timeout is recorded as failure.
- [ ] A provider error body is not copied into logs if it may contain PII.

### Exit criterion

- [ ] The owner can act on the inquiry using the email alone.

---

## E4. Telegram content

Telegram is a short alert only.

Recommended format:

```text
🎭 New booking inquiry

ID: ML-XXXXX
Type: Birthday party
Date: July 18, 2026
City: Glendale

Full details are in email and the lead archive.
```

Do not include:

- [ ] full address;
- [ ] full notes;
- [ ] child information;
- [ ] full phone number;
- [ ] full email address unless explicitly approved;
- [ ] provider credentials;
- [ ] database links containing secrets.

Required behavior:

- [ ] check `res.ok`;
- [ ] keep a timeout;
- [ ] classify non-2xx as error;
- [ ] do not fail the booking if Telegram fails.

### Exit criterion

- [ ] Telegram gives a quick operational alert without becoming a PII archive.

---

## E5. Notification status persistence

After notification attempts:

- [ ] update the lead’s `notificationStatus.email`;
- [ ] update the lead’s `notificationStatus.telegram`;
- [ ] update `lastAttemptAt`;
- [ ] do not overwrite the original lead fields;
- [ ] do not make a notification-status update failure turn an already durable lead into a user-facing failure.

### Exit criterion

- [ ] It is possible to distinguish “lead stored” from “owner notified”.

---

# PHASE F — Automated tests

## F1. Unit tests: lead store

Required cases:

- [ ] successful insert;
- [ ] duplicate `submissionId`;
- [ ] two different submissions with the same email;
- [ ] missing `MONGODB_URI`;
- [ ] connection timeout;
- [ ] rejected connection cache clears;
- [ ] retry after failed connection succeeds;
- [ ] index creation is idempotent;
- [ ] database errors do not expose PII;
- [ ] no customer data appears in console output.

---

## F2. Unit tests: delivery matrix

Required cases:

| MongoDB | Email | Telegram | Expected |
|---|---|---|---|
| ok | ok | ok | accepted |
| ok | error | error | accepted |
| ok | skipped | error | accepted |
| error | ok | ok/error | accepted |
| error | error | ok | rejected |
| error | skipped | ok | rejected |
| error | error | error | rejected |

Additional cases:

- [ ] Telegram HTTP 400/401 is recognized as failure.
- [ ] Email HTTP 500 is recognized as failure.
- [ ] Email timeout is recognized as failure.
- [ ] Telegram timeout is recognized as failure.
- [ ] Provider failures never expose PII in logs.

---

## F3. API tests

Required cases:

- [ ] valid inquiry returns `{ok:true,id}` when MongoDB succeeds;
- [ ] valid inquiry returns `{ok:true,id}` when MongoDB fails but email succeeds;
- [ ] valid inquiry returns 502 when MongoDB and email both fail;
- [ ] Telegram-only success does not produce `{ok:true}`;
- [ ] invalid body returns 400/422;
- [ ] oversized body returns 413;
- [ ] honeypot returns fake success without writing;
- [ ] rate limit returns 429;
- [ ] repeated same `submissionId` does not create a second record;
- [ ] different `submissionId` creates a second legitimate inquiry.

---

## F4. Client tests

- [ ] success panel appears only after `data.ok === true`;
- [ ] error panel appears when the server rejects;
- [ ] inquiry ID is displayed on success;
- [ ] form cannot create a new `submissionId` during an automatic retry of the same submission;
- [ ] a fresh completed submission receives a fresh `submissionId`;
- [ ] mobile and desktop behavior are verified;
- [ ] accessibility behavior remains correct.

---

## F5. Required quality commands

Run and record:

```bash
pnpm lint
pnpm typecheck
pnpm governance
pnpm build
pnpm test
pnpm test:e2e
pnpm run ci:exact
git diff --check
```

Run the repository’s secret scan:

```bash
security/secret-scan.sh
```

or the actual canonical equivalent present in the repository.

### Exit criterion

- [ ] Every required command is green.
- [ ] Any skipped command is explicitly justified and remains a launch blocker.

---

# PHASE G — Preview deployment

## G1. Configure Preview only

- [ ] Add Preview `MONGODB_URI`.
- [ ] Add Preview email webhook credentials.
- [ ] Add Preview Telegram bot/chat credentials.
- [ ] Use a test database or clearly separated Preview collection.
- [ ] Do not add Production secrets yet.
- [ ] Deploy the implementation branch to Preview.

---

## G2. Preview happy-path test

Submit a clearly marked test inquiry.

Verify:

- [ ] client shows success;
- [ ] client shows the same inquiry ID stored in MongoDB;
- [ ] exactly one MongoDB record exists;
- [ ] record fields are correct;
- [ ] status is `new`;
- [ ] email arrives;
- [ ] Telegram arrives;
- [ ] Telegram contains only approved short fields;
- [ ] notification statuses are updated;
- [ ] logs contain no PII;
- [ ] test data is removed or marked `test`.

---

## G3. Preview failure-path tests

Execute all of the following deliberately:

### MongoDB failure, email working

- [ ] use an invalid Preview DB credential;
- [ ] confirm email is accepted;
- [ ] confirm visitor sees success;
- [ ] confirm logs state fallback acceptance without PII.

### MongoDB failure, email failure

- [ ] disable both in Preview;
- [ ] confirm visitor sees an error;
- [ ] confirm no success panel appears;
- [ ] confirm fallback phone/contact wording is visible.

### Telegram failure

- [ ] use an invalid Preview Telegram token;
- [ ] confirm Telegram is recorded as error;
- [ ] confirm stored lead/email still produce success.

### Duplicate request

- [ ] submit the same `submissionId` twice;
- [ ] confirm one database record;
- [ ] confirm response remains safe/idempotent.

### Cold start/redeploy

- [ ] redeploy or force a new serverless instance;
- [ ] submit the first lead after cold start;
- [ ] confirm successful connection and persistence.

### Rate limit and abuse controls

- [ ] verify honeypot stores nothing;
- [ ] verify repeated requests trigger 429;
- [ ] verify valid customers are not blocked during normal use.

### Exit criterion

- [ ] Every failure scenario matches the approved truth table.
- [ ] No false success is observed.

---

# PHASE H — Production rollout

## H1. Production configuration

Only after Preview closure:

- [ ] create a separate Production DB user if appropriate;
- [ ] add Production `MONGODB_URI`;
- [ ] add Production email webhook secrets;
- [ ] add Production Telegram secrets;
- [ ] confirm `LEAD_NOTIFY_EMAIL=info@misslanatheatre.com`;
- [ ] verify secrets are scoped to Production only;
- [ ] verify Preview and Production data are separated.

---

## H2. Production deployment

- [ ] deploy from the reviewed implementation branch/commit;
- [ ] verify deployment logs;
- [ ] verify health/build status;
- [ ] do not remove `noindex`;
- [ ] do not start paid traffic.

---

## H3. Production end-to-end acceptance test

Submit one controlled inquiry marked clearly:

```text
TEST — Production lead pipeline verification
```

Verify all of the following:

- [ ] success panel appears;
- [ ] inquiry ID is visible;
- [ ] matching MongoDB record exists;
- [ ] email arrives in `info@misslanatheatre.com`;
- [ ] Telegram alert arrives to the approved chat;
- [ ] stored data is accurate;
- [ ] no duplicate record exists;
- [ ] notification statuses are correct;
- [ ] logs contain no PII;
- [ ] test record is removed or retained with `status:"test"` according to policy;
- [ ] owner confirms she can see and understand the notification.

---

# PHASE I — Documentation and privacy

## I1. Update technical documentation

Update:

```text
.env.example
docs/operations/LEAD_PIPELINE_RUNBOOK.md
docs/PROJECT_PROGRESS.md
STATUS.md
```

Document:

- [ ] architecture;
- [ ] environment variables;
- [ ] database/collection names without credentials;
- [ ] acceptance rule;
- [ ] failure matrix;
- [ ] operational recovery steps;
- [ ] how to identify notification failures;
- [ ] how to test without using real customer data;
- [ ] how to rotate credentials;
- [ ] how to disable a compromised bot;
- [ ] how to restore email delivery;
- [ ] how to confirm Atlas connectivity.

---

## I2. Update privacy documentation

Public privacy copy must accurately state:

- [ ] what form data is collected;
- [ ] why it is collected;
- [ ] that it is used to respond to booking inquiries;
- [ ] that operational service providers may process the data;
- [ ] who can access it;
- [ ] how deletion can be requested;
- [ ] the approved retention period.

### Owner decision required

- [ ] Confirm the lead-retention period.
- [ ] Confirm who may access the Telegram chat.
- [ ] Confirm whether customer email may appear in Telegram.
- [ ] Confirm whether addresses should be stored immediately or only after follow-up.

Do not invent these answers in public copy.

---

# PHASE J — Final launch gate

The lead pipeline is not production-ready until every P0 item below is checked.

## P0 mandatory launch gate

- [ ] MongoDB Atlas is the durable production store.
- [ ] Production email delivery is verified in the real inbox.
- [ ] Production Telegram delivery is verified.
- [ ] MongoDB failure + email failure shows an honest error.
- [ ] Telegram failure does not lose or reject a durable lead.
- [ ] Duplicate retry creates one lead.
- [ ] Two legitimate requests from the same customer create two leads.
- [ ] Cold-start persistence is verified.
- [ ] No PII appears in logs.
- [ ] Secret scan is clean.
- [ ] `pnpm run ci:exact` is green.
- [ ] Production E2E evidence is recorded.
- [ ] Runbook is updated.
- [ ] Owner confirms receipt and usability.
- [ ] No unresolved BLOCKER or HIGH review finding remains.

## Only after P0 closure

- [ ] consider removing `noindex`;
- [ ] start paid advertising;
- [ ] direct external traffic to the booking form;
- [ ] mark the lead pipeline launch dependency complete.

---

# 6. Operational failure guide

## Customer reports that the form failed

1. Ask for approximate submission time and inquiry ID if shown.
2. Search MongoDB by inquiry ID or submission ID.
3. Check email-provider delivery.
4. Check server logs using inquiry ID only.
5. Never ask the customer to publish personal details in a public channel.
6. If no durable record and no email exists, ask the customer to resubmit or contact the primary phone/email.

## Telegram notification is missing

1. Check whether the lead exists in MongoDB.
2. Check email.
3. Check `notificationStatus.telegram`.
4. Validate bot/chat configuration without exposing token values.
5. Telegram failure does not mean the lead was lost.

## Email notification is missing

1. Check MongoDB first.
2. Check `notificationStatus.email`.
3. Check webhook/provider logs.
4. Retry notification manually only through an approved safe process.
5. Do not create a duplicate lead record merely to resend the email.

## MongoDB is unavailable

1. Confirm whether email accepted the lead.
2. If yes, preserve the inquiry from email and restore DB connectivity.
3. If no, the user must receive an honest error.
4. Clear a rejected cached client promise through the implemented self-heal behavior.
5. Verify Atlas network access, credentials and service status.
6. Do not weaken security permanently as a quick fix.

---

# 7. Required closure report

The implementation is complete only when a closure report is created.

Recommended path:

```text
docs/reports/IMPLEMENT_MISS_LANA_DURABLE_LEAD_STORE_MONGODB_001.md
```

The report must contain:

- branch and commit;
- changed files;
- final architecture;
- schema and indexes;
- environment variables added;
- test commands and results;
- Preview E2E evidence;
- Production E2E evidence;
- failure-path evidence;
- security/privacy review;
- secret-scan result;
- remaining risks;
- owner decisions;
- confirmation that `noindex`/traffic remained blocked until launch gates passed;
- final verdict: `CLOSE` or `DO NOT CLOSE`.

---

# 8. Final implementation order

Use this exact order:

1. Clean branch/worktree.
2. Inventory current pipeline.
3. Create dedicated Atlas project/database/user.
4. Configure Preview access and secrets.
5. Lock schema and idempotency design.
6. Implement `lib/leadStore.ts`.
7. Remove local filesystem from Production acceptance.
8. Integrate MongoDB into `deliverLead`.
9. Preserve and verify email behavior.
10. Preserve and verify Telegram behavior.
11. Persist notification statuses.
12. Add unit tests.
13. Add API and client tests.
14. Run full CI and security checks.
15. Deploy to Preview.
16. Run happy-path Preview test.
17. Run every Preview failure-path test.
18. Review code and close all BLOCKER/HIGH findings.
19. Add Production secrets.
20. Deploy to Production while keeping `noindex`.
21. Run controlled Production E2E.
22. Obtain owner confirmation.
23. Update runbook, progress, status and privacy documentation.
24. Create closure report.
25. Only then approve removal of `noindex` and external traffic.

---

# 9. Progress tracker

| Phase | Status | Evidence / notes |
|---|---|---|
| A — Repository preparation | ✅ Complete | Branch `feat/miss-lana-durable-lead-store` from `e5d95bc`; pipeline inventoried. |
| B — Atlas setup | ⬜ Not started | **Infra/owner** — create dedicated cluster/db `misslana`/user; record outside repo. |
| C — Schema/idempotency | ✅ Complete | `StoredLead`/`submissionId` in `lib/leads.ts`; unique `submissionId` index. |
| D — Durable storage code | ✅ Complete | `lib/leadStore.ts` (cached self-healing client, insert-only, idempotent indexes); local file demoted to dev-only. |
| E — Delivery integration | ✅ Complete | `deliverLead` Mongo-first, `accepted=mongo||email`, `notificationStatus` persisted. |
| F — Automated tests | ✅ Complete | 65 unit (incl. `leadStore.test.ts` + acceptance matrix) + 63 e2e; `ci:exact` green. |
| G — Preview verification | ⬜ Not started | **Infra** — needs Preview secrets + deploy (plan §G). |
| H — Production rollout | ⬜ Not started | **Infra** — needs Prod secrets + deploy + E2E (plan §H). |
| I — Documentation/privacy | 🟨 In progress | Technical docs done (`.env.example`, runbook, STATUS, PROGRESS, report). Privacy copy (I2) pending owner decisions §10. |
| J — Launch gate | ⬜ Not started | Blocked on B/G/H + owner confirmation. |

> **Code closure report:** `docs/reports/IMPLEMENT_MISS_LANA_DURABLE_LEAD_STORE_MONGODB_001.md`
> (verdict: code/tests/docs CLOSE-ready; overall plan DO NOT CLOSE until B/G/H/J pass).

Status legend:

```text
⬜ Not started
🟨 In progress
🟥 Blocked
✅ Complete
```

---

# 10. Current open decisions

These must be resolved before final closure, but they do not all block initial coding.

| Decision | Owner | Deadline/status |
|---|---|---|
| Lead-retention period | Business owner | Open |
| Approved Telegram recipients | Business owner | Open |
| Whether email may appear in Telegram | Business owner | Default: no |
| Whether full street address is needed in initial form/storage | Business owner + UX | Open |
| Production email provider/webhook | Technical owner | Open |
| Atlas network-hardening method | Technical owner | Open |
| Production test-record retention/removal | Technical owner | Open |

---

# 11. Definition of done

This plan is complete when:

- the durable source of truth is external MongoDB Atlas;
- a customer cannot receive false success when both durable channels fail;
- the owner receives a complete email and a short Telegram alert;
- retries are idempotent;
- customer PII is protected;
- Preview and Production failure paths are proven;
- all launch gates are checked;
- the closure report says `CLOSE`;
- the owner confirms the workflow is usable;
- the site is not opened to traffic before those conditions are met.
