import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  getPortfolioPageProjectsByPageId,
  syncPortfolioPageProjects,
} from "../../../../services/supabase/portfolioPageProjectsService";
import { getAdminPortfolioPages } from "../../../../services/supabase/portfolioPagesService";
import { getAdminProjects } from "../../../../services/supabase/projectsService";
import type {
  PortfolioPageRow,
  ProjectSummaryRow,
} from "../../../../types/database";
import { getProjectStatusBadgeVariant } from "../../../portfolio/utils/getProjectStatusBadgeVariant";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

export function AdminPortfolioPageProjectsPage() {
  const { pageSlug } = useParams();

  const [portfolioPage, setPortfolioPage] = useState<PortfolioPageRow | null>(
    null
  );
  const [projects, setProjects] = useState<ProjectSummaryRow[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const groupedProjects = useMemo(() => {
    return projects.reduce<Record<string, ProjectSummaryRow[]>>(
      (accumulator, project) => {
        const groupName = project.category || "Sem categoria";

        if (!accumulator[groupName]) {
          accumulator[groupName] = [];
        }

        accumulator[groupName].push(project);

        return accumulator;
      },
      {}
    );
  }, [projects]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!pageSlug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const [pagesData, projectsData] = await Promise.all([
          getAdminPortfolioPages(),
          getAdminProjects(),
        ]);

        if (!isMounted) {
          return;
        }

        const currentPage = pagesData.find((page) => page.slug === pageSlug);

        setPortfolioPage(currentPage ?? null);
        setProjects(projectsData);

        if (!currentPage) {
          return;
        }

        const pageProjectsData = await getPortfolioPageProjectsByPageId(
          currentPage.id
        );

        if (!isMounted) {
          return;
        }

        setSelectedProjectIds(
          pageProjectsData
            .filter((pageProject) => pageProject.is_visible)
            .map((pageProject) => pageProject.project_id)
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os projetos da vitrine.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [pageSlug]);

  function toggleProject(projectId: string) {
    setSelectedProjectIds((currentIds) => {
      if (currentIds.includes(projectId)) {
        return currentIds.filter((currentId) => currentId !== projectId);
      }

      return [...currentIds, projectId];
    });
  }

  async function handleSave() {
    if (!portfolioPage) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await syncPortfolioPageProjects(portfolioPage.id, selectedProjectIds);

      setSuccessMessage("Projetos da vitrine atualizados com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar os projetos da vitrine.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Projetos da vitrine"
        description="Gerencie quais projetos aparecem em cada página pública."
      >
        <LoadingState
          title="Carregando vitrine"
          description="Buscando página, projetos e vínculos atuais."
        />
      </AdminShell>
    );
  }

  if (errorMessage && !portfolioPage) {
    return (
      <AdminShell
        title="Projetos da vitrine"
        description="Gerencie quais projetos aparecem em cada página pública."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar a vitrine."
          description={errorMessage}
          action={{
            label: "Voltar para vitrines",
            to: "/admin/pages",
          }}
        />
      </AdminShell>
    );
  }

  if (!portfolioPage) {
    return (
      <AdminShell
        title="Projetos da vitrine"
        description="Gerencie quais projetos aparecem em cada página pública."
      >
        <ErrorState
          eyebrow="Vitrine não encontrada"
          title="Essa vitrine não foi localizada no CMS."
          description="Volte para a lista de vitrines e selecione uma página válida."
          action={{
            label: "Voltar para vitrines",
            to: "/admin/pages",
          }}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Projetos da vitrine"
      description={`Escolha os projetos exibidos em "/${portfolioPage.slug}".`}
    >
      <div className={styles.pageHeader}>
        <div>
          <p>Vitrine</p>
          <h2>{portfolioPage.title}</h2>
          <span>/{portfolioPage.slug}</span>
        </div>

        <div className={styles.headerActions}>
          {portfolioPage.slug !== "home" && (
            <Link to={`/${portfolioPage.slug}`} target="_blank">
              Ver página
            </Link>
          )}

          <Link to="/admin/pages">Voltar para vitrines</Link>
        </div>
      </div>

      <section className={styles.summaryCard}>
        <div>
          <span>Selecionados</span>
          <strong>{selectedProjectIds.length}</strong>
          <p>Projetos vinculados a esta vitrine.</p>
        </div>

        <button type="button" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar projetos da vitrine"}
        </button>
      </section>

      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <section className={styles.projectGroups}>
        {Object.entries(groupedProjects).map(([groupName, groupItems]) => (
          <article key={groupName} className={styles.groupCard}>
            <div className={styles.groupHeader}>
              <h3>{groupName}</h3>
              <span>{groupItems.length} projetos</span>
            </div>

            <div className={styles.projectGrid}>
              {groupItems.map((project) => {
                const isSelected = selectedProjectIds.includes(project.id);

                return (
                  <button
                    key={project.id}
                    type="button"
                    className={
                      isSelected
                        ? `${styles.projectItem} ${styles.selectedProjectItem}`
                        : styles.projectItem
                    }
                    onClick={() => toggleProject(project.id)}
                  >
                    <div className={styles.projectCover}>
                      {project.cover_image_url ? (
                        <img
                          src={project.cover_image_url}
                          alt={`Capa do projeto ${project.title}`}
                          loading="lazy"
                        />
                      ) : (
                        <span>{project.title.slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>

                    <div className={styles.projectInfo}>
                      <strong>{project.title}</strong>
                      <small>{project.slug}</small>

                      <p>{project.short_description}</p>

                      <div className={styles.badges}>
                        <Badge
                          variant={getProjectStatusBadgeVariant(project.status)}
                          size="sm"
                        >
                          {project.status}
                        </Badge>

                        {project.is_published ? (
                          <Badge variant="success" size="sm">
                            Publicado
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            Rascunho
                          </Badge>
                        )}

                        {isSelected && (
                          <Badge variant="purple" size="sm">
                            Na vitrine
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        ))}

        {projects.length === 0 && (
          <div className={styles.emptyState}>
            Nenhum projeto cadastrado ainda.
          </div>
        )}
      </section>
    </AdminShell>
  );
}