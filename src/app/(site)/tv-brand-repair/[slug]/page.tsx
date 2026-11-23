import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { brands, getBrand } from "@/content/brands";
import { buildMetadata } from "@/lib/seo";
import { getBusiness } from "@/lib/business";
import { LandingTemplate } from "@/components/LandingTemplate";
import { BrandDisclaimer } from "@/components/blocks";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getBrand(slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/tv-brand-repair/${slug}` });
}

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const page = getBrand(slug);
  if (!page) notFound();
  // Brands switched off in Admin → Business details are not offered.
  if (!(await getBusiness()).brands.includes(page.brand)) notFound();
  return (
    <LandingTemplate
      page={page}
      basePath="/tv-brand-repair"
      breadcrumbs={[
        { name: "Brands We Repair", href: "/tv-brand-repair" },
        { name: page.title, href: `/tv-brand-repair/${page.slug}` },
      ]}
      notices={<BrandDisclaimer brand={page.brand} />}
      formTitle={`${page.brand} TV repair enquiry`}
    />
  );
}
