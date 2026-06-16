import { useEffect, useState } from "react";
import { getActiveSiteSettings } from "../../../services/supabase/siteSettingsService";
import type { SiteSettingsRow } from "../../../types/database";

interface UseSiteSettingsResult {
  siteSettings: SiteSettingsRow | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function useSiteSettings(): UseSiteSettingsResult {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSiteSettings() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getActiveSiteSettings();

        if (!isMounted) {
          return;
        }

        setSiteSettings(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as configurações do site.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSiteSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    siteSettings,
    isLoading,
    errorMessage,
  };
}
