import "server-only";
import { unstable_cache } from "next/cache";
import { isSupabaseConfigured, supabaseAdmin } from "./supabase/admin";

export type ServiceArea = { id: string; area_name: string; city: string };

/** Active, verified service areas managed from the admin dashboard. Cached for 1 hour. */
export const getServiceAreas = unstable_cache(
  async (): Promise<ServiceArea[]> => {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabaseAdmin()
        .from("service_areas")
        .select("id, area_name, city")
        .eq("active", true)
        .order("city")
        .order("area_name");
      if (error) throw error;
      return data ?? [];
    } catch (e) {
      console.error("getServiceAreas failed", e);
      return [];
    }
  },
  ["service-areas"],
  { revalidate: 3600, tags: ["service-areas"] },
);
