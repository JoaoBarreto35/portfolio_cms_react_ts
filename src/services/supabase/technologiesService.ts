import { supabase } from "./supabaseClient";
import type { TechnologyRow } from "../../types/database";

export async function getTechnologies(): Promise<TechnologyRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("technologies")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
