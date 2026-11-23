import { buildMetadata } from "@/lib/seo";
import { CheckList, PageHero } from "@/components/blocks";
import { CallButton, WhatsAppButton } from "@/components/CtaButtons";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getBusiness } from "@/lib/business";

export const generateMetadata = () => buildMetadata({
  title: "Book a TV Repair - Repair Enquiry Form",
  description: "Book a TV or electronics repair with Veenus Electronics. Submit your details and our team will contact you to confirm.",
  path: "/book-repair",
});

export default async function BookRepairPage() {
  const b = await getBusiness();
  return (
    <>
      <PageHero
        title="Book a TV Repair"
        intro="Tell us about your TV and the problem. It takes about a minute - our team will contact you to confirm."
        breadcrumbs={[{ name: "Book Repair", href: "/book-repair" }]}
        showCtas={false}
      />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_360px]">
          <EnquiryForm title="Repair enquiry" />
          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="mb-3 text-lg font-bold">Prefer to talk?</h2>
              <div className="flex flex-col gap-3">
                <CallButton />
                <WhatsAppButton booking label="Book on WhatsApp" />
              </div>
            </div>
            <div className="card p-6">
              <h2 className="mb-3 text-lg font-bold">What happens next</h2>
              <CheckList
                items={[
                  "You receive an enquiry ID on screen.",
                  "Our team calls or WhatsApps you to discuss the problem.",
                  "We agree a visit, pickup or workshop drop-off time.",
                  "You get an estimate before any repair.",
                  ...(b.inspectionCharges ? [`Inspection charges: ${b.inspectionCharges.replace(/\.$/, "")}.`] : []),
                ]}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
