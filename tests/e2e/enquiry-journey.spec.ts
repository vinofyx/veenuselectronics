import { test, expect } from "@playwright/test";

/**
 * Public website customer journey and booking E2E tests:
 * - Homepage navigation and sections
 * - TV repair service, brand, and problem pages
 * - Contact page and business details
 * - Phone, WhatsApp, and SMS direct booking links
 * - Mobile responsive navigation (drawer menu, sticky bar)
 * - Sitemap and robots.txt verification
 */

test.describe("Homepage navigation", () => {
  test("header navigation links reach main public sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Veenus Electronics/i);

    // Verify main navigation on desktop (>= 1280px)
    if (page.viewportSize()!.width >= 1280) {
      const nav = page.getByRole("navigation", { name: "Main" });
      await expect(nav.getByRole("button", { name: /TV Repair/i })).toBeVisible();
      await expect(nav.getByRole("button", { name: /TV Problems/i })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Brands We Repair" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Contact Us" })).toBeVisible();
      await expect(page.getByRole("link", { name: /Book Repair/i }).first()).toBeVisible();
    }
  });

  test("homepage hero and primary CTAs navigate to booking and services", async ({ page }) => {
    await page.goto("/");
    const heroCta = page.getByRole("link", { name: /Book (TV )?Repair/i }).first();
    await expect(heroCta).toBeVisible();
    await heroCta.click();
    await expect(page).toHaveURL(/\/book-repair/);
    await expect(page.locator("h1")).toContainText(/Book a TV Repair/i);
  });

  test("homepage service cards link to specific repair services", async ({ page }) => {
    await page.goto("/");
    const ledCard = page.locator('main a[href="/tv-repair/led-tv-repair"]').first();
    await expect(ledCard).toBeVisible();
    await ledCard.click();
    await expect(page).toHaveURL(/\/tv-repair\/led-tv-repair/);
    await expect(page.locator("h1")).toContainText(/LED TV Repair/i);
  });
});

test.describe("TV repair service pages", () => {
  test("service hub and detail pages display repair features and booking CTAs", async ({ page }) => {
    // Service hub
    await page.goto("/tv-repair");
    await expect(page.locator("h1")).toContainText(/TV Repair Services/i);

    // Detail service page
    await page.goto("/tv-repair/led-tv-repair");
    await expect(page.locator("h1")).toContainText(/LED TV Repair/i);
    await expect(page.locator("article h2").first()).toBeVisible();
    // Confirms NO written enquiry form exists
    await expect(page.locator("form")).toHaveCount(0);
    // Confirms direct booking action is present
    await expect(page.locator('main a[href^="tel:"], main a[href^="https://wa.me/"]').first()).toBeVisible();
  });

  test("brand repair pages display independent service disclaimer and repair scope", async ({ page }) => {
    await page.goto("/tv-brand-repair/samsung-tv-repair");
    await expect(page.locator("h1")).toContainText(/Samsung TV Repair/i);
    await expect(page.getByText(/not an authorised service centre/i).first()).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
  });

  test("problem repair pages display diagnostic advice, safety warning, and no form", async ({ page }) => {
    await page.goto("/tv-problems/tv-sound-but-no-picture");
    await expect(page.locator("h1")).toContainText(/Sound But No Picture/i);
    await expect(page.getByText(/please do not open your TV/i)).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('main a[href^="tel:"], main a[href^="https://wa.me/"]').first()).toBeVisible();
  });
});

test.describe("Contact page", () => {
  test("displays contact information and direct technician channels with no form", async ({ page }) => {
    await page.goto("/contact-us");
    await expect(page.locator("h1")).toHaveText("Contact Us");
    await expect(page.getByRole("heading", { name: /Contact information/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Talk to a technician/i })).toBeVisible();

    // Verify phone, email, and address info
    await expect(page.locator('main a[href^="tel:"]').first()).toBeVisible();
    await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();

    // No enquiry form
    await expect(page.locator("form")).toHaveCount(0);
  });
});

test.describe("Phone, WhatsApp, and SMS booking links", () => {
  test("phone links use valid international tel: protocol", async ({ page }) => {
    await page.goto("/book-repair");
    const telLinks = page.locator('main a[href^="tel:"]');
    await expect(telLinks.first()).toBeVisible();
    const href = await telLinks.first().getAttribute("href");
    expect(href).toMatch(/^tel:\+\d{10,15}$/);
  });

  test("WhatsApp booking links open wa.me with pre-filled repair message", async ({ page }) => {
    await page.goto("/book-repair");
    const waLinks = page.locator('main a[href^="https://wa.me/"]');
    await expect(waLinks.first()).toBeVisible();
    const href = (await waLinks.first().getAttribute("href"))!;
    expect(href).toMatch(/^https:\/\/wa\.me\/\d{10,15}\?text=/);
    const decoded = decodeURIComponent(href.split("text=")[1]);
    expect(decoded).toMatch(/repair/i);
  });

  test("SMS booking links use valid sms: protocol with repair message", async ({ page }) => {
    await page.goto("/book-repair");
    const smsLinks = page.locator('main a[href^="sms:"]');
    await expect(smsLinks.first()).toBeVisible();
    const href = (await smsLinks.first().getAttribute("href"))!;
    expect(href).toMatch(/^sms:\+?\d{10,15}(\?|&)body=/);
    const decoded = decodeURIComponent(href.split(/body=/i)[1]);
    expect(decoded).toMatch(/repair/i);
  });
});

test.describe("Mobile responsive navigation", () => {
  test("hamburger menu toggles drawer and navigates on mobile viewports", async ({ page }) => {
    test.skip(page.viewportSize()!.width >= 1280, "mobile/tablet navigation only");
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Open menu" });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const mobileMenu = page.locator("#mobile-menu");
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByText("TV Repair", { exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("Brands We Repair", { exact: true })).toBeVisible();
    await expect(mobileMenu.getByText("TV Problems", { exact: true })).toBeVisible();

    await mobileMenu.getByText("Brands We Repair", { exact: true }).click();
    await expect(page).toHaveURL(/\/tv-brand-repair$/);
  });

  test("sticky bottom contact bar is visible on mobile and hidden on desktop", async ({ page }) => {
    await page.goto("/");
    const bar = page.locator("div.fixed.inset-x-0.bottom-0");
    if (page.viewportSize()!.width < 768) {
      await expect(bar).toBeVisible();
      await expect(bar.locator('a[href^="tel:"]').first()).toBeVisible();
      await expect(bar.locator('a[href^="https://wa.me/"], a[href="/book-repair"]').first()).toBeVisible();
    } else {
      await expect(bar).toBeHidden();
    }
  });
});

test.describe("Sitemap and robots.txt", () => {
  test("robots.txt allows indexing and links to sitemap without admin references", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap: https://veenuselectronics.com/sitemap.xml");
    expect(body).not.toContain("Disallow: /admin");
    expect(body).not.toContain("/admin");
  });

  test("sitemap.xml lists public routes and excludes removed admin routes", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("https://veenuselectronics.com/tv-repair");
    expect(xml).toContain("https://veenuselectronics.com/tv-repair/led-tv-repair");
    expect(xml).toContain("https://veenuselectronics.com/tv-brand-repair/samsung-tv-repair");
    expect(xml).toContain("https://veenuselectronics.com/tv-problems/tv-screen-repair");
    expect(xml).toContain("https://veenuselectronics.com/contact-us");
    expect(xml).toContain("https://veenuselectronics.com/book-repair");
    expect(xml).not.toContain("/admin");
  });

  test("removed admin and API routes return 404", async ({ request }) => {
    for (const route of ["/admin", "/admin/login", "/admin/enquiries", "/api/enquiries", "/api/admin/export"]) {
      const res = await request.get(route);
      expect(res.status(), `Expected ${route} to be 404`).toBe(404);
    }
  });
});
