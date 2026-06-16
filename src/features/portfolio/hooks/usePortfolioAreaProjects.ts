import { useEffect, useState } from "react";
import { getProjectsByPortfolioPageSlug } from "../../../services/supabase/projectsService";
import type { ProjectSummaryRow } from "../../../types/database";
import type { PortfolioAreaSlug } from "../../../types/portfolio";

interface UsePortfolioAreaProjectsResult {
  areaProjects: ProjectSummaryRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function usePortfolioAreaProjects(
  areaSlug: PortfolioAreaSlug
): UsePortfolioAreaProjectsResult {
  const [areaProjects, setAreaProjects] = useState<ProjectSummaryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolioAreaProjects() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getProjectsByPortfolioPageSlug(areaSlug);

        if (!isMounted) {
          return;
        }

        setAreaProjects(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os projetos da área.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolioAreaProjects();

    return () => {
      isMounted = false;
    };
  }, [areaSlug]);

  return {
    areaProjects,
    isLoading,
    errorMessage,
  };
}