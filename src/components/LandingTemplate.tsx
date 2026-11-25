import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import type { LandingPage } from "@/content/types";
import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { brands } from "@/content/brands";
import { electronics } from "@/content/electronics";
import { serviceSchema } from "@/lib/schema";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";
import { photoForPath, type PhotoKey } from "@/config/images";
import { FaqList, PageHero } from "./blocks";
import { CallButton, WhatsAppButton } from "./CtaButtons";
import { JsonLd } from "./JsonLd";

export type LandingVariant = "service" | "problem" | "brand" | "electronics";

function pageFor(href: string) {
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  return [...tvServices, ...tvProblems, ...brands, ...electronics].find((p) => p.slug === slug);
}
function labelFor(href: string): string {
  const hit = pageFor(href);
  if (hit) return hit.title;
  if (href === "/book-repair") return "Book a Repair";
  if (href === "/tv-brand-repair") return "Brands We Repair";
  return href.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? href;
}

const EYEBROW: Record<LandingVariant, string> = {
  service: "TV repair",
  problem: "TV problem",
  brand: "Brand repair",
  electronics: "Electronics repair",
};

const FALLBACK_PHOTO: Record<LandingVariant, PhotoKey> = {
  service: "livingRoomTv",
  problem: "boardRepair",
  brand: "modernTv",
  electronics: "homeTheatre",
};

type Props = {
  page: LandingPage;
  basePath: string;
  breadcrumbs: { name: string; href: string }[];
  variant?: LandingVariant;
  /** Notices rendered above the main content, e.g. SafetyNotice or BrandDisclaimer */
  notices?: ReactNode;
  /** Optional extra content after the main sections */
  extra?: ReactNode;
  formTitle?: string;
  /** Kept for compatibility; brand pages now use a photo like the other pages. */
  heroAside?: ReactNode;
};

export async function LandingTemplate({ page, basePath, breadcrumbs, variant = "service", notices, extra, formTitle }: Props) {
  const path = `${basePath}/${page.slug}`;
  const b = await getBusiness();
  const related = page.related.filter((href) => isPathOffered(b, href)).slice(0, 3);
  const [lead, ...restIntro] = page.intro;

  return (
    <>
      <JsonLd data={serviceSchema(page.title, page.metaDescription, path, b.address.city || undefined)} />
      <PageHero
        title={page.title}
        intro={page.summary}
        breadcrumbs={breadcrumbs}
        eyebrow={EYEBROW[variant]}
        photo={variant === "brand" ? undefined : photoForPath(path, FALLBACK_PHOTO[variant])}
        showCtas={false}
      />

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-20">
          <article className="min-w-0 max-w-3xl space-y-12">
            {lead && (
              <div className="space-y-4 text-[17px] leading-[1.75] text-slate-700">
                <p className="text-[18px] text-brand-800 sm:text-[19px]">{lead}</p>
                {restIntro.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            )}

            {notices}

            <div className="divide-y divide-brand-100 border-y border-brand-100">
              {page.sections.map((s, i) => (
                <section key={s.heading} className="py-8">
                  <h2 className="flex items-baseline gap-3 text-[21px]">
                    {variant === "problem" && <span className="font-display text-[14px] font-bold text-accent-600">{String(i + 1).padStart(2, "0")}</span>}
                    {s.heading}
                  </h2>
                  {s.body && <p className="mt-3 text-[16px] leading-relaxed text-slate-700">{s.body}</p>}
                  {s.bullets && (
                    <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                      {s.bullets.map((it) => (
                        <li key={it} className="flex gap-2.5 text-[15.5px] leading-relaxed text-slate-700">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {extra}

            {page.faqs.length > 0 && (
              <section>
                <h2 className="mb-6 text-[24px]">Questions</h2>
                <FaqList faqs={page.faqs} defaultOpen={null} />
              </section>
            )}

            {related.length > 0 && (
              <section>
                <h2 className="mb-4 text-[18px]">Related</h2>
                <ul className="flex flex-wrap gap-2.5">
                  {related.map((href) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 text-[14.5px] font-medium text-brand-800 transition-colors hover:border-accent hover:text-accent-600"
                      >
                        {labelFor(href)} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          {/* One booking CTA per page */}
          <aside id="enquiry" className="scroll-mt-28 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-brand-900 p-7 text-white">
              <h2 className="text-[20px] text-white">{formTitle ?? (/repair$/i.test(page.label) ? `Book ${page.label}` : `Book ${page.label} repair`)}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-brand-200">Tell us your TV brand, model and the problem. We&apos;ll explain the fault and the estimate before any work.</p>
              <div className="mt-6 space-y-2.5">
                <CallButton className="w-full" variant="onDark" label="Call Now" />
                <WhatsAppButton className="w-full" booking label="Book on WhatsApp" />
              </div>
              <Link href="/book-repair" className="mt-4 flex min-h-[44px] items-center justify-center gap-1.5 text-[14px] font-semibold text-accent-300 hover:text-accent-200">
                More booking options <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
