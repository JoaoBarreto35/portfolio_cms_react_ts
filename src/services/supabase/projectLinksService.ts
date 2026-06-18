import { supabase } from "./supabaseClient";
import type { ProjectLinkRow } from "../../types/database";

export interface ProjectLinkInput {
  project_id: string;
  label: string;
  url: string;
  link_type: string;
  icon_name: string | null;
  order_index: number;
  is_visible: boolean;
}

export async function getProjectLinksByProjectId(
  projectId: string
): Promise<ProjectLinkRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("project_links")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createProjectLink(
  values: ProjectLinkInput
): Promise<ProjectLinkRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("project_links")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProjectLink(
  projectLinkId: string,
  values: ProjectLinkInput
): Promise<ProjectLinkRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("project_links")
    .update(values)
    .eq("id", projectLinkId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteProjectLink(projectLinkId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("project_links")
    .delete()
    .eq("id", projectLinkId);

  if (error) {
    throw new Error(error.message);
  }
}
