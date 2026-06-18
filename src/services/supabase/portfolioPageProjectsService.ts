import { supabase } from "./supabaseClient";
import type { PortfolioPageProjectRow } from "../../types/database";

export async function getPortfolioPageProjectsByPageId(
  pageId: string
): Promise<PortfolioPageProjectRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_page_projects")
    .select("*")
    .eq("page_id", pageId)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function syncPortfolioPageProjects(
  pageId: string,
  projectIds: string[]
): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase não está configurado.");
  }

  const { error: deleteError } = await supabase
    .from("portfolio_page_projects")
    .delete()
    .eq("page_id", pageId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (projectIds.length === 0) {
    return;
  }

  const rows = projectIds.map((projectId, index) => ({
    page_id: pageId,
    project_id: projectId,
    order_index: index + 1,
    is_visible: true,
  }));

  const { error: insertError } = await supabase
    .from("portfolio_page_projects")
    .insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }
}
