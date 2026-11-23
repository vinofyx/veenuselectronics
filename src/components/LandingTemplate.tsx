import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { LandingPage } from "@/content/types";
import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { brands } from "@/content/brands";
import { electronics } from "@/content/electronics";
import { serviceSchema } from "@/lib/schema";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";
import { CheckList, CtaBanner, FaqList, PageHero } from "./blocks";
import { CallButton, WhatsAppButton } from "./CtaButtons";
import { EnquiryForm } from "./forms/EnquiryForm";
import { JsonLd } from "./JsonLd";

/** Resolves an internal href to a human label for "related services" links. */
function labelFor(href: string): string {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  const all = [...tvServices, ...tvProblems, ...brands, ...electronics];
  const hit = all.find((p) => p.slug === slug);
  if (hit) return hit.title;
  if (href === "/book-repair") return "Book a Repair";
  if (href === "/tv-brand-repair") return "Brands We Repair";
  return slug.replace(/-/g, " ");
}

type Props = {
  page: LandingPage;
  basePath: string;
  breadcrumbs: { name: string; href: string }[];
  /** Notices rendered above the main content, e.g. SafetyNotice or BrandDisclaimer */
  notices?: ReactNode;
  /** Shown after main sections, e.g. supported brands */
  extra?: ReactNode;
  formTitle?: string;
};

export async function LandingTemplate({ page, basePath, breadcrumbs, notices, extra, formTitle }: Props) {
  const path = `${basePath}/${page.slug}`;
  const b = await getBusiness();
  const related = page.related.filter((href) => isPathOffered(b, href));
  return (
    <>
      <JsonLd data={serviceSchema(page.title, page.metaDescription, path, b.address.city || undefined)} />
      <PageHero title={page.title} intro={page.summary} breadcrumbs={breadcrumbs} icon={page.icon} bookHref="#enquiry" bookLabel="Request This Repair" />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[1fr_400px]">
          <article className="min-w-0 space-y-10">
            <div className="prose-content">
              {page.intro.map((p) => (
                <p key={p.slice(0, 32)} className="text-[17px]">
                  {p}
                </p>
              ))}
            </div>

            {notices}

            {page.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="mb-4 text-xl font-bold sm:text-2xl">{s.heading}</h2>
                {s.body && <p className="mb-4 leading-relaxed text-slate-700">{s.body}</p>}
                {s.bullets && <CheckList items={s.bullets} />}
              </section>
            ))}

            <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-brand-800">Need help with this?</p>
                <p className="text-sm text-slate-600">Talk to our team or send the enquiry form.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <CallButton />
                <WhatsAppButton />
                <a href="#enquiry" className="btn-accent">
                  Book Repair
                </a>
              </div>
            </div>

            {extra}

            {page.faqs.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold sm:text-2xl">Frequently asked questions</h2>
                <FaqList faqs={page.faqs} />
              </section>
            )}

            {related.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold sm:text-2xl">Related services</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {related.map((href) => (
                    <li key={href}>
                      <Link href={href} className="card-hover flex items-center justify-between p-4 font-medium text-brand-800">
                        {labelFor(href)}
                        <ArrowRight className="h-4 w-4 text-accent" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          <aside id="enquiry" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
            <EnquiryForm compact prefill={page.prefill} title={formTitle ?? `Request ${page.label}`} />
          </aside>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
