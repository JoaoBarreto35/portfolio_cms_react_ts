import { supabase } from "./supabaseClient";
import type { PortfolioPageRow } from "../../types/database";

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
