#!/usr/bin/env node
// One-off review helper: full-page screenshots of every route (desktop + mobile),
// for handoff. NOT part of the gate. Run against a running server:
//   PORT=3100 pnpm dev &   then   node scripts/screenshots.mjs
// Uses reducedMotion:'reduce' so scroll-reveal blocks are visible in the capture.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3100";
const OUT = process.env.SHOT_OUT ?? "docs/reports/2026-06-22-screenshots";

const ROUTES = [
  ["home", "/"],
  ["booking", "/booking"],
  ["pricing", "/pricing"],
  ["shows", "/shows"],
  ["school-shows", "/school-shows"],
  ["birthdays", "/birthdays"],
  ["characters", "/characters"],
  ["gallery", "/gallery"],
  ["about", "/about"],
  ["design", "/design"],
];
const MOBILE = new Set(["home", "booking", "pricing"]);

async function waitForServer(url, tries = 120) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

if (!(await waitForServer(BASE))) {
  console.error("server not ready at", BASE);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

async function shot(ctx, name, path, suffix) {
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "load", timeout: 60_000 });
  await page.waitForTimeout(900); // let fonts + first-compile settle
  await page.screenshot({ path: `${OUT}/${name}-${suffix}.png`, fullPage: true });
  await page.close();
  console.log("shot", `${name}-${suffix}`);
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
  deviceScaleFactor: 1,
});
for (const [name, path] of ROUTES) await shot(desktop, name, path, "desktop");
await desktop.close();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
for (const [name, path] of ROUTES.filter(([k]) => MOBILE.has(k))) {
  await shot(mobile, name, path, "mobile");
}
await mobile.close();

await browser.close();
console.log("DONE ->", OUT);
