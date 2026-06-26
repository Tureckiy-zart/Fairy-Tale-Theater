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
  // Assert navigation only (a page with an H1 rendered) — not specific H1 text, so the
  // test survives the stub → real-page swap as Phase 2 lands.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("the header wordmark routes Home from an inner page (homeHref, not #)", async ({ page }) => {
  await page.goto("/pricing");
  await page.getByRole("link", { name: "Miss Lana — home" }).first().click();
  await expect(page).toHaveURL(/\/$/); // origin root, not a "#" scroll-to-top
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/live theater that comes to you/i);
});

test("Phosphor Duotone brand-thread renders after the icon-library swap", async ({ page }) => {
  await page.goto("/");
  // The duotone secondary path carries the [opacity] attr the brand CSS targets;
  // globals.css §6 recolors it to glow at full opacity. Proves the swapped library's
  // markup still matches the brand-thread selector.
  const accent = page.locator('[data-icon="duotone-brand"] svg path[opacity]').first();
  await expect(accent).toBeAttached();
  await expect(accent).toHaveCSS("opacity", "1");
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
    await page.getByLabel(/event date/i).fill("12/01/2026");
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

// Phase 2 — Shows hub + 8 show pages + School Shows / Birthdays landings
// (BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001).
test.describe("Phase 2 — shows + landings", () => {
  const PAGES: { path: string; h1: RegExp }[] = [
    { path: "/shows", h1: /eight kind fairy tales to choose from/i },
    { path: "/shows/the-gingerbread-man", h1: /the gingerbread man/i },
    { path: "/shows/the-winters-gift", h1: /the winter's gift/i },
    { path: "/shows/little-red-riding-hood", h1: /little red riding hood/i },
    { path: "/school-shows", h1: /theater your school can say yes to/i },
    { path: "/birthdays", h1: /a magical party/i },
  ];
  for (const { path, h1 } of PAGES) {
    test(`${path} responds 200 with its H1`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    });
  }

  test("a show page carries TheaterEvent + BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/shows/cinderella");
    // <script> content isn't "visible text", so read the raw text content and assert.
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).toContain('"@type":"TheaterEvent"');
    expect(ld).toContain('"@type":"BreadcrumbList"');
  });

  test("an unknown show slug 404s (closed slug set)", async ({ page }) => {
    const res = await page.goto("/shows/not-a-real-show");
    expect(res?.status()).toBe(404);
  });

  test("a show card links through to its own detail page", async ({ page }) => {
    await page.goto("/shows");
    await page.getByRole("link", { name: /see this show/i }).first().click();
    await expect(page).toHaveURL(/\/shows\/[a-z-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("the landings emit FAQPage schema and the FAQ opens by keyboard", async ({ page }) => {
    await page.goto("/school-shows");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).toContain('"@type":"FAQPage"');
    const q = page.getByRole("button", { name: /where do you perform/i });
    await q.focus();
    await page.keyboard.press("Enter");
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/we bring everything to you/i)).toBeVisible();
  });

  test("new Phase-2 routes are noindex pre-launch", async ({ page }) => {
    for (const path of ["/shows", "/shows/suzy-bee", "/school-shows", "/birthdays"]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    }
  });
});

// Phase 3 — Services overview + Characters + Gallery + About
// (BUILD_MISS_LANA_SHOWCASE_AND_ABOUT_001). Completes the MVP page set.
test.describe("Phase 3 — services + characters + gallery + about", () => {
  const PAGES: { path: string; h1: RegExp }[] = [
    { path: "/services", h1: /the same theater, shaped to your day/i },
    { path: "/characters", h1: /costumed characters who come to visit/i },
    { path: "/gallery", h1: /from our shows/i },
    { path: "/about", h1: /theater as a little bit of magic/i },
  ];
  for (const { path, h1 } of PAGES) {
    test(`${path} responds 200 with its H1`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
    });
  }

  test("the four Phase-3 routes are noindex pre-launch", async ({ page }) => {
    for (const path of ["/services", "/characters", "/gallery", "/about"]) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    }
  });

  test("each Phase-3 page emits a BreadcrumbList", async ({ page }) => {
    for (const path of ["/services", "/characters", "/gallery", "/about"]) {
      await page.goto(path);
      const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
      expect(ld, `BreadcrumbList on ${path}`).toContain('"@type":"BreadcrumbList"');
    }
  });

  test("/services links through to all four service lines", async ({ page }) => {
    await page.goto("/services");
    for (const href of ["/shows", "/school-shows", "/birthdays", "/characters"]) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }
  });

  test("the gallery renders its category sections with real photos", async ({ page }) => {
    await page.goto("/gallery");
    for (const cat of ["Shows", "Troupe", "Children"]) {
      await expect(page.getByRole("heading", { level: 2, name: cat })).toBeVisible();
    }
    // Real, content-sorted assets are wired (not placeholders): tiles render <img>.
    const imgs = page.locator("main img");
    expect(await imgs.count()).toBeGreaterThan(0);
    await expect(imgs.first()).toBeVisible();
  });

  test("/about shows the 30+ years line and the full troupe", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("30+ years").first()).toBeVisible();
    for (const name of [
      "Svitlana Grygoryshyna",
      "Armen Tadevosyan",
      "Victoria Stolyarenko",
      "Roman Listopad",
    ]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
  });

  test("under reduced motion, the gallery reveals are shown immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/gallery");
    await expect(page.locator(".ll-reveal").first()).toHaveCSS("opacity", "1");
  });
});
