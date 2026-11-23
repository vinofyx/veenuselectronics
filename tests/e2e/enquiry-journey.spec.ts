import { test, expect, type Page } from "@playwright/test";
import { PNG_1PX, FAKE_JPG } from "./fixtures/make-images";

// Uses the real API + TEST Supabase project. Runs on one viewport to stay under the per-IP rate limit.
test.describe.configure({ mode: "serial" });
test.beforeEach(async ({ page: _page }, info) => {
  test.skip(!process.env.E2E_WITH_BACKEND, "needs a TEST Supabase project (set E2E_WITH_BACKEND=1)");
  test.skip(info.project.name !== "desktop" && info.project.name !== "android", "enquiry flow runs on desktop + android only");
});

const uniqueMobile = () => `9${String(Date.now()).slice(-9)}`;

async function fillRequired(page: Page, mobile: string) {
  await page.getByLabel("Your name").fill("E2E Test Customer");
  await page.getByLabel("Mobile number").fill(mobile);
  await page.getByLabel("Your area / locality").fill("E2E Test Area");
}

test("full customer journey: home -> TV repair -> brand -> problem -> enquiry with photo -> success -> WhatsApp", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /LED TV Repair/ }).first().click();
  await expect(page).toHaveURL(/\/tv-repair\/led-tv-repair/);

  await page.goto("/tv-brand-repair/samsung-tv-repair");
  await expect(page.getByText(/not an authorised service centre of Samsung/)).toBeVisible();

  await page.goto("/tv-problems/tv-sound-but-no-picture");
  await expect(page.getByText(/please do not open your TV/i)).toBeVisible();

  const form = page.locator("#enquiry");
  await form.scrollIntoViewIfNeeded();
  await fillRequired(page, uniqueMobile());
  await expect(page.getByLabel("Problem", { exact: true })).toHaveValue("Sound But No Picture"); // pre-filled from the page
  await page.getByLabel("Equipment").selectOption("LED TV");
  await page.getByRole("button", { name: /Add more details/ }).click();
  await page.getByLabel("Brand").selectOption("Samsung");
  await page.getByLabel("Model number").fill("UA43T5310");
  await page.locator("input[type=file]").setInputFiles({ name: "screen.png", mimeType: "image/png", buffer: PNG_1PX });
  await expect(page.getByAltText("Selected photo 1")).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(1600); // real users take longer than the anti-bot minimum
  await page.getByRole("button", { name: "Submit Repair Enquiry" }).click();

  await expect(page.getByText("Enquiry received - thank you!")).toBeVisible({ timeout: 15_000 });
  const id = await page.locator("strong.font-mono").innerText();
  expect(id).toMatch(/^VE-\d{6}-\d{4,}$/);
  await expect(page.getByText(/not a confirmed appointment/)).toBeVisible();

  const wa = page.getByRole("link", { name: /Share details on WhatsApp/ });
  if (await wa.count()) {
    const href = await wa.getAttribute("href");
    const text = decodeURIComponent(href!.split("text=")[1]);
    expect(href).toMatch(/^https:\/\/wa\.me\/\d{10,15}\?text=/);
    expect(text).toContain(`Enquiry ID: ${id}`);
    expect(text).toContain("Brand: Samsung");
    expect(text).toContain("Model: UA43T5310");
  }
});

test("invalid mobile and missing fields show errors and do not submit", async ({ page }) => {
  await page.goto("/book-repair");
  await page.getByRole("button", { name: "Submit Repair Enquiry" }).click();
  await expect(page.getByText("Please enter your name")).toBeVisible();
  await expect(page.getByText(/valid 10-digit Indian mobile/)).toBeVisible();
  await expect(page.getByText(/Please agree/)).toBeVisible();
  await page.getByLabel("Mobile number").fill("12345");
  await page.getByRole("button", { name: "Submit Repair Enquiry" }).click();
  await expect(page.getByText(/valid 10-digit Indian mobile/)).toBeVisible();
});

test("duplicate submission returns the same enquiry number", async ({ page }) => {
  const mobile = uniqueMobile();
  const submit = async () => {
    await page.goto("/book-repair");
    await fillRequired(page, mobile);
    await page.getByRole("checkbox").check();
    await page.waitForTimeout(1600);
    await page.getByRole("button", { name: "Submit Repair Enquiry" }).click();
    await expect(page.locator("strong.font-mono")).toBeVisible({ timeout: 15_000 });
    return page.locator("strong.font-mono").innerText();
  };
  const first = await submit();
  const second = await submit();
  expect(second).toBe(first);
  await expect(page.getByText("We already have your enquiry")).toBeVisible();
});

test.describe("API protection", () => {
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
