import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tvProblems } from "@/content/tv-problems";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, IconTile, PageHero, SafetyNotice } from "@/components/blocks";

export const generateMetadata = () =>
  buildMetadata({
    title: "Common TV Problems - Causes & Repairs",
    description:
      "TV not turning on, black screen, no picture, screen lines, backlight, motherboard, power supply, HDMI and Wi-Fi problems explained, with repair options.",
    path: "/tv-problems",
  });

const GROUPS: { title: string; text: string; slugs: string[] }[] = [
  {
    title: "Power & start-up",
    text: "The TV won't switch on, clicks, or keeps rebooting.",
    slugs: ["tv-not-turning-on", "tv-power-supply-repair", "tv-restarting-problem"],
  },
  {
    title: "Picture & screen",
    text: "Dark, black, dim or striped picture - with or without sound.",
    slugs: ["tv-sound-but-no-picture", "tv-black-screen", "tv-screen-lines", "tv-backlight-repair", "tv-screen-repair"],
  },
  {
    title: "Boards & connectivity",
    text: "Stuck logo, inputs not working, HDMI or Wi-Fi faults.",
    slugs: ["tv-motherboard-repair", "tv-hdmi-problem", "tv-wifi-problem"],
  },
];

export default function TvProblemsIndex() {
  const grouped = new Set(GROUPS.flatMap((g) => g.slugs));
  const other = tvProblems.filter((p) => !grouped.has(p.slug));
  const groups = other.length ? [...GROUPS, { title: "Other problems", text: "", slugs: other.map((p) => p.slug) }] : GROUPS;
  return (
    <>
      <PageHero
        title="Common TV Problems"
        eyebrow="Diagnose the symptom"
        icon="screenOff"
        intro="Find the symptom that matches your TV to see likely causes and how we repair it."
        breadcrumbs={[{ name: "TV Problems", href: "/tv-problems" }]}
        photo="screenNoise"
      />
      <section className="section">
        <div className="container space-y-14">
          <SafetyNotice />
          {groups.map((g) => (
            <div key={g.title} className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
              <div>
                <h2 className="text-[24px]">{g.title}</h2>
                {g.text && <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{g.text}</p>}
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {g.slugs
                  .map((s) => tvProblems.find((p) => p.slug === s))
                  .filter((p): p is NonNullable<typeof p> => Boolean(p))
                  .map((p) => (
                    <li key={p.slug}>
                      <Link href={`/tv-problems/${p.slug}`} className="card-hover group flex h-full flex-col p-5">
                        <IconTile icon={p.icon} size="sm" tone="accent" />
                        <span className="mt-4 font-display text-[17px] font-bold text-brand-800">{p.title}</span>
                        <span className="mt-1.5 flex-1 text-[14.5px] leading-relaxed text-ink-muted">{p.summary}</span>
                        <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand-800 group-hover:text-accent-600">
                          Causes &amp; repair <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <CtaBanner title="Can't find your symptom?" text="Describe what your TV is doing and we'll tell you the likely cause and the next step." />
    </>
  );
}
