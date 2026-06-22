import { test, expect } from "@playwright/test";

// Smoke coverage for the Phase-1 marketing shell + Home/Booking/Pricing
// (BUILD_MISS_LANA_HOME_AND_SHELL_001). Verifies the three pages render, navigation
// is 404-free (stubs exist), the LeadForm validates + confirms, the keyboard path /
// drawer work, motion stills under reduce, and the whole site is noindex pre-launch.

test.describe("pages render", () => {
  const PAGES: { path: string; h1: RegExp }[] = [
    { path: "/", h1: /live theater that comes to you/i },
    { path: "/booking", h1: /book a show/i },
    { path: "/pricing", h1: /simple pricing, by group size/i },
  ];
  for (const { path, h1 } of PAGES) {
    test(`${path} responds 200 with its H1`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    });
  }
});

test("every nav + footer target resolves (no 404 from navigation)", async ({ page }) => {
  const paths = [
    "/shows",
    "/school-shows",
    "/birthdays",
    "/characters",
    "/about",
    "/gallery",
    "/pricing",
    "/booking",
  ];
  for (const p of paths) {
    const res = await page.goto(p);
    expect(res?.status(), `expected 200 for ${p}`).toBe(200);
  }
});

test("header nav link navigates to its route", async ({ page }) => {
  await page.goto("/");
  // Desktop nav link (the header is the live Nav primitive).
  await page.getByRole("link", { name: "School Shows" }).first().click();
  await expect(page).toHaveURL(/\/school-shows$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/school shows/i);
});

test.describe("LeadForm (client validation + on-screen confirmation)", () => {
  test("shows field errors on empty submit", async ({ page }) => {
    await page.goto("/booking");
    await page.getByRole("button", { name: /request a booking/i }).click();
    await expect(page.getByText("Please tell us your name.")).toBeVisible();
    // Still on the form (not submitted).
    await expect(page.getByRole("button", { name: /request a booking/i })).toBeVisible();
  });

  test("confirms when the required fields are valid", async ({ page }) => {
    await page.goto("/booking");
    await page.getByLabel(/full name/i).fill("Alex Rivera");
    await page.getByLabel(/phone/i).fill("(213) 555-0142");
    await page.getByLabel(/event type/i).selectOption("Birthday party");
    await page.getByLabel(/event date/i).fill("2026-12-01");
    await page.getByLabel(/city \/ area/i).fill("Pasadena");
    await page.getByRole("button", { name: /request a booking/i }).click();
    await expect(page.getByRole("heading", { name: /request received/i })).toBeVisible();
  });
});

test("skip-to-content is the first focusable and targets main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href", "#main-content");
});

test("mobile drawer opens and closes by keyboard, restoring focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const burger = page.getByRole("button", { name: "Open menu" });
  await burger.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Site menu" });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("under reduced motion, scroll-reveals are shown immediately (no motion trap)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Under reduce, the global backstop forces `.ll-reveal` to opacity:1.
  await expect(page.locator(".ll-reveal").first()).toHaveCSS("opacity", "1");
  // And deep-page content is still reachable/visible.
  await expect(page.getByRole("heading", { name: /three steps to a show/i })).toBeVisible();
});

test("the site is noindex pre-launch", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});
