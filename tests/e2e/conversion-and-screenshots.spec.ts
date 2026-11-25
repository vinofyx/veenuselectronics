import { test, expect } from "@playwright/test";
import path from "node:path";

/**
 * Call / WhatsApp buttons, contact page, booking page, and screenshots.
 * In CI the business phone/WhatsApp come from clearly-marked test fixtures in the workflow env.
 * Locally, configured via environment variables or business config; otherwise these tests skip.
 */

test.describe("Call and WhatsApp buttons", () => {
  test("Call buttons use a valid tel: link", async ({ page }) => {
    await page.goto("/");
    const tel = page.locator('a[href^="tel:"]');
    test.skip((await tel.count()) === 0, "no phone configured - Call buttons are hidden by design");
    for (const href of await tel.evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) {
      expect(href).toMatch(/^tel:\+\d{10,15}$/);
    }
    await expect(tel.filter({ visible: true }).first()).toBeVisible();
  });

  test("WhatsApp buttons open wa.me with an encoded TV-repair message", async ({ page }) => {
    await page.goto("/");
    const wa = page.locator('a[href^="https://wa.me/"]');
    test.skip((await wa.count()) === 0, "no WhatsApp configured - buttons are hidden by design");
    for (const a of await wa.all()) {
      const href = (await a.getAttribute("href"))!;
      expect(href).toMatch(/^https:\/\/wa\.me\/\d{10,15}\?text=\S+$/);
      expect(decodeURIComponent(href.split("text=")[1])).toMatch(/TV repair/i);
      expect(await a.getAttribute("target")).toBe("_blank");
      expect(await a.getAttribute("rel")).toContain("noopener");
    }
  });

  test("booking page offers WhatsApp booking with the repair-request template", async ({ page }) => {
    await page.goto("/book-repair");
    const wa = page.getByRole("link", { name: /Book on WhatsApp/ }).first();
    test.skip((await wa.count()) === 0, "no WhatsApp configured");
    const text = decodeURIComponent((await wa.getAttribute("href"))!.split("text=")[1]);
    expect(text).toContain("I would like to request a repair");
  });

  test("hidden Call/WhatsApp buttons never point to placeholder numbers", async ({ page }) => {
    await page.goto("/contact-us");
    const html = await page.content();
    expect(html).not.toMatch(/CONFIGURE_|XXXXXXXX|tel:undefined|wa\.me\/undefined/);
  });
});

test.describe("contact and booking pages", () => {
  test("contact page shows contact details and direct booking actions, with no enquiry form", async ({ page }) => {
    await page.goto("/contact-us");
    await expect(page.locator("h1")).toHaveText("Contact Us");
    await expect(page.getByRole("heading", { name: "Contact information" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Talk to a technician" })).toBeVisible();
    // The written enquiry form was removed at the owner's request (Nov 2026)
    await expect(page.locator("form")).toHaveCount(0);
  });

  test("booking page has no form and offers direct call, whatsapp, and sms options", async ({ page }) => {
    await page.goto("/book-repair");
    // Verify NO form is present on the page
    await expect(page.locator("form")).toHaveCount(0);

    // Verify direct Call links inside main content
    const callLinks = page.locator('main a[href^="tel:"]');
    await expect(callLinks.first()).toBeVisible();

    // Verify direct WhatsApp links inside main content
    const waLinks = page.locator('main a[href^="https://wa.me/"]');
    await expect(waLinks.first()).toBeVisible();

    // Verify direct SMS links inside main content
    const smsLinks = page.locator('main a[href^="sms:"]');
    await expect(smsLinks.first()).toBeVisible();
  });
});

test.describe("screenshots", () => {
  for (const [name, url] of [
    ["home", "/"],
    ["tv-repair", "/tv-repair"],
    ["tv-problems", "/tv-problems"],
    ["electronics-repair", "/electronics-repair"],
    ["tv-brand-repair", "/tv-brand-repair"],
    ["about-us", "/about-us"],
    ["contact-us", "/contact-us"],
    ["book-repair", "/book-repair"],
  ] as const) {
    test(`${name} page screenshot`, async ({ page }, info) => {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: path.join("docs", "screenshots", `${info.project.name}-${name}.png`),
        fullPage: true,
      });
    });
  }
});
