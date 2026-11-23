import { buildMetadata } from "@/lib/seo";
import { inCity, serviceOptionsSentence } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { CtaBanner, PageHero } from "@/components/blocks";
import { ServiceAreasBlock } from "@/components/sections";

export const revalidate = 3600;

export const generateMetadata = () => buildMetadata({
  title: "Service Areas - TV Repair Near You",
  description: "Areas served by Veenus Electronics for TV repair home visits, pickup and workshop repair. Check if we cover your locality.",
  path: "/service-areas",
});

export default async function ServiceAreasPage() {
  const b = await getBusiness();
  const options = serviceOptionsSentence(b);
  return (
    <>
      <PageHero
        title={`TV Repair Service Areas${inCity(b)}`}
        intro="These are the localities we currently serve. Not listed? Send an enquiry with your area - we will confirm whether we can help."
        breadcrumbs={[{ name: "Service Areas", href: "/service-areas" }]}
        icon="home"
      />
      <section className="section">
        <div className="container">
          <ServiceAreasBlock />
          {options && (
            <div className="mt-10 max-w-3xl space-y-3 text-slate-700">
              <h2 className="text-xl font-bold">{options}?</h2>
              <p>
                Some faults - such as software, remote, Wi-Fi or certain board issues - can be handled without a workshop.
                Repairs such as LED backlight replacement need a clean workshop environment. When we contact you, we will
                suggest the best option for your TV and location.
              </p>
            </div>
          )}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
