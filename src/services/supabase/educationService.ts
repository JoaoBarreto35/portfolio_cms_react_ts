import { supabase } from "./supabaseClient";
import type { EducationRow } from "../../types/database";

export interface EducationInput {
  title: string;
  institution: string;
  education_type: string | null;

  start_date: string | null;
  end_date: string | null;
  is_current: boolean;

  description: string | null;
  certificate_url: string | null;

  order_index: number;
  is_published: boolean;
}

export async function getEducation(): Promise<EducationRow[]> {
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

export async function getAdminEducation(): Promise<EducationRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createEducation(
  values: EducationInput
): Promise<EducationRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("education")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateEducation(
  educationId: string,
  values: EducationInput
): Promise<EducationRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("education")
    .update(values)
    .eq("id", educationId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteEducation(educationId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("education")
    .delete()
    .eq("id", educationId);

  if (error) {
    throw new Error(error.message);
  }
}