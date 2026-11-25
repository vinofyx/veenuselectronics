import { tvServices } from "@/content/tv-services";
import { buildMetadata } from "@/lib/seo";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";
import { CtaBanner, PageHero, ServiceCard } from "@/components/blocks";

export const generateMetadata = () =>
  buildMetadata({
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
        eyebrow="Our speciality"
        intro="Choose your TV type to see the faults we repair and how we diagnose them."
        breadcrumbs={[{ name: "TV Repair", href: "/tv-repair" }]}
        photo="smartTv"
      />
      <section className="section">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offered.map((s) => (
            <ServiceCard key={s.slug} href={`/tv-repair/${s.slug}`} title={s.title} summary={s.summary} icon={s.icon} />
          ))}
        </div>
      </section>
      <CtaBanner title="Not sure which TV type you have?" text="Share the model number from the back of your TV and we'll take it from there." />
    </>
  );
}
