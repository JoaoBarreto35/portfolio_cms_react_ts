import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  getCurrentSession,
  getIsCurrentUserAdmin,
} from "../../../services/supabase/authService";

interface UseAdminAuthResult {
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

export function useAdminAuth(): UseAdminAuthResult {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminAuth() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const currentSession = await getCurrentSession();

        if (!isMounted) {
          return;
        }

        setSession(currentSession);

        if (!currentSession) {
          setIsAdmin(false);
          return;
        }

        const userIsAdmin = await getIsCurrentUserAdmin();

        if (!isMounted) {
          return;
        }

        setIsAdmin(userIsAdmin);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível validar o acesso admin.";

        setErrorMessage(message);
        setSession(null);
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    session,
    isAuthenticated: Boolean(session),
    isAdmin,
    isLoading,
    errorMessage,
  };
}