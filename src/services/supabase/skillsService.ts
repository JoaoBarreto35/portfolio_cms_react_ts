import { supabase } from "./supabaseClient";
import type { SkillRow } from "../../types/database";

export async function getSkills(): Promise<SkillRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
