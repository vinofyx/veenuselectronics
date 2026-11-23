import { NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase/admin";
import { clientIp, hashIp, isSameOrigin } from "@/lib/security";
import { notifyNewEnquiry } from "@/lib/notify";
import { MAX_TOTAL_UPLOAD_BYTES } from "@/lib/constants";
import { submitEnquiry, type EnquiryDeps } from "@/lib/enquiry-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = MAX_TOTAL_UPLOAD_BYTES + 400_000;

const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/** Supabase-backed implementation of the enquiry service's data layer (service role, server only). */
function supabaseDeps(): EnquiryDeps {
  const db = supabaseAdmin();
  return {
    async countSince(ipHash, since) {
      const { data, error } = await db.rpc("enquiry_count_since", { p_ip_hash: ipHash, p_since: since.toISOString() });
      if (error) throw error;
      return Number(data ?? 0);
    },
    async findDuplicate({ mobile, equipment, problem, since }) {
      let q = db.from("repair_enquiries").select("enquiry_number").eq("mobile_number", mobile).gte("created_at", since.toISOString());
      q = equipment ? q.eq("equipment_type", equipment) : q.is("equipment_type", null);
      q = problem ? q.eq("problem", problem) : q.is("problem", null);
      const { data } = await q.order("created_at", { ascending: false }).limit(1);
      return data && data.length ? (data[0].enquiry_number as string) : null;
    },
    async insertEnquiry(row) {
      const { data, error } = await db.from("repair_enquiries").insert(row).select("id, enquiry_number").single();
      if (error || !data) throw error ?? new Error("insert returned no row");
      return { id: data.id as string, enquiry_number: data.enquiry_number as string };
    },
    async uploadPhoto(path, bytes, contentType) {
      const { error } = await db.storage.from("repair-photos").upload(path, bytes, { contentType, upsert: false });
      if (error) console.error("Photo upload failed", error);
      return !error;
    },
    async insertPhoto(enquiryId, path) {
      const { error } = await db.from("repair_photos").insert({ enquiry_id: enquiryId, file_url: path });
      return !error;
    },
    async notify(s) {
      await notifyNewEnquiry({
        id: s.id,
        enquiry_number: s.enquiry_number,
        customer_name: s.customer_name,
        mobile_number: s.mobile_number,
        location: s.location,
        equipment_type: s.equipment_type,
        brand: s.brand,
        model_number: s.model_number,
        problem: s.problem,
        problem_description: s.problem_description,
        service_type: s.service_type,
        preferred_date: s.preferred_date,
        photoCount: s.photoCount,
      });
    },
  };
}

export async function POST(req: Request) {
  if (!isSameOrigin(req.headers)) return fail(403, "Invalid request origin.");
  if (!isSupabaseConfigured()) return fail(503, "Enquiries are temporarily unavailable. Please call or WhatsApp us.");

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) return fail(413, "Upload too large. Please attach fewer or smaller photos.");

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "Invalid form submission.");
  }

  try {
    const result = await submitEnquiry(form, hashIp(clientIp(req.headers)), supabaseDeps());
    return NextResponse.json(result.body, { status: result.status });
  } catch (e) {
    console.error("Enquiry submission failed", e);
    return fail(500, "We couldn't save your enquiry. Please try again or contact us directly.");
  }
}
