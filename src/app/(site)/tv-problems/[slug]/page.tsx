import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTvProblem, tvProblems } from "@/content/tv-problems";
import { buildMetadata } from "@/lib/seo";
import { LandingTemplate } from "@/components/LandingTemplate";
import { SafetyNotice } from "@/components/blocks";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tvProblems.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getTvProblem(slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/tv-problems/${slug}` });
}

export default async function TvProblemPage({ params }: Params) {
  const { slug } = await params;
  const page = getTvProblem(slug);
  if (!page) notFound();
  return (
    <LandingTemplate
      page={page}
      basePath="/tv-problems"
      breadcrumbs={[
        { name: "TV Problems", href: "/tv-problems" },
        { name: page.title, href: `/tv-problems/${page.slug}` },
      ]}
      notices={<SafetyNotice />}
      formTitle="Get this problem checked"
    />
  );
}
