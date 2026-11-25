import Link from "next/link";
import { ArrowRight, Home, Tv } from "lucide-react";

const POPULAR = [
  { label: "TV Repair Services", href: "/tv-repair" },
  { label: "Common TV Problems", href: "/tv-problems" },
  { label: "Brands We Repair", href: "/tv-brand-repair" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-[80vh] place-items-center overflow-hidden bg-brand-900 px-5 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 tech-grid" aria-hidden />
      <div className="max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-accent ring-1 ring-white/15">
          <Tv className="h-8 w-8" aria-hidden />
        </span>
        <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-300">Error 404 &middot; No signal</p>
        <h1 className="mt-3 text-display-lg text-white">Page not found</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-brand-200">The page you were looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-ghost-light">
            <Home className="h-4 w-4" aria-hidden /> Go to home
          </Link>
          <Link href="/book-repair" className="btn-accent">
            Book a repair
          </Link>
        </div>
        <ul className="mt-12 grid gap-2 border-t border-white/10 pt-8 text-left sm:grid-cols-2">
          {POPULAR.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="flex min-h-[44px] items-center justify-between rounded-xl px-4 text-[15px] font-medium text-brand-100 transition-colors hover:bg-white/5 hover:text-white">
                {l.label} <ArrowRight className="h-4 w-4 text-accent" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
