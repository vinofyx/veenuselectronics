import "server-only";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";
import type { AdminRole } from "./constants";

export type StaffProfile = { id: string; name: string; email: string; role: AdminRole };

/** Returns the signed-in, active staff member - or null. */
export async function getStaff() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, staff: null };
  const { data } = await supabase.from("admin_users").select("id, name, email, role, active").eq("id", user.id).maybeSingle();
  if (!data || !data.active) return { supabase, staff: null };
  return { supabase, staff: { id: data.id, name: data.name, email: data.email, role: data.role } as StaffProfile };
}

/** Use at the top of every admin page and server action. */
export async function requireStaff(role?: AdminRole) {
  const { supabase, staff } = await getStaff();
  if (!staff) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorised");
  }
  if (role === "admin" && staff.role !== "admin") redirect("/admin?error=forbidden");
  return { supabase, staff };
}
