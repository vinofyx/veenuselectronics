/**
 * Real photography slots.
 *
 * The brief asks for authentic TV-technician and workshop photography. Stock or
 * AI images must not be presented as the business's own workshop. Add your own
 * photos to /public/images/ (WebP or AVIF, about 1600px wide) and set the paths
 * below. Until then, a neutral illustration is shown.
 */
export const images: {
  hero: { src: string; alt: string } | null;
  about: { src: string; alt: string } | null;
} = {
  hero: null, // e.g. { src: "/images/hero-technician.webp", alt: "Veenus Electronics technician repairing an LED TV at the workshop" }
  about: null, // e.g. { src: "/images/workshop.webp", alt: "Veenus Electronics repair workshop" }
};
