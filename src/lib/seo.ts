import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";
import { getBusiness } from "./business";

type Args = {
  title: string;
  description: string;
  path: string;
  /** Append the configured city to the title for local SEO (only when a city is set). */
  localise?: boolean;
  noindex?: boolean;
  type?: "website" | "article";
};

/** Builds page metadata. Server-only (reads business settings for the city and name). */
export async function buildMetadata({ title, description, path, localise = true, noindex = false, type = "website" }: Args): Promise<Metadata> {
  const b = await getBusiness();
  const city = b.address.city;
  const fullTitle = localise && city && !title.includes(city) ? `${title} in ${city}` : title;
  const url = absoluteUrl(path);
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${fullTitle} | ${b.name}`,
      description,
      url,
      siteName: b.name,
      locale: "en_IN",
      type,
      images: [{ url: absoluteUrl("/og-image.png"), width: 1200, height: 630, alt: `${b.name} - ${site.tagline}` }],
    },
    twitter: { card: "summary_large_image", title: `${fullTitle} | ${b.name}`, description, images: [absoluteUrl("/og-image.png")] },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
