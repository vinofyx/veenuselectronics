import { Home, Truck, Wrench } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { inCity } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { CtaBanner, PageHero, SectionHeading } from "@/components/blocks";
import { ServiceAreasBlock } from "@/components/sections";

export const revalidate = 3600;

export const generateMetadata = () =>
  buildMetadata({
    title: "Service Areas - TV Repair Near You",
    description: "Areas served by Veenus Electronics for TV repair home visits, pickup and workshop repair. Check if we cover your locality.",
    path: "/service-areas",
  });

export default async function ServiceAreasPage() {
  const b = await getBusiness();
  const modes = [
    b.homeVisit && { icon: Home, title: "Home visit", text: "Suitable for many software, Wi-Fi, remote and some board faults that can be handled where the TV is." },
    b.workshopRepair && { icon: Wrench, title: "Workshop repair", text: "Needed for repairs such as LED backlight replacement, which require a clean workshop environment." },
    b.pickupDelivery && { icon: Truck, title: "Pickup & delivery", text: "Where available, we can collect the TV and return it after the repair and testing." },
  ].filter(Boolean) as { icon: typeof Home; title: string; text: string }[];
  return (
    <>
      <PageHero
        title={`TV Repair Service Areas${inCity(b)}`}
        eyebrow="Where we work"
        icon="home"
        intro="The localities we currently serve. Not listed? Call or WhatsApp and we will confirm."
        breadcrumbs={[{ name: "Service Areas", href: "/service-areas" }]}
      />
      <section className="section">
        <div className="container">
          <ServiceAreasBlock />
        </div>
      </section>
      {modes.length > 0 && (
        <section className="section border-t border-brand-100 bg-white">
          <div className="container">
            <SectionHeading eyebrow="Service options" title="How we can repair your TV" intro="When we contact you, we suggest the best option for your TV's fault and your location." />
            <ul className="grid gap-5 md:grid-cols-3">
              {modes.map((m) => (
                <li key={m.title} className="card p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <m.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-[19px]">{m.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{m.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBanner title="Is your area covered?" text="Tell us your locality when you call or WhatsApp and we'll confirm." />
    </>
  );
}
