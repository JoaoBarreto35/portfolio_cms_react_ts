import { useEffect, useState } from "react";
import { getContactLinks } from "../../../services/supabase/contactLinksService";
import type { ContactLinkRow } from "../../../types/database";

interface UseContactLinksResult {
  contactLinks: ContactLinkRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useContactLinks(): UseContactLinksResult {
  const [contactLinks, setContactLinks] = useState<ContactLinkRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContactLinks() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getContactLinks();

        if (!isMounted) {
          return;
        }

        setContactLinks(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os links de contato.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadContactLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    contactLinks,
    isLoading,
    errorMessage,
  };
}
