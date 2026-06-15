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
