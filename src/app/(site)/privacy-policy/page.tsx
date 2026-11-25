import { legal } from "@/config/legal";
import { getBusiness } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks";
import { LegalNav } from "@/components/LegalNav";

export const generateMetadata = () => buildMetadata({
  title: "Privacy Policy",
  description: "How Veenus Electronics handles the information you share when you call, WhatsApp, SMS or email us about a repair.",
  path: "/privacy-policy",
  localise: false,
});

export default async function PrivacyPage() {
  const b = await getBusiness();
  const contact = b.email || b.phoneDisplay;
  return (
    <>
      <PageHero title="Privacy Policy" eyebrow="Legal" breadcrumbs={[{ name: "Privacy Policy", href: "/privacy-policy" }]} showCtas={false} size="compact" />
      <section className="section">
        <div className="container grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          <LegalNav current="/privacy-policy" />
          <div className="card prose-content min-w-0 max-w-3xl p-6 sm:p-10 [&_h2]:text-[21px] [&_li]:text-slate-700">
          <p className="text-sm text-slate-500">Last updated: {new Date(legal.lastUpdated).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
          <p>
            This policy explains how {b.name} (&quot;we&quot;, &quot;us&quot;) handles personal information when you use this
            website or contact us. It describes what information we hold and how you can exercise your rights under applicable
            Indian data protection laws. This document provides transparency regarding our communications and data practices;
            it does not constitute a formal certification of statutory compliance and is subject to professional legal review.
          </p>

          <h2>1. What this website collects</h2>
          <p>
            This website has no public online enquiry or booking form. Repair bookings are made by {legal.bookingMethod} or email,
            and those messages go directly to us through your phone or messaging app.
          </p>
          <ul>
            <li>Like most websites, our hosting provider records basic technical logs (such as IP address, browser and pages requested) to keep the site running and secure.</li>
            <li>If analytics is enabled, anonymised usage data (pages visited, button clicks) is collected via Google Analytics.</li>
          </ul>

          <h2>2. Information you give us when you contact us</h2>
          <ul>
            <li>Contact details: your name, mobile number, email address (if you email us) and your area or address for a visit or pickup.</li>
            <li>Repair details: equipment type, brand, model number, the problem, and any photos or videos you choose to send us.</li>
          </ul>
          <p>
            Messages sent by WhatsApp, SMS or email are also handled by those services under their own privacy policies.
          </p>

          <h2>3. Why we use it</h2>
          <ul>
            <li>To reply to you and arrange the inspection, visit, pickup or repair.</li>
            <li>To diagnose the problem, prepare estimates, carry out and track the repair.</li>
            <li>To keep records of repairs, parts used and any warranty provided.</li>
            <li>To keep the website secure and, if analytics is enabled, to understand which pages are useful (aggregated only).</li>
          </ul>
          <p>We do not sell your personal information and we do not use it for unrelated marketing without your consent.</p>

          <h2>4. Earlier online enquiries</h2>
          <p>
            If you sent us an enquiry through an online form on an earlier version of this website, it (and any photos you
            attached) is kept in private, access-controlled storage visible only to authorised staff. Photos are kept for{" "}
            {legal.photoRetention}, then deleted.
          </p>

          <h2>5. Data retention</h2>
          <p>
            Enquiry and repair records are kept for {legal.enquiryRetention}, or longer if required by law (for example tax or
            warranty records), and then deleted or anonymised.
          </p>

          <h2>6. Sharing</h2>
          <p>
            We use service providers to run this website and our records - website hosting, database and storage (Supabase) and,
            if enabled, Google Analytics. They act on our instructions. We may disclose information if required by law.
          </p>

          <h2>7. Security</h2>
          <p>
            Data is transmitted over HTTPS and stored with access restricted to authorised staff using secure sign-in.
            No method of transmission or storage is completely secure, but we take reasonable steps to protect your data.
          </p>

          <h2>8. Your rights</h2>
          <p>
            You may ask to access, correct or delete the personal information we hold about you, or raise a grievance about
            how it is handled. We will respond within a reasonable time.
          </p>

          <h2>9. Contact for privacy queries</h2>
          <p>
            {contact ? (
              <>
                For privacy questions or requests, contact us at <strong>{contact}</strong>
                {b.email && b.phoneDisplay ? <> or call {b.phoneDisplay}</> : null}.
              </>
            ) : (
              <>For privacy questions or requests, please use the contact options on our Contact Us page.</>
            )}
          </p>

          <h2>10. Changes</h2>
          <p>We may update this policy. The date at the top shows when it was last changed.</p>
          </div>
        </div>
      </section>
    </>
  );
}
