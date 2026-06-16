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
  