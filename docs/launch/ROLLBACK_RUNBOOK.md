# Rollback Runbook — Miss Lana's Fairy-Tale Theatre

> `STABILIZE_MISS_LANA_PRELAUNCH_001` (2026-06-27). **No secrets.** How to undo the
> launch (re-hide from search) and recover the form/domain/deploy if something goes
> wrong. Keep this readable by whoever is on call.

## 1. Re-hide the site from search (fastest, no redeploy of content)

If indexing must be reverted (bad content indexed, emergency):

1. **robots** — `app/robots.ts`: change the rule back to
   `rules: [{ userAgent: "*", disallow: "/" }]`.
2. **global meta** — `app/layout.tsx`: restore
   `robots: { index: false, follow: false }` in the exported `metadata`.
3. **per-page** — add `noindex: true` back to each public page's `buildMetadata({…})`
   (12 pages) — or rely on the global block in step 2 (sufficient on its own).
4. Redeploy. Then in Search Console use **Removals** for any URL already indexed.

> Fastest emergency lever: step 2 alone (global `index:false`) re-hides every page on
> the next deploy.

## 2. Lead form / provider failure

- **Symptom:** owner stops receiving inquiry emails.
- Leads are **not lost** — they're in the durable store (`LEAD_STORE_DIR`, default
  `.leads/`). Replay from there.
- Fix: check the email provider dashboard; verify `LEAD_EMAIL_WEBHOOK_URL` /
  `LEAD_EMAIL_WEBHOOK_TOKEN`. Full steps: `docs/operations/LEAD_PIPELINE_RUNBOOK.md`.
- **Disable the form quickly** if abused: lower `MAX_PER_WINDOW` in
  `app/api/lead/route.ts`, or temporarily return a maintenance message.

## 3. Domain / redirect problems

- **Redirect loop or wrong destination:** the app `redirects()` are host-conditional;
  to neutralize, remove the offending host from `ALTERNATE_HOSTS` / `LEGACY_HOSTS` in
  `next.config.ts` and redeploy, or pull the redirect at the CDN edge.
- **Canonical wrong:** confirm `APP_BASE_URL=https://misslanatheatre.com` in deploy
  env (drives canonical/OG/sitemap/robots). Fix env → redeploy.
- **SSL:** ensure certs cover apex + every alternate/legacy host.
- **Never** cancel legacy/protective domain registrations — they must keep serving 301s.

## 4. Deployment rollback

- Revert to the previous deployment in the host's dashboard (Vercel/Netlify/etc.:
  "promote previous deployment") — instant, no rebuild.
- In git: `git revert <launch-commit>` (re-adds noindex) and redeploy.
- Keep the last known-good deployment id noted at release time.

## Rollback decision table

| Problem | First action |
|---|---|
| Bad/placeholder content indexed | §1 step 2 (global noindex) + GSC Removals |
| Owner not getting leads | §2 — replay from store, fix webhook |
| Redirect loop | §3 — drop host from config / CDN, redeploy |
| Site down / broken deploy | §4 — promote previous deployment |
| Form spam flood | §2 — tighten rate limit / maintenance message |
