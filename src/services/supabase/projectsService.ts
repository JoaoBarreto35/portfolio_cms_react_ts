import { supabase } from "./supabaseClient";
import type {
  ProjectDetailsRow,
  ProjectImageRow,
  ProjectLinkRow,
  ProjectSummaryRow,
} from "../../types/database";
import type { PortfolioAreaSlug } from "../../types/portfolio";

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

interface PortfolioPageProjectQueryResult {
  order_index: number;
  highlight_label: string | null;
  projects: ProjectQueryResult | null;
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

export async function getProjectsByPortfolioPageSlug(
  pageSlug: PortfolioAreaSlug
): Promise<ProjectSummaryRow[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_page_projects")
    .select(
      `
        order_index,
        highlight_label,
        portfolio_pages!inner (
          slug
        ),
        projects!inner (
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
        )
      `
    )
    .eq("is_visible", true)
    .eq("portfolio_pages.slug", pageSlug)
    .eq("projects.is_published", true)
    .order("order_index", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as PortfolioPageProjectQueryResult[])
    .map((item) => item.projects)
    .filter((project): project is ProjectQueryResult => Boolean(project))
    .map(mapProject);
}
interface ProjectLinkQueryResult {
  id: string;
  project_id: string;
  label: string;
  url: string;
  link_type: string;
  icon_name: string | null;
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectImageQueryResult {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  image_type: string;
  is_cover: boolean;
  is_visible: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface ProjectDetailsQueryResult extends ProjectQueryResult {
  subtitle: string | null;
  full_description: string | null;
  project_year: number | null;
  role: string | null;
  problem: string | null;
  solution: string | null;
  impact: string | null;
  project_links: ProjectLinkQueryResult[];
  project_images: ProjectImageQueryResult[];
}

function mapProjectDetails(project: ProjectDetailsQueryResult): ProjectDetailsRow {
  const summary = mapProject(project);

  const links = project.project_links
    .filter((link) => link.is_visible)
    .sort((firstLink, secondLink) => firstLink.order_index - secondLink.order_index)
    .map<ProjectLinkRow>((link) => ({
      id: link.id,
      project_id: link.project_id,
      label: link.label,
      url: link.url,
      link_type: link.link_type,
      icon_name: link.icon_name,
      order_index: link.order_index,
      is_visible: link.is_visible,
      created_at: link.created_at,
      updated_at: link.updated_at,
    }));

  const images = project.project_images
    .filter((image) => image.is_visible)
    .sort((firstImage, secondImage) => {
      if (firstImage.is_cover && !secondImage.is_cover) {
        return -1;
      }

      if (!firstImage.is_cover && secondImage.is_cover) {
        return 1;
      }

      return firstImage.order_index - secondImage.order_index;
    })
    .map<ProjectImageRow>((image) => ({
      id: image.id,
      project_id: image.project_id,
      image_url: image.image_url,
      alt_text: image.alt_text,
      caption: image.caption,
      image_type: image.image_type,
      is_cover: image.is_cover,
      is_visible: image.is_visible,
      order_index: image.order_index,
      created_at: image.created_at,
      updated_at: image.updated_at,
    }));

  return {
    ...summary,
    subtitle: project.subtitle,
    full_description: project.full_description,
    project_year: project.project_year,
    role: project.role,
    problem: project.problem,
    solution: project.solution,
    impact: project.impact,
    links,
    images,
  };
}

export async function getProjectDetailsBySlug(
  projectSlug: string
): Promise<ProjectDetailsRow | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        title,
        slug,
        subtitle,
        short_description,
        full_description,
        status,
        project_year,
        role,
        problem,
        solution,
        impact,
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
        ),
        project_links (
          id,
          project_id,
          label,
          url,
          link_type,
          icon_name,
          order_index,
          is_visible,
          created_at,
          updated_at
        ),
        project_images (
          id,
          project_id,
          image_url,
          alt_text,
          caption,
          image_type,
          is_cover,
          is_visible,
          order_index,
          created_at,
          updated_at
        )
      `
    )
    .eq("slug", projectSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapProjectDetails(data as ProjectDetailsQueryResult);
}
