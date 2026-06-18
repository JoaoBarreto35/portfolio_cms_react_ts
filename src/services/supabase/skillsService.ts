import { supabase } from "./supabaseClient";
import type { SkillRow } from "../../types/database";

export interface SkillInput {
  name: string;
  slug: string;
  group_name: string;
  description: string | null;

  level_label: string | null;
  level_value: number | null;

  icon_name: string | null;
  color: string;

  order_index: number;
  is_published: boolean;
}

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

export async function getAdminSkills(): Promise<SkillRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("group_name", { ascending: true })
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createSkill(values: SkillInput): Promise<SkillRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("skills")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateSkill(
  skillId: string,
  values: SkillInput
): Promise<SkillRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("skills")
    .update(values)
    .eq("id", skillId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteSkill(skillId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase.from("skills").delete().eq("id", skillId);

  if (error) {
    throw new Error(error.message);
  }
}