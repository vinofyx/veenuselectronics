import { test, expect } from "@playwright/test";
import path from "node:path";

/**
 * Call / WhatsApp buttons, contact page, booking page, and screenshots.
 * In CI the business phone/WhatsApp come from clearly-marked test fixtures in the workflow env.
 * Locally, configure them in Admin -> Business details (or env) first; otherwise these tests skip.
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
    const wa = page.getByRole("link", { name: /Book on WhatsApp/ });
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
  test("contact page shows the enquiry form and contact details card", async ({ page }) => {
    await page.goto("/contact-us");
    await expect(page.locator("h1")).toHaveText("Contact Us");
    await expect(page.getByRole("heading", { name: "Contact information" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit Repair Enquiry" })).toBeVisible();
  });

  test("booking form fields are usable and the form fits the screen", async ({ page }) => {
    await page.goto("/book-repair");
    for (const label of ["Your name", "Mobile number", "Your area / locality", "Equipment"]) {
      await expect(page.getByLabel(label)).toBeVisible();
    }
    await expect(page.getByLabel("Problem", { exact: true })).toBeVisible();
    const form = await page.locator("form").first().boundingBox();
    expect(form!.x + form!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  });
});

test.describe("screenshots", () => {
  for (const [name, url] of [
    ["home", "/"],
    ["booking", "/book-repair"],
  ] as const) {
    test(`${name} page screenshot`, async ({ page }, info) => {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.screenshot({
        path: path.join("test-results", "screenshots", `${info.project.name}-${name}.png`),
        fullPage: true,
      });
    });
  }
});
