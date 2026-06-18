import { supabase } from "./supabaseClient";
import type { ProjectTechnologyRow } from "../../types/database";

export async function getProjectTechnologiesByProjectId(
  projectId: string
): Promise<ProjectTechnologyRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("project_technologies")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function syncProjectTechnologies(
  projectId: string,
  technologyIds: string[]
): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error: deleteError } = await supabase
    .from("project_technologies")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (technologyIds.length === 0) {
    return;
  }

  const rows = technologyIds.map((technologyId, index) => ({
    project_id: projectId,
    technology_id: technologyId,
    order_index: index + 1,
    is_visible: true,
  }));

  const { error: insertError } = await supabase
    .from("project_technologies")
    .insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }
}