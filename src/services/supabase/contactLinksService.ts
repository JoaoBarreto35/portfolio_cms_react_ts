import { supabase } from "./supabaseClient";
import type { ContactLinkRow } from "../../types/database";

export async function getContactLinks(): Promise<ContactLinkRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("contact_links")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}