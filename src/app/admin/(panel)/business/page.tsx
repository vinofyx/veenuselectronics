import { requireStaff } from "@/lib/auth";
import type { BusinessSettingsRow } from "@/config/business";
import { BusinessForm } from "./BusinessForm";
import { fmtDate } from "../StatusBadge";

export const metadata = { title: "Business details" };

export default async function BusinessPage() {
  const { supabase } = await requireStaff("admin");
  const { data, error } = await supabase.from("business_settings").select("*, admin_users(name)").eq("id", 1).maybeSingle();
  const row = (data ?? {}) as BusinessSettingsRow & { updated_at?: string; admin_users?: { name?: string } | null };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Business details</h1>
        <p className="text-sm text-slate-600">
          These details appear across the website (header, footer, contact page, call and WhatsApp buttons, structured data).
          Leave a field empty if it is not confirmed - the website hides anything that is not set. Changes go live within a minute.
        </p>
        {row.updated_at && (
          <p className="mt-1 text-xs text-slate-500">
            Last saved {fmtDate(row.updated_at)}
            {row.admin_users?.name ? ` by ${row.admin_users.name}` : ""}
          </p>
        )}
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Could not load settings ({error.message}). Has migration 20261124000000 been applied?
        </p>
      )}
      <BusinessForm row={row} />
    </div>
  );
}
