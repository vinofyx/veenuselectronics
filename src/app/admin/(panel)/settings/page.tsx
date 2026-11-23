import { requireStaff } from "@/lib/auth";
import { getBusiness } from "@/lib/business";
import { addServiceArea, deleteServiceArea, toggleServiceArea } from "../../actions";
import { fmtDate } from "../StatusBadge";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { supabase } = await requireStaff("admin");
  const business = await getBusiness();
  const [{ data: areas }, { data: staff }] = await Promise.all([
    supabase.from("service_areas").select("id, area_name, city, active").order("city").order("area_name"),
    supabase.from("admin_users").select("id, name, email, role, active, created_at").order("created_at"),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section className="card p-5">
        <h2 className="text-lg font-semibold">Service areas</h2>
        <p className="mb-4 text-sm text-slate-600">
          Only add areas you actually serve. Active areas appear on the website (Service Areas, Contact and Home pages) within an hour.
        </p>
        <form action={addServiceArea} className="mb-5 flex flex-wrap gap-2">
          <input name="area_name" required minLength={2} maxLength={80} placeholder="Area / locality" className="input max-w-xs" aria-label="Area name" />
          <input name="city" required minLength={2} maxLength={60} placeholder="City" defaultValue={business.address.city} className="input max-w-[200px]" aria-label="City" />
          <button type="submit" className="btn-accent py-2 text-sm">
            Add area
          </button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2">Area</th>
                <th className="py-2">City</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {(areas ?? []).map((a) => (
                <tr key={a.id}>
                  <td className="py-2">{a.area_name}</td>
                  <td className="py-2">{a.city}</td>
                  <td className="py-2">{a.active ? <span className="text-green-700">Active</span> : <span className="text-slate-400">Hidden</span>}</td>
                  <td className="py-2">
                    <div className="flex justify-end gap-2">
                      <form action={toggleServiceArea}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="active" value={String(a.active)} />
                        <button className="rounded border border-brand-200 px-2 py-1 text-xs">{a.active ? "Hide" : "Show"}</button>
                      </form>
                      <form action={deleteServiceArea}>
                        <input type="hidden" name="id" value={a.id} />
                        <button className="rounded border border-red-200 px-2 py-1 text-xs text-red-700">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!areas || areas.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-500">
                    No service areas yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-semibold">Staff accounts</h2>
        <p className="mb-4 text-sm text-slate-600">
          To add staff: create the user in Supabase Dashboard &rarr; Authentication &rarr; Users, then add a row to <code>admin_users</code> (see docs/ADMIN_GUIDE.md).
          Roles: <strong>admin</strong> (everything incl. reports, export, settings) and <strong>staff</strong> (view and update enquiries).
        </p>
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Active</th>
              <th className="py-2">Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {(staff ?? []).map((s) => (
              <tr key={s.id}>
                <td className="py-2">{s.name}</td>
                <td className="py-2">{s.email}</td>
                <td className="py-2 uppercase">{s.role}</td>
                <td className="py-2">{s.active ? "Yes" : "No"}</td>
                <td className="py-2 text-xs text-slate-500">{fmtDate(s.created_at, false)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
