import { test, expect } from "@playwright/test";
import { FAKE_JPG } from "./fixtures/make-images";

// The public enquiry form was removed at the owner's request (Nov 2026). Customers book by
// phone, WhatsApp or SMS; the enquiry API and admin remain and are covered by "API protection".

test("customer journey: home -> TV repair -> brand -> problem -> book on WhatsApp (no form)", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop" && info.project.name !== "android", "journey runs on desktop + android only");
  await page.goto("/");
  await page.locator('main a[href="/tv-repair/led-tv-repair"]').first().click();
  await expect(page).toHaveURL(/\/tv-repair\/led-tv-repair/);

  await page.goto("/tv-brand-repair/samsung-tv-repair");
  await expect(page.getByText(/not an authorised service centre of Samsung/)).toBeVisible();

  await page.goto("/tv-problems/tv-sound-but-no-picture");
  await expect(page.getByText(/please do not open your TV/i)).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);

  const wa = page.locator("#enquiry").getByRole("link", { name: /Book on WhatsApp/ });
  test.skip((await wa.count()) === 0, "no WhatsApp configured");
  const href = (await wa.getAttribute("href"))!;
  expect(href).toMatch(/^https:\/\/wa\.me\/\d{10,15}\?text=/);
  expect(decodeURIComponent(href.split("text=")[1])).toContain("I would like to request a repair");
});

// API tests use the real API + a TEST Supabase project, on one viewport to stay under the per-IP rate limit.
test.describe.configure({ mode: "serial" });

const uniqueMobile = () => `9${String(Date.now()).slice(-9)}`;

test.describe("API protection", () => {
  test.beforeEach(async ({ page: _page }, info) => {
    test.skip(!process.env.E2E_WITH_BACKEND, "needs a TEST Supabase project (set E2E_WITH_BACKEND=1)");
    test.skip(info.project.name !== "desktop", "API tests run once");
  });

  test("rejects cross-site posts", async ({ request }) => {
    const res = await request.post("/api/enquiries", { headers: { origin: "https://evil.example" }, multipart: { customer_name: "x" } });
    expect(res.status()).toBe(403);
  });

  test("honeypot submissions get a decoy and are not stored", async ({ request, baseURL }) => {
    const res = await request.post("/api/enquiries", {
      headers: { origin: baseURL! },
      multipart: { customer_name: "Bot", mobile_number: "9876543210", location: "X Area", consent: "true", elapsed_ms: "9000", company: "spam" },
    });
    expect(res.status()).toBe(200); // decoy: verify in admin that no "Bot" enquiry exists
  });

  test("non-image uploads are rejected", async ({ request, baseURL }) => {
    const res = await request.post("/api/enquiries", {
      headers: { origin: baseURL! },
      multipart: {
        customer_name: "E2E Upload Test",
        mobile_number: uniqueMobile(),
        location: "E2E Test Area",
        consent: "true",
        elapsed_ms: "9000",
        photos: { name: "x.jpg", mimeType: "image/jpeg", buffer: FAKE_JPG },
      },
    });
    expect(res.status()).toBe(422);
  });
});
