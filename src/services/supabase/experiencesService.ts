import { supabase } from "./supabaseClient";
import type { ExperienceRow } from "../../types/database";

export interface ExperienceInput {
  company: string;
  role: string;
  employment_type: string | null;
  location: string | null;

  start_date: string;
  end_date: string | null;
  is_current: boolean;

  description: string | null;
  highlights: string[];
  tools: string[];

  order_index: number;
  is_published: boolean;
}

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

export async function getAdminExperiences(): Promise<ExperienceRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createExperience(
  values: ExperienceInput
): Promise<ExperienceRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("experiences")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateExperience(
  experienceId: string,
  values: ExperienceInput
): Promise<ExperienceRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("experiences")
    .update(values)
    .eq("id", experienceId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteExperience(experienceId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("experiences")
    .delete()
    .eq("id", experienceId);

  if (error) {
    throw new Error(error.message);
  }
}
