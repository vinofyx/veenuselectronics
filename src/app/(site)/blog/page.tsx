import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { blogPosts } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, PageHero } from "@/components/blocks";

export const generateMetadata = () =>
  buildMetadata({
    title: "TV Repair Guides & Tips",
    description: "Practical TV repair guides from Veenus Electronics - diagnose common TV problems safely and protect your TV.",
    path: "/blog",
    localise: false,
  });

const fmt = (d: string) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function BlogIndex() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        title="TV Repair Guides"
        eyebrow="Guides & advice"
        intro="Practical advice to understand your TV's problem before you call a technician."
        breadcrumbs={[{ name: "Guides", href: "/blog" }]}
        showCtas={false}
        size="compact"
      />
      <section className="section">
        <div className="container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card-hover group flex flex-col overflow-hidden">
              <div className="flex flex-1 flex-col p-6">
                <p className="flex items-center gap-2 text-[13px] text-ink-muted">
                  <time dateTime={p.date}>{fmt(p.date)}</time>
                  <span aria-hidden>&middot;</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden /> {p.readingMinutes} min read
                  </span>
                </p>
                <h2 className="mt-3 text-[20px] leading-snug">{p.title}</h2>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{p.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-800 group-hover:text-accent-600">
                  Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
