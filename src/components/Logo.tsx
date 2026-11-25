import Image from "next/image";
import Link from "next/link";

/**
 * Official Veenus Electronics logo (public/brand/).
 *  - tone="dark":  full-colour logo for white / light backgrounds (header, menus)
 *  - tone="light": white-wordmark version for the dark navy footer
 * Source artwork: 2001x519 px, displayed at 40-44px tall.
 */
export function Logo({ tone = "dark", className = "", priority = false }: { tone?: "dark" | "light"; className?: string; priority?: boolean }) {
  const src = tone === "light" ? "/brand/veenus-logo-light.png" : "/brand/veenus-logo.png";
  return (
    <Link href="/" className={`group flex shrink-0 items-center ${className}`} aria-label="Veenus Electronics - home">
      <Image
        src={src}
        alt="Veenus Electronics"
        width={679}
        height={176}
        priority={priority}
        sizes="180px"
        className="h-10 w-auto transition-opacity duration-200 group-hover:opacity-90 lg:h-11"
      />
    </Link>
  );
}

/** Icon-only brand mark (TV symbol), same artwork as the favicon. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return <Image src="/brand/icon-192.png" alt="" width={192} height={192} className={className} />;
}
