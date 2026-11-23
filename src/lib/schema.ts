import { absoluteUrl, site } from "@/config/site";
import { hasAddress, hasGeo, hasPhone, type Business } from "@/config/business";
import type { Faq } from "@/content/types";

/** LocalBusiness schema. Only includes configured fields - nothing invented, no ratings. */
export function localBusinessSchema(b: Business) {
  const a = b.address;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#business"),
    name: b.name,
    description: `${site.tagline} - LED, LCD, Smart, OLED and QLED TV repair.`,
    url: site.url,
    image: b.logoUrl || absoluteUrl("/og-image.png"),
    logo: b.logoUrl || absoluteUrl("/icon.svg"),
    knowsAbout: ["TV repair", "LED TV repair", "Smart TV repair", "TV backlight repair", "TV motherboard repair", "TV screen repair"],
  };
  if (hasPhone(b)) data.telephone = b.phone;
  if (b.email) data.email = b.email;
  if (hasAddress(b) || a.city) {
    data.address = {
      "@type": "PostalAddress",
      ...(a.street ? { streetAddress: a.street } : {}),
      ...(a.locality || a.city ? { addressLocality: a.locality || a.city } : {}),
      ...(a.state ? { addressRegion: a.state } : {}),
      ...(a.postcode ? { postalCode: a.postcode } : {}),
      addressCountry: a.country,
    };
  }
  if (hasGeo(b)) data.geo = { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng };
  if (b.mapsUrl) data.hasMap = b.mapsUrl;
  if (a.city) data.areaServed = { "@type": "City", name: a.city };
  // aggregateRating intentionally omitted. Never add ratings that are not real and verifiable.
  return data;
}

export function organizationSchema(b: Business) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: b.name,
    url: site.url,
    logo: b.logoUrl || absoluteUrl("/icon.svg"),
    ...(hasPhone(b) ? { contactPoint: { "@type": "ContactPoint", telephone: b.phone, contactType: "customer service", areaServed: "IN" } } : {}),
  };
}

export function serviceSchema(name: string, description: string, path: string, city?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: absoluteUrl(path),
    provider: { "@id": absoluteUrl("/#business") },
    ...(city ? { areaServed: { "@type": "City", name: city } } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.href) })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function articleSchema(p: { title: string; description: string; path: string; date: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    mainEntityOfPage: absoluteUrl(p.path),
    author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}
