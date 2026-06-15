export type PortfolioAreaSlug = "web" | "data-analytics" | "automation" | "game";

export interface PortfolioAreaItem {
    title: string;
    description: string;
    href: string;
}

export interface FeaturedProject {
    title: string;
    slug: string;
    description: string;
    cetegory: string;
    status: string;
    technologies: string[];
    coverImageUrl: string | null;
}

export interface SkillGroup {
    title: string;
    description: string;
    skills: string[];
}

export interface ContactLink{
    label: string;
    description: string;
    href: string;
}

export interface StatusItem {
    title: string;
    description: string;
}
export interface PortfolioAreaContent {
    slug: PortfolioAreaSlug;
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
  }
  
  export interface ProjectDetails {
    title: string;
    slug: string;
    subtitle: string;
    category: string;
    year: string;
    status: string;
    role: string;
    technologies: string[];
    problem: string;
    solution: string;
    impact: string;
    coverImageUrl: string | null;
  }
  