import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BarChart3, Building2, ExternalLink, LayoutDashboard, ListChecks, LogOut, Settings } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Veenus Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { staff } = await requireStaff();
  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/enquiries", label: "Enquiries", icon: ListChecks },
    ...(staff.role === "admin"
      ? [
          { href: "/admin/reports", label: "Reports", icon: BarChart3 },
          { href: "/admin/business", label: "Business", icon: Building2 },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ]
      : []),
  ];
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-brand-100 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <Link href="/admin" className="font-display font-bold text-brand-800">
            Veenus <span className="text-accent-600">Admin</span>
          </Link>
          <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label="Admin">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">
                <n.icon className="h-4 w-4" aria-hidden /> <span className="hidden sm:inline">{n.label}</span>
              </Link>
            ))}
          </nav>
          <Link href="/" target="_blank" className="hidden items-center gap-1 text-sm text-slate-500 hover:text-brand md:flex">
            View site <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <span className="hidden text-sm text-slate-600 lg:inline">
            {staff.name} <span className="rounded bg-brand-50 px-1.5 py-0.5 text-xs uppercase text-brand">{staff.role}</span>
          </span>
          <form action={signOut}>
            <button type="submit" className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-brand-50" aria-label="Sign out">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
