import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { StatusBadge, fmtDate } from "./StatusBadge";

export const metadata = { title: "Dashboard" };

const WIDGETS: { label: string; statuses: string[] | null; tone: string }[] = [
  { label: "Total Enquiries", statuses: null, tone: "text-brand-800" },
  { label: "New Enquiries", statuses: ["New"], tone: "text-blue-700" },
  { label: "Contacted Customers", statuses: ["Contacted"], tone: "text-indigo-700" },
  { label: "Inspection Pending", statuses: ["Inspection Scheduled", "Diagnosing"], tone: "text-purple-700" },
  { label: "Estimates Sent", statuses: ["Estimate Sent"], tone: "text-orange-700" },
  { label: "Repairs In Progress", statuses: ["Approved", "Repairing"], tone: "text-yellow-700" },
  { label: "Completed Repairs", statuses: ["Completed", "Delivered"], tone: "text-green-700" },
  { label: "Cancelled Requests", statuses: ["Cancelled"], tone: "text-gray-600" },
];

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { supabase, staff } = await requireStaff();
  const sp = await searchParams;

  const counts = await Promise.all(
    WIDGETS.map(async (w) => {
      let q = supabase.from("repair_enquiries").select("id", { count: "exact", head: true });
      if (w.statuses) q = q.in("status", w.statuses);
      const { count } = await q;
      return count ?? 0;
    }),
  );

  const { data: recent } = await supabase
    .from("repair_enquiries")
    .select("id, enquiry_number, customer_name, mobile_number, equipment_type, brand, problem, status, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {staff.name.split(" ")[0]}</h1>
        <p className="text-sm text-slate-600">Overview of repair enquiries.</p>
      </div>
      {sp.error === "forbidden" && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">That section is available to administrators only.</p>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {WIDGETS.map((w, i) => (
          <Link
            key={w.label}
            href={w.statuses ? `/admin/enquiries?status=${encodeURIComponent(w.statuses[0])}` : "/admin/enquiries"}
            className="card-hover p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{w.label}</p>
            <p className={`mt-2 font-display text-3xl font-bold ${w.tone}`}>{counts[i]}</p>
          </Link>
        ))}
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-100 px-5 py-4">
          <h2 className="text-lg font-semibold">Latest enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Enquiry</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">Problem</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {(recent ?? []).map((e) => (
                <tr key={e.id} className="hover:bg-surface">
                  <td className="px-5 py-3 font-mono text-xs">
                    <Link href={`/admin/enquiries/${e.id}`} className="font-semibold text-brand hover:underline">
                      {e.enquiry_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium">{e.customer_name}</div>
                    <div className="text-xs text-slate-500">{e.mobile_number}</div>
                  </td>
                  <td className="px-5 py-3">{[e.brand, e.equipment_type].filter(Boolean).join(" ") || "-"}</td>
                  <td className="px-5 py-3">{e.problem ?? "-"}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{fmtDate(e.created_at)}</td>
                </tr>
              ))}
              {(!recent || recent.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
