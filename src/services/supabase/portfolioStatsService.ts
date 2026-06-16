import { supabase } from "./supabaseClient";
import type { PortfolioStatRow } from "../../types/database";

export async function getPortfolioStats(): Promise<PortfolioStatRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_stats")
    .select("*")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
