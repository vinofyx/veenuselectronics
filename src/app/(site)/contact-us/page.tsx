import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks";
import { ContactCard } from "@/components/ContactCard";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ServiceAreasBlock } from "@/components/sections";

export const revalidate = 3600;

export const generateMetadata = () => buildMetadata({
  title: "Contact Us - Call, WhatsApp or Send an Enquiry",
  description: "Contact Veenus Electronics for TV and electronics repair. Call, WhatsApp, or send a repair enquiry and our team will get back to you.",
  path: "/contact-us",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        intro="Call, WhatsApp or send us your repair details. Our team will get back to you to discuss the problem."
        breadcrumbs={[{ name: "Contact Us", href: "/contact-us" }]}
        bookHref="#enquiry"
      />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_440px]">
          <div className="space-y-8">
            <ContactCard />
            <ServiceAreasBlock showHeading />
          </div>
          <div id="enquiry" className="scroll-mt-24">
            <EnquiryForm title="Send a repair enquiry" />
          </div>
        </div>
      </section>
    </>
  );
}
