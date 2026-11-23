"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, MessageCircle, Phone, Tv, X } from "lucide-react";
import { mainNav, type NavItem } from "@/config/navigation";
import { hasPhone, hasWhatsApp, isPathOffered, telHref, whatsappHref } from "@/config/business";
import { useBusiness } from "../BusinessProvider";
import { TrackedLink } from "../TrackedLink";

function hasChildren(item: NavItem): item is Extract<NavItem, { children: unknown }> {
  return "children" in item;
}

export function Logo() {
  const b = useBusiness();
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${b.name} - home`}>
      {b.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={b.logoUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-xl object-contain" />
      ) : (
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white">
          <Tv className="h-5 w-5" aria-hidden />
        </span>
      )}
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold text-brand-800">Veenus</span>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600">Electronics</span>
      </span>
    </Link>
  );
}

export function Header() {
  const b = useBusiness();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Close desktop dropdown on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  // Hide menu entries for equipment the business does not repair (Admin -> Business).
  const nav = mainNav.map((item) => (hasChildren(item) ? { ...item, children: item.children.filter((c) => isPathOffered(b, c.href)) } : item));

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo />

        <nav ref={navRef} className="hidden xl:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              hasChildren(item) ? (
                <li key={item.label} className="relative">
                  <button
                    type="button"
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-brand-50 ${
                      isActive(item.href) ? "text-accent-600" : "text-brand-800"
                    }`}
                    aria-expanded={openMenu === item.label}
                    aria-haspopup="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu((m) => (m === item.label ? null : item.label));
                    }}
                    onMouseEnter={() => setOpenMenu(item.label)}
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${openMenu === item.label ? "rotate-180" : ""}`} aria-hidden />
                  </button>
                  {openMenu === item.label && (
                    <div className="absolute left-0 top-full pt-2" onMouseLeave={() => setOpenMenu(null)}>
                      <ul className="card w-64 p-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className={`block rounded-lg px-3 py-2 text-sm hover:bg-brand-50 ${
                                pathname === c.href ? "font-semibold text-accent-600" : "text-ink"
                              }`}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li className="mt-1 border-t border-brand-100 pt-1">
                          <Link href={item.href} className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-50">
                            View all {item.label.toLowerCase()} &rarr;
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-[15px] font-medium hover:bg-brand-50 ${
                      isActive(item.href) ? "text-accent-600" : "text-brand-800"
                    }`}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {hasPhone(b) && (
            <TrackedLink href={telHref(b)} event="click_call" className="btn-primary hidden px-4 py-2.5 md:inline-flex">
              <Phone className="h-4 w-4" aria-hidden />
              Call Now
            </TrackedLink>
          )}
          <TrackedLink href="/book-repair" event="click_book_repair" className="btn-accent hidden px-4 py-2.5 sm:inline-flex">
            Book Repair
          </TrackedLink>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg text-brand-800 hover:bg-brand-50 xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-white xl:hidden">
          <div className="container py-4">
            <div className="mb-4 grid grid-cols-2 gap-2">
              {hasPhone(b) && (
                <TrackedLink href={telHref(b)} event="click_call" className="btn-primary">
                  <Phone className="h-4 w-4" aria-hidden /> Call
                </TrackedLink>
              )}
              {hasWhatsApp(b) && (
                <TrackedLink href={whatsappHref(b)} event="click_whatsapp" className="btn-whatsapp">
                  <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                </TrackedLink>
              )}
              <TrackedLink href="/book-repair" event="click_book_repair" className="btn-accent col-span-2">
                Book Repair
              </TrackedLink>
            </div>
            <ul className="divide-y divide-brand-100">
              {nav.map((item) =>
                hasChildren(item) ? (
                  <li key={item.label}>
                    <details className="group py-1" open={isActive(item.href)}>
                      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-semibold text-brand-800">
                        {item.label}
                        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" aria-hidden />
                      </summary>
                      <ul className="mb-2 space-y-1 pl-3">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block rounded-lg px-3 py-2 text-[15px] text-ink hover:bg-brand-50">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href={item.href} className="block rounded-lg px-3 py-2 text-[15px] font-semibold text-brand">
                            View all &rarr;
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link href={item.href} className="block py-3 text-base font-semibold text-brand-800">
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
