import { useEffect, useState } from "react";
import { getEducationItems } from "../../../services/supabase/educationService";
import type { EducationRow } from "../../../types/database";

interface UseEducationResult {
  educationItems: EducationRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useEducation(): UseEducationResult {
  const [educationItems, setEducationItems] = useState<EducationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEducationItems() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getEducationItems();

        if (!isMounted) {
          return;
        }

        setEducationItems(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as formações.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEducationItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    educationItems,
    isLoading,
    errorMessage,
  };
}
