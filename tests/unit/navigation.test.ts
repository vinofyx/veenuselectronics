import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { mainNav, footerLinks } from "../../src/config/navigation";
import { tvServices } from "../../src/content/tv-services";
import { tvProblems } from "../../src/content/tv-problems";
import { brands } from "../../src/content/brands";
import { electronics } from "../../src/content/electronics";
import { blogPosts } from "../../src/content/blog";

const ROOT = path.resolve(__dirname, "../..");
const SITE = path.join(ROOT, "src/app/(site)");

/** Every public route: static page files + dynamic slugs from content. */
function publicRoutes(): Set<string> {
  const routes = new Set<string>();
  (function walk(dir: string) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) {
        if (!f.startsWith("[")) walk(p);
      } else if (f === "page.tsx") {
        const rel = path.relative(SITE, dir).split(path.sep).join("/");
        routes.add(rel ? `/${rel}` : "/");
      }
    }
  })(SITE);
  tvServices.forEach((s) => routes.add(`/tv-repair/${s.slug}`));
  tvProblems.forEach((s) => routes.add(`/tv-problems/${s.slug}`));
  brands.forEach((s) => routes.add(`/tv-brand-repair/${s.slug}`));
  electronics.forEach((s) => routes.add(`/electronics-repair/${s.slug}`));
  blogPosts.forEach((s) => routes.add(`/blog/${s.slug}`));
  return routes;
}

describe("navigation and internal links", () => {
  const routes = publicRoutes();

  it("has the expected number of public routes", () => {
    // 15 static + 7 TV services + 11 problems + 9 brands + 6 electronics + 3 guides
    assert.equal(routes.size, 51, [...routes].sort().join("\n"));
  });

  it("dynamic slugs are unique", () => {
    for (const list of [tvServices, tvProblems, brands, electronics, blogPosts]) {
      const slugs = list.map((x) => x.slug);
      assert.equal(new Set(slugs).size, slugs.length);
    }
  });

  it("every header and footer link resolves", () => {
    const links: string[] = [];
    for (const item of mainNav) {
      links.push(item.href);
      if ("children" in item) item.children.forEach((c) => links.push(c.href));
    }
    [...footerLinks.company, ...footerLinks.legal].forEach((l) => links.push(l.href));
    for (const l of links) assert.ok(routes.has(l), `broken nav link ${l}`);
  });

  it("every 'related' link in page content resolves", () => {
    for (const p of [...tvServices, ...tvProblems, ...brands, ...electronics, ...blogPosts]) {
      for (const r of p.related) assert.ok(routes.has(r), `${p.slug} -> broken related link ${r}`);
    }
  });

  it("every hard-coded internal href in the source resolves", () => {
    const broken: string[] = [];
    (function walk(dir: string) {
      for (const f of fs.readdirSync(dir)) {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(f)) {
          const src = fs.readFileSync(p, "utf8");
          for (const m of src.matchAll(/href=["{]\s*["`]?(\/[a-z0-9\-/]*)["`]/g)) {
            const h = m[1].replace(/\/$/, "") || "/";
            if (h.startsWith("/admin") || h.startsWith("/api")) continue;
            if (!routes.has(h)) broken.push(`${path.relative(ROOT, p)}: ${h}`);
          }
        }
      }
    })(path.join(ROOT, "src"));
    assert.deepEqual(broken, []);
  });

  it("every page has a unique meta title and a description of sensible length", () => {
    const all = [...tvServices, ...tvProblems, ...brands, ...electronics];
    const titles = all.map((p) => p.metaTitle);
    assert.equal(new Set(titles).size, titles.length, "duplicate meta titles");
    for (const p of all) {
      assert.ok(p.metaDescription.length >= 70 && p.metaDescription.length <= 160, `${p.slug} description length ${p.metaDescription.length}`);
      assert.ok(p.metaTitle.length <= 60, `${p.slug} title too long (${p.metaTitle.length})`);
    }
  });

  it("brand pages state independent (non-authorised) status in an FAQ", () => {
    for (const b of brands) assert.ok(b.faqs.some((f) => /not (affiliated|an authorised)|independent/i.test(f.a)), b.slug);
  });
});
