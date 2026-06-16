import { useEffect, useState } from "react";
import { getFeaturedProjects } from "../../../services/supabase/projectsService";
import type { ProjectSummaryRow } from "../../../types/database";

interface UseFeaturedProjectsResult {
  featuredProjects: ProjectSummaryRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useFeaturedProjects(): UseFeaturedProjectsResult {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectSummaryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedProjects() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getFeaturedProjects();

        if (!isMounted) {
          return;
        }

        setFeaturedProjects(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os projetos em destaque.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFeaturedProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    featuredProjects,
    isLoading,
    errorMessage,
  };
}
