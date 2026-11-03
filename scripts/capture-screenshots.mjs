import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = process.env.CAPTURE_BASE_URL ?? "http://127.0.0.1:3000";
const outDir = path.join(process.cwd(), "qa");
const channel = process.env.PLAYWRIGHT_CHANNEL;

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch(channel ? { channel } : {});

async function openPage({
  width,
  height,
  reducedMotion = "no-preference",
  isMobile = false,
}) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion,
    isMobile,
    hasTouch: isMobile,
  });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2600);
  return { context, page };
}

const desktop = await openPage({ width: 1440, height: 1000 });
await desktop.page.screenshot({ path: path.join(outDir, "new-desktop.png") });

for (const [name, selector] of [
  ["manifesto", "#manifesto"],
  ["trust", "#trust"],
  ["footer", ".site-footer"],
]) {
  await desktop.page.evaluate((target) => {
    const element = document.querySelector(target);
    if (element) window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY);
  }, selector);
  await desktop.page.waitForTimeout(1600);
  await desktop.page.screenshot({ path: path.join(outDir, `new-${name}.png`) });
}
await desktop.context.close();

const desktopFull = await openPage({
  width: 1440,
  height: 1000,
  reducedMotion: "reduce",
});
await desktopFull.page.screenshot({
  path: path.join(outDir, "new-full-desktop.png"),
  fullPage: true,
});
await desktopFull.context.close();

const mobile = await openPage({ width: 390, height: 844, isMobile: true });
await mobile.page.screenshot({ path: path.join(outDir, "new-mobile.png") });
await mobile.context.close();

const mobileFull = await openPage({
  width: 390,
  height: 844,
  isMobile: true,
  reducedMotion: "reduce",
});
await mobileFull.page.screenshot({
  path: path.join(outDir, "new-full-mobile.png"),
  fullPage: true,
});
await mobileFull.context.close();

await browser.close();
console.log("Screenshots written to qa/");
