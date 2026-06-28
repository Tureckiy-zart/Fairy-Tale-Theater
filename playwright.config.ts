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
    },
  },
});
