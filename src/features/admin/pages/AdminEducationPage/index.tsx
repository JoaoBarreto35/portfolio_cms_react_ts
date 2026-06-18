import { FormEvent, useEffect, useState } from "react";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  createEducation,
  deleteEducation,
  getAdminEducation,
  updateEducation,
  type EducationInput,
} from "../../../../services/supabase/educationService";
import type { EducationRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface EducationFormState {
  title: string;
  institution: string;
  education_type: string;

  start_date: string;
  end_date: string;
  is_current: boolean;

  description: string;
  certificate_url: string;

  order_index: string;
  is_published: boolean;
}

const emptyFormState: EducationFormState = {
  title: "",
  institution: "",
  education_type: "",

  start_date: "",
  end_date: "",
  is_current: false,

  description: "",
  certificate_url: "",

  order_index: "1",
  is_published: true,
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function mapEducationToForm(education: EducationRow): EducationFormState {
  return {
    title: education.title,
    institution: education.institution,
    education_type: education.education_type ?? "",

    start_date: education.start_date ?? "",
    end_date: education.end_date ?? "",
    is_current: education.is_current,

    description: education.description ?? "",
    certificate_url: education.certificate_url ?? "",

    order_index: String(education.order_index),
    is_published: education.is_published,
  };
}

function mapFormToInput(formState: EducationFormState): EducationInput {
  return {
    title: formState.title.trim(),
    institution: formState.institution.trim(),
    education_type: emptyToNull(formState.education_type),

    start_date: emptyToNull(formState.start_date),
    end_date: formState.is_current ? null : emptyToNull(formState.end_date),
    is_current: formState.is_current,

    description: emptyToNull(formState.description),
    certificate_url: emptyToNull(formState.certificate_url),

    order_index: Number(formState.order_index) || 0,
    is_published: formState.is_published,
  };
}

export function AdminEducationPage() {
  const [educationItems, setEducationItems] = useState<EducationRow[]>([]);
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(
    null
  );

  const [formState, setFormState] =
    useState<EducationFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedEducation = educationItems.find(
    (education) => education.id === selectedEducationId
  );

  async function loadEducationItems() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getAdminEducation();

      setEducationItems(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as formações.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEducationItems();
  }, []);

  function updateField(
    field: keyof EducationFormState,
    value: string | boolean
  ) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleCreateNew() {
    setSelectedEducationId(null);
    setFormState({
      ...emptyFormState,
      order_index: String(educationItems.length + 1),
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSelectEducation(education: EducationRow) {
    setSelectedEducationId(education.id);
    setFormState(mapEducationToForm(education));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const input = mapFormToInput(formState);

      if (selectedEducation) {
        await updateEducation(selectedEducation.id, input);
        setSuccessMessage("Formação atualizada com sucesso.");
      } else {
        const createdEducation = await createEducation(input);
        setSelectedEducationId(createdEducation.id);
        setSuccessMessage("Formação criada com sucesso.");
      }

      await loadEducationItems();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a formação.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedEducation) {
      return;
    }

    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir "${selectedEducation.title}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await deleteEducation(selectedEducation.id);

      setSelectedEducationId(null);
      setFormState(emptyFormState);
      setSuccessMessage("Formação excluída com sucesso.");

      await loadEducationItems();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a formação.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Formações"
        description="Gerencie graduação, cursos e certificados exibidos no portfólio."
      >
        <LoadingState
          title="Carregando formações"
          description="Buscando formações cadastradas no CMS."
        />
      </AdminShell>
    );
  }

  if (errorMessage && educationItems.length === 0) {
    return (
      <AdminShell
        title="Formações"
        description="Gerencie graduação, cursos e certificados exibidos no portfólio."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar as formações."
          description={errorMessage}
          action={{
            label: "Voltar ao dashboard",
            to: "/admin",
          }}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Formações"
      description="Crie, edite, oculte ou remova formações, cursos e certificados."
    >
      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Formações cadastradas</p>
              <h2>{educationItems.length} registros</h2>
            </div>

            <button type="button" onClick={handleCreateNew}>
              Nova formação
            </button>
          </div>

          <div className={styles.educationList}>
            {educationItems.map((education) => (
              <button
                key={education.id}
                type="button"
                className={
                  education.id === selectedEducationId
                    ? `${styles.educationItem} ${styles.activeEducationItem}`
                    : styles.educationItem
                }
                onClick={() => handleSelectEducation(education)}
              >
                <div>
                  <span>{education.title}</span>
                  <small>{education.institution}</small>
                </div>

                <div className={styles.itemBadges}>
                  {education.is_current && (
                    <Badge variant="success" size="sm">
                      Atual
                    </Badge>
                  )}

                  {!education.is_published && (
                    <Badge variant="warning" size="sm">
                      Oculta
                    </Badge>
                  )}

                  <Badge variant="default" size="sm">
                    #{education.order_index}
                  </Badge>
                </div>
              </button>
            ))}

            {educationItems.length === 0 && (
              <div className={styles.emptyList}>
                Nenhuma formação cadastrada ainda.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>{selectedEducation ? "Editando" : "Nova formação"}</p>
              <h2>{selectedEducation?.title ?? "Cadastrar formação"}</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Título</span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Análise e Desenvolvimento de Sistemas"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Instituição</span>
                <input
                  type="text"
                  value={formState.institution}
                  onChange={(event) =>
                    updateField("institution", event.target.value)
                  }
                  placeholder="UNINTER"
                  required
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Tipo</span>
              <input
                type="text"
                value={formState.education_type}
                onChange={(event) =>
                  updateField("education_type", event.target.value)
                }
                placeholder="Graduação, Curso livre, Certificação..."
              />
            </label>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Data de início</span>
                <input
                  type="date"
                  value={formState.start_date}
                  onChange={(event) =>
                    updateField("start_date", event.target.value)
                  }
                />
              </label>

              <label className={styles.field}>
                <span>Data de fim</span>
                <input
                  type="date"
                  value={formState.end_date}
                  onChange={(event) =>
                    updateField("end_date", event.target.value)
                  }
                  disabled={formState.is_current}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Descrição</span>
              <textarea
                value={formState.description}
                rows={5}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Resumo do curso, aprendizados principais ou contexto."
              />
            </label>

            <label className={styles.field}>
              <span>URL do certificado</span>
              <input
                type="url"
                value={formState.certificate_url}
                onChange={(event) =>
                  updateField("certificate_url", event.target.value)
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
                  checked={formState.is_current}
                  onChange={(event) =>
                    updateField("is_current", event.target.checked)
                  }
                />
                <span>Formação atual</span>
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
            </div>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <div className={styles.actions}>
              {selectedEducation && (
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
                  : selectedEducation
                    ? "Salvar alterações"
                    : "Criar formação"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
