import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getPost } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { CheckList, PageHero } from "@/components/blocks";
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
        eyebrow="Repair guide"
        intro={post.description}
        breadcrumbs={[
          { name: "Guides", href: "/blog" },
          { name: post.title, href: path },
        ]}
        showCtas={false}
        size="compact"
      />
      <section className="section">
        <div className="container grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="min-w-0 max-w-3xl space-y-10">
            <p className="text-[14px] text-ink-muted">
              Published <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</time> &middot; {post.readingMinutes} min read
            </p>
            {post.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="mb-3 text-[24px]">{s.heading}</h2>
                {s.body && <p className="mb-4 text-[16.5px] leading-[1.75] text-slate-700">{s.body}</p>}
                {s.bullets && <CheckList items={s.bullets} />}
              </section>
            ))}
          </article>
          <aside className="space-y-5 lg:sticky lg:top-24">
            {post.related.length > 0 && (
              <div className="card p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Related</p>
                <ul className="mt-3 space-y-1">
                  {post.related.map((r) => (
                    <li key={r}>
                      <Link href={r} className="flex min-h-[40px] items-center justify-between gap-2 text-[15px] font-semibold capitalize text-brand-800 hover:text-accent-600">
                        {r.split("/").filter(Boolean).pop()?.replace(/-/g, " ")}
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="panel-dark p-6">
              <p className="font-display text-[18px] font-bold text-white">Need it checked?</p>
              <p className="mt-1.5 text-[14.5px] text-brand-200">A technician can diagnose the fault and give you an estimate.</p>
              <Link href="/book-repair" className="btn-accent mt-5 w-full">
                Book a repair
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
