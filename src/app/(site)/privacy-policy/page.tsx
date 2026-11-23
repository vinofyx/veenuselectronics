import { legal } from "@/config/legal";
import { getBusiness } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks";

export const generateMetadata = () => buildMetadata({
  title: "Privacy Policy",
  description: "How Veenus Electronics collects, uses, stores and protects the information you share in a repair enquiry.",
  path: "/privacy-policy",
  localise: false,
});

export default async function PrivacyPage() {
  const b = await getBusiness();
  const contact = b.email || b.phoneDisplay;
  return (
    <>
      <PageHero title="Privacy Policy" breadcrumbs={[{ name: "Privacy Policy", href: "/privacy-policy" }]} showCtas={false} />
      <section className="section">
        <div className="container prose-content max-w-3xl [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_li]:text-slate-700">
          <p className="text-sm text-slate-500">Last updated: {new Date(legal.lastUpdated).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
          <p>
            This policy explains how {b.name} (&quot;we&quot;, &quot;us&quot;) handles personal information you share through this
            website. We process personal data in line with applicable Indian law, including the Digital Personal Data
            Protection Act, 2023.
          </p>

          <h2>1. Information we collect</h2>
          <ul>
            <li>Contact details: name, mobile number, optional email address and your area/locality.</li>
            <li>Repair details: equipment type, brand, model number, screen size, problem description and preferred date.</li>
            <li>Photos you choose to upload of the device or problem.</li>
            <li>Technical data: the page you submitted from, the time of submission, and a one-way hashed form of your IP address used only to prevent spam and abuse.</li>
            <li>If analytics is enabled, anonymised usage data (pages visited, button clicks) collected via Google Analytics.</li>
          </ul>

          <h2>2. Why we use it</h2>
          <ul>
            <li>To contact you by phone, SMS or WhatsApp about your repair enquiry.</li>
            <li>To diagnose your problem, prepare estimates, carry out and track the repair.</li>
            <li>To keep records of repairs, parts used and any warranty provided.</li>
            <li>To protect the website from spam and misuse.</li>
            <li>To understand which pages are useful and improve the website (aggregated analytics only).</li>
          </ul>
          <p>We do not sell your personal information and we do not use it for unrelated marketing without your consent.</p>

          <h2>3. Consent</h2>
          <p>
            When you submit an enquiry you consent to us using your details for the purposes above. You can withdraw consent at
            any time by contacting us; this will not affect work already carried out.
          </p>

          <h2>4. Photo uploads</h2>
          <p>
            Photos are stored in private, access-controlled storage and are visible only to authorised staff handling your
            enquiry. Please avoid including people, documents or other personal information in photos. Photos are kept for{" "}
            {legal.photoRetention}, then deleted.
          </p>

          <h2>5. Data retention</h2>
          <p>
            Enquiry and repair records are kept for {legal.enquiryRetention}, or longer if required by law (for example tax or
            warranty records), and then deleted or anonymised.
          </p>

          <h2>6. Sharing</h2>
          <p>
            Your data is processed by service providers we use to run this website - hosting (Vercel), database and storage
            (Supabase), email delivery and, if enabled, Google Analytics. They act on our instructions. We may disclose
            information if required by law.
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
      </section>
    </>
  );
}
