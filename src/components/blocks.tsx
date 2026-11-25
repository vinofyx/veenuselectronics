import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, Info, Plus } from "lucide-react";
import type { ReactNode } from "react";
import type { Faq, IconKey } from "@/content/types";
import type { PhotoKey } from "@/config/images";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CtaGroup } from "./CtaButtons";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";
import { Photo } from "./Photo";

/* ---------------- Breadcrumbs ---------------- */
export function Breadcrumbs({ items, tone = "dark" }: { items: { name: string; href: string }[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  const onDark = tone === "dark";
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="text-[13px]">
        <ol className={`flex flex-wrap items-center gap-1.5 ${onDark ? "text-brand-300" : "text-ink-muted"}`}>
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className={`font-medium ${onDark ? "text-white" : "text-brand-800"}`}>
                  {it.name}
                </span>
              ) : (
                <Link href={it.href} className={`inline-flex min-h-[28px] items-center transition-colors ${onDark ? "hover:text-white" : "hover:text-brand-800"}`}>
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/* ---------------- Page hero (inner pages) ---------------- */
export function PageHero({
  title,
  intro,
  breadcrumbs,
  icon,
  eyebrow,
  photo,
  photoAlt,
  facts,
  aside,
  showCtas = false,
  bookLabel,
  bookHref,
  size = "default",
}: {
  title: string;
  intro?: string;
  breadcrumbs: { name: string; href: string }[];
  icon?: IconKey;
  eyebrow?: string;
  /** Page-specific photograph shown beside the heading on large screens. */
  photo?: PhotoKey;
  photoAlt?: string;
  /** Short factual chips shown under the intro. */
  facts?: string[];
  /** Custom right-hand content (replaces the photo). */
  aside?: ReactNode;
  showCtas?: boolean;
  bookLabel?: string;
  bookHref?: string;
  size?: "default" | "compact";
}) {
  const hasSide = Boolean(photo || aside);
  return (
    <section className="relative isolate overflow-hidden bg-brand-900 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 tech-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />
      <div className="pointer-events-none absolute -right-40 top-0 -z-10 h-[420px] w-[620px] rounded-full bg-brand-600/40 blur-3xl" aria-hidden />
      <div className={`container ${size === "compact" ? "py-10 sm:py-12" : "py-10 sm:py-14 lg:py-16"}`}>
        <Breadcrumbs items={breadcrumbs} />
        <div className={`mt-7 grid items-center gap-10 ${hasSide ? "lg:grid-cols-[1.15fr_0.85fr] xl:gap-16" : ""}`}>
          <div className="max-w-3xl">
            {(eyebrow || icon) && (
              <p className="mb-4 flex items-center gap-3">
                {icon && (
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-accent ring-1 ring-white/15">
                    <Icon name={icon} className="h-5 w-5" />
                  </span>
                )}
                {eyebrow && <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-300">{eyebrow}</span>}
              </p>
            )}
            <h1 className={`text-white ${size === "compact" ? "text-display-md" : "text-display-lg"}`}>{title}</h1>
            {intro && <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-brand-200 sm:text-[18px]">{intro}</p>}
            {facts && facts.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {facts.map((f) => (
                  <li key={f} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[13px] text-brand-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {showCtas && (
              <div className="mt-8">
                <CtaGroup variant="onDark" bookLabel={bookLabel} bookHref={bookHref} />
              </div>
            )}
          </div>
          {aside ??
            (photo && (
              <div className="relative hidden lg:block">
                <div className="relative aspect-[5/4] overflow-hidden rounded-3xl ring-1 ring-white/10">
                  <Photo name={photo} width={620} height={496} priority lazyWhenHidden alt={photoAlt} sizes="(min-width:1024px) 40vw, 1px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/10 to-transparent" aria-hidden />
                </div>
                <div className="absolute -bottom-px -left-px h-16 w-16 rounded-bl-3xl border-b-2 border-l-2 border-accent" aria-hidden />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
  tone = "dark",
  action,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  tone?: "dark" | "light";
  /** Optional link shown at the right of the heading on large screens. */
  action?: { label: string; href: string };
  as?: "h2" | "h3";
}) {
  const light = tone === "light";
  return (
    <div className={`mb-10 flex flex-col gap-5 lg:mb-12 ${center ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between"}`}>
      <div className={`max-w-2xl ${center ? "mx-auto" : ""}`}>
        {eyebrow && <p className={`${light ? "eyebrow-light" : "eyebrow"} mb-3`}>{eyebrow}</p>}
        <As className={`text-display-md ${light ? "text-white" : ""}`}>{title}</As>
        {intro && <p className={`mt-4 text-[16px] leading-relaxed sm:text-[17px] ${light ? "text-brand-200" : "text-ink-muted"}`}>{intro}</p>}
      </div>
      {action && !center && (
        <Link
          href={action.href}
          className={`group inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-[15px] font-semibold ${light ? "text-white hover:text-accent-300" : "text-brand-800 hover:text-accent-600"}`}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/* ---------------- Cards ---------------- */
export function IconTile({ icon, tone = "brand", size = "md" }: { icon: IconKey; tone?: "brand" | "accent" | "dark"; size?: "sm" | "md" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    accent: "bg-accent-50 text-accent-600 ring-accent-100",
    dark: "bg-white/10 text-accent ring-white/15",
  } as const;
  const dims = size === "sm" ? "h-10 w-10 rounded-xl" : "h-12 w-12 rounded-2xl";
  return (
    <span className={`grid shrink-0 place-items-center ring-1 ${dims} ${tones[tone]}`}>
      <Icon name={icon} className={size === "sm" ? "h-5 w-5" : "h-6 w-6"} />
    </span>
  );
}

/** Service card. `variant="compact"` is a single-row link for secondary categories. */
export function ServiceCard({
  href,
  title,
  summary,
  icon,
  featured = false,
  variant = "default",
  cta = "Learn more",
}: {
  href: string;
  title: string;
  summary: string;
  icon: IconKey;
  featured?: boolean;
  variant?: "default" | "compact";
  cta?: string;
}) {
  if (variant === "compact") {
    return (
      <Link href={href} className="card-hover group flex h-full items-start gap-4 p-5">
        <IconTile icon={icon} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2 font-display text-[16px] font-bold text-brand-800">
            {title}
            <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-300 transition-colors group-hover:text-accent-600" aria-hidden />
          </span>
          <span className="mt-1 block text-[14px] leading-relaxed text-ink-muted">{summary}</span>
        </span>
      </Link>
    );
  }
  return (
    <Link href={href} className={`card-hover group relative flex h-full flex-col overflow-hidden p-6 sm:p-7 ${featured ? "border-accent-200" : ""}`}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" aria-hidden />
      <IconTile icon={icon} tone={featured ? "accent" : "brand"} />
      <h3 className="mt-5 text-[19px]">{title}</h3>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{summary}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-800 transition-colors group-hover:text-accent-600">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}

/** Feature card with a photo header - for primary categories. */
export function PhotoCard({ href, title, summary, photo, label, cta = "Explore" }: { href: string; title: string; summary: string; photo: PhotoKey; label?: string; cta?: string }) {
  return (
    <Link href={href} className="card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-800">
        <Photo name={photo} width={640} height={400} className="transition-transform duration-700 group-hover:scale-[1.04]" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 to-transparent" aria-hidden />
        {label && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-brand-800">{label}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[20px]">{title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{summary}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-800 group-hover:text-accent-600">
          {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/* ---------------- Check list ---------------- */
export function CheckList({ items, tone = "dark" }: { items: string[]; tone?: "dark" | "light" }) {
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it} className={`flex gap-3 ${tone === "light" ? "text-brand-100" : "text-slate-700"}`}>
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- FAQ ---------------- */
export function FaqList({ faqs, withSchema = true, defaultOpen = 0 }: { faqs: Faq[]; withSchema?: boolean; defaultOpen?: number | null }) {
  if (!faqs.length) return null;
  return (
    <>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
      <div className="divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
        {faqs.map((f, i) => (
          <details key={f.q} className="group" open={defaultOpen === i}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-5 px-5 py-5 text-[16px] font-semibold text-brand-800 transition-colors hover:bg-brand-50/60 sm:px-7 [&::-webkit-details-marker]:hidden">
              <span className="pt-0.5">{f.q}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand-200 text-brand-700 transition-all group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-white">
                <Plus className="h-4 w-4" aria-hidden />
              </span>
            </summary>
            <p className="-mt-1 px-5 pb-6 pr-14 text-[15.5px] leading-relaxed text-ink-muted sm:px-7 sm:pr-20">{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

/* ---------------- Notices ---------------- */
export function SafetyNotice() {
  return (
    <div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 sm:p-6" role="note">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <p className="font-semibold">Safety first: please do not open your TV</p>
        <p className="mt-1 text-[14.5px] leading-relaxed">
          TVs contain power-supply capacitors that can hold a dangerous electrical charge even after unplugging, and the screen panel cracks easily. Opening the back cover without training risks electric shock and can turn a
          repairable fault into an unrepairable one. If you notice a burning smell, smoke or sparking, switch off at the wall and unplug immediately.
        </p>
      </div>
    </div>
  );
}

export function BrandDisclaimer({ brand }: { brand: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5 text-brand-800 sm:p-6" role="note">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-brand-100">
        <Info className="h-5 w-5" aria-hidden />
      </span>
      <p className="text-[14.5px] leading-relaxed">
        <strong>Independent repair service.</strong> Veenus Electronics is not an authorised service centre of {brand} and is not affiliated with or endorsed by {brand}. {brand} is a trademark of its respective owner and is used here
        only to describe the TVs we repair. If your TV is under the manufacturer&apos;s warranty, please contact {brand} first.
      </p>
    </div>
  );
}

/* ---------------- CTA banner ---------------- */
export function CtaBanner({
  title = "Having trouble with your TV?",
  text = "Call or WhatsApp us with your TV brand and the problem.",
  bookLabel = "Book a Repair",
  bookHref,
}: {
  title?: string;
  text?: string;
  bookLabel?: string;
  bookHref?: string;
  /** @deprecated CTA banners no longer show a decorative photo; ignored. */
  photo?: PhotoKey;
}) {
  return (
    <section className="section-tight">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-3xl bg-brand-900 text-white">
          <div className="pointer-events-none absolute inset-0 -z-10 tech-grid opacity-70" aria-hidden />
          <div className="max-w-2xl px-6 py-12 sm:px-12 sm:py-16">
            <p className="eyebrow-light mb-3">Talk to a technician</p>
            <h2 className="text-display-md text-white">{title}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-brand-200 sm:text-[17px]">{text}</p>
            <div className="mt-8">
              <CtaGroup variant="onDark" bookLabel={bookLabel} bookHref={bookHref} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Simple prose wrapper ---------------- */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose-content max-w-3xl">{children}</div>;
}
