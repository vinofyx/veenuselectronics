import { tvProblems } from "@/content/tv-problems";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, PageHero, SafetyNotice, ServiceCard } from "@/components/blocks";

export const generateMetadata = () => buildMetadata({
  title: "Common TV Problems - Causes & Repairs",
  description:
    "TV not turning on, black screen, no picture, screen lines, backlight, motherboard, power supply, HDMI and Wi-Fi problems explained, with repair options.",
  path: "/tv-problems",
});

export default function TvProblemsIndex() {
  return (
    <>
      <PageHero
        title="Common TV Problems"
        intro="Find the symptom that matches your TV. Each guide explains the likely causes, safe checks you can do and how we repair it."
        breadcrumbs={[{ name: "TV Problems", href: "/tv-problems" }]}
        icon="screenOff"
      />
      <section className="section">
        <div className="container space-y-8">
          <SafetyNotice />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tvProblems.map((p) => (
              <ServiceCard key={p.slug} href={`/tv-problems/${p.slug}`} title={p.title} summary={p.summary} icon={p.icon} />
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
