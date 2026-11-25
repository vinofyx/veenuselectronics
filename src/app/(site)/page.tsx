import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isPathOffered } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { HOME_PROBLEM_PHOTOS } from "@/config/images";
import { tvServices } from "@/content/tv-services";
import { tvProblems } from "@/content/tv-problems";
import { buildMetadata } from "@/lib/seo";
import { IconTile, SectionHeading } from "@/components/blocks";
import { CtaGroup } from "@/components/CtaButtons";
import { HeroVisual } from "@/components/HeroVisual";
import { Photo } from "@/components/Photo";
import { BrandGrid, HowItWorksSteps } from "@/components/sections";

export const revalidate = 3600;

export const generateMetadata = () =>
  buildMetadata({
    title: "TV Repair Service - LED, LCD, Smart, OLED & QLED",
    description:
      "Expert repair for LED, LCD, Smart, OLED and QLED TVs - backlight, no power, black screen, lines and board faults. Book a repair, call or WhatsApp us.",
    path: "/",
  });

/** Homepage copy is deliberately short and different from the service/problem pages. */
const SERVICES: { slug: string; name: string; line: string }[] = [
  { slug: "led-tv-repair", name: "LED TV", line: "Backlight, power and board faults." },
  { slug: "lcd-tv-repair", name: "LCD TV", line: "Older panels, inverters and power faults." },
  { slug: "smart-tv-repair", name: "Smart TV", line: "Boot loops, apps, Wi-Fi and display." },
  { slug: "oled-tv-repair", name: "OLED TV", line: "Careful repair of premium OLED sets." },
  { slug: "qled-tv-repair", name: "QLED TV", line: "Backlight, local dimming and boards." },
  { slug: "android-tv-repair", name: "Android TV", line: "Boot, storage, app and hardware faults." },
];

const PROBLEMS: { slug: string; name: string; line: string }[] = [
  { slug: "tv-not-turning-on", name: "TV Not Turning ON", line: "No power, no standby light, or it won't start." },
  { slug: "tv-black-screen", name: "Black Screen", line: "The screen stays dark, with or without sound." },
  { slug: "tv-sound-but-no-picture", name: "Sound But No Picture", line: "You can hear it, but nothing shows." },
  { slug: "tv-screen-lines", name: "Display Lines", line: "Lines, colour bands or a split picture." },
  { slug: "tv-backlight-repair", name: "Backlight Problem", line: "A dim, dark or patchy picture." },
  { slug: "tv-motherboard-repair", name: "Motherboard Problem", line: "Stuck on the logo, or inputs stop working." },
];

export default async function HomePage() {
  const b = await getBusiness();
  const services = SERVICES.map((s) => ({ ...s, page: tvServices.find((t) => t.slug === s.slug) }))
    .filter((s) => s.page && isPathOffered(b, `/tv-repair/${s.slug}`));
  const problems = PROBLEMS.map((p) => ({ ...p, page: tvProblems.find((t) => t.slug === p.slug) })).filter((p) => p.page);

  return (
    <>
      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-page">
        <div className="pointer-events-none absolute inset-0 -z-10 tech-grid-light [mask-image:radial-gradient(ellipse_at_top_left,black_20%,transparent_70%)]" aria-hidden />
        <div className="container grid items-center gap-10 pb-14 pt-10 sm:pt-12 xl:grid-cols-[1fr_1fr] xl:gap-14 xl:pb-16 xl:pt-10 2xl:gap-20 2xl:pb-20 2xl:pt-14">
          <div className="mx-auto w-full max-w-2xl xl:mx-0 xl:max-w-none">
            <h1 className="text-[clamp(2.5rem,1rem+3.6vw,4.5rem)] leading-[1.04] tracking-[-0.03em] text-brand-800">
              Expert TV Repair. <span className="block text-accent-600">Done Right.</span>
            </h1>
            <p className="mt-6 max-w-[30rem] text-[18px] leading-relaxed text-ink-muted sm:text-[19px]">
              Professional LED, LCD, Smart TV, OLED and QLED television repair.
            </p>
            <div className="mt-9">
              <CtaGroup bookLabel="Book Repair" waLabel="WhatsApp" />
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* 2. WHAT WE REPAIR */}
      <section className="section">
        <div className="container">
          <SectionHeading title="What We Repair" action={{ label: "All TV repair services", href: "/tv-repair" }} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/tv-repair/${s.slug}`}
                  className="group flex h-full items-start gap-5 rounded-2xl border border-brand-100 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover sm:p-7"
                >
                  <IconTile icon={s.page!.icon} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[19px] font-bold text-brand-800">{s.name}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-ink-muted">{s.line}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-800 group-hover:text-accent-600">
                      Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] text-ink-muted">
            We also repair{" "}
            <Link href="/electronics-repair" className="font-semibold text-brand-800 underline decoration-brand-200 underline-offset-4 hover:text-accent-600 hover:decoration-accent">
              home theatres, speakers, amplifiers, projectors and set top boxes
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 3. COMMON TV PROBLEMS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading title="Common TV Problems" action={{ label: "All TV problems", href: "/tv-problems" }} />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p) => (
              <li key={p.slug}>
                <Link href={`/tv-problems/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover">
                  <div className="relative aspect-[16/9] overflow-hidden bg-brand-800">
                    <Photo
                      name={HOME_PROBLEM_PHOTOS[`/tv-problems/${p.slug}`] ?? "boardRepair"}
                      width={440}
                      height={248}
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
                      className="transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-4 p-5">
                    <span>
                      <span className="block font-display text-[17px] font-bold text-brand-800">{p.name}</span>
                      <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-muted">{p.line}</span>
                    </span>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-brand-300 transition-all group-hover:translate-x-0.5 group-hover:text-accent-600" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. BRANDS */}
      <section className="section">
        <div className="container">
          <SectionHeading title="TV Brands We Repair" />
          <BrandGrid />
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="section bg-white">
        <div className="container">
          <SectionHeading title="How It Works" />
          <HowItWorksSteps />
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="section">
        <div className="container">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-brand-900 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute inset-0 -z-10 tech-grid" aria-hidden />
            <h2 className="text-display-md text-white">Need Your TV Repaired?</h2>
            <p className="mx-auto mt-4 max-w-md text-[17px] text-brand-200">Contact {b.name} to discuss your TV repair.</p>
            <div className="mt-8 flex justify-center">
              <CtaGroup variant="onDark" order="call-first" bookLabel="Book Repair" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
