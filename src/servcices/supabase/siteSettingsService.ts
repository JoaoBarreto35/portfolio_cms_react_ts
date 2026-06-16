import { supabase } from "./supabaseClient";
import type { SiteSettingsRow } from "../../types/database";

export async function getActiveSiteSettings(): Promise<SiteSettingsRow | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
