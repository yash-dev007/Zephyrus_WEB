import { expect, test, type Page } from "@playwright/test";

const EXTERNAL_HREF = /^https:\/\/github\.com\//;

async function openHome(page: Page) {
  await page.goto("/");
  await page.waitForFunction(
    () => (window as Window & { __zephyrusBooted?: boolean }).__zephyrusBooted === true,
  );
  await page.evaluate(() => document.fonts.ready.then(() => true));
}

async function expectSectionAtViewportTop(page: Page, id: string) {
  await expect
    .poll(
      () =>
        page.evaluate((sectionId) => {
          const section = document.getElementById(sectionId);
          if (!section) return Number.POSITIVE_INFINITY;
          return Math.abs(Math.round(section.getBoundingClientRect().top));
        }, id),
      {
        message: `expected #${id} to align with the top of the viewport`,
        timeout: 10_000,
      },
    )
    .toBeLessThan(8);
}

test.describe("page content", () => {
  test("renders the hero, story, modules, quickstart and footer", async ({ page }) => {
    await openHome(page);

    await expect(page).toHaveTitle(/Zephyrus\s+—\s+Local-first AI harness/);
    await expect(page.getByRole("heading", { level: 1, name: "Zephyrus" })).toBeVisible();
    await expect(page.locator(".about-copy")).toContainText("A self-hosted AI workspace");
    await expect(page.getByRole("heading", { name: /Own your models/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Self-host your AI/ })).toBeVisible();
    await expect(page.locator(".subline em")).toHaveText("Built for local-first work.");
    await expect(page.locator(".term-body")).toContainText(
      "docker compose up -d --build",
    );
    await expect(page.locator(".footer-path")).toHaveText("data/");
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("has one h1, labelled sections and intrinsically sized images", async ({
    page,
  }) => {
    await openHome(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("div.site > main")).toHaveCount(1);

    const images = page.locator("img");
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);

    for (let index = 0; index < imageCount; index += 1) {
      const image = images.nth(index);
      expect(await image.getAttribute("alt")).not.toBeNull();
      expect(await image.getAttribute("width")).not.toBeNull();
      expect(await image.getAttribute("height")).not.toBeNull();
    }
  });
});

test.describe("navigation", () => {
  test("updates the URL, active state and scroll position", async ({ page }) => {
    await openHome(page);

    const nav = page.getByRole("navigation", { name: "Primary" });
    const home = nav.getByRole("link", { name: "Home" });
    const overview = nav.getByRole("link", { name: "Overview" });

    await expect(home).toHaveAttribute("aria-current", "location");

    await overview.click();

    await expect(page).toHaveURL(/#manifesto$/);
    await expect(overview).toHaveAttribute("aria-current", "location");
    await expect(home).not.toHaveAttribute("aria-current", "location");
    await expectSectionAtViewportTop(page, "manifesto");
  });

  test("hero CTA opens the modules section", async ({ page }) => {
    await openHome(page);

    await page.getByRole("link", { name: "Explore modules" }).click();

    await expect(page).toHaveURL(/#trust$/);
    await expectSectionAtViewportTop(page, "trust");
  });

  test("footer section links scroll back to content", async ({ page }) => {
    await openHome(page);

    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    await page
      .getByRole("navigation", { name: "Product" })
      .getByRole("link", { name: "Overview" })
      .click();

    await expect(page).toHaveURL(/#manifesto$/);
    await expectSectionAtViewportTop(page, "manifesto");
  });

  test("external links open safely in a new tab", async ({ page }) => {
    await openHome(page);

    const externalLinks = page.locator('a[target="_blank"]');
    const linkCount = await externalLinks.count();
    expect(linkCount).toBeGreaterThanOrEqual(10);

    for (let index = 0; index < linkCount; index += 1) {
      const link = externalLinks.nth(index);
      await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
      await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
      await expect(link).toHaveAttribute("href", EXTERNAL_HREF);
      await expect(link).toContainText("(opens in a new tab)");
    }
  });
});

test.describe("motion", () => {
  test("animated counters settle on their real values", async ({ page }) => {
    await openHome(page);

    const heroCounts = page.locator(".hero-stats .count");
    await expect(heroCounts.nth(0)).toHaveText("16");
    await expect(heroCounts.nth(1)).toHaveText("13+");

    await page.getByRole("link", { name: "Explore modules" }).click();

    const trustCounts = page.locator(".trust-section .trust-count .count");
    await expect(trustCounts.nth(0)).toHaveText("16");
    await expect(trustCounts.nth(1)).toHaveText("13+");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("server-rendered content and counters stay visible", async ({ page }) => {
      await page.goto("/");

      await expect(page.locator("html")).not.toHaveClass(/\bjs\b/);
      await expect(
        page.getByRole("heading", { level: 1, name: "Zephyrus" }),
      ).toBeVisible();
      await expect(page.locator(".hero-stats .count").first()).toHaveText("16");
      await expect(page.locator(".hero-stats .count").last()).toHaveText("13+");
      await expect(page.locator(".subline")).toHaveCSS("opacity", "1");
      await expect(page.locator(".trust-heading")).toHaveCSS("opacity", "1");
    });
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("skips smooth scrolling while revealing all content", async ({ page }) => {
      await openHome(page);

      await expect(page.locator("html")).toHaveClass(/reduce/);
      await expect(page.locator(".subline")).toHaveCSS("opacity", "1");
      expect(
        await page.evaluate(() => document.documentElement.classList.contains("lenis")),
      ).toBe(false);

      await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Overview" })
        .click();

      await expect(page).toHaveURL(/#manifesto$/);
      await expectSectionAtViewportTop(page, "manifesto");
    });
  });
});

test.describe("metadata and accessibility", () => {
  test("ships indexable metadata and static SEO routes", async ({ page, request }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Zephyrus\s+—\s+Local-first AI harness/);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toContain("local-first AI harness");

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).not.toBeNull();
    expect(new URL(canonical as string).pathname).toBe("/");

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).not.toBeNull();
    expect(new URL(ogImage as string).pathname).toBe("/og-image.jpg");

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    const jsonLdText = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const jsonLd = JSON.parse(jsonLdText ?? "{}") as Record<string, unknown>;
    expect(jsonLd["@type"]).toBe("SoftwareApplication");
    expect(jsonLd.name).toBe("Zephyrus");
    expect(jsonLd.featureList).toContain("MCP tools");
    expect(jsonLd.offers).toMatchObject({ price: "0", priceCurrency: "USD" });

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("User-Agent: *");
    expect(robotsBody).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain("<loc>");
    expect(sitemapBody).toContain("/</loc>");

    const manifest = await request.get("/manifest.webmanifest");
    expect(manifest.status()).toBe(200);
    const manifestBody = (await manifest.json()) as {
      name: string;
      icons: Array<{ sizes?: string }>;
    };
    expect(manifestBody.name).toContain("Zephyrus");
    expect(manifestBody.icons).toEqual(
      expect.arrayContaining([expect.objectContaining({ sizes: "192x192" })]),
    );

    const og = await request.get("/og-image.jpg");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/jpeg");
  });

  test("supports the skip link and adequately sized nav targets", async ({ page }) => {
    await openHome(page);

    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await skipLink.press("Enter");
    await expect(page).toHaveURL(/#manifesto$/);
    await expect(page.locator("#manifesto")).toBeFocused();
    await expectSectionAtViewportTop(page, "manifesto");

    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const name of ["Home", "Overview", "Modules", "Docs"]) {
      const box = await nav.getByRole("link", { name }).boundingBox();
      expect(box).not.toBeNull();
      expect(box?.height).toBeGreaterThanOrEqual(24);
      expect(box?.width).toBeGreaterThanOrEqual(24);
    }
  });
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openHome(page);

    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });

    expect(overflow).toBeLessThanOrEqual(1);
  });
}
