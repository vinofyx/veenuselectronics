import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { brands } from "@/content/brands";
import { electronics } from "@/content/electronics";
import { blogPosts } from "@/content/blog";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const business = await getBusiness();
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  const all = [
    entry("/", 1, "weekly"),
    entry("/book-repair", 0.9),
    entry("/tv-repair", 0.9),
    ...tvServices.map((s) => entry(`/tv-repair/${s.slug}`, 0.9)),
    entry("/tv-problems", 0.8),
    ...tvProblems.map((p) => entry(`/tv-problems/${p.slug}`, 0.8)),
    entry("/tv-brand-repair", 0.8),
    ...brands.map((b) => entry(`/tv-brand-repair/${b.slug}`, 0.7)),
    entry("/electronics-repair", 0.6),
    ...electronics.map((e) => entry(`/electronics-repair/${e.slug}`, 0.6)),
    entry("/contact-us", 0.7),
    entry("/service-areas", 0.7, "weekly"),
    entry("/about-us", 0.5),
    entry("/how-it-works", 0.5),
    entry("/customer-reviews", 0.5),
    entry("/faq", 0.5),
    entry("/blog", 0.5, "weekly"),
    ...blogPosts.map((p) => ({ ...entry(`/blog/${p.slug}`, 0.5), lastModified: new Date(p.date) })),
    entry("/privacy-policy", 0.2, "yearly"),
    entry("/terms-and-conditions", 0.2, "yearly"),
  ];
  return all.filter((e) => isPathOffered(business, new URL(e.url).pathname));
}
