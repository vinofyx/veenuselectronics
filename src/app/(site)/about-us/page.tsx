import Image from "next/image";
import { images } from "@/config/images";
import { site } from "@/config/site";
import { whyChooseItems } from "@/config/claims";
import { buildMetadata } from "@/lib/seo";
import { inCity } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { CheckList, CtaBanner, PageHero, SectionHeading } from "@/components/blocks";
import { HowItWorksSteps } from "@/components/sections";

export const generateMetadata = () => buildMetadata({
  title: "About Us - TV Repair Specialists",
  description: "About Veenus Electronics - a TV repair specialist for LED, LCD, Smart, OLED and QLED televisions, also repairing home theatre and audio equipment.",
  path: "/about-us",
});

export default async function AboutPage() {
  const b = await getBusiness();
  const why = whyChooseItems(b);
  return (
    <>
      <PageHero
        title={`About ${b.name}`}
        intro={`${site.tagline}${inCity(b)}.`}
        breadcrumbs={[{ name: "About Us", href: "/about-us" }]}
        icon="tv"
      />
      <section className="section">
        <div className="container grid items-start gap-12 lg:grid-cols-2">
          <div className="prose-content">
            <h2 className="mb-4 text-2xl font-bold">TV repair is what we do</h2>
            <p>
              {b.name} is a repair service focused on televisions - LED, LCD, Smart, OLED and QLED TVs from the brands
              found in Indian homes. We also repair the equipment that sits around the TV: home theatre systems, soundbars,
              speakers, amplifiers, projectors and set top boxes.
            </p>
            {b.yearsExperience && (
              <p>
                Our team has <strong>{b.yearsExperience}+ years</strong> of hands-on experience repairing televisions and
                electronics.
              </p>
            )}
            <p>
              Our approach is simple: diagnose properly, explain the fault in plain language, give an estimate, and only
              repair with your approval. If a repair does not make financial sense, we will tell you.
            </p>
            <p>
              We are an independent repair business and are not an authorised service centre of any TV manufacturer.
            </p>
          </div>
          {images.about ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
              <Image src={images.about.src} alt={images.about.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <div className="card p-8">
              <h2 className="mb-4 text-xl font-bold">What we stand for</h2>
              <CheckList
                items={[
                  "Honest diagnosis before any repair",
                  "Clear estimates and your approval before work",
                  "Careful handling of your TV",
                  "Practical advice - including when not to repair",
                ]}
              />
            </div>
          )}
        </div>
      </section>
      {why.length > 0 && (
        <section className="section bg-white">
          <div className="container">
            <SectionHeading title={`Why customers choose ${b.name}`} />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {why.map((w) => (
                <li key={w.title} className="card p-6">
                  <h3 className="text-lg font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container">
          <SectionHeading title="How we work" />
          <HowItWorksSteps />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
