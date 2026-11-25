import Link from "next/link";
import { FileText } from "lucide-react";
import { footerLinks } from "@/config/navigation";

export function LegalNav({ current }: { current: string }) {
  return (
    <nav aria-label="Legal documents" className="lg:sticky lg:top-24">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Legal</p>
      <ul className="flex gap-2 lg:flex-col">
        {footerLinks.legal.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={l.href === current ? "page" : undefined}
              className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-4 text-[14.5px] font-semibold transition-colors ${
                l.href === current ? "bg-brand-800 text-white" : "border border-brand-100 bg-white text-brand-800 hover:border-brand-300"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" aria-hidden /> {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 hidden text-[13.5px] leading-relaxed text-ink-muted lg:block">
        Questions about these terms? <Link href="/contact-us" className="font-semibold text-brand-700 underline underline-offset-4">Contact us</Link>.
      </p>
    </nav>
  );
}
