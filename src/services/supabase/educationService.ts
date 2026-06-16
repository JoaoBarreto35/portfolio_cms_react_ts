import { supabase } from "./supabaseClient";
import type { EducationRow } from "../../types/database";

export async function getEducationItems(): Promise<EducationRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("education")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
