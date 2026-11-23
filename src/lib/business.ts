import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { envBusiness, mergeBusiness, type Business, type BusinessSettingsRow } from "@/config/business";
import { isSupabaseConfigured, supabaseAdmin } from "./supabase/admin";

export const BUSINESS_TAG = "business";

const loadRow = unstable_cache(
  async (): Promise<BusinessSettingsRow | null> => {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabaseAdmin().from("business_settings").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return (data as BusinessSettingsRow | null) ?? null;
    } catch (e) {
      console.error("business_settings load failed - using environment values", e);
      return null;
    }
  },
  ["business-settings"],
  { revalidate: 3600, tags: [BUSINESS_TAG] },
);

/**
 * Current business details (admin settings merged over env fallbacks).
 * Cached across requests; refreshed immediately when an admin saves (revalidateTag).
 */
export const getBusiness = cache(async (): Promise<Business> => mergeBusiness(envBusiness(), await loadRow()));
