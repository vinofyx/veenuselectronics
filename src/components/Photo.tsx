import { photoSrc, photos, type PhotoKey } from "@/config/images";

type Props = {
  name: PhotoKey;
  /** Rendered width in CSS px at the largest breakpoint (limits which file sizes are offered). */
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  /** Override alt text for context. Use "" only for purely decorative use. */
  alt?: string;
  sizes?: string;
  /** For priority photos inside containers hidden on small screens: keep high priority but let the
   *  browser skip the download when the container is not displayed (lazy images in display:none are not fetched). */
  lazyWhenHidden?: boolean;
};

/**
 * Responsive local photo (AVIF with WebP fallback). Server component: ships no JavaScript.
 * The dark parent background shows through if a file is ever missing.
 * Fills its parent (parent must be `relative` and sized); cropping is done with object-cover.
 */
export function Photo({ name, width, height, className = "", priority = false, alt, sizes = "100vw", lazyWhenHidden = false }: Props) {
  const p = photos[name];
  // Offer sizes up to 2x the rendered width (sharp on high-density screens), never fewer than one.
  const offered = p.widths.filter((w) => w <= width * 2);
  const widths = offered.length ? offered : [p.widths[0]];
  const set = (format: "webp" | "avif") => widths.map((w) => `${photoSrc(p, w, format)} ${w}w`).join(", ");
  const fallbackWidth = widths.find((w) => w >= width) ?? widths[widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photoSrc(p, fallbackWidth)}
        srcSet={set("webp")}
        sizes={sizes}
        alt={alt ?? p.alt}
        width={width}
        height={height}
        loading={priority && !lazyWhenHidden ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
