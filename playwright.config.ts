import { defineConfig, devices } from "@playwright/test";

// E2E config. Run `npx playwright install` once to fetch browsers (not part of
// ci:exact — keep the green gate install-light). Then `pnpm test:e2e`.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // Keep e2e lead submissions out of the real store (test-results/ is git-ignored).
      LEAD_STORE_DIR: "test-results/.leads-e2e",
      // The parallel suite shares one localhost IP; raise the per-IP limit so valid-path
      // tests aren't collateral-throttled. The dedicated rate-limit test exceeds this on
      // purpose. Production keeps the default 5 (this override is e2e-only).
      LEAD_RATE_LIMIT_PER_MINUTE: "50",
      // Fully isolate e2e from real outbound side effects. `pnpm dev` loads the real,
      // git-ignored `.env`; without these blanks the ~70 lead POSTs the suite fires (incl.
      // the 60-request rate-limit burst in lead-api.spec.ts) would hit the LIVE Telegram
      // bot AND write the production MongoDB store. Empty string ⇒ each `env` getter
      // (`process.env.X || undefined`, lib/env.ts) returns undefined ⇒ the channel is
      // skipped and `leadStore` falls back to the local file store above. Next's `.env`
      // loader never overrides an already-set process.env var (Playwright sets these on the
      // dev child), so the blanks win. Do NOT remove — this is the guard against spamming
      // the owner's real Telegram/DB from a test run.
      MONGODB_URI: "",
      TELEGRAM_BOT_TOKEN: "",
      TELEGRAM_CHAT_ID: "",
      LEAD_EMAIL_WEBHOOK_URL: "",
      GOOGLE_SHEETS_WEBHOOK_URL: "",
    },
  },
});
