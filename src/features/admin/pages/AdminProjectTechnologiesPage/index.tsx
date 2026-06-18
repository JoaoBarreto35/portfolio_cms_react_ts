import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  getAdminProjectBySlug,
} from "../../../../services/supabase/projectsService";
import {
  getProjectTechnologiesByProjectId,
  syncProjectTechnologies,
} from "../../../../services/supabase/projectTechnologiesService";
import { getTechnologies } from "../../../../services/supabase/technologiesService";
import type {
  AdminProjectRow,
  TechnologyRow,
} from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

export function AdminProjectTechnologiesPage() {
  const { projectSlug } = useParams();

  const [project, setProject] = useState<AdminProjectRow | null>(null);
  const [technologies, setTechnologies] = useState<TechnologyRow[]>([]);
  const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<string[]>(
    []
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const groupedTechnologies = useMemo(() => {
    return technologies.reduce<Record<string, TechnologyRow[]>>(
      (accumulator, technology) => {
        const groupName = technology.group_name ?? "Outras";

        if (!accumulator[groupName]) {
          accumulator[groupName] = [];
        }

        accumulator[groupName].push(technology);

        return accumulator;
      },
      {}
    );
  }, [technologies]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!projectSlug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const projectData = await getAdminProjectBySlug(projectSlug);

        if (!isMounted) {
          return;
        }

        setProject(projectData);

        if (!projectData) {
          return;
        }

        const [technologiesData, projectTechnologiesData] = await Promise.all([
          getTechnologies(),
          getProjectTechnologiesByProjectId(projectData.id),
        ]);

        if (!isMounted) {
          return;
        }

        setTechnologies(technologiesData);
        setSelectedTechnologyIds(
          projectTechnologiesData
            .filter((projectTechnology) => projectTechnology.is_visible)
            .map((projectTechnology) => projectTechnology.technology_id)
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as tecnologias do projeto.";

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
  }, [projectSlug]);

  function toggleTechnology(technologyId: string) {
    setSelectedTechnologyIds((currentIds) => {
      if (currentIds.includes(technologyId)) {
        return currentIds.filter((currentId) => currentId !== technologyId);
      }

      return [...currentIds, technologyId];
    });
  }

  async function handleSave() {
    if (!project) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await syncProjectTechnologies(project.id, selectedTechnologyIds);

      setSuccessMessage("Tecnologias atualizadas com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as tecnologias.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Tecnologias do projeto"
        description="Gerencie as tecnologias vinculadas ao projeto."
      >
        <LoadingState
          title="Carregando tecnologias"
          description="Buscando projeto, tecnologias e vínculos atuais."
        />
      </AdminShell>
    );
  }

  if (errorMessage && !project) {
    return (
      <AdminShell
        title="Tecnologias do projeto"
        description="Gerencie as tecnologias vinculadas ao projeto."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar as tecnologias."
          description={errorMessage}
          action={{
            label: "Voltar para projetos",
            to: "/admin/projects",
          }}
        />
      </AdminShell>
    );
  }

  if (!project) {
    return (
      <AdminShell
        title="Tecnologias do projeto"
        description="Gerencie as tecnologias vinculadas ao projeto."
      >
        <ErrorState
          eyebrow="Projeto não encontrado"
          title="Esse projeto não foi localizado no CMS."
          description="Volte para a lista de projetos e selecione um projeto válido."
          action={{
            label: "Voltar para projetos",
            to: "/admin/projects",
          }}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Tecnologias do projeto"
      description={`Selecione as tecnologias que aparecem em "${project.title}".`}
    >
      <div className={styles.pageHeader}>
        <div>
          <p>Projeto</p>
          <h2>{project.title}</h2>
          <span>{project.slug}</span>
        </div>

        <div className={styles.headerActions}>
          <Link to={`/admin/projects/${project.slug}`}>Editar projeto</Link>
          <Link to="/admin/projects">Voltar para lista</Link>
        </div>
      </div>

      <section className={styles.summaryCard}>
        <div>
          <span>Selecionadas</span>
          <strong>{selectedTechnologyIds.length}</strong>
          <p>Tecnologias vinculadas a este projeto.</p>
        </div>

        <button type="button" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar tecnologias"}
        </button>
      </section>

      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <section className={styles.technologyGroups}>
        {Object.entries(groupedTechnologies).map(([groupName, groupItems]) => (
          <article key={groupName} className={styles.groupCard}>
            <div className={styles.groupHeader}>
              <h3>{groupName}</h3>
              <span>{groupItems.length} tecnologias</span>
            </div>

            <div className={styles.technologyGrid}>
              {groupItems.map((technology) => {
                const isSelected = selectedTechnologyIds.includes(
                  technology.id
                );

                return (
                  <button
                    key={technology.id}
                    type="button"
                    className={
                      isSelected
                        ? `${styles.technologyItem} ${styles.selectedTechnologyItem}`
                        : styles.technologyItem
                    }
                    onClick={() => toggleTechnology(technology.id)}
                  >
                    <div>
                      <strong>{technology.name}</strong>
                      <span>{technology.slug}</span>
                    </div>

                    {isSelected ? (
                      <Badge variant="success" size="sm">
                        Selecionada
                      </Badge>
                    ) : (
                      <Badge variant="default" size="sm">
                        Disponível
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </article>
        ))}

        {technologies.length === 0 && (
          <div className={styles.emptyState}>
            Nenhuma tecnologia ativa foi encontrada.
          </div>
        )}
      </section>
    </AdminShell>
  );
}