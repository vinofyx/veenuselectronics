import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, ShieldCheck } from "lucide-react";
import { site } from "@/config/site";
import { inCity, isPathOffered, serviceOptionsSentence } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { trustItems, whyChooseItems } from "@/config/claims";
import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { electronics } from "@/content/electronics";
import { getGeneralFaqs } from "@/content/faqs";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, FaqList, SectionHeading, ServiceCard } from "@/components/blocks";
import { CtaGroup } from "@/components/CtaButtons";
import { HeroVisual } from "@/components/HeroVisual";
import { BrandGrid, HowItWorksSteps, ReviewsBlock, ServiceAreasBlock } from "@/components/sections";

export const revalidate = 3600;

export const generateMetadata = () => buildMetadata({
  title: "TV Repair Service - LED, LCD, Smart, OLED & QLED",
  description:
    "Expert repair for LED, LCD, Smart, OLED and QLED TVs - backlight, no power, black screen, lines and board faults. Book a repair, call or WhatsApp us.",
  path: "/",
});

const HOME_PROBLEMS = [
  "tv-not-turning-on",
  "tv-sound-but-no-picture",
  "tv-black-screen",
  "tv-screen-lines",
  "tv-backlight-repair",
  "tv-motherboard-repair",
  "tv-restarting-problem",
  "tv-wifi-problem",
];

export default async function HomePage() {
  const b = await getBusiness();
  const options = serviceOptionsSentence(b);
  const problems = HOME_PROBLEMS.map((s) => tvProblems.find((p) => p.slug === s)!).filter(Boolean);
  const services = tvServices.filter((s) => s.slug !== "4k-tv-repair" && isPathOffered(b, `/tv-repair/${s.slug}`));
  const otherElectronics = electronics.filter((e) => isPathOffered(b, `/electronics-repair/${e.slug}`));
  const trust = trustItems(b);
  const why = whyChooseItems(b);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-surface">
        <div className="container grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="eyebrow mb-3">{site.primarySpeciality}{inCity(b)}</p>
            <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
              Expert TV Repair Services at <span className="text-accent-600">Affordable Prices</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Professional LED, LCD, Smart TV, OLED and QLED television repair services. Get your television diagnosed and
              repaired by experienced technicians.
            </p>
            <div className="mt-8">
              <CtaGroup />
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden /> Estimate before repair
              </li>
              {options && (
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden /> {options}
                </li>
              )}
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden /> All major brands
              </li>
            </ul>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* TRUST BAR */}
      {trust.length > 0 && (
        <section aria-label="Why customers contact us" className="border-y border-brand-100 bg-white">
          <ul className="container grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
            {trust.map((t) => (
              <li key={t.title} className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-accent" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-brand-800">{t.title}</p>
                  <p className="text-xs text-slate-600">{t.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* MAIN TV SERVICES */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our speciality"
            title="TV Repair Services"
            intro="Whatever type of television you own, we diagnose the fault properly and explain your options before any work begins."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} href={`/tv-repair/${s.slug}`} title={s.title} summary={s.summary} icon={s.icon} featured={i < 3} />
            ))}
          </div>
          <div className="mt-8">
            <Link href="/tv-repair" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">
              View all TV repair services <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* COMMON PROBLEMS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading
            eyebrow="Diagnose the symptom"
            title="Common TV Problems We Fix"
            intro="Select the problem that matches your TV to learn the likely causes and what a repair involves."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => (
              <ServiceCard key={p.slug} href={`/tv-problems/${p.slug}`} title={p.label} summary={p.summary} icon={p.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Brands"
            title="TV Brands We Repair"
            intro="Independent repair for popular TV brands. We are not an authorised service centre of any manufacturer."
          />
          <BrandGrid />
        </div>
      </section>

      {/* OTHER ELECTRONICS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading eyebrow="Also repaired" title="Other Electronics Repair" intro="Alongside TVs, we repair the audio and video equipment around them." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherElectronics.map((e) => (
              <ServiceCard key={e.slug} href={`/electronics-repair/${e.slug}`} title={e.label} summary={e.summary} icon={e.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      {why.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Why us" title={`Why Choose ${b.name}`} center />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {why.map((w) => (
                <li key={w.title} className="card p-6">
                  <BadgeCheck className="h-7 w-7 text-accent" aria-hidden />
                  <h3 className="mt-3 text-lg font-semibold">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading eyebrow="Simple process" title="How It Works" intro="An enquiry is not a confirmed appointment - our team will contact you to confirm." />
          <HowItWorksSteps />
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Reviews" title="What Our Customers Say" center />
          <ReviewsBlock />
        </div>
      </section>

      {/* SERVICE LOCATIONS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading eyebrow="Locations" title="Service Locations" />
          <ServiceAreasBlock />
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container max-w-4xl">
          <SectionHeading eyebrow="FAQ" title="TV Repair Questions" center />
          <FaqList faqs={getGeneralFaqs(b).slice(0, 6)} />
          <p className="mt-6 text-center">
            <Link href="/faq" className="font-semibold text-brand hover:underline">
              See all FAQs &rarr;
            </Link>
          </p>
        </div>
      </section>

      <CtaBanner title="Having Trouble With Your TV?" bookLabel="Book a Repair" />
    </>
  );
}
