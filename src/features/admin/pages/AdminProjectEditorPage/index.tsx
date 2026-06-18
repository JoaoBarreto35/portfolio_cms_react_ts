import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import { getProjectCategories } from "../../../../services/supabase/projectCategoriesService";
import {
  createProject,
  getAdminProjectBySlug,
  updateProject,
  type ProjectInput,
} from "../../../../services/supabase/projectsService";
import type {
  AdminProjectRow,
  ProjectCategoryRow,
} from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface ProjectFormState {
  category_id: string;

  title: string;
  slug: string;

  short_description: string;
  subtitle: string;
  full_description: string;

  status: string;
  project_year: string;
  role: string;

  problem: string;
  solution: string;
  impact: string;

  cover_image_url: string;

  is_featured: boolean;
  is_published: boolean;

  order_index: string;
}

const emptyFormState: ProjectFormState = {
  category_id: "",

  title: "",
  slug: "",

  short_description: "",
  subtitle: "",
  full_description: "",

  status: "MVP",
  project_year: "",
  role: "Desenvolvedor",

  problem: "",
  solution: "",
  impact: "",

  cover_image_url: "",

  is_featured: false,
  is_published: false,

  order_index: "1",
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function createSlugFromTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function mapProjectToForm(project: AdminProjectRow): ProjectFormState {
  return {
    category_id: project.category_id ?? "",

    title: project.title,
    slug: project.slug,

    short_description: project.short_description,
    subtitle: project.subtitle ?? "",
    full_description: project.full_description ?? "",

    status: project.status,
    project_year: project.project_year ? String(project.project_year) : "",
    role: project.role ?? "",

    problem: project.problem ?? "",
    solution: project.solution ?? "",
    impact: project.impact ?? "",

    cover_image_url: project.cover_image_url ?? "",

    is_featured: project.is_featured,
    is_published: project.is_published,

    order_index: String(project.order_index),
  };
}

function mapFormToInput(formState: ProjectFormState): ProjectInput {
  const projectYear = Number(formState.project_year);

  return {
    category_id: emptyToNull(formState.category_id),

    title: formState.title.trim(),
    slug: formState.slug.trim(),

    short_description: formState.short_description.trim(),
    subtitle: emptyToNull(formState.subtitle),
    full_description: emptyToNull(formState.full_description),

    status: formState.status.trim() || "MVP",
    project_year:
      formState.project_year.trim().length > 0 && !Number.isNaN(projectYear)
        ? projectYear
        : null,
    role: emptyToNull(formState.role),

    problem: emptyToNull(formState.problem),
    solution: emptyToNull(formState.solution),
    impact: emptyToNull(formState.impact),

    cover_image_url: emptyToNull(formState.cover_image_url),

    is_featured: formState.is_featured,
    is_published: formState.is_published,

    order_index: Number(formState.order_index) || 0,
  };
}

export function AdminProjectEditorPage() {
  const { projectSlug } = useParams();
  const navigate = useNavigate();

  const isCreating = !projectSlug || projectSlug === "new";

  const [project, setProject] = useState<AdminProjectRow | null>(null);
  const [categories, setCategories] = useState<ProjectCategoryRow[]>([]);

  const [formState, setFormState] =
    useState<ProjectFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(!isCreating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const pageTitle = isCreating ? "Novo projeto" : "Editar projeto";

  const pageDescription = isCreating
    ? "Cadastre um novo projeto no portfólio."
    : "Atualize as informações principais do projeto.";

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) => category.id === formState.category_id
    );
  }, [categories, formState.category_id]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const categoriesData = await getProjectCategories();

        if (!isMounted) {
          return;
        }

        setCategories(categoriesData);

        if (isCreating) {
          setFormState((currentFormState) => ({
            ...currentFormState,
            category_id: categoriesData[0]?.id ?? "",
          }));

          return;
        }

        if (!projectSlug) {
          return;
        }

        const projectData = await getAdminProjectBySlug(projectSlug);

        if (!isMounted) {
          return;
        }

        setProject(projectData);

        if (projectData) {
          setFormState(mapProjectToForm(projectData));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o projeto.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [isCreating, projectSlug]);

  function updateField(field: keyof ProjectFormState, value: string | boolean) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleTitleChange(title: string) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      title,
      slug:
        isCreating && currentFormState.slug.trim().length === 0
          ? createSlugFromTitle(title)
          : currentFormState.slug,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const input = mapFormToInput(formState);

      if (isCreating) {
        const createdProject = await createProject(input);

        setSuccessMessage("Projeto criado com sucesso.");
        navigate(`/admin/projects/${createdProject.slug}`);

        return;
      }

      if (!project) {
        return;
      }

      const updatedProject = await updateProject(project.id, input);

      setProject(updatedProject);
      setFormState(mapProjectToForm(updatedProject));
      setSuccessMessage("Projeto atualizado com sucesso.");

      if (updatedProject.slug !== projectSlug) {
        navigate(`/admin/projects/${updatedProject.slug}`, {
          replace: true,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o projeto.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell title={pageTitle} description={pageDescription}>
        <LoadingState
          title="Carregando projeto"
          description="Buscando os dados do projeto e categorias."
        />
      </AdminShell>
    );
  }

  if (errorMessage && !isCreating && !project) {
    return (
      <AdminShell title={pageTitle} description={pageDescription}>
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar esse projeto."
          description={errorMessage}
          action={{
            label: "Voltar para projetos",
            to: "/admin/projects",
          }}
        />
      </AdminShell>
    );
  }

  if (!isCreating && !project) {
    return (
      <AdminShell title={pageTitle} description={pageDescription}>
        <ErrorState
          eyebrow="Projeto não encontrado"
          title="Esse projeto não foi localizado no CMS."
          description="Confira se o slug está correto ou volte para a lista de projetos."
          action={{
            label: "Voltar para projetos",
            to: "/admin/projects",
          }}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell title={pageTitle} description={pageDescription}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p>Base</p>
              <h2>Informações principais</h2>
            </div>

            <Link to="/admin/projects" className={styles.backLink}>
              Voltar para lista
            </Link>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Título</span>
              <input
                type="text"
                value={formState.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Slug</span>
              <input
                type="text"
                value={formState.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Categoria</span>
              <select
                value={formState.category_id}
                onChange={(event) =>
                  updateField("category_id", event.target.value)
                }
              >
                <option value="">Sem categoria</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <small>Selecionada: {selectedCategory.slug}</small>
              )}
            </label>

            <label className={styles.field}>
              <span>Status</span>
              <input
                type="text"
                value={formState.status}
                onChange={(event) => updateField("status", event.target.value)}
                placeholder="MVP, Publicado, Em evolução..."
                required
              />
            </label>

            <label className={styles.field}>
              <span>Ano</span>
              <input
                type="number"
                value={formState.project_year}
                onChange={(event) =>
                  updateField("project_year", event.target.value)
                }
                placeholder="2026"
              />
            </label>

            <label className={styles.field}>
              <span>Papel</span>
              <input
                type="text"
                value={formState.role}
                onChange={(event) => updateField("role", event.target.value)}
                placeholder="Desenvolvedor Full Stack"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Descrição curta</span>
            <textarea
              value={formState.short_description}
              rows={3}
              onChange={(event) =>
                updateField("short_description", event.target.value)
              }
              required
            />
          </label>

          <label className={styles.field}>
            <span>Subtítulo</span>
            <textarea
              value={formState.subtitle}
              rows={2}
              onChange={(event) => updateField("subtitle", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Descrição completa</span>
            <textarea
              value={formState.full_description}
              rows={5}
              onChange={(event) =>
                updateField("full_description", event.target.value)
              }
            />
          </label>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p>Case</p>
              <h2>Problema, solução e impacto</h2>
            </div>
          </div>

          <label className={styles.field}>
            <span>Problema</span>
            <textarea
              value={formState.problem}
              rows={4}
              onChange={(event) => updateField("problem", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Solução</span>
            <textarea
              value={formState.solution}
              rows={4}
              onChange={(event) => updateField("solution", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Impacto</span>
            <textarea
              value={formState.impact}
              rows={4}
              onChange={(event) => updateField("impact", event.target.value)}
            />
          </label>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p>Publicação</p>
              <h2>Capa, ordem e visibilidade</h2>
            </div>
          </div>

          <label className={styles.field}>
            <span>URL da imagem de capa</span>
            <input
              type="url"
              value={formState.cover_image_url}
              onChange={(event) =>
                updateField("cover_image_url", event.target.value)
              }
              placeholder="https://..."
            />
          </label>

          <div className={styles.grid}>
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

            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={formState.is_published}
                onChange={(event) =>
                  updateField("is_published", event.target.checked)
                }
              />
              <span>Publicado no site</span>
            </label>

            <label className={styles.checkboxField}>
              <input
                type="checkbox"
                checked={formState.is_featured}
                onChange={(event) =>
                  updateField("is_featured", event.target.checked)
                }
              />
              <span>Mostrar em destaque na Home</span>
            </label>
          </div>
        </section>

        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.actions}>
          {!isCreating && project && (
            <Link
              to={`/project/${project.slug}`}
              target="_blank"
              className={styles.previewLink}
            >
              Ver no site
            </Link>
          )}

          {!isCreating && project && (
            <Link
              to={`/admin/projects/${project.slug}/technologies`}
              className={styles.previewLink}
            >
              Tecnologias
            </Link>
          )}

          {!isCreating && project && (
            <Link
              to={`/admin/projects/${project.slug}/links`}
              className={styles.previewLink}
            >
              Links
            </Link>
          )}
          {!isCreating && project && (
            <Link
              to={`/admin/projects/${project.slug}/images`}
              className={styles.previewLink}
            >
              Imagens
            </Link>
          )}



          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Salvando..."
              : isCreating
                ? "Criar projeto"
                : "Salvar alterações"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

