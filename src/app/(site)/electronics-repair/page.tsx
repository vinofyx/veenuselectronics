import { electronics } from "@/content/electronics";
import { buildMetadata } from "@/lib/seo";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";
import { CtaBanner, PageHero, ServiceCard } from "@/components/blocks";

export const generateMetadata = () => buildMetadata({
  title: "Electronics Repair - Home Theatre, Speakers, Amplifiers",
  description:
    "Home theatre, soundbar, speaker, amplifier, projector, DVD player and set top box repair from Veenus Electronics.",
  path: "/electronics-repair",
});

export default async function ElectronicsIndex() {
  const b = await getBusiness();
  const offered = electronics.filter((x) => isPathOffered(b, `/electronics-repair/${x.slug}`));
  return (
    <>
      <PageHero
        title="Other Electronics Repair"
        intro="TV repair is our speciality, and we also repair the audio and video equipment connected to it."
        breadcrumbs={[{ name: "Other Electronics", href: "/electronics-repair" }]}
        icon="speaker"
        bookLabel="Book Repair"
      />
      <section className="section">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offered.map((e) => (
            <ServiceCard key={e.slug} href={`/electronics-repair/${e.slug}`} title={e.title} summary={e.summary} icon={e.icon} />
          ))}
        </div>
      </section>
      <CtaBanner title="Need an electronics repair?" />
    </>
  );
}
