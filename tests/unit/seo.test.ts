import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { tvServices } from "../../src/content/tv-services";
import { tvProblems } from "../../src/content/tv-problems";
import { brands } from "../../src/content/brands";
import { electronics } from "../../src/content/electronics";
import { blogPosts } from "../../src/content/blog";

const SITE = path.resolve(__dirname, "../../src/app/(site)");

type Meta = { route: string; title: string; description: string; canonicalPath: string };

/** Reads buildMetadata({ title, description, path }) from each static page file. */
function staticPageMeta(): Meta[] {
  const out: Meta[] = [];
  (function walk(dir: string) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) {
        if (!f.startsWith("[")) walk(p);
        continue;
      }
      if (f !== "page.tsx") continue;
      const src = fs.readFileSync(p, "utf8");
      const block = src.match(/buildMetadata\(\{([\s\S]*?)\}\)/);
      assert.ok(block, `${p} has no buildMetadata()`);
      const get = (k: string) => {
        const m = block![1].match(new RegExp(`${k}:\\s*\\n?\\s*"([^"]+)"`));
        assert.ok(m, `${p} missing ${k}`);
        return m![1];
      };
      const rel = path.relative(SITE, dir).split(path.sep).join("/");
      out.push({ route: rel ? `/${rel}` : "/", title: get("title"), description: get("description"), canonicalPath: get("path") });
    }
  })(SITE);
  return out;
}

function allMeta(): Meta[] {
  const dyn = (base: string, list: { slug: string; metaTitle: string; metaDescription: string }[]) =>
    list.map((p) => ({ route: `${base}/${p.slug}`, title: p.metaTitle, description: p.metaDescription, canonicalPath: `${base}/${p.slug}` }));
  return [
    ...staticPageMeta(),
    ...dyn("/tv-repair", tvServices),
    ...dyn("/tv-problems", tvProblems),
    ...dyn("/tv-brand-repair", brands),
    ...dyn("/electronics-repair", electronics),
    ...blogPosts.map((p) => ({ route: `/blog/${p.slug}`, title: p.title, description: p.description, canonicalPath: `/blog/${p.slug}` })),
  ];
}

describe("SEO metadata across all public routes", () => {
  const meta = allMeta();

  it("covers all 51 routes", () => assert.equal(meta.length, 51));

  it("every canonical path matches its own route", () => {
    for (const m of meta) assert.equal(m.canonicalPath, m.route, `${m.route} canonical points to ${m.canonicalPath}`);
  });

  it("all 51 titles are unique", () => {
    const dupes = meta.map((m) => m.title).filter((t, i, a) => a.indexOf(t) !== i);
    assert.deepEqual(dupes, []);
  });

  it("all 51 meta descriptions are unique", () => {
    const dupes = meta.map((m) => m.description).filter((t, i, a) => a.indexOf(t) !== i);
    assert.deepEqual(dupes, []);
  });

  it("titles are 10-70 characters (before the brand suffix)", () => {
    for (const m of meta) assert.ok(m.title.length >= 10 && m.title.length <= 70, `${m.route}: "${m.title}" (${m.title.length})`);
  });

  it("descriptions are 50-160 characters", () => {
    for (const m of meta) assert.ok(m.description.length >= 50 && m.description.length <= 160, `${m.route}: ${m.description.length} chars`);
  });

  it("priority keywords each have a dedicated page whose title contains the keyword", () => {
    const byRoute = new Map(meta.map((m) => [m.route, m.title.toLowerCase()]));
    const priority: [string, string][] = [
      ["/tv-repair", "tv repair"],
      ["/tv-repair/led-tv-repair", "led tv repair"],
      ["/tv-repair/smart-tv-repair", "smart tv repair"],
      ["/tv-brand-repair/samsung-tv-repair", "samsung tv repair"],
      ["/tv-brand-repair/lg-tv-repair", "lg tv repair"],
      ["/tv-brand-repair/sony-tv-repair", "sony tv repair"],
      ["/tv-problems/tv-screen-repair", "tv screen repair"],
      ["/tv-problems/tv-backlight-repair", "tv backlight repair"],
      ["/tv-problems/tv-motherboard-repair", "tv motherboard repair"],
    ];
    for (const [route, kw] of priority) assert.ok(byRoute.get(route)?.includes(kw), `${route} title lacks "${kw}"`);
  });

  it("no location-stuffed or thin duplicate location pages exist", () => {
    for (const m of meta) assert.ok(!/repair-in-|near-me/.test(m.route), m.route);
  });

  it("every landing page has substantial unique content (no thin pages)", () => {
    for (const p of [...tvServices, ...tvProblems, ...brands, ...electronics]) {
      const words = [p.intro.join(" "), ...p.sections.map((s) => [s.heading, s.body ?? "", ...(s.bullets ?? [])].join(" ")), ...p.faqs.map((f) => f.q + " " + f.a)]
        .join(" ")
        .split(/\s+/).length;
      assert.ok(words >= 120, `${p.slug} has only ${words} words`);
    }
  });
});
