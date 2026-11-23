import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getPost } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { CheckList, CtaBanner, PageHero } from "@/components/blocks";
import { JsonLd } from "@/components/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({ title: post.title, description: post.description, path: `/blog/${slug}`, localise: false, type: "article" });
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  return (
    <>
      <JsonLd data={articleSchema({ title: post.title, description: post.description, path, date: post.date })} />
      <PageHero
        title={post.title}
        intro={post.description}
        breadcrumbs={[
          { name: "Guides", href: "/blog" },
          { name: post.title, href: path },
        ]}
        showCtas={false}
      />
      <article className="section">
        <div className="container max-w-3xl space-y-10">
          <p className="text-sm text-slate-500">
            Published <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</time> &middot;{" "}
            {post.readingMinutes} min read
          </p>
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-3 text-xl font-bold sm:text-2xl">{s.heading}</h2>
              {s.body && <p className="mb-4 leading-relaxed text-slate-700">{s.body}</p>}
              {s.bullets && <CheckList items={s.bullets} />}
            </section>
          ))}
          <div className="card p-6">
            <p className="font-semibold text-brand-800">Related</p>
            <ul className="mt-2 space-y-1">
              {post.related.map((r) => (
                <li key={r}>
                  <Link href={r} className="text-brand underline">
                    {r.split("/").filter(Boolean).pop()?.replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
      <CtaBanner />
    </>
  );
}
