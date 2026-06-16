export interface SiteSettingsRow {
  id: string;

  name: string;
  headline: string;
  subtitle: string | null;
  bio: string | null;

  email: string | null;
  phone: string | null;
  city: string | null;

  github_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;
  resume_url: string | null;

  profile_image_url: string | null;

  primary_color: string;
  secondary_color: string;
  accent_color: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface PortfolioStatRow {
  id: string;

  label: string;
  value: string;
  description: string | null;

  icon_name: string | null;
  color: string;

  order_index: number;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}

export interface ContactLinkRow {
  id: string;

  label: string;
  description: string | null;
  href: string;

  contact_type: string;
  icon_name: string | null;
  color: string;

  order_index: number;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}
export interface SkillRow {
  id: string;

  name: string;
  slug: string;

  group_name: string;
  description: string | null;

  level_label: string | null;
  level_value: number | null;

  icon_name: string | null;
  color: string;

  order_index: number;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}
export interface ProjectSummaryRow {
  id: string;

  title: string;
  slug: string;
  short_description: string;

  category: string;
  status: string;

  technologies: string[];
  cover_image_url: string | null;

  is_featured: boolean;
  is_published: boolean;

  order_index: number;

  created_at: string;
  updated_at: string;
}
export interface PortfolioPageRow {
  id: string;

  slug: string;
  title: string;
  eyebrow: string | null;
  subtitle: string | null;
  description: string | null;

  primary_color: string;
  secondary_color: string;
  accent_color: string;

  background_style: string;
  layout_style: string;

  order_index: number;
  is_published: boolean;

  created_at: string;
  updated_at: string;
}