import { buildMetadata } from "@/lib/seo";
import { CheckList, CtaBanner, PageHero } from "@/components/blocks";
import { HowItWorksSteps } from "@/components/sections";
import { getBusiness } from "@/lib/business";

export const generateMetadata = () => buildMetadata({
  title: "How It Works - Our TV Repair Process",
  description: "How a repair works at Veenus Electronics: submit a request, we contact you, inspect and estimate, repair and test, then deliver.",
  path: "/how-it-works",
});

export default async function HowItWorksPage() {
  const b = await getBusiness();
  return (
    <>
      <PageHero
        title="How It Works"
        intro="From your first message to a working TV - here is what to expect."
        breadcrumbs={[{ name: "How It Works", href: "/how-it-works" }]}
      />
      <section className="section">
        <div className="container space-y-12">
          <HowItWorksSteps />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-4 text-xl font-bold">Important to know</h2>
              <CheckList
                items={[
                  "Submitting an enquiry is not a confirmed appointment - we will contact you to confirm a time.",
                  b.inspectionCharges ? `Inspection charges: ${b.inspectionCharges.replace(/\.$/, "")}.` : "Any visit or inspection charges are explained before we visit.",
                  "No repair work starts without your approval of the estimate.",
                  "If parts must be ordered, we tell you the expected wait before you approve.",
                ]}
              />
            </div>
            <div className="card p-6">
              <h2 className="mb-4 text-xl font-bold">To speed things up, have ready</h2>
              <CheckList
                items={[
                  "TV brand and model number (sticker on the back)",
                  "Screen size",
                  "A photo or short video of the problem",
                  "Any blinking-light pattern or error message",
                  "Your locality and a convenient time to call",
                ]}
              />
            </div>
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
