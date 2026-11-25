import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import { brands } from "@/content/brands";
import { getBusiness } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, PageHero } from "@/components/blocks";

export const generateMetadata = () =>
  buildMetadata({
    title: "TV Brands We Repair - Samsung, LG, Sony, Mi & More",
    description:
      "Independent TV repair for Samsung, LG, Sony, Xiaomi (Mi), OnePlus, TCL, Hisense, Panasonic and Haier televisions. Not an authorised service centre.",
    path: "/tv-brand-repair",
  });

export default async function BrandsIndex() {
  const b = await getBusiness();
  const list = brands.filter((x) => b.brands.includes(x.brand));
  return (
    <>
      <PageHero
        title="TV Brands We Repair"
        eyebrow="Independent multi-brand repair"
        icon="tv"
        intro="We repair televisions from the major brands sold in India as an independent repair service - we are not an authorised service centre of any manufacturer."
        breadcrumbs={[{ name: "Brands We Repair", href: "/tv-brand-repair" }]}
      />
      <section className="section">
        <div className="container">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((x) => (
              <li key={x.slug}>
                <Link href={`/tv-brand-repair/${x.slug}`} className="card-hover group flex h-full flex-col p-7">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-display text-[30px] font-extrabold leading-none tracking-tight text-brand-800">{x.brand}</span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-brand-200 text-brand-700 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </span>
                  <span className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-600">{x.title}</span>
                  <span className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{x.summary}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book-repair" className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-brand-300 p-7 transition-colors hover:border-accent hover:bg-accent-50">
                <span className="font-display text-[22px] font-bold text-brand-800">Brand not listed?</span>
                <span className="mt-2 text-[15px] leading-relaxed text-ink-muted">Send us the brand and model number and we&apos;ll tell you whether we can help.</span>
                <span className="mt-4 text-[14px] font-semibold text-accent-600">Ask about your TV &rarr;</span>
              </Link>
            </li>
          </ul>
          <div className="mt-10 flex gap-4 rounded-2xl border border-brand-100 bg-white p-6 text-[14.5px] leading-relaxed text-slate-700">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
            <p>
              <strong className="text-brand-800">Independent repair.</strong> {b.name} is not affiliated with any TV manufacturer. Brand names and trademarks belong to their respective owners and are used only to identify the products we
              repair. If your TV is still under the manufacturer&apos;s warranty, contact the manufacturer first.
            </p>
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
