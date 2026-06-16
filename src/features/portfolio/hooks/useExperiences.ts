import { useEffect, useState } from "react";
import { getExperiences } from "../../../services/supabase/experiencesService";
import type { ExperienceRow } from "../../../types/database";

interface UseExperiencesResult {
  experiences: ExperienceRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useExperiences(): UseExperiencesResult {
  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadExperiences() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getExperiences();

        if (!isMounted) {
          return;
        }

        setExperiences(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as experiências.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadExperiences();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    experiences,
    isLoading,
    errorMessage,
  };
}
