import { useEffect, useState } from "react";
import { getPortfolioStats } from "../../../services/supabase/portfolioStatsService";
import type { PortfolioStatRow } from "../../../types/database";

interface UsePortfolioStatsResult {
  portfolioStats: PortfolioStatRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function usePortfolioStats(): UsePortfolioStatsResult {
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStatRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolioStats() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getPortfolioStats();

        if (!isMounted) {
          return;
        }

        setPortfolioStats(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os destaques do portfólio.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolioStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    portfolioStats,
    isLoading,
    errorMessage,
  };
}