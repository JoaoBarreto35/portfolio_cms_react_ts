import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import { getAdminProjectBySlug } from "../../../../services/supabase/projectsService";
import {
  createProjectLink,
  deleteProjectLink,
  getProjectLinksByProjectId,
  updateProjectLink,
  type ProjectLinkInput,
} from "../../../../services/supabase/projectLinksService";
import type { AdminProjectRow, ProjectLinkRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface ProjectLinkFormState {
  label: string;
  url: string;
  link_type: string;
  icon_name: string;
  order_index: string;
  is_visible: boolean;
}

const emptyFormState: ProjectLinkFormState = {
  label: "",
  url: "",
  link_type: "external",
  icon_name: "",
  order_index: "1",
  is_visible: true,
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function mapProjectLinkToForm(projectLink: ProjectLinkRow): ProjectLinkFormState {
  return {
    label: projectLink.label,
    url: projectLink.url,
    link_type: projectLink.link_type,
    icon_name: projectLink.icon_name ?? "",
    order_index: String(projectLink.order_index),
    is_visible: projectLink.is_visible,
  };
}

function mapFormToInput(
  projectId: string,
  formState: ProjectLinkFormState
): ProjectLinkInput {
  return {
    project_id: projectId,
    label: formState.label.trim(),
    url: formState.url.trim(),
    link_type: formState.link_type.trim() || "external",
    icon_name: emptyToNull(formState.icon_name),
    order_index: Number(formState.order_index) || 0,
    is_visible: formState.is_visible,
  };
}

export function AdminProjectLinksPage() {
  const { projectSlug } = useParams();

  const [project, setProject] = useState<AdminProjectRow | null>(null);
  const [projectLinks, setProjectLinks] = useState<ProjectLinkRow[]>([]);

  const [selectedProjectLinkId, setSelectedProjectLinkId] = useState<
    string | null
  >(null);

  const [formState, setFormState] =
    useState<ProjectLinkFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedProjectLink = projectLinks.find(
    (projectLink) => projectLink.id === selectedProjectLinkId
  );

  async function loadProjectLinks(projectId: string) {
    const linksData = await getProjectLinksByProjectId(projectId);
    setProjectLinks(linksData);
  }

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

        const linksData = await getProjectLinksByProjectId(projectData.id);

        if (!isMounted) {
          return;
        }

        setProjectLinks(linksData);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os links do projeto.";

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

  function updateField(field: keyof ProjectLinkFormState, value: string | boolean) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleCreateNew() {
    setSelectedProjectLinkId(null);
    setFormState({
      ...emptyFormState,
      order_index: String(projectLinks.length + 1),
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSelectProjectLink(projectLink: ProjectLinkRow) {
    setSelectedProjectLinkId(projectLink.id);
    setFormState(mapProjectLinkToForm(projectLink));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!project) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const input = mapFormToInput(project.id, formState);

      if (selectedProjectLink) {
        await updateProjectLink(selectedProjectLink.id, input);
        setSuccessMessage("Link atualizado com sucesso.");
      } else {
        const createdProjectLink = await createProjectLink(input);
        setSelectedProjectLinkId(createdProjectLink.id);
        setSuccessMessage("Link criado com sucesso.");
      }

      await loadProjectLinks(project.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o link.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!project || !selectedProjectLink) {
      return;
    }

    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir o link "${selectedProjectLink.label}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await deleteProjectLink(selectedProjectLink.id);

      setSelectedProjectLinkId(null);
      setFormState(emptyFormState);
      setSuccessMessage("Link excluído com sucesso.");

      await loadProjectLinks(project.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o link.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Links do projeto"
        description="Gerencie demos, GitHub, documentação e links externos."
      >
        <LoadingState
          title="Carregando links"
          description="Buscando projeto e links cadastrados."
        />
      </AdminShell>
    );
  }

  if (errorMessage && !project) {
    return (
      <AdminShell
        title="Links do projeto"
        description="Gerencie demos, GitHub, documentação e links externos."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar os links."
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
        title="Links do projeto"
        description="Gerencie demos, GitHub, documentação e links externos."
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
      title="Links do projeto"
      description={`Gerencie os links exibidos em "${project.title}".`}
    >
      <div className={styles.pageHeader}>
        <div>
          <p>Projeto</p>
          <h2>{project.title}</h2>
          <span>{project.slug}</span>
        </div>

        <div className={styles.headerActions}>
          <Link to={`/admin/projects/${project.slug}`}>Editar projeto</Link>
          <Link to={`/admin/projects/${project.slug}/technologies`}>
            Tecnologias
          </Link>
          <Link to="/admin/projects">Voltar para lista</Link>
        </div>
      </div>

      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Links cadastrados</p>
              <h2>{projectLinks.length} links</h2>
            </div>

            <button type="button" onClick={handleCreateNew}>
              Novo link
            </button>
          </div>

          <div className={styles.linkList}>
            {projectLinks.map((projectLink) => (
              <button
                key={projectLink.id}
                type="button"
                className={
                  projectLink.id === selectedProjectLinkId
                    ? `${styles.linkItem} ${styles.activeLinkItem}`
                    : styles.linkItem
                }
                onClick={() => handleSelectProjectLink(projectLink)}
              >
                <span>{projectLink.label}</span>
                <small>{projectLink.url}</small>

                <div className={styles.itemBadges}>
                  <Badge variant="default" size="sm">
                    {projectLink.link_type}
                  </Badge>

                  {!projectLink.is_visible && (
                    <Badge variant="warning" size="sm">
                      Oculto
                    </Badge>
                  )}
                </div>
              </button>
            ))}

            {projectLinks.length === 0 && (
              <div className={styles.emptyList}>
                Nenhum link cadastrado para este projeto.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>{selectedProjectLink ? "Editando" : "Novo link"}</p>
              <h2>{selectedProjectLink?.label ?? "Cadastrar link"}</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Rótulo</span>
                <input
                  type="text"
                  value={formState.label}
                  onChange={(event) => updateField("label", event.target.value)}
                  placeholder="Ver projeto online"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Tipo</span>
                <input
                  type="text"
                  value={formState.link_type}
                  onChange={(event) =>
                    updateField("link_type", event.target.value)
                  }
                  placeholder="demo, github, documentation..."
                  required
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>URL</span>
              <input
                type="text"
                value={formState.url}
                onChange={(event) => updateField("url", event.target.value)}
                placeholder="https://... ou /project/slug"
                required
              />
            </label>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Ícone</span>
                <input
                  type="text"
                  value={formState.icon_name}
                  onChange={(event) =>
                    updateField("icon_name", event.target.value)
                  }
                  placeholder="Github, ExternalLink, FileText..."
                />
              </label>

              <label className={styles.field}>
                <span>Ordem</span>
                <input
                  type="number"
                  value={formState.order_index}
                  onChange={(event) =>
                    updateField("order_index", event.target.value)
                  }
                />
              </label>
            </div>

            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={formState.is_visible}
                onChange={(event) =>
                  updateField("is_visible", event.target.checked)
                }
              />
              <span>Visível no projeto</span>
            </label>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <div className={styles.actions}>
              {selectedProjectLink && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Excluir
                </button>
              )}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Salvando..."
                  : selectedProjectLink
                    ? "Salvar alterações"
                    : "Criar link"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
