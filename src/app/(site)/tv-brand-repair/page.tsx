import { brands } from "@/content/brands";
import { getBusiness } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, PageHero, ServiceCard } from "@/components/blocks";

export const generateMetadata = () => buildMetadata({
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
        intro="We repair televisions from the major brands sold in India as an independent repair service - we are not an authorised service centre of any manufacturer."
        breadcrumbs={[{ name: "Brands We Repair", href: "/tv-brand-repair" }]}
        icon="tv"
      />
      <section className="section">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((x) => (
            <ServiceCard key={x.slug} href={`/tv-brand-repair/${x.slug}`} title={x.title} summary={x.summary} icon={x.icon} />
          ))}
        </div>
        <p className="container mt-8 text-sm text-slate-500">
          Brand names and trademarks belong to their respective owners and are used only to identify the products we repair.
        </p>
      </section>
      <CtaBanner />
    </>
  );
}
