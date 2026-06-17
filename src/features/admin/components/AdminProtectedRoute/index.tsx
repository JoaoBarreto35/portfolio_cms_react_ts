import { Navigate, useLocation } from "react-router-dom";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import { useAdminAuth } from "../../hooks/useAdminAuth";

interface AdminProtectedRouteProps {
  children: JSX.Element;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const location = useLocation();

  const { isAuthenticated, isAdmin, isLoading, errorMessage } = useAdminAuth();

  if (isLoading) {
    return (
      <LoadingState
        title="Validando acesso"
        description="Verificando sua sessão e permissão de administrador."
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (errorMessage) {
    return (
      <ErrorState
        eyebrow="Erro de autenticação"
        title="Não foi possível validar seu acesso."
        description={errorMessage}
        action={{
          label: "Ir para o login",
          to: "/admin/login",
        }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <ErrorState
        eyebrow="Acesso negado"
        title="Você está logado, mas não tem permissão de administrador."
        description="Cadastre esse usuário na tabela admin_users para liberar o acesso ao CMS."
        action={{
          label: "Voltar para a Home",
          to: "/",
        }}
      />
    );
  }

  return children;
}
