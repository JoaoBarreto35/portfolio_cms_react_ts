import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import { getAdminProjects } from "../../../../services/supabase/projectsService";
import type { ProjectSummaryRow } from "../../../../types/database";
import { getProjectStatusBadgeVariant } from "../../../portfolio/utils/getProjectStatusBadgeVariant";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummaryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getAdminProjects();

        if (!isMounted) {
          return;
        }

        setProjects(data);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os projetos.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <AdminShell
        title="Projetos"
        description="Gerencie os projetos exibidos no portfólio."
      >
        <LoadingState
          title="Carregando projetos"
          description="Buscando projetos cadastrados no CMS."
        />
      </AdminShell>
    );
  }

  if (errorMessage) {
    return (
      <AdminShell
        title="Projetos"
        description="Gerencie os projetos exibidos no portfólio."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar os projetos."
          description={errorMessage}
          action={{
            label: "Voltar ao dashboard",
            to: "/admin",
          }}
        />
      </AdminShell>
    );
  }

  const publishedProjectsCount = projects.filter(
    (project) => project.is_published
  ).length;

  const featuredProjectsCount = projects.filter(
    (project) => project.is_featured
  ).length;

  return (
    <AdminShell
      title="Projetos"
      description="Visualize os projetos cadastrados e prepare a gestão de edição, publicação e destaque."
    >
      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <span>Total</span>
          <strong>{projects.length}</strong>
          <p>Projetos cadastrados no CMS.</p>
        </article>

        <article className={styles.summaryCard}>
          <span>Publicados</span>
          <strong>{publishedProjectsCount}</strong>
          <p>Projetos visíveis no site público.</p>
        </article>

        <article className={styles.summaryCard}>
          <span>Destaques</span>
          <strong>{featuredProjectsCount}</strong>
          <p>Projetos marcados para aparecer na Home.</p>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p>Projetos cadastrados</p>
            <h2>Lista de projetos</h2>
          </div>

          <Link to="/admin/projects/new" className={styles.createLink}>
            Novo projeto
          </Link>
        </div>

        <div className={styles.projectList}>
          {projects.map((project) => (
            <article key={project.id} className={styles.projectItem}>
              <div className={styles.projectMain}>
                <div className={styles.projectCover}>
                  {project.cover_image_url ? (
                    <img
                      src={project.cover_image_url}
                      alt={`Capa do projeto ${project.title}`}
                    />
                  ) : (
                    <span>{project.title.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>

                <div>
                  <h3>{project.title}</h3>
                  <p>{project.short_description}</p>

                  <div className={styles.meta}>
                    <span>{project.category}</span>
                    <span>{project.slug}</span>
                  </div>
                </div>
              </div>

              <div className={styles.badges}>
                <Badge variant={getProjectStatusBadgeVariant(project.status)}>
                  {project.status}
                </Badge>

                {project.is_published ? (
                  <Badge variant="success">Publicado</Badge>
                ) : (
                  <Badge variant="warning">Rascunho</Badge>
                )}

                {project.is_featured && (
                  <Badge variant="purple">Destaque</Badge>
                )}
              </div>

              <div className={styles.technologies}>
                {project.technologies.slice(0, 4).map((technology) => (
                  <Badge key={technology} variant="default" size="sm">
                    {technology}
                  </Badge>
                ))}

                {project.technologies.length > 4 && (
                  <Badge variant="default" size="sm">
                    +{project.technologies.length - 4}
                  </Badge>
                )}
              </div>

              <div className={styles.actions}>
                <Link to={`/project/${project.slug}`} target="_blank">
                  Ver
                </Link>

                <Link to={`/admin/projects/${project.slug}`}>
                  Editar
                </Link>

                <Link to={`/admin/projects/${project.slug}/technologies`}>
                  Tecnologias
                </Link>

                <Link to={`/admin/projects/${project.slug}/links`}>
                  Links
                </Link>
              </div>
            </article>
          ))}

          {projects.length === 0 && (
            <div className={styles.emptyList}>
              Nenhum projeto cadastrado ainda.
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}