import { getGeneralFaqs } from "@/content/faqs";
import { getBusiness } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { FaqList, PageHero } from "@/components/blocks";
import { CallButton, WhatsAppButton } from "@/components/CtaButtons";

export const generateMetadata = () =>
  buildMetadata({
    title: "TV Repair FAQ",
    description: "Answers to common questions about TV repair: estimates, home visits, brands, cracked screens, warranty and more.",
    path: "/faq",
  });

export default async function FaqPage() {
  const b = await getBusiness();
  const faqs = getGeneralFaqs(b);
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        eyebrow="Help centre"
        intro="Answers to the questions customers ask us most often."
        breadcrumbs={[{ name: "FAQ", href: "/faq" }]}
        showCtas={false}
        size="compact"
      />
      <section className="section">
        <div className="container grid items-start gap-10 lg:grid-cols-[1fr_340px] xl:gap-14">
          <FaqList faqs={faqs} />
          <aside className="panel-dark relative overflow-hidden p-7 lg:sticky lg:top-24">
            <div className="pointer-events-none absolute inset-0 tech-grid" aria-hidden />
            <div className="relative">
              <h2 className="text-[21px] text-white">Still have a question?</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-brand-200">Describe your TV&apos;s problem and we&apos;ll explain what&apos;s likely wrong and the next step.</p>
              <div className="mt-6 flex flex-col gap-2.5">
                <CallButton variant="onDark" className="w-full" />
                <WhatsAppButton className="w-full" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
