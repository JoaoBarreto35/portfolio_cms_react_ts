import { useEffect, useState } from "react";
import { getProjectDetailsBySlug } from "../../../services/supabase/projectsService";
import type { ProjectDetailsRow } from "../../../types/database";

interface UseProjectDetailsResult {
  projectDetails: ProjectDetailsRow | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export function useProjectDetails(projectSlug: string | undefined): UseProjectDetailsResult {
  const [projectDetails, setProjectDetails] = useState<ProjectDetailsRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProjectDetails() {
      if (!projectSlug) {
        setProjectDetails(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getProjectDetailsBySlug(projectSlug);

        if (!isMounted) {
          return;
        }

        setProjectDetails(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os detalhes do projeto.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjectDetails();

    return () => {
      isMounted = false;
    };
  }, [projectSlug]);

  return {
    projectDetails,
    isLoading,
    errorMessage,
  };
}
