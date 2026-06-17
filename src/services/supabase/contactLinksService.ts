import { supabase } from "./supabaseClient";
import type { ContactLinkRow } from "../../types/database";

export interface ContactLinkInput {
  label: string;
  description: string | null;
  href: string;
  contact_type: string;
  icon_name: string | null;
  color: string;
  order_index: number;
  is_published: boolean;
}

export async function getContactLinks(): Promise<ContactLinkRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("contact_links")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAdminContactLinks(): Promise<ContactLinkRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("contact_links")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createContactLink(
  values: ContactLinkInput
): Promise<ContactLinkRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("contact_links")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateContactLink(
  contactLinkId: string,
  values: ContactLinkInput
): Promise<ContactLinkRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("contact_links")
    .update(values)
    .eq("id", contactLinkId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteContactLink(contactLinkId: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("contact_links")
    .delete()
    .eq("id", contactLinkId);

  if (error) {
    throw new Error(error.message);
  }
}
