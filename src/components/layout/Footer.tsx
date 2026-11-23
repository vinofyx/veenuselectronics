import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { footerLinks } from "@/config/navigation";
import { site } from "@/config/site";
import { fullAddress, hasAddress, hasPhone, isPathOffered, telHref } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { electronics } from "@/content/electronics";
import { Logo } from "./Header";

export async function Footer() {
  const b = await getBusiness();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-900 pb-24 text-brand-100 md:pb-0">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="inline-block rounded-xl bg-white p-2">
            <Logo />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-100/80">
            {site.tagline}. Specialists in LED, LCD and Smart TV repair, with repairs for home theatre, speakers,
            amplifiers, projectors and set top boxes.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {hasPhone(b) && (
              <li>
                <a href={telHref(b)} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4 text-accent" aria-hidden /> {b.phoneDisplay}
                </a>
              </li>
            )}
            {b.email && (
              <li>
                <a href={`mailto:${b.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4 text-accent" aria-hidden /> {b.email}
                </a>
              </li>
            )}
            {hasAddress(b) && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                <span>{fullAddress(b)}</span>
              </li>
            )}
            {b.workingHours && (
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" aria-hidden /> {b.workingHours}
              </li>
            )}
          </ul>
        </div>

        <FooterCol title="TV Repair" links={tvServices.map((s) => ({ label: s.label, href: `/tv-repair/${s.slug}` })).filter((l) => isPathOffered(b, l.href))} />
        <FooterCol
          title="TV Problems"
          links={tvProblems.slice(0, 7).map((p) => ({ label: p.label, href: `/tv-problems/${p.slug}` }))}
        />
        <div className="space-y-8">
          <FooterCol title="Company" links={footerLinks.company} />
          <FooterCol
            title="Other Electronics"
            links={electronics.map((e) => ({ label: e.label, href: `/electronics-repair/${e.slug}` })).filter((l) => isPathOffered(b, l.href)).slice(0, 4)}
          />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-xs text-brand-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {b.name}. Independent repair service - not an authorised service centre of any TV
            manufacturer. Brand names belong to their respective owners.
          </p>
          <ul className="flex gap-4">
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

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
      <ul className="space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-brand-100/80 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
