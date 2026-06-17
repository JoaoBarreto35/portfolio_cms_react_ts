import { supabase } from "./supabaseClient";
import type { ProjectCategoryRow } from "../../types/database";

export async function getProjectCategories(): Promise<ProjectCategoryRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("project_categories")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}