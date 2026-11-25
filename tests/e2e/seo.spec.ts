import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page: _page }, info) => {
  test.skip(info.project.name !== "desktop", "SEO checks run once");
});

const PRIORITY = [
  "/tv-repair",
  "/tv-repair/led-tv-repair",
  "/tv-repair/smart-tv-repair",
  "/tv-brand-repair/samsung-tv-repair",
  "/tv-brand-repair/lg-tv-repair",
  "/tv-brand-repair/sony-tv-repair",
  "/tv-problems/tv-screen-repair",
  "/tv-problems/tv-backlight-repair",
  "/tv-problems/tv-motherboard-repair",
];

test("priority pages: unique title, description, canonical, OG, JSON-LD, indexable", async ({ page }) => {
  const titles = new Set<string>();
  for (const path of PRIORITY) {
    await page.goto(path);
    const title = await page.title();
    expect(titles.has(title), `duplicate title ${title}`).toBe(false);
    titles.add(title);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc!.length).toBeGreaterThan(70);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toMatch(new RegExp(`${path}$`));
    expect(canonical).not.toContain("localhost"); // NEXT_PUBLIC_SITE_URL must be set in production
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    expect(await page.locator('meta[name="robots"][content*="noindex"]').count()).toBe(0);
    const types = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap((t) => {
      const j = JSON.parse(t);
      return (Array.isArray(j) ? j : [j]).map((x) => String(x["@type"]));
    });
    const required = path.split("/").filter(Boolean).length > 1 ? ["LocalBusiness", "BreadcrumbList", "Service"] : ["LocalBusiness", "BreadcrumbList"];
    for (const t of required) expect(types, `${path} missing ${t}`).toContain(t);
  }
});

test("no fake ratings anywhere in structured data", async ({ page }) => {
  await page.goto("/");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
  expect(ld).not.toMatch(/aggregateRating|reviewRating/);
});

test("sitemap and robots", async ({ request }) => {
  const sm = await request.get("/sitemap.xml");
  expect(sm.status()).toBe(200);
  const xml = await sm.text();
  for (const p of ["/tv-repair/led-tv-repair", "/tv-problems/tv-screen-repair", "/tv-brand-repair/samsung-tv-repair"]) expect(xml).toContain(p);
  expect(xml).not.toContain("/admin");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Sitemap:");
  expect(robots).not.toContain("Disallow: /admin");
});

test("removed admin routes return 404", async ({ request }) => {
  const res = await request.get("/admin/login");
  expect(res.status()).toBe(404);
});
