import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { StatusBadge, fmtDate, fmtINR } from "../../StatusBadge";
import { UpdateForm } from "./UpdateForm";

export const metadata = { title: "Enquiry details" };

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireStaff();

  const [{ data: e }, { data: photos }, { data: history }, { data: staffList }] = await Promise.all([
    supabase.from("repair_enquiries").select("*").eq("id", id).maybeSingle(),
    supabase.from("repair_photos").select("id, file_url, created_at").eq("enquiry_id", id).order("created_at"),
    supabase
      .from("repair_status_history")
      .select("id, old_status, new_status, created_at, admin_users(name)")
      .eq("enquiry_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("admin_users").select("name").eq("active", true).order("name"),
  ]);
  if (!e) notFound();

  // Signed URLs for private photos (valid 1 hour, generated with the staff session - RLS applies)
  let photoUrls: { id: string; url: string }[] = [];
  if (photos && photos.length) {
    const { data: signed } = await supabase.storage.from("repair-photos").createSignedUrls(
      photos.map((p) => p.file_url),
      3600,
    );
    photoUrls = (signed ?? [])
      .map((s, i) => ({ id: photos[i].id as string, url: s.signedUrl ?? "" }))
      .filter((p) => p.url);
  }

  const waText = `Hello ${e.customer_name}, this is Veenus Electronics regarding your repair enquiry ${e.enquiry_number}.`;
  const details: [string, string | null][] = [
    ["Mobile", e.mobile_number],
    ["Email", e.email],
    ["Location", e.location],
    ["Service type", e.service_type],
    ["Equipment", e.equipment_type],
    ["Brand", e.brand],
    ["Model number", e.model_number],
    ["Screen size", e.screen_size],
    ["Problem", e.problem],
    ["Preferred date", e.preferred_date ? fmtDate(e.preferred_date, false) : null],
    ["Submitted from", e.source_page],
    ["Received", fmtDate(e.created_at)],
    ["Last updated", fmtDate(e.updated_at)],
    ["Estimated cost", e.estimated_cost !== null ? fmtINR(Number(e.estimated_cost)) : null],
    ["Final cost", e.final_cost !== null ? fmtINR(Number(e.final_cost)) : null],
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
        <ArrowLeft className="h-4 w-4" /> All enquiries
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-slate-500">{e.enquiry_number}</p>
          <h1 className="text-2xl font-bold">{e.customer_name}</h1>
          <div className="mt-2">
            <StatusBadge status={e.status} />
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${e.mobile_number}`} className="btn-primary py-2 text-sm">
            <Phone className="h-4 w-4" /> Call
          </a>
          <a
            href={`https://wa.me/${String(e.mobile_number).replace(/\D/g, "")}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp py-2 text-sm"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-4 text-lg font-semibold">Customer &amp; device</h2>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {details.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="break-words text-sm">{v || "-"}</dd>
                </div>
              ))}
            </dl>
            {e.problem_description && (
              <div className="mt-5 border-t border-brand-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer description</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{e.problem_description}</p>
              </div>
            )}
          </section>

          <section className="card p-5">
            <h2 className="mb-4 text-lg font-semibold">Photos ({photoUrls.length})</h2>
            {photoUrls.length === 0 ? (
              <p className="text-sm text-slate-500">No photos uploaded.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photoUrls.map((p, i) => (
                  <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-lg border border-brand-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={`Customer photo ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                  </a>
                ))}
              </div>
            )}
            <p className="mt-3 text-xs text-slate-500">Photo links expire after 1 hour. Refresh the page to view again.</p>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 text-lg font-semibold">Status history</h2>
            <ol className="space-y-3">
              {(history ?? []).map((h) => {
                const by = (h as { admin_users?: { name?: string } | null }).admin_users?.name;
                return (
                  <li key={h.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="w-40 text-xs text-slate-500">{fmtDate(h.created_at)}</span>
                    {h.old_status ? (
                      <>
                        <StatusBadge status={h.old_status} /> <span aria-hidden>&rarr;</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500">Created as</span>
                    )}
                    <StatusBadge status={h.new_status} />
                    {by && <span className="text-xs text-slate-500">by {by}</span>}
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <UpdateForm
            enquiry={{
              id: e.id,
              status: e.status,
              assigned_technician: e.assigned_technician ?? "",
              diagnosis: e.diagnosis ?? "",
              estimated_cost: e.estimated_cost !== null ? String(e.estimated_cost) : "",
              final_cost: e.final_cost !== null ? String(e.final_cost) : "",
              parts_used: e.parts_used ?? "",
              warranty_details: e.warranty_details ?? "",
              internal_notes: e.internal_notes ?? "",
            }}
            technicians={(staffList ?? []).map((s) => s.name as string)}
          />
        </aside>
      </div>
    </div>
  );
}
