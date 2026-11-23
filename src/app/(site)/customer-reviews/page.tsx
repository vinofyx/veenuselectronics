import { buildMetadata } from "@/lib/seo";
import { CtaBanner, PageHero } from "@/components/blocks";
import { ReviewsBlock } from "@/components/sections";

export const generateMetadata = () => buildMetadata({
  title: "Customer Reviews",
  description: "Genuine reviews from Veenus Electronics customers. We only publish real, verified customer reviews.",
  path: "/customer-reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        title="Customer Reviews"
        intro="We only publish genuine reviews from real customers."
        breadcrumbs={[{ name: "Customer Reviews", href: "/customer-reviews" }]}
        showCtas={false}
      />
      <section className="section">
        <div className="container">
          <ReviewsBlock />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
