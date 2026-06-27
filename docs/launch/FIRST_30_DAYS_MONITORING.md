# First 30 Days — Monitoring Plan

> `STABILIZE_MISS_LANA_PRELAUNCH_001` (2026-06-27). What to watch after launch so
> decisions come from real data — not assumptions. No city-page/blog assumptions.

## Daily (first week)

- [ ] **Lead delivery:** submit a test inquiry (or confirm a real one arrived) — owner
      received it at `info@misslanatheatre.com`; a store record exists.
- [ ] **Owner response time:** inquiries answered within the promised 1–2 business days.
- [ ] **Errors:** check deploy/server logs for `[lead]` failures, 5xx, exceptions.
- [ ] **404s:** review 404 hits (esp. from legacy-domain old URLs) — add/adjust a
      redirect in `next.config.ts` `LEGACY_PATH_MAP` if a real old URL is missed.
- [ ] **Form spam:** honeypot/rate-limit holding; no junk in the store.

## Weekly (first month)

- [ ] **Search Console — Pages:** indexed count rising; investigate "Discovered/Crawled
      – not indexed" or duplicate www/apex or theater/theatre URLs.
- [ ] **Search Console — Performance:** which queries/pages get impressions & clicks;
      note real intent (vs. the assumed keyword list in `04_SEO.md`).
- [ ] **Redirects:** spot-check legacy/protective host 301s still land on canonical.
- [ ] **Core Web Vitals:** LCP/CLS/INP stay green (static/SSG build).
- [ ] **Conversion:** form-success and contact-click events firing (no PII); rough
      inquiry→conversion sense-check with the owner.
- [ ] **Lead quality:** owner's read on whether inquiries are the right segments
      (preschools/schools/birthdays) — feeds positioning, not new pages.

## Triggers → action (evidence-based backlog, no premature build-out)

| Signal | Consider |
|---|---|
| A legacy old URL 404s repeatedly | add it to `LEGACY_PATH_MAP` |
| A real query cluster appears in GSC | tune existing page copy/title for it |
| Strong demand from one segment | strengthen that existing landing (not a new city page) |
| Reviews arrive with permission | add a trust block + (only then) Review schema |
| Email deliverability issues | revisit provider / SPF-DKIM at the email webhook |

## Explicitly NOT in this plan

City pages, blog, public-school procurement materials, paid ads — only add later from
real Search Console / analytics / lead-quality evidence (per task post-actions).
