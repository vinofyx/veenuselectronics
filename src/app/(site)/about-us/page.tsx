import { CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getBusiness } from "@/lib/business";
import { CtaBanner, PageHero } from "@/components/blocks";
import { Photo } from "@/components/Photo";

export const generateMetadata = () =>
  buildMetadata({
    title: "About Us - TV Repair Specialists",
    description: "About Veenus Electronics - a TV repair specialist for LED, LCD, Smart, OLED and QLED televisions, also repairing home theatre and audio equipment.",
    path: "/about-us",
  });

const APPROACH = [
  { title: "Diagnose first", text: "We find the actual fault before talking about a repair." },
  { title: "Estimate before work", text: "Nothing is repaired without your approval." },
  { title: "Honest advice", text: "If a repair isn't worth it, we will tell you." },
];

export default async function AboutPage() {
  const b = await getBusiness();
  return (
    <>
      <PageHero title={`About ${b.name}`} eyebrow="Who we are" breadcrumbs={[{ name: "About Us", href: "/about-us" }]} size="compact" />

      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-display-md">TV repair is what we do</h2>
            <div className="mt-6 space-y-4 text-[17px] leading-[1.75] text-slate-700">
              <p>
                {b.name} is an independent repair service focused on televisions &mdash; LED, LCD, Smart, OLED and QLED TVs from the brands found in Indian homes. We also repair home theatres, speakers, amplifiers,
                projectors and set top boxes.
              </p>
              {b.yearsExperience && <p>Our team has {b.yearsExperience}+ years of hands-on experience repairing televisions and electronics.</p>}
            </div>
            <ul className="mt-8 space-y-4">
              {APPROACH.map((a) => (
                <li key={a.title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                  <span>
                    <span className="block font-semibold text-brand-800">{a.title}</span>
                    <span className="block text-[15px] text-ink-muted">{a.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[13.5px] text-ink-muted">We are not an authorised service centre of any TV manufacturer.</p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-brand-800 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Photo name="soldering" width={600} height={750} sizes="(min-width:1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
