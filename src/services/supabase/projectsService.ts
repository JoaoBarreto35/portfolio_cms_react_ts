import { supabase } from "./supabaseClient";
import type { ProjectSummaryRow } from "../../types/database";

interface ProjectTechnologyQueryResult {
  order_index: number;
  is_visible: boolean;
  technologies: {
    name: string;
  } | null;
}

interface ProjectQueryResult {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  status: string;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  project_categories: {
    name: string;
  } | null;
  project_technologies: ProjectTechnologyQueryResult[];
}

function mapProject(project: ProjectQueryResult): ProjectSummaryRow {
  const technologies = project.project_technologies
    .filter((projectTechnology) => projectTechnology.is_visible)
    .sort((firstTechnology, secondTechnology) => {
      return firstTechnology.order_index - secondTechnology.order_index;
    })
    .map((projectTechnology) => projectTechnology.technologies?.name)
    .filter((technologyName): technologyName is string => Boolean(technologyName));

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    short_description: project.short_description,
    category: project.project_categories?.name ?? "Projeto",
    status: project.status,
    technologies,
    cover_image_url: project.cover_image_url,
    is_featured: project.is_featured,
    is_published: project.is_published,
    order_index: project.order_index,
    created_at: project.created_at,
    updated_at: project.updated_at,
  };
}

export async function getFeaturedProjects(): Promise<ProjectSummaryRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        title,
        slug,
        short_description,
        status,
        cover_image_url,
        is_featured,
        is_published,
        order_index,
        created_at,
        updated_at,
        project_categories (
          name
        ),
        project_technologies (
          order_index,
          is_visible,
          technologies (
            name
          )
        )
      `
    )
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ProjectQueryResult[]).map(mapProject);
}