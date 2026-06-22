import { test, expect } from "@playwright/test";

// Smoke test for the internal /design styleguide route — it responds 200 and
// renders its key section headings. Visual/a11y QA is manual (see the route note).
test("design preview renders with key sections", async ({ page }) => {
  const res = await page.goto("/design");
  expect(res?.status()).toBe(200);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("design system");

  for (const heading of [
    "Color",
    "Typography",
    "Spacing · Radius · Elevation",
    "Iconography — Phosphor",
    "Motif — direction",
    "Motion",
    "Components",
    "Service-line accents",
    "Accessibility",
  ]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
});

test("design preview is noindex", async ({ page }) => {
  await page.goto("/design");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

// --- IMPLEMENT_MISS_LANA_DESIGN_TOKENS_001: the gallery renders the REAL
// components/ui primitives, and their key interactions are keyboard-operable. ---

test("design preview renders the real UI primitives", async ({ page }) => {
  await page.goto("/design");
  // Button primitive (secondary variant) → accessible <button>.
  await expect(page.getByRole("button", { name: "See the shows" })).toBeVisible();
  // Field primitive → accessible, labelled control.
  await expect(page.getByLabel("Your name")).toBeVisible();
  // Card primitive → its "See this show" CTA link.
  await expect(page.getByRole("link", { name: "See this show" }).first()).toBeVisible();
});

test("skip-to-content link is the first focusable and targets main", async ({ page }) => {
  await page.goto("/design");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href", "#content");
});

test("nav mobile drawer opens and closes by keyboard, restoring focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/design");

  const burger = page.getByRole("button", { name: "Open menu" });
  await expect(burger).toBeVisible();

  await burger.focus();
  await page.keyboard.press("Enter");

  const drawer = page.getByRole("dialog", { name: "Site menu" });
  await expect(drawer).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0); // unmounted on close
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused(); // focus restored
});
