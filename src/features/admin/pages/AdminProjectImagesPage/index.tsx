
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  createProjectImage,
  deleteProjectImage,
  getProjectImagesByProjectId,
  updateProjectImage,
  type ProjectImageInput,
} from "../../../../services/supabase/projectImagesService";
import { getAdminProjectBySlug } from "../../../../services/supabase/projectsService";
import type { AdminProjectRow, ProjectImageRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface ProjectImageFormState {
  image_url: string;
  alt_text: string;
  caption: string;
  image_type: string;

  is_cover: boolean;
  is_visible: boolean;

  order_index: string;
}

const emptyFormState: ProjectImageFormState = {
  image_url: "",
  alt_text: "",
  caption: "",
  image_type: "gallery",

  is_cover: false,
  is_visible: true,

  order_index: "1",
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function mapProjectImageToForm(
  projectImage: ProjectImageRow
): ProjectImageFormState {
  return {
    image_url: projectImage.image_url,
    alt_text: projectImage.alt_text,
    caption: projectImage.caption ?? "",
    image_type: projectImage.image_type,

    is_cover: projectImage.is_cover,
    is_visible: projectImage.is_visible,

    order_index: String(projectImage.order_index),
  };
}

function mapFormToInput(
  projectId: string,
  formState: ProjectImageFormState
): ProjectImageInput {
  return {
    project_id: projectId,

    image_url: formState.image_url.trim(),
    alt_text: formState.alt_text.trim(),
    caption: emptyToNull(formState.caption),
    image_type: formState.image_type.trim() || "gallery",

    is_cover: formState.is_cover,
    is_visible: formState.is_visible,

    order_index: Number(formState.order_index) || 0,
  };
}

export function AdminProjectImagesPage() {
  const { projectSlug } = useParams();

  const [project, setProject] = useState<AdminProjectRow | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImageRow[]>([]);

  const [selectedProjectImageId, setSelectedProjectImageId] = useState<
    string | null
  >(null);

  const [formState, setFormState] =
    useState<ProjectImageFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedProjectImage = projectImages.find(
    (projectImage) => projectImage.id === selectedProjectImageId
  );

  async function loadProjectImages(projectId: string) {
    const imagesData = await getProjectImagesByProjectId(projectId);
    setProjectImages(imagesData);
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

        const imagesData = await getProjectImagesByProjectId(projectData.id);

        if (!isMounted) {
          return;
        }

        setProjectImages(imagesData);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as imagens do projeto.";

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

  function updateField(
    field: keyof ProjectImageFormState,
    value: string | boolean
  ) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleCreateNew() {
    setSelectedProjectImageId(null);
    setFormState({
      ...emptyFormState,
      order_index: String(projectImages.length + 1),
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSelectProjectImage(projectImage: ProjectImageRow) {
    setSelectedProjectImageId(projectImage.id);
    setFormState(mapProjectImageToForm(projectImage));
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

      if (selectedProjectImage) {
        await updateProjectImage(selectedProjectImage.id, input);
        setSuccessMessage("Imagem atualizada com sucesso.");
      } else {
        const createdProjectImage = await createProjectImage(input);
        setSelectedProjectImageId(createdProjectImage.id);
        setSuccessMessage("Imagem criada com sucesso.");
      }

      await loadProjectImages(project.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a imagem.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!project || !selectedProjectImage) {
      return;
    }

    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir a imagem "${selectedProjectImage.alt_text}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await deleteProjectImage(selectedProjectImage.id);

      setSelectedProjectImageId(null);
      setFormState(emptyFormState);
      setSuccessMessage("Imagem excluída com sucesso.");

      await loadProjectImages(project.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a imagem.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Imagens do projeto"
        description="Gerencie capas, prints e galeria do projeto."
      >
        <LoadingState
          title="Carregando imagens"
          description="Buscando projeto e imagens cadastradas."
        />
      </AdminShell>
    );
  }

  if (errorMessage && !project) {
    return (
      <AdminShell
        title="Imagens do projeto"
        description="Gerencie capas, prints e galeria do projeto."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar as imagens."
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
        title="Imagens do projeto"
        description="Gerencie capas, prints e galeria do projeto."
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
      title="Imagens do projeto"
      description={`Gerencie a galeria visual exibida em "${project.title}".`}
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
          <Link to={`/admin/projects/${project.slug}/links`}>Links</Link>
          <Link to="/admin/projects">Voltar para lista</Link>
        </div>
      </div>

      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Imagens cadastradas</p>
              <h2>{projectImages.length} imagens</h2>
            </div>

            <button type="button" onClick={handleCreateNew}>
              Nova imagem
            </button>
          </div>

          <div className={styles.imageList}>
            {projectImages.map((projectImage) => (
              <button
                key={projectImage.id}
                type="button"
                className={
                  projectImage.id === selectedProjectImageId
                    ? `${styles.imageItem} ${styles.activeImageItem}`
                    : styles.imageItem
                }
                onClick={() => handleSelectProjectImage(projectImage)}
              >
                <div className={styles.thumbnail}>
                  <img
                    src={projectImage.image_url}
                    alt={projectImage.alt_text}
                    loading="lazy"
                  />
                </div>

                <div className={styles.imageInfo}>
                  <span>{projectImage.alt_text}</span>
                  <small>{projectImage.image_url}</small>

                  <div className={styles.itemBadges}>
                    <Badge variant="default" size="sm">
                      {projectImage.image_type}
                    </Badge>

                    {projectImage.is_cover && (
                      <Badge variant="purple" size="sm">
                        Capa
                      </Badge>
                    )}

                    {!projectImage.is_visible && (
                      <Badge variant="warning" size="sm">
                        Oculta
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {projectImages.length === 0 && (
              <div className={styles.emptyList}>
                Nenhuma imagem cadastrada para este projeto.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>{selectedProjectImage ? "Editando" : "Nova imagem"}</p>
              <h2>{selectedProjectImage?.alt_text ?? "Cadastrar imagem"}</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>URL da imagem</span>
              <input
                type="url"
                value={formState.image_url}
                onChange={(event) =>
                  updateField("image_url", event.target.value)
                }
                placeholder="https://..."
                required
              />
            </label>

            {formState.image_url && (
              <div className={styles.preview}>
                <img src={formState.image_url} alt="Prévia da imagem" />
              </div>
            )}

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Texto alternativo</span>
                <input
                  type="text"
                  value={formState.alt_text}
                  onChange={(event) =>
                    updateField("alt_text", event.target.value)
                  }
                  placeholder="Tela inicial do Manutix"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Tipo</span>
                <input
                  type="text"
                  value={formState.image_type}
                  onChange={(event) =>
                    updateField("image_type", event.target.value)
                  }
                  placeholder="cover, gallery, mockup..."
                  required
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Legenda</span>
              <textarea
                value={formState.caption}
                rows={3}
                onChange={(event) =>
                  updateField("caption", event.target.value)
                }
                placeholder="Texto opcional para explicar a imagem."
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

            <div className={styles.grid}>
              <label className={styles.checkboxField}>
                <input
                  type="checkbox"
                  checked={formState.is_cover}
                  onChange={(event) =>
                    updateField("is_cover", event.target.checked)
                  }
                />
                <span>Marcar como capa da galeria</span>
              </label>

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
            </div>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <div className={styles.actions}>
              {selectedProjectImage && (
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
                  : selectedProjectImage
                    ? "Salvar alterações"
                    : "Criar imagem"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
