"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { STATUSES } from "@/lib/constants";
import { BUSINESS_TAG } from "@/lib/business";
import { businessFormToObject, businessSettingsSchema } from "@/lib/business-validation";

/* ---------------- Auth ---------------- */
export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(200),
});

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: "Invalid email or password." };

  const { data: staff } = await supabase.from("admin_users").select("active").eq("id", data.user.id).maybeSingle();
  if (!staff?.active) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  const next = String(formData.get("next") ?? "/admin");
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------------- Enquiry update ---------------- */
const money = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : Number(v)))
  .refine((v) => v === null || (Number.isFinite(v) && v >= 0 && v < 10_000_000), "Invalid amount");
const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(STATUSES),
  assigned_technician: text(80),
  diagnosis: text(2000),
  estimated_cost: money,
  final_cost: money,
  parts_used: text(1000),
  warranty_details: text(500),
  internal_notes: text(4000),
});

export type UpdateState = { ok?: boolean; error?: string };

export async function updateEnquiry(_prev: UpdateState, formData: FormData): Promise<UpdateState> {
  const { supabase } = await requireStaff();
  const parsed = updateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  const { id, ...fields } = parsed.data;

  const { error } = await supabase.from("repair_enquiries").update(fields).eq("id", id);
  if (error) {
    console.error("updateEnquiry", error);
    return { error: "Could not save changes. Please try again." };
  }
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { ok: true };
}

/** Quick status change from the list view. */
export async function quickStatus(formData: FormData) {
  const { supabase } = await requireStaff();
  const parsed = z.object({ id: z.string().uuid(), status: z.enum(STATUSES) }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await supabase.from("repair_enquiries").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

/* ---------------- Service areas (admin only) ---------------- */
export async function addServiceArea(formData: FormData) {
  const { supabase } = await requireStaff("admin");
  const parsed = z
    .object({ area_name: z.string().trim().min(2).max(80), city: z.string().trim().min(2).max(60) })
    .safeParse({ area_name: formData.get("area_name"), city: formData.get("city") });
  if (!parsed.success) return;
  await supabase.from("service_areas").upsert({ ...parsed.data, active: true }, { onConflict: "area_name,city" });
  revalidateTag("service-areas");
  revalidatePath("/admin/settings");
}

export async function toggleServiceArea(formData: FormData) {
  const { supabase } = await requireStaff("admin");
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const active = formData.get("active") === "true";
  await supabase.from("service_areas").update({ active: !active }).eq("id", id.data);
  revalidateTag("service-areas");
  revalidatePath("/admin/settings");
}

export async function deleteServiceArea(formData: FormData) {
  const { supabase } = await requireStaff("admin");
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  await supabase.from("service_areas").delete().eq("id", id.data);
  revalidateTag("service-areas");
  revalidatePath("/admin/settings");
}

/* ---------------- Business details (admin only) ---------------- */
export type BusinessState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

const LOGO_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

export async function saveBusinessSettings(_prev: BusinessState, formData: FormData): Promise<BusinessState> {
  const { supabase } = await requireStaff("admin");
  const parsed = businessSettingsSchema.safeParse(businessFormToObject(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: "Please correct the highlighted fields.", fieldErrors };
  }
  const update: Record<string, unknown> = { ...parsed.data };

  // Optional logo upload (PNG/JPG/WEBP up to 1 MB) to the public "site-assets" bucket.
  const logo = formData.get("logo");
  if (logo && typeof logo === "object" && "size" in logo && logo.size > 0) {
    const ext = LOGO_TYPES[logo.type];
    if (!ext) return { error: "Logo must be a PNG, JPG or WEBP image." };
    if (logo.size > 1024 * 1024) return { error: "Logo must be under 1 MB." };
    const path = `logo-${Date.now()}.${ext}`;
    const up = await supabase.storage.from("site-assets").upload(path, logo, { contentType: logo.type, upsert: false });
    if (up.error) {
      console.error("logo upload", up.error);
      return { error: "Logo upload failed. Please try again." };
    }
    update.logo_url = supabase.storage.from("site-assets").getPublicUrl(path).data.publicUrl;
  }
  if (formData.get("remove_logo") === "on") update.logo_url = null;

  const { error } = await supabase.from("business_settings").update(update).eq("id", 1);
  if (error) {
    console.error("saveBusinessSettings", error);
    return { error: "Could not save. Please try again." };
  }
  revalidateTag(BUSINESS_TAG);
  revalidatePath("/", "layout");
  return { ok: true };
}
