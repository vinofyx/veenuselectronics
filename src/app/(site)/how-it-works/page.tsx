import { buildMetadata } from "@/lib/seo";
import { CheckList, CtaBanner, PageHero } from "@/components/blocks";
import { HowItWorksSteps } from "@/components/sections";
import { getBusiness } from "@/lib/business";

export const generateMetadata = () =>
  buildMetadata({
    title: "How It Works - Our TV Repair Process",
    description: "How a repair works at Veenus Electronics: contact us, we diagnose the TV, you approve the estimate, then we repair and test it.",
    path: "/how-it-works",
  });

export default async function HowItWorksPage() {
  const b = await getBusiness();
  return (
    <>
      <PageHero title="How It Works" eyebrow="Our repair process" intro="Four simple steps - and nothing is repaired without your approval." breadcrumbs={[{ name: "How It Works", href: "/how-it-works" }]} size="compact" />
      <section className="section">
        <div className="container">
          <HowItWorksSteps />
        </div>
      </section>
      <section className="section border-t border-brand-100 bg-white">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 text-[22px]">Good to know</h2>
            <CheckList
              items={[
                "A booking is confirmed only after we call you back.",
                b.inspectionCharges ? `Inspection charges: ${b.inspectionCharges.replace(/\.$/, "")}.` : "Any visit or inspection charges are explained before we visit.",
                "If parts must be ordered, we tell you the expected wait first.",
              ]}
            />
          </div>
          <div>
            <h2 className="mb-5 text-[22px]">Have these ready</h2>
            <CheckList items={["TV brand and model number (sticker on the back)", "Screen size", "A photo or short video of the problem"]} />
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
