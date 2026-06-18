import { supabase } from "./supabaseClient";
import type { PortfolioPageHighlightRow } from "../../types/database";

export interface PortfolioPageHighlightInput {
  page_id: string;

  label: string;
  description: string | null;

  icon_name: string | null;
  color: string;

  order_index: number;
  is_visible: boolean;
}

export async function getPortfolioPageHighlightsByPageId(
  pageId: string
): Promise<PortfolioPageHighlightRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_page_highlights")
    .select("*")
    .eq("page_id", pageId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function createPortfolioPageHighlight(
  values: PortfolioPageHighlightInput
): Promise<PortfolioPageHighlightRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("portfolio_page_highlights")
    .insert(values)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePortfolioPageHighlight(
  highlightId: string,
  values: PortfolioPageHighlightInput
): Promise<PortfolioPageHighlightRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("portfolio_page_highlights")
    .update(values)
    .eq("id", highlightId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePortfolioPageHighlight(
  highlightId: string
): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error } = await supabase
    .from("portfolio_page_highlights")
    .delete()
    .eq("id", highlightId);

  if (error) {
    throw new Error(error.message);
  }
}