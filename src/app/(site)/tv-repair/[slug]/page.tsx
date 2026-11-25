import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTvService, tvServices } from "@/content/tv-services";
import { buildMetadata } from "@/lib/seo";
import { getBusiness } from "@/lib/business";
import { isPathOffered } from "@/config/business";
import { LandingTemplate } from "@/components/LandingTemplate";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tvServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getTvService(slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/tv-repair/${slug}` });
}

export default async function TvServicePage({ params }: Params) {
  const { slug } = await params;
  const page = getTvService(slug);
  if (!page) notFound();
  // Equipment switched off in Admin -> Business is not offered.
  if (!isPathOffered(await getBusiness(), `/tv-repair/${page.slug}`)) notFound();
  return (
    <LandingTemplate
      page={page}
      basePath="/tv-repair"
      variant="service"
      breadcrumbs={[
        { name: "TV Repair", href: "/tv-repair" },
        { name: page.title, href: `/tv-repair/${page.slug}` },
      ]}
    />
  );
}
