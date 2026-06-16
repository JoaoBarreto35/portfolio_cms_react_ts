import { useEffect, useState } from "react";
import { getPortfolioPages } from "../../../services/supabase/portfolioPagesService";
import type { PortfolioPageRow } from "../../../types/database";

interface UsePortfolioPagesResult {
  portfolioPages: PortfolioPageRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function usePortfolioPages(): UsePortfolioPagesResult {
  const [portfolioPages, setPortfolioPages] = useState<PortfolioPageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolioPages() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getPortfolioPages();

        if (!isMounted) {
          return;
        }

        setPortfolioPages(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as áreas do portfólio.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolioPages();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    portfolioPages,
    isLoading,
    errorMessage,
  };
}
