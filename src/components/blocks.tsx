import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Info } from "lucide-react";
import type { ReactNode } from "react";
import type { Faq, IconKey } from "@/content/types";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CtaGroup } from "./CtaButtons";
import { Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

/* ---------------- Breadcrumbs ---------------- */
export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-brand-100">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-white">
                  {it.name}
                </span>
              ) : (
                <Link href={it.href} className="hover:text-white hover:underline">
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
  showCtas = true,
  bookLabel,
  bookHref,
}: {
  title: string;
  intro?: string;
  breadcrumbs: { name: string; href: string }[];
  icon?: IconKey;
  showCtas?: boolean;
  bookLabel?: string;
  bookHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden>
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[48px] border-white" />
      </div>
      <div className="container relative py-10 sm:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6 flex items-start gap-4">
          {icon && (
            <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-accent sm:grid">
              <Icon name={icon} className="h-7 w-7" />
            </span>
          )}
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">{title}</h1>
            {intro && <p className="mt-4 text-base leading-relaxed text-brand-100 sm:text-lg">{intro}</p>}
          </div>
        </div>
        {showCtas && (
          <div className="mt-8">
            <CtaGroup variant="onDark" bookLabel={bookLabel} bookHref={bookHref} />
          </div>
        )}
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
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  center?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <As className="text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</As>
      {intro && <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{intro}</p>}
    </div>
  );
}

/* ---------------- Service card ---------------- */
export function ServiceCard({
  href,
  title,
  summary,
  icon,
  featured = false,
}: {
  href: string;
  title: string;
  summary: string;
  icon: IconKey;
  featured?: boolean;
}) {
  return (
    <Link href={href} className={`card-hover group flex h-full flex-col p-6 ${featured ? "border-accent/40" : ""}`}>
      <span
        className={`mb-4 grid h-12 w-12 place-items-center rounded-xl ${
          featured ? "bg-accent text-white" : "bg-brand-50 text-brand"
        }`}
      >
        <Icon name={icon} />
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
        Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

/* ---------------- Check list ---------------- */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex gap-3 text-slate-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- FAQ ---------------- */
export function FaqList({ faqs, withSchema = true }: { faqs: Faq[]; withSchema?: boolean }) {
  if (!faqs.length) return null;
  return (
    <>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="card group p-0">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 font-semibold text-brand-800">
              <span>{f.q}</span>
              <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-slate-700">{f.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}

/* ---------------- Notices ---------------- */
export function SafetyNotice() {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900" role="note">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">Safety first: please do not open your TV</p>
        <p className="mt-1 text-sm leading-relaxed">
          TVs contain power-supply capacitors that can hold a dangerous electrical charge even after unplugging, and
          the screen panel cracks easily. Opening the back cover without training risks electric shock and can turn a
          repairable fault into an unrepairable one. If you notice a burning smell, smoke or sparking, switch off at
          the wall and unplug immediately.
        </p>
      </div>
    </div>
  );
}

export function BrandDisclaimer({ brand }: { brand: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-5 text-brand-800" role="note">
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <p className="text-sm leading-relaxed">
        <strong>Independent repair service.</strong> Veenus Electronics is not an authorised service centre of {brand}{" "}
        and is not affiliated with or endorsed by {brand}. {brand} is a trademark of its respective owner and is used
        here only to describe the TVs we repair. If your TV is under the manufacturer&apos;s warranty, please contact
        {" "}{brand} first.
      </p>
    </div>
  );
}

/* ---------------- CTA banner ---------------- */
export function CtaBanner({
  title = "Having Trouble With Your TV?",
  text = "Tell us what's wrong and our team will contact you to discuss the problem and the best repair option.",
  bookLabel = "Book a Repair",
  bookHref,
}: {
  title?: string;
  text?: string;
  bookLabel?: string;
  bookHref?: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 text-white sm:px-12">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/20" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
            <p className="mt-3 text-brand-100">{text}</p>
            <div className="mt-7">
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
