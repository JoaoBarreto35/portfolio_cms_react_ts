import { useEffect, useState } from "react";
import { getSkills } from "../../../services/supabase/skillsService";
import type { SkillRow } from "../../../types/database";

interface UseSkillsResult {
  skills: SkillRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useSkills(): UseSkillsResult {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSkills() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getSkills();

        if (!isMounted) {
          return;
        }

        setSkills(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as habilidades.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    skills,
    isLoading,
    errorMessage,
  };
}
