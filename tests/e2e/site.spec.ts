import { test, expect } from "@playwright/test";

// Smoke coverage for the Phase-1 marketing shell + Home/Booking/Pricing
// (BUILD_MISS_LANA_HOME_AND_SHELL_001). Verifies the three pages render, navigation
// is 404-free (stubs exist), the LeadForm validates + confirms, the keyboard path /
// drawer work, motion stills under reduce, and the whole site is publicly indexable.

test.describe("pages render", () => {
  const PAGES: { path: string; h1: RegExp }[] = [
    { path: "/", h1: /live theater that comes to you/i },
    { path: "/booking", h1: /book a show/i },
    { path: "/pricing", h1: /from \$350/i },
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

test("the home page is indexable post-launch (no noindex)", async ({ page }) => {
  await page.goto("/");
  // After STABILIZE launch, public pages must NOT carry a noindex robots meta.
  const robots = page.locator('meta[name="robots"]');
  if (await robots.count()) {
    await expect(robots.first()).not.toHaveAttribute("content", /noindex/);
  }
});

// Phase 2 — Shows hub + 7 show pages + School Shows / Birthdays landings
// (BUILD_MISS_LANA_SHOWS_AND_LANDINGS_001).
test.describe("Phase 2 — shows + landings", () => {
  const PAGES: { path: string; h1: RegExp }[] = [
    { path: "/shows", h1: /seven kind fairy tales to choose from/i },
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

  test("a show page carries CreativeWork (not a scheduled Event) + BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/shows/cinderella");
    // <script> content isn't "visible text", so read the raw text content and assert.
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    // Evergreen repertoire pages use CreativeWork, never Event/TheaterEvent (no date).
    expect(ld).toContain('"@type":"CreativeWork"');
    expect(ld).not.toContain("TheaterEvent");
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

  test("Phase-2 routes are indexable post-launch (no noindex)", async ({ page }) => {
    for (const path of ["/shows", "/shows/suzy-bee", "/school-shows", "/birthdays"]) {
      await page.goto(path);
      const robots = page.locator('meta[name="robots"]');
      if (await robots.count()) {
        await expect(robots.first()).not.toHaveAttribute("content", /noindex/);
      }
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

  test("the four Phase-3 routes are indexable post-launch (no noindex)", async ({ page }) => {
    for (const path of ["/services", "/characters", "/gallery", "/about"]) {
      await page.goto(path);
      const robots = page.locator('meta[name="robots"]');
      if (await robots.count()) {
        await expect(robots.first()).not.toHaveAttribute("content", /noindex/);
      }
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
      "Armen Tadevosyan",
      "Victoria Stolyarenko",
      "Marzhan Kanlybayeva",
      "Anton Gakh",
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

// Planning Your Event route (BUILD_MISS_LANA_EVENT_PLANNING_FAQ_001) — the single
// home for shared venue/logistics info, friendly progressive disclosure.
test.describe("Planning Your Event", () => {
  test("/planning-your-event responds 200 with its H1 and is indexable", async ({ page }) => {
    const res = await page.goto("/planning-your-event");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/we bring everything/i);
    const robots = page.locator('meta[name="robots"]');
    if (await robots.count()) {
      await expect(robots.first()).not.toHaveAttribute("content", /noindex/);
    }
  });

  test("it emits a FAQPage and a BreadcrumbList", async ({ page }) => {
    await page.goto("/planning-your-event");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).toContain('"@type":"FAQPage"');
    expect(ld).toContain('"@type":"BreadcrumbList"');
  });

  test("accordions are closed on load and open by keyboard (progressive disclosure)", async ({ page }) => {
    await page.goto("/planning-your-event");
    const q = page.getByRole("button", { name: /how much space do you need/i });
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await q.focus();
    await page.keyboard.press("Enter");
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/about 20 m²/i)).toBeVisible();
  });

  test("a low-priority footer link points to the route", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('footer a[href="/planning-your-event"]')).toBeVisible();
  });

  test("no unresolved policy / unsafe wording is published", async ({ page }) => {
    await page.goto("/planning-your-event");
    const body = (await page.locator("main").innerText()).toLowerCase();
    for (const banned of ["deposit", "refund", "cancellation policy", "supervision is not", "insurance"]) {
      expect(body, `should not publish "${banned}"`).not.toContain(banned);
    }
  });
});

// Production lead pipeline (IMPLEMENT_MISS_LANA_PRODUCTION_LEAD_PIPELINE_001) — the
// booking form POSTs to /api/lead; success renders only after server acceptance.
test.describe("Lead pipeline", () => {
  async function fillValid(page: import("@playwright/test").Page) {
    await page.getByLabel(/full name/i).fill("E2E Tester");
    await page.getByLabel(/^phone/i).fill("(213) 555-0142");
    await page.getByLabel(/event type/i).selectOption("Birthday party");
    await page.getByLabel(/event date/i).fill("12/01/2026");
    await page.getByLabel(/city \/ area/i).fill("Pasadena");
  }

  test("no public 'demo / nothing is sent' notice remains on the form", async ({ page }) => {
    await page.goto("/booking");
    const body = (await page.locator("main").innerText()).toLowerCase();
    expect(body).not.toContain("demo");
    expect(body).not.toContain("no message is sent");
  });

  test("a valid submission shows success only after the server accepts it", async ({ page }) => {
    await page.goto("/booking");
    await fillValid(page);
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/lead") && r.request().method() === "POST"),
      page.getByRole("button", { name: /request a booking/i }).click(),
    ]);
    expect(res.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /request received/i })).toBeVisible();
    await expect(page.getByText(/within 1.2 business days/i)).toBeVisible();
  });

  test("validation blocks submit and shows no success", async ({ page }) => {
    await page.goto("/booking");
    // Submit empty → client validation stops it; no network success panel.
    await page.getByRole("button", { name: /request a booking/i }).click();
    await expect(page.getByText(/please fix the highlighted fields/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /request received/i })).toHaveCount(0);
  });

  test("the honeypot field is present, off the tab order, and off-screen", async ({ page }) => {
    await page.goto("/booking");
    const honeypot = page.locator('input[name="company"]');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    // Standard honeypot: kept in the DOM (so bots fill it) but moved off-screen and
    // out of the a11y tree — not display:none. Assert it's far off the viewport.
    const box = await honeypot.boundingBox();
    expect(box === null || box.x < -1000 || box.y < -1000).toBeTruthy();
    await expect(page.locator('[aria-hidden="true"] input[name="company"]')).toHaveCount(1);
  });
});

// Technical SEO + domain migration (FIX_MISS_LANA_SEO_AND_DOMAIN_MIGRATION_001).
test.describe("SEO + indexing", () => {
  test("home emits PerformingGroup/LocalBusiness org schema with no street address", async ({ page }) => {
    await page.goto("/");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    expect(ld).toContain('"PerformingGroup"');
    expect(ld).toContain('"LocalBusiness"');
    // Service-area business — region only, never a streetAddress.
    expect(ld).not.toContain("streetAddress");
  });

  test("sitemap lists real public routes and excludes /design and /api", async ({ page }) => {
    const res = await page.goto("/sitemap.xml");
    expect(res?.status()).toBe(200);
    const xml = (await res?.text()) ?? "";
    for (const path of ["/shows", "/planning-your-event", "/gallery", "/pricing"]) {
      expect(xml).toContain(path);
    }
    expect(xml).toContain("/shows/cinderella");
    expect(xml).not.toContain("/design");
    expect(xml).not.toContain("/api/");
  });

  test("robots.txt allows crawling post-launch but blocks internal surfaces", async ({ page }) => {
    const res = await page.goto("/robots.txt");
    expect(res?.status()).toBe(200);
    const txt = (await res?.text()) ?? "";
    expect(txt).toMatch(/Allow:\s*\//);
    expect(txt).toMatch(/Disallow:\s*\/api\//);
    expect(txt).toMatch(/Disallow:\s*\/design/);
    expect(txt).toContain("Sitemap:");
  });

  test("/design stays noindex after launch (internal preview)", async ({ page }) => {
    await page.goto("/design");
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  });

  test("Gallery is in the primary navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation").getByRole("link", { name: "Gallery" }).first()).toBeVisible();
  });
});
