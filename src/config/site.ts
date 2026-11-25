/**
 * Static site settings (not business facts).
 * Business details - phone, WhatsApp, address, hours, brands, warranty... - live in
 * src/config/business.ts and verified business settings.
 */

const env = (v: string | undefined) => (v ?? "").trim();

function resolveSiteUrl(): string {
  const explicit = env(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/$/, "");
  // Vercel system variable (server/build only) - better than localhost for canonical URLs.
  const vercel = env(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercel) return `https://${vercel}`;
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    console.warn("[veenus] NEXT_PUBLIC_SITE_URL is not set - canonical URLs and the sitemap will point to localhost.");
  }
  return "http://localhost:3000";
}

export const site = {
  /** Default brand name from business details. */
  name: "Veenus Electronics",
  tagline: "Expert TV Repair and Electronics Service",
  primarySpeciality: "LED, LCD and Smart TV Repair",
  url: resolveSiteUrl(),
  gaId: env(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  gscVerification: env(process.env.NEXT_PUBLIC_GSC_VERIFICATION),
} as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
