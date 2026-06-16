import { useEffect, useState } from "react";
import {
  getPortfolioPageBySlug,
  getPortfolioPageHighlights,
} from "../../../services/supabase/portfolioPagesService";
import type {
  PortfolioPageHighlightRow,
  PortfolioPageRow,
} from "../../../types/database";
import type { PortfolioAreaSlug } from "../../../types/portfolio";

interface UsePortfolioAreaContentResult {
  portfolioPage: PortfolioPageRow | null;
  highlights: PortfolioPageHighlightRow[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function usePortfolioAreaContent(
  areaSlug: PortfolioAreaSlug
): UsePortfolioAreaContentResult {
  const [portfolioPage, setPortfolioPage] = useState<PortfolioPageRow | null>(
    null
  );
  const [highlights, setHighlights] = useState<PortfolioPageHighlightRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPortfolioAreaContent() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const pageData = await getPortfolioPageBySlug(areaSlug);

        if (!isMounted) {
          return;
        }

        setPortfolioPage(pageData);

        if (!pageData) {
          setHighlights([]);
          return;
        }

        const highlightsData = await getPortfolioPageHighlights(pageData.id);

        if (!isMounted) {
          return;
        }

        setHighlights(highlightsData);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o conteúdo da área.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPortfolioAreaContent();

    return () => {
      isMounted = false;
    };
  }, [areaSlug]);

  return {
    portfolioPage,
    highlights,
    isLoading,
    errorMessage,
  };
}