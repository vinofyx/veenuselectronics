import Link from "next/link";
import { blogPosts } from "@/content/blog";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner, PageHero } from "@/components/blocks";

export const generateMetadata = () => buildMetadata({
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
      <PageHero title="TV Repair Guides" intro="Practical advice to understand your TV's problem before you call a technician." breadcrumbs={[{ name: "Guides", href: "/blog" }]} showCtas={false} />
      <section className="section">
        <div className="container grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card-hover flex flex-col p-6">
              <p className="text-xs text-slate-500">
                <time dateTime={p.date}>{fmt(p.date)}</time> &middot; {p.readingMinutes} min read
              </p>
              <h2 className="mt-2 text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{p.description}</p>
              <span className="mt-4 text-sm font-semibold text-accent-600">Read guide &rarr;</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
