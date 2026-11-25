import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks";
import { ContactCard } from "@/components/ContactCard";
import { CallButton, SmsButton, WhatsAppButton } from "@/components/CtaButtons";
import { ServiceAreasBlock } from "@/components/sections";

export const revalidate = 3600;

export const generateMetadata = () =>
  buildMetadata({
    title: "Contact Us - Call, WhatsApp or Visit",
    description: "Contact Veenus Electronics for TV and electronics repair. Call, WhatsApp or SMS us with your TV details, or get directions to our workshop.",
    path: "/contact-us",
  });

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        eyebrow="We're here to help"
        intro="Call, WhatsApp or SMS us with your TV brand, model and the problem you see. Our team will discuss the fault and the next step with you."
        breadcrumbs={[{ name: "Contact Us", href: "/contact-us" }]}
        size="compact"
      />
      <section className="section">
        <div className="container grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-14">
          <div className="space-y-8">
            <ContactCard />
            <ServiceAreasBlock showHeading />
          </div>
          <aside className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card lg:sticky lg:top-24">
            <div className="border-b border-brand-100 bg-brand-50/70 px-6 py-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-accent-600">Quickest way</p>
              <h2 className="mt-1 text-[21px]">Talk to a technician</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">Tell us your TV brand, model and what it is doing. Photos or a short video on WhatsApp help.</p>
            </div>
            <div className="space-y-2.5 p-6">
              <CallButton className="w-full" label="Call Now" />
              <CallButton className="w-full" secondary label="Call Alternate Number" />
              <WhatsAppButton className="w-full" booking label="Book on WhatsApp" />
              <SmsButton className="w-full" label="Send SMS" />
              <Link href="/book-repair" className="btn-accent w-full">
                <CalendarCheck className="h-4 w-4" aria-hidden /> All booking options
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
