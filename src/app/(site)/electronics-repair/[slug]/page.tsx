import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { electronics, getElectronicsService } from "@/content/electronics";
import { buildMetadata } from "@/lib/seo";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";
import { LandingTemplate } from "@/components/LandingTemplate";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return electronics.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getElectronicsService(slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/electronics-repair/${slug}` });
}

export default async function ElectronicsPage({ params }: Params) {
  const { slug } = await params;
  const page = getElectronicsService(slug);
  if (!page) notFound();
  // Equipment switched off in Admin -> Business is not offered.
  if (!isPathOffered(await getBusiness(), `/electronics-repair/${page.slug}`)) notFound();
  return (
    <LandingTemplate
      page={page}
      basePath="/electronics-repair"
      variant="electronics"
      breadcrumbs={[
        { name: "Other Electronics", href: "/electronics-repair" },
        { name: page.title, href: `/electronics-repair/${page.slug}` },
      ]}
    />
  );
}
