import { supabase } from "./supabaseClient";
import type { ExperienceRow } from "../../types/database";

export async function getExperiences(): Promise<ExperienceRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
