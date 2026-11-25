"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowRight, CalendarCheck, ChevronDown, ChevronRight, Mail, MapPin, Menu, MessageCircle, Navigation, Phone, X } from "lucide-react";
import { mainNav, type NavItem } from "@/config/navigation";
import { allPhones, fullAddress, hasAddress, hasPhone, hasWhatsApp, isPathOffered, mapsSearchUrl, telHref, whatsappHref } from "@/config/business";
import { useBusiness } from "../BusinessProvider";
import { TrackedLink } from "../TrackedLink";
import { Logo } from "../Logo";

export { Logo } from "../Logo";

type Parent = Extract<NavItem, { children: unknown }>;
function hasChildren(item: NavItem): item is Parent {
  return "children" in item;
}

/* ---------------- Utility bar (desktop only, scrolls away) ---------------- */
function UtilityBar() {
  const b = useBusiness();
  const phones = allPhones(b);
  return (
    <div className="hidden bg-brand-900 text-[13px] text-brand-200 lg:block">
      <div className="container flex h-9 items-center justify-between gap-6">
        <p className="truncate">
          <span className="font-semibold text-white">Independent TV repair specialist</span>
          {hasAddress(b) && <span className="text-brand-300"> &middot; {[b.address.locality, b.address.city].filter(Boolean).join(", ")}</span>}
        </p>
        <ul className="flex shrink-0 items-center gap-5">
          {phones.map((p) => (
            <li key={p.number}>
              <a href={p.href} className="inline-flex min-h-[28px] items-center gap-1.5 transition-colors hover:text-white">
                <Phone className="h-3.5 w-3.5 text-accent" aria-hidden />
                {p.display}
              </a>
            </li>
          ))}
          {b.email && (
            <li className="hidden xl:block">
              <a href={`mailto:${b.email}`} className="inline-flex min-h-[28px] items-center gap-1.5 transition-colors hover:text-white">
                <Mail className="h-3.5 w-3.5 text-accent" aria-hidden />
                {b.email}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

/* ---------------- Desktop dropdown ---------------- */
function Dropdown({ item, pathname, wide, id }: { item: Parent; pathname: string | null; wide: boolean; id: string }) {
  const withDesc = item.children.some((c) => c.description);
  return (
    <div id={id} className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
      <div
        className={`animate-fade-down overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-float ${
          wide ? "w-[560px]" : "w-[300px]"
        }`}
      >
        <ul className={`grid gap-0.5 p-2.5 ${wide ? "grid-cols-2" : "grid-cols-1"}`}>
          {item.children.map((c) => {
            const active = pathname === c.href;
            return (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className={`group/item block rounded-xl px-3.5 py-2.5 transition-colors ${
                    active ? "bg-accent-50" : "hover:bg-brand-50"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className={`flex items-center justify-between gap-2 text-[14px] font-semibold ${active ? "text-accent-700" : "text-brand-800"}`}>
                    {c.label}
                    <ChevronRight className="h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" aria-hidden />
                  </span>
                  {withDesc && c.description && <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-muted">{c.description}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={item.href}
          className="flex items-center justify-between border-t border-brand-100 bg-brand-50/70 px-6 py-3 text-[13px] font-semibold text-brand-800 transition-colors hover:text-accent-600"
        >
          {item.viewAll ?? `View all ${item.label.toLowerCase()}`}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const b = useBusiness();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasMobileOpen = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // When a menu was just opened by hover, the following click must not toggle it shut.
  const hoverOpenedAt = useRef(0);
  const phones = allPhones(b);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    if (mobileOpen) {
      // Move focus into the drawer so keyboard and screen-reader users land in the menu.
      drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    } else if (wasMobileOpen.current) {
      menuButtonRef.current?.focus();
    }
    wasMobileOpen.current = mobileOpen;
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Keep Tab inside the open drawer.
  const trapFocus = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !drawerRef.current) return;
    const items = [...drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([tabindex='-1']), summary")].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const menuKeys = (label: string) => (e: ReactKeyboardEvent<HTMLLIElement>) => {
    const li = e.currentTarget;
    const links = [...li.querySelectorAll<HTMLAnchorElement>("a[href]")];
    const idx = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape") {
      e.stopPropagation();
      setOpenMenu(null);
      li.querySelector("button")?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (openMenu !== label) {
        setOpenMenu(label);
        requestAnimationFrame(() => li.querySelector<HTMLAnchorElement>("a[href]")?.focus());
      } else links[Math.min(idx + 1, links.length - 1)]?.focus();
    } else if (e.key === "ArrowUp" && idx >= 0) {
      e.preventDefault();
      if (idx === 0) li.querySelector("button")?.focus();
      else links[idx - 1]?.focus();
    }
  };

  // Filter entries for supported equipment and brands.
  const nav = mainNav.map((item) => (hasChildren(item) ? { ...item, children: item.children.filter((c) => isPathOffered(b, c.href)) } : item));
  const isActive = (href: string) => (href === "/" ? pathname === "/" : Boolean(pathname?.startsWith(href)));

  const openNow = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu((m) => {
      if (m !== label) hoverOpenedAt.current = Date.now();
      return label;
    });
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const linkBase =
    "relative inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 text-[14px] font-medium transition-colors 2xl:px-3.5 2xl:text-[15px]";
  const underline = "after:absolute after:inset-x-2.5 after:-bottom-[15px] after:h-[2px] after:rounded-full after:bg-accent 2xl:after:inset-x-3.5";

  return (
    <>
      <UtilityBar />
      <header
        className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-shadow supports-[backdrop-filter]:bg-white/85 ${
          scrolled ? "border-brand-100 shadow-header" : "border-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-[72px] xl:gap-6">
          <Logo priority />

          {/* Desktop navigation: one line from 1280px; hamburger below */}
          <nav ref={navRef} className="hidden min-w-0 xl:block" aria-label="Main">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) => {
                const active = isActive(item.href);
                if (!hasChildren(item)) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`${linkBase} ${active ? `text-brand-800 ${underline}` : "text-brand-700 hover:bg-brand-50 hover:text-brand-800"}`}
                        aria-current={pathname === item.href ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const open = openMenu === item.label;
                return (
                  <li
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => openNow(item.label)}
                    onMouseLeave={closeSoon}
                    onKeyDown={menuKeys(item.label)}
                    onBlur={(e) => {
                      // Close when keyboard focus leaves this menu.
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu((m) => (m === item.label ? null : m));
                    }}
                  >
                    <button
                      type="button"
                      className={`${linkBase} ${active ? `text-brand-800 ${underline}` : "text-brand-700 hover:bg-brand-50 hover:text-brand-800"} ${
                        open ? "bg-brand-50 text-brand-800" : ""
                      }`}
                      aria-expanded={open}
                      aria-controls={`menu-${item.href.slice(1)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const justHovered = Date.now() - hoverOpenedAt.current < 600;
                        setOpenMenu((m) => (m === item.label && !justHovered ? null : item.label));
                      }}
                    >
                      {item.label}
                      <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${open ? "rotate-180 opacity-100" : ""}`} aria-hidden />
                    </button>
                    {open && <Dropdown id={`menu-${item.href.slice(1)}`} item={item} pathname={pathname} wide={item.children.length > 6} />}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {hasPhone(b) && (
              <TrackedLink
                href={telHref(b)}
                event="click_call"
                eventParams={{ location: "header" }}
                className="btn-outline hidden h-11 px-3 text-[14px] md:inline-flex min-[1360px]:px-4"
                aria-label={`Call Now - ${b.phoneDisplay}`}
                title={`Call ${b.phoneDisplay}`}
              >
                <Phone className="h-4 w-4 text-accent-600" aria-hidden />
                <span className="xl:hidden min-[1360px]:inline">Call Now</span>
              </TrackedLink>
            )}
            <TrackedLink
              href="/book-repair"
              event="click_book_repair"
              eventParams={{ location: "header" }}
              className="btn-accent hidden h-11 px-4 text-[14px] sm:inline-flex"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden />
              Book Repair
            </TrackedLink>
            <button
              ref={menuButtonRef}
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl border border-brand-100 text-brand-800 transition-colors hover:bg-brand-50 xl:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet drawer */}
      {mobileOpen && (
        <div ref={drawerRef} onKeyDown={trapFocus} className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <button type="button" className="absolute inset-0 bg-brand-950/50 backdrop-blur-[2px]" aria-label="Close menu" tabIndex={-1} onClick={() => setMobileOpen(false)} />
          <div id="mobile-menu" className="absolute inset-y-0 right-0 flex w-full max-w-[420px] animate-slide-in flex-col bg-white shadow-float">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-brand-100 px-5">
              <Logo />
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-xl border border-brand-100 text-brand-800 hover:bg-brand-50"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-2">
              <ul className="divide-y divide-brand-100">
                {nav.map((item) =>
                  hasChildren(item) ? (
                    <li key={item.label}>
                      <details className="group" open={isActive(item.href)}>
                        <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between text-[16px] font-semibold text-brand-800 [&::-webkit-details-marker]:hidden">
                          <span className={isActive(item.href) ? "text-accent-600" : ""}>{item.label}</span>
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50">
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden />
                          </span>
                        </summary>
                        <ul className="mb-3 grid gap-0.5 border-l-2 border-accent-200 pl-3">
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex min-h-[44px] items-center rounded-lg px-3 text-[15px] ${
                                  pathname === c.href ? "bg-accent-50 font-semibold text-accent-700" : "text-ink hover:bg-brand-50"
                                }`}
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                          <li>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex min-h-[44px] items-center gap-1.5 px-3 text-[14px] font-semibold text-accent-600"
                            >
                              {item.viewAll ?? "View all"} <ArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                          </li>
                        </ul>
                      </details>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex min-h-[52px] items-center justify-between text-[16px] font-semibold ${isActive(item.href) ? "text-accent-600" : "text-brand-800"}`}
                      >
                        {item.label}
                        <ChevronRight className="h-4 w-4 text-brand-300" aria-hidden />
                      </Link>
                    </li>
                  ),
                )}
              </ul>

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                {hasPhone(b) && (
                  <TrackedLink href={telHref(b)} event="click_call" eventParams={{ location: "drawer" }} className="btn-primary">
                    <Phone className="h-4 w-4" aria-hidden /> Call Now
                  </TrackedLink>
                )}
                {hasWhatsApp(b) && (
                  <TrackedLink href={whatsappHref(b)} event="click_whatsapp" eventParams={{ location: "drawer" }} className="btn-whatsapp">
                    <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
                  </TrackedLink>
                )}
                <TrackedLink href="/book-repair" event="click_book_repair" eventParams={{ location: "drawer" }} className="btn-accent col-span-2">
                  <CalendarCheck className="h-4 w-4" aria-hidden /> Book TV Repair
                </TrackedLink>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl bg-brand-50 p-4 text-[14px]">
                {phones.map((p) => (
                  <a key={p.number} href={p.href} className="flex items-center gap-2.5 font-medium text-brand-800">
                    <Phone className="h-4 w-4 text-accent-600" aria-hidden /> {p.display}
                  </a>
                ))}
                {b.email && (
                  <a href={`mailto:${b.email}`} className="flex items-center gap-2.5 break-all font-medium text-brand-800">
                    <Mail className="h-4 w-4 shrink-0 text-accent-600" aria-hidden /> {b.email}
                  </a>
                )}
                {hasAddress(b) && (
                  <a href={mapsSearchUrl(b)} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-ink-muted">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                    <span>
                      {fullAddress(b)}
                      <span className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-brand-700">
                        <Navigation className="h-3.5 w-3.5" aria-hidden /> Get directions
                      </span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
