import { test, expect } from "@playwright/test";

test.describe("full launch polish", () => {
  test("canonical brand and public contacts render", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("header")).toContainText("Miss Lana’s");
    await expect(page.locator("header")).toContainText("Fairy-Tale Theatre");

    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "info@misslanatheatre.com" })).toHaveAttribute(
      "href",
      "mailto:info@misslanatheatre.com",
    );
    await expect(footer.getByRole("link", { name: "(323) 903-2039" })).toHaveAttribute(
      "href",
      "tel:+13239032039",
    );
    await expect(footer).toContainText("Southern California");
  });

  test("booking page has finished service-area content and no internal placeholder", async ({ page }) => {
    await page.goto("/booking");

    await expect(page.getByRole("link", { name: /email info@misslanatheatre.com/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /call or text \(323\) 903-2039/i })).toBeVisible();
    await expect(page.getByText("A touring theater — we come to you")).toBeVisible();
    await expect(page.getByText(/other california locations/i)).toBeVisible();
    await expect(page.getByText(/GBP-first/i)).toHaveCount(0);
    await expect(page.getByText(/embed later/i)).toHaveCount(0);
  });

  test("reply preference reaches the existing lead contract through notes", async ({ page }) => {
    let submitted: Record<string, string> | undefined;
    await page.route("**/api/lead", async (route) => {
      submitted = route.request().postDataJSON() as Record<string, string>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, id: "ML-TEST1" }),
      });
    });

    await page.goto("/booking");
    await page.getByLabel(/full name/i).fill("Alex Rivera");
    await page.getByLabel(/phone number/i).fill("(213) 555-0142");
    await page.getByLabel(/email/i).fill("alex@example.com");
    await page.getByLabel(/best way to reply/i).selectOption("WhatsApp");
    await page.getByLabel(/event type/i).selectOption("Birthday party");
    await page.getByLabel(/event date/i).fill("12/01/2026");
    await page.getByLabel(/city \/ area/i).fill("Pasadena");
    await page.getByLabel(/anything else/i).fill("Afternoon is best.");
    await page.getByRole("button", { name: /request a booking/i }).click();

    await expect(page.getByRole("heading", { name: /request received/i })).toBeVisible();
    expect(submitted?.contactMethod).toBeUndefined();
    expect(submitted?.notes).toContain("Preferred reply: WhatsApp.");
    expect(submitted?.notes).toContain("Afternoon is best.");
  });

  test("email reply choice requires an email address", async ({ page }) => {
    await page.goto("/booking");
    await page.getByLabel(/full name/i).fill("Alex Rivera");
    await page.getByLabel(/phone number/i).fill("(213) 555-0142");
    await page.getByLabel(/best way to reply/i).selectOption("Email");
    await page.getByLabel(/event type/i).selectOption("Birthday party");
    await page.getByLabel(/event date/i).fill("12/01/2026");
    await page.getByLabel(/city \/ area/i).fill("Pasadena");
    await page.getByRole("button", { name: /request a booking/i }).click();

    await expect(page.getByText(/add an email address if you would like us to reply by email/i)).toBeVisible();
  });

  test("privacy is public and included in the crawl surface", async ({ page }) => {
    const privacy = await page.goto("/privacy");
    expect(privacy?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/booking information/i);
    const robotsMeta = page.locator('meta[name="robots"]');
    if (await robotsMeta.count()) {
      await expect(robotsMeta.first()).not.toHaveAttribute("content", /noindex/);
    }

    const sitemap = await page.request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("/privacy");

    const robots = await page.request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    const robotsText = await robots.text();
    expect(robotsText).toContain("Disallow: /design");
    expect(robotsText).toContain("Disallow: /api/");
    expect(robotsText).toContain("Sitemap:");
  });

  test("commercial pages make no blanket free-travel promise", async ({ page }) => {
    for (const path of ["/", "/booking", "/pricing", "/school-shows", "/birthdays"]) {
      await page.goto(path);
      await expect(page.locator("body"), `unapproved travel promise on ${path}`).not.toContainText(
        /free across (the )?(greater )?los angeles|free across .*orange county/i,
      );
    }
  });
});
