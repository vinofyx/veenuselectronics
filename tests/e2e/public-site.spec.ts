import { test, expect } from "@playwright/test";

const KEY_PAGES = [
  "/",
  "/tv-problems",
  "/tv-brand-repair",
  "/tv-problems/tv-not-turning-on",
  "/tv-repair",
  "/tv-repair/led-tv-repair",
  "/tv-repair/smart-tv-repair",
  "/tv-problems/tv-screen-repair",
  "/tv-problems/tv-backlight-repair",
  "/tv-problems/tv-motherboard-repair",
  "/tv-brand-repair/samsung-tv-repair",
  "/tv-brand-repair/lg-tv-repair",
  "/tv-brand-repair/sony-tv-repair",
  "/book-repair",
  "/contact-us",
];

test.describe("public pages", () => {
  for (const path of KEY_PAGES) {
    test(`${path} loads with one H1, no horizontal scroll, no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, "page is wider than the viewport").toBeLessThanOrEqual(1);
      expect(errors.filter((e) => !/googletagmanager|favicon/i.test(e))).toEqual([]);
    });
  }

  test("all images have alt text (or are decorative)", async ({ page }) => {
    for (const path of ["/", "/tv-repair/led-tv-repair", "/about-us"]) {
      await page.goto(path);
      const missing = await page.locator("img:not([alt])").count();
      expect(missing, `${path} has <img> without alt`).toBe(0);
    }
  });

  test("404 page for unknown routes", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("header links reach the TV repair, problems and brands sections", async ({ page }) => {
    await page.goto("/");
    if (page.viewportSize()!.width < 1280) {
      // below the xl breakpoint the header uses the hamburger menu
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.locator("#mobile-menu").getByText("Brands We Repair").click();
    } else {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Brands We Repair" }).click();
    }
    await expect(page).toHaveURL(/\/tv-brand-repair$/);
    await expect(page.locator("h1")).toHaveText(/TV Brands We Repair/);
  });

  test("every link on the homepage resolves (no 404s)", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href")!.split("#")[0]))]);
    for (const href of hrefs.filter(Boolean)) {
      const res = await request.get(href);
      expect(res.status(), href).toBeLessThan(400);
    }
  });
});

test.describe("responsive conversion elements", () => {
  test("mobile sticky bar shows Call/WhatsApp/Book on phones and is hidden from 768px", async ({ page }) => {
    await page.goto("/");
    const bar = page.locator("div.fixed.inset-x-0.bottom-0");
    if (page.viewportSize()!.width < 768) {
      await expect(bar).toBeVisible();
      await expect(bar.getByRole("link", { name: /Book Repair/ })).toBeVisible();
      const box = await bar.boundingBox();
      const vh = page.viewportSize()!.height;
      expect(box!.y + box!.height).toBeLessThanOrEqual(vh + 1);
    } else {
      await expect(bar).toBeHidden();
    }
  });

  test("hero headline and primary CTA are above the fold", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /Book TV Repair/ }).first();
    const box = await cta.boundingBox();
    expect(box!.y).toBeLessThan(page.viewportSize()!.height);
  });

  test("tap targets in the sticky bar are at least 44px tall", async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 768, "phones only");
    await page.goto("/");
    for (const link of await page.locator("div.fixed.inset-x-0.bottom-0 a").all()) {
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });
});
