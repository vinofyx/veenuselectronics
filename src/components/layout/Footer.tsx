import Link from "next/link";
import { Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { footerLinks } from "@/config/navigation";
import { allPhones, fullAddress, hasAddress, hasWhatsApp, isPathOffered, mapsSearchUrl, whatsappHref } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { electronics } from "@/content/electronics";
import { Logo } from "../Logo";

const FOOTER_PROBLEMS = ["tv-not-turning-on", "tv-black-screen", "tv-sound-but-no-picture", "tv-screen-lines", "tv-backlight-repair", "tv-motherboard-repair"];

export async function Footer() {
  const b = await getBusiness();
  const year = new Date().getFullYear();
  const phones = allPhones(b);

  const tvLinks = tvServices.map((s) => ({ label: s.label, href: `/tv-repair/${s.slug}` })).filter((l) => isPathOffered(b, l.href));
  const problemLinks = FOOTER_PROBLEMS.map((s) => tvProblems.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({ label: p.label, href: `/tv-problems/${p.slug}` }));
  const elecLinks = electronics.map((e) => ({ label: e.title, href: `/electronics-repair/${e.slug}` })).filter((l) => isPathOffered(b, l.href));

  return (
    <footer className="bg-brand-900 pb-28 text-brand-200 md:pb-24">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
        {/* Brand + contact */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-4 text-[14.5px] text-brand-200">Professional TV repair in {b.address.locality || "Hyderabad"}.</p>
          <ul className="mt-6 space-y-3 text-[14.5px]">
            {phones.map((p) => (
              <li key={p.number}>
                <a href={p.href} className="inline-flex min-h-[28px] items-center gap-2.5 font-semibold text-white hover:text-accent-300">
                  <Phone className="h-4 w-4 text-accent" aria-hidden /> {p.display}
                </a>
              </li>
            ))}
            {hasWhatsApp(b) && (
              <li>
                <a href={whatsappHref(b)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[28px] items-center gap-2.5 text-brand-100 hover:text-white">
                  <MessageCircle className="h-4 w-4 text-whatsapp" aria-hidden /> WhatsApp
                </a>
              </li>
            )}
            {b.email && (
              <li>
                <a href={`mailto:${b.email}`} className="inline-flex min-h-[28px] items-center gap-2.5 break-all text-brand-100 hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden /> {b.email}
                </a>
              </li>
            )}
            {hasAddress(b) && (
              <li className="flex items-start gap-2.5 text-brand-100">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>
                  {fullAddress(b)}
                  <a href={mapsSearchUrl(b)} target="_blank" rel="noopener noreferrer" className="mt-1 flex min-h-[28px] items-center gap-1.5 text-[13.5px] font-semibold text-accent-300 hover:text-accent-200">
                    <Navigation className="h-3.5 w-3.5" aria-hidden /> Get directions
                  </a>
                </span>
              </li>
            )}
          </ul>
        </div>

        <FooterCol className="lg:col-span-2" title="TV Repair" links={tvLinks} />
        <FooterCol className="lg:col-span-2" title="TV Problems" links={problemLinks} more={{ label: "All TV problems", href: "/tv-problems" }} />
        <FooterCol className="lg:col-span-2" title="Electronics" links={elecLinks} />
        <FooterCol className="lg:col-span-2" title="Company" links={footerLinks.company} />
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-[12.5px] text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {b.name}. Independent repair service &mdash; not an authorised service centre of any manufacturer.
          </p>
          <ul className="flex shrink-0 gap-5">
            {footerLinks.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, more, className = "" }: { title: string; links: { label: string; href: string }[]; more?: { label: string; href: string }; className?: string }) {
  return (
    <div className={className}>
      <h2 className="mb-4 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="space-y-2.5 text-[14px]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-brand-200 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
        {more && (
          <li>
            <Link href={more.href} className="font-semibold text-accent-300 hover:text-accent-200">
              {more.label} &rarr;
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
