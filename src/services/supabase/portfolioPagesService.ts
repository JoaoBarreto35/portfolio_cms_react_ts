import { supabase } from "./supabaseClient";
import type {
  PortfolioPageHighlightRow,
  PortfolioPageRow,
} from "../../types/database";

export async function getPortfolioPages(): Promise<PortfolioPageRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_pages")
    .select("*")
    .eq("is_published", true)
    .neq("slug", "home")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPortfolioPageBySlug(
  slug: string
): Promise<PortfolioPageRow | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("portfolio_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPortfolioPageHighlights(
  pageId: string
): Promise<PortfolioPageHighlightRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_page_highlights")
    .select("*")
    .eq("page_id", pageId)
    .eq("is_visible", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
export interface PortfolioPageInput {
  eyebrow: string;
  title: string;
  description: string;
  order_index: number;
  is_active: boolean;
}

export async function getAdminPortfolioPages(): Promise<PortfolioPageRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_pages")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function updatePortfolioPage(
  portfolioPageId: string,
  values: PortfolioPageInput
): Promise<PortfolioPageRow> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { data, error } = await supabase
    .from("portfolio_pages")
    .update(values)
    .eq("id", portfolioPageId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
