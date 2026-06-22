import { test, expect } from "@playwright/test";

// Minimal smoke test — the home page renders. Extend per project.
test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
