import { getGeneralFaqs } from "@/content/faqs";
import { getBusiness } from "@/lib/business";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, FaqList, PageHero } from "@/components/blocks";

export const generateMetadata = () => buildMetadata({
  title: "TV Repair FAQ",
  description: "Answers to common questions about TV repair: estimates, home visits, brands, cracked screens, warranty and more.",
  path: "/faq",
});

export default async function FaqPage() {
  const b = await getBusiness();
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        intro="Answers to the questions customers ask us most often."
        breadcrumbs={[{ name: "FAQ", href: "/faq" }]}
      />
      <section className="section">
        <div className="container max-w-4xl">
          <FaqList faqs={getGeneralFaqs(b)} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
