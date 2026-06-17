import { supabase } from "./supabaseClient";
import type { SiteSettingsRow } from "../../types/database";

export interface UpdateSiteSettingsInput {
  name: string;
  headline: string;
  subtitle: string | null;
  bio: string | null;

  email: string | null;
  phone: string | null;
  city: string | null;

  github_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;
  resume_url: string | null;

  profile_image_url: string | null;

  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

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

export async function updateSiteSettings(
  siteSettingsId: string,
  values: UpdateSiteSettingsInput
): Promise<SiteSettingsRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("site_settings")
    .update(values)
    .eq("id", siteSettingsId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
