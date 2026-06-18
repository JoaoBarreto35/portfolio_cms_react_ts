import { supabase } from "./supabaseClient";
import type { ProjectImageRow } from "../../types/database";

export interface ProjectImageInput {
  project_id: string;

  image_url: string;
  alt_text: string;
  caption: string | null;
  image_type: string;

  is_cover: boolean;
  is_visible: boolean;

  order_index: number;
}

async function unsetOtherCoverImages(projectId: string) {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("project_images")
    .update({ is_cover: false })
    .eq("project_id", projectId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getProjectImagesByProjectId(
  projectId: string
): Promise<ProjectImageRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createProjectImage(
  values: ProjectImageInput
): Promise<ProjectImageRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  if (values.is_cover) {
    await unsetOtherCoverImages(values.project_id);
  }

  const { data, error } = await supabase
    .from("project_images")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateProjectImage(
  projectImageId: string,
  values: ProjectImageInput
): Promise<ProjectImageRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  if (values.is_cover) {
    await unsetOtherCoverImages(values.project_id);
  }

  const { data, error } = await supabase
    .from("project_images")
    .update(values)
    .eq("id", projectImageId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteProjectImage(projectImageId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", projectImageId);

  if (error) {
    throw new Error(error.message);
  }
}
