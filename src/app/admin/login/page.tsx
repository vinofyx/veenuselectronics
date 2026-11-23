import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

const ERRORS: Record<string, string> = {
  unauthorised: "Your account does not have admin access, or your session expired.",
  config: "Supabase is not configured. Set the environment variables (see docs/ENVIRONMENT.md).",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const sp = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="font-display text-2xl font-bold text-brand-800">Veenus Electronics</p>
          <p className="text-sm text-slate-500">Staff sign in</p>
        </div>
        {sp.error && ERRORS[sp.error] && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {ERRORS[sp.error]}
          </p>
        )}
        <LoginForm next={sp.next ?? "/admin"} />
        <p className="mt-6 text-center text-xs text-slate-500">Accounts are created by the administrator. There is no public sign-up.</p>
      </div>
    </main>
  );
}
