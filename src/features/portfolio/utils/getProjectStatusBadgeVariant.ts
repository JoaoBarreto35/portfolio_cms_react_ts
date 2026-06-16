import type { BadgeVariant } from "../../../components/ui/Badge";

export function getProjectStatusBadgeVariant(status: string): BadgeVariant {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "publicado") {
    return "success";
  }

  if (normalizedStatus === "em evolução" || normalizedStatus === "em evolucao") {
    return "warning";
  }

  if (normalizedStatus === "mvp") {
    return "primary";
  }

  if (normalizedStatus === "conceito") {
    return "purple";
  }

  if (normalizedStatus === "estudo") {
    return "default";
  }

  return "default";
}
