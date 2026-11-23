import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { buildMetadata } from "@/lib/seo";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";
import { CtaBanner, PageHero, SectionHeading, ServiceCard } from "@/components/blocks";
import { BrandGrid } from "@/components/sections";

export const generateMetadata = () => buildMetadata({
  title: "TV Repair Services - LED, LCD, Smart, OLED, QLED",
  description:
    "All TV repair services from Veenus Electronics: LED, LCD, Smart, OLED, QLED, Android and 4K TV repair. Professional diagnosis and transparent estimates.",
  path: "/tv-repair",
});

export default async function TvRepairIndex() {
  const b = await getBusiness();
  const offered = tvServices.filter((x) => isPathOffered(b, `/tv-repair/${x.slug}`));
  return (
    <>
      <PageHero
        title="TV Repair Services"
        intro="Choose your TV type to see the common faults, what we can repair and how we diagnose the problem."
        breadcrumbs={[{ name: "TV Repair", href: "/tv-repair" }]}
        icon="tv"
      />
      <section className="section">
        <div className="container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offered.map((s) => (
              <ServiceCard key={s.slug} href={`/tv-repair/${s.slug}`} title={s.title} summary={s.summary} icon={s.icon} />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container">
          <SectionHeading title="Know the symptom but not the cause?" intro="Start from the problem you are seeing." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tvProblems.slice(0, 8).map((p) => (
              <ServiceCard key={p.slug} href={`/tv-problems/${p.slug}`} title={p.label} summary={p.summary} icon={p.icon} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading title="Brands we repair" />
          <BrandGrid />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
