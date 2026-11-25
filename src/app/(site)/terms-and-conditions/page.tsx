import { legal } from "@/config/legal";
import { getBusiness } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks";
import { LegalNav } from "@/components/LegalNav";

export const generateMetadata = () => buildMetadata({
  title: "Terms and Conditions",
  description: "Terms and conditions for repair bookings and repair services from Veenus Electronics.",
  path: "/terms-and-conditions",
  localise: false,
});

export default async function TermsPage() {
  const b = await getBusiness();
  return (
    <>
      <PageHero title="Terms and Conditions" eyebrow="Legal" breadcrumbs={[{ name: "Terms and Conditions", href: "/terms-and-conditions" }]} showCtas={false} size="compact" />
      <section className="section">
        <div className="container grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <LegalNav current="/terms-and-conditions" />
          <div className="card prose-content min-w-0 max-w-3xl p-6 sm:p-10 [&_h2]:text-[21px] [&_li]:text-slate-700">
          <p className="text-sm text-slate-500">Last updated: {new Date(legal.lastUpdated).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>

          <h2>1. Repair requests are not appointments</h2>
          <p>
            Contacting us about a repair by phone, WhatsApp, SMS or email does not create a confirmed appointment or
            a contract for repair. Our staff will contact you to confirm availability, service type and any applicable charges.
          </p>

          <h2>2. Inspection and estimates</h2>
          <ul>
            <li>
              Any applicable inspection or home-visit charges are disclosed verbally before booking. We do not advertise or offer a fixed inspection fee or free inspection unless separately agreed in writing.
              {b.inspectionCharges ? ` Current policy: ${b.inspectionCharges.replace(/\.$/, "")}.` : ""}
            </li>
            <li>Estimates are based on the fault identified during diagnosis. Hidden faults found during repair may change the estimate; we will contact you for approval before continuing.</li>
            <li>No repair work is carried out without your approval.</li>
          </ul>

          <h2>3. Parts</h2>
          <p>
            Availability and lead times of parts vary by model. Where an exact part is unavailable we will tell you before
            proceeding and only fit a compatible alternative with your agreement.
          </p>

          <h2>4. Warranty</h2>
          <p>
            Any warranty on a repair is limited to the specific work performed and parts replaced. Applicable warranty terms,
            conditions and durations are strictly those specified on your individual repair receipt issued upon completion.{b.warrantyText ? ` ${b.warrantyText.replace(/\.$/, "")}.` : ""}
            We do not advertise or provide a universal or blanket warranty across all repairs. Warranty coverage, where applicable,
            does not cover physical damage, liquid damage, power-surge damage, customer tampering, or subsequent faults unrelated to the original repair.
          </p>

          <h2>5. Independent repairer</h2>
          <p>
            {b.name} is an independent repair service and is not an authorised service centre of any manufacturer. Brand
            names are used only to identify products. Repairs by an independent repairer may affect any remaining manufacturer
            warranty - please check with the manufacturer if your product is still under warranty.
          </p>

          <h2>6. Uncollected items</h2>
          <p>
            Please collect repaired or unrepaired items promptly once notified. We will make reasonable attempts to contact you
            regarding items left uncollected for an extended period.
          </p>

          <h2>7. Liability</h2>
          <p>
            We handle your equipment with reasonable care. Our liability is limited to the value of the repair charges paid,
            except where the law does not allow such a limitation. We are not responsible for loss of data, apps or settings
            on smart devices; some repairs require a factory reset.
          </p>

          <h2>8. Website use</h2>
          <p>
            Information on this website is general guidance and not a diagnosis. Do not attempt internal repairs on TVs or
            electronics without proper training - they contain dangerous voltages.
          </p>

          <h2>9. Governing law</h2>
          <p>
            These terms are governed by the laws of India and subject to the jurisdiction of {legal.jurisdiction}, subject to professional legal review and applicable statutory provisions. This document does not constitute a statutory compliance certification.
          </p>
          </div>
        </div>
      </section>
    </>
  );
}
