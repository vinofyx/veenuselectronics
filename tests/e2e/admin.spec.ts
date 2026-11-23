import { test, expect, type Page } from "@playwright/test";

const ADMIN = { email: process.env.E2E_ADMIN_EMAIL, password: process.env.E2E_ADMIN_PASSWORD };
const STAFF = { email: process.env.E2E_STAFF_EMAIL, password: process.env.E2E_STAFF_PASSWORD };

test.beforeEach(async ({ page: _page }, info) => {
  test.skip(info.project.name !== "desktop" && info.project.name !== "iphone", "admin runs on desktop + iphone");
});

async function login(page: Page, creds: { email?: string; password?: string }) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(creds.email!);
  await page.getByLabel("Password").fill(creds.password!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("unauthorised access", () => {
  for (const path of ["/admin", "/admin/enquiries", "/admin/reports", "/admin/business", "/admin/settings"]) {
    test(`${path} redirects to login when signed out`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login/);
    });
  }
  test("CSV export is not available when signed out", async ({ request }) => {
    const res = await request.get("/api/admin/export", { maxRedirects: 0 });
    expect([302, 303, 307, 401]).toContain(res.status());
  });
  test("wrong password is rejected", async ({ page }) => {
    test.skip(!process.env.E2E_WITH_BACKEND, "needs a TEST Supabase project");
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toContainText(/Invalid email or password/);
  });
});

test.describe("admin", () => {
  test.skip(!ADMIN.email || !ADMIN.password, "set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD");

  test("dashboard shows all 8 widgets", async ({ page }) => {
    await login(page, ADMIN);
    for (const w of ["Total Enquiries", "New Enquiries", "Contacted Customers", "Inspection Pending", "Estimates Sent", "Repairs In Progress", "Completed Repairs", "Cancelled Requests"]) {
      await expect(page.getByText(w, { exact: true })).toBeVisible();
    }
  });

  test("search, filter, open, update repair details, status history", async ({ page }) => {
    await login(page, ADMIN);
    await page.goto("/admin/enquiries?q=E2E");
    const first = page.locator("tbody a.font-mono").first();
    test.skip((await first.count()) === 0, "no E2E enquiries - run enquiry-journey.spec.ts first");
    await page.goto("/admin/enquiries?brand=Samsung&equipment=LED+TV");
    await first.click();
    await page.getByLabel("Status").selectOption("Diagnosing");
    await page.getByLabel("Assigned technician").fill("E2E Technician");
    await page.getByLabel("Diagnosis").fill("E2E: backlight strip failure");
    await page.getByLabel("Estimate (₹)").fill("2500");
    await page.getByLabel("Final cost (₹)").fill("2400");
    await page.getByLabel("Parts used").fill("LED strip set");
    await page.getByLabel("Warranty information").fill("E2E warranty note");
    await page.getByLabel(/Internal notes/).fill("E2E internal note");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("status")).toContainText("Saved");
    await page.reload();
    await expect(page.getByLabel("Diagnosis")).toHaveValue("E2E: backlight strip failure");
    await expect(page.getByText("Diagnosing").first()).toBeVisible();
  });

  test("CSV export downloads with a header row", async ({ page }) => {
    await login(page, ADMIN);
    const res = await page.request.get("/api/admin/export");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/csv");
    expect(await res.text()).toContain("enquiry_number,created_at,status");
  });

  test("reports page shows revenue", async ({ page }) => {
    await login(page, ADMIN);
    await page.goto("/admin/reports");
    await expect(page.getByText("Revenue (final cost)")).toBeVisible();
  });

  test("business details save and appear on the public site", async ({ page }) => {
    await login(page, ADMIN);
    await page.goto("/admin/business");
    const hours = page.getByLabel("Working hours");
    const original = await hours.inputValue();
    await hours.fill("E2E hours 9-5");
    await page.getByRole("button", { name: "Save business details" }).click();
    await expect(page.getByRole("status")).toContainText("Saved");
    await page.goto("/contact-us");
    await expect(page.getByText("E2E hours 9-5").first()).toBeVisible({ timeout: 20_000 });
    await page.goto("/admin/business");
    await page.getByLabel("Working hours").fill(original);
    await page.getByRole("button", { name: "Save business details" }).click();
  });
});

test.describe("staff permissions", () => {
  test.skip(!STAFF.email || !STAFF.password, "set E2E_STAFF_EMAIL and E2E_STAFF_PASSWORD");
  test("staff cannot open admin-only pages or export", async ({ page }) => {
    await login(page, STAFF);
    for (const p of ["/admin/reports", "/admin/business", "/admin/settings"]) {
      await page.goto(p);
      await expect(page).toHaveURL(/\/admin\?error=forbidden/);
    }
    expect((await page.request.get("/api/admin/export")).status()).toBe(403);
  });
});
