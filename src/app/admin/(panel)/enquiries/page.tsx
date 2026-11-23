import Link from "next/link";
import { Download, MessageCircle, Phone, Search } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { BRANDS, EQUIPMENT_TYPES, STATUSES } from "@/lib/constants";
import { applyFilters, cleanFilters, filtersToSearch, type EnquiryFilters } from "@/lib/enquiry-filters";
import { quickStatus } from "../../actions";
import { StatusBadge, fmtDate } from "../StatusBadge";

export const metadata = { title: "Enquiries" };

const PAGE_SIZE = 25;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<EnquiryFilters> }) {
  const { supabase, staff } = await requireStaff();
  const f = cleanFilters(await searchParams);

  const fromIdx = (f.page - 1) * PAGE_SIZE;
  const query = applyFilters(
    supabase
      .from("repair_enquiries")
      .select("id, enquiry_number, customer_name, mobile_number, location, equipment_type, brand, problem, service_type, status, assigned_technician, created_at", {
        count: "exact",
      }),
    f,
  )
    .order("created_at", { ascending: false })
    .range(fromIdx, fromIdx + PAGE_SIZE - 1);

  const { data: rows, count, error } = await query;
  const total = count ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Repair enquiries</h1>
          <p className="text-sm text-slate-600">{total} result{total === 1 ? "" : "s"}</p>
        </div>
        {staff.role === "admin" && (
          <a href={`/api/admin/export${filtersToSearch(f, { page: 1 })}`} className="btn-outline py-2 text-sm">
            <Download className="h-4 w-4" /> Export CSV
          </a>
        )}
      </div>

      <form className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6" method="get">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input name="q" defaultValue={f.q} placeholder="Name, phone or enquiry ID" className="input pl-9" aria-label="Search" />
        </div>
        <select name="status" defaultValue={f.status} className="input" aria-label="Status">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select name="equipment" defaultValue={f.equipment} className="input" aria-label="Repair category">
          <option value="">All categories</option>
          {EQUIPMENT_TYPES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select name="brand" defaultValue={f.brand} className="input" aria-label="Brand">
          <option value="">All brands</option>
          {BRANDS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1 py-2 text-sm">
            Filter
          </button>
          <Link href="/admin/enquiries" className="btn-outline py-2 text-sm">
            Reset
          </Link>
        </div>
        <label className="text-xs text-slate-600 lg:col-span-1">
          From
          <input type="date" name="from" defaultValue={f.from} className="input mt-1" />
        </label>
        <label className="text-xs text-slate-600 lg:col-span-1">
          To
          <input type="date" name="to" defaultValue={f.to} className="input mt-1" />
        </label>
      </form>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Could not load enquiries: {error.message}</p>}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Enquiry</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Device</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {(rows ?? []).map((e) => (
              <tr key={e.id} className="align-top hover:bg-surface">
                <td className="px-4 py-3">
                  <Link href={`/admin/enquiries/${e.id}`} className="font-mono text-xs font-semibold text-brand hover:underline">
                    {e.enquiry_number}
                  </Link>
                  <div className="mt-1 text-xs text-slate-500">{fmtDate(e.created_at)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{e.customer_name}</div>
                  <div className="text-xs text-slate-500">{e.mobile_number}</div>
                  <div className="text-xs text-slate-500">{e.location}</div>
                </td>
                <td className="px-4 py-3">
                  {[e.brand, e.equipment_type].filter(Boolean).join(" ") || "-"}
                  {e.service_type && <div className="text-xs text-slate-500">{e.service_type}</div>}
                </td>
                <td className="px-4 py-3">{e.problem ?? "-"}</td>
                <td className="px-4 py-3">{e.assigned_technician ?? <span className="text-slate-400">Unassigned</span>}</td>
                <td className="px-4 py-3">
                  <form action={quickStatus} className="flex flex-col gap-1">
                    <input type="hidden" name="id" value={e.id} />
                    <StatusBadge status={e.status} />
                    <div className="flex gap-1">
                      <select name="status" defaultValue={e.status} className="rounded border border-brand-100 px-1 py-0.5 text-xs" aria-label="Change status">
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <button type="submit" className="rounded bg-brand px-2 text-xs text-white">
                        Set
                      </button>
                    </div>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <a href={`tel:${e.mobile_number}`} className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand" aria-label={`Call ${e.customer_name}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://wa.me/${e.mobile_number.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${e.customer_name}, this is Veenus Electronics regarding your repair enquiry ${e.enquiry_number}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-8 w-8 place-items-center rounded-lg bg-green-50 text-green-700"
                      aria-label={`WhatsApp ${e.customer_name}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {rows && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  No enquiries match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="flex items-center justify-between text-sm" aria-label="Pagination">
          <span className="text-slate-600">
            Page {f.page} of {pages}
          </span>
          <div className="flex gap-2">
            {f.page > 1 && (
              <Link href={`/admin/enquiries${filtersToSearch(f, { page: f.page - 1 })}`} className="btn-outline py-2 text-sm">
                Previous
              </Link>
            )}
            {f.page < pages && (
              <Link href={`/admin/enquiries${filtersToSearch(f, { page: f.page + 1 })}`} className="btn-outline py-2 text-sm">
                Next
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
