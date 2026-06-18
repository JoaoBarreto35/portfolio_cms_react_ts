import { FormEvent, useEffect, useState } from "react";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  createExperience,
  deleteExperience,
  getAdminExperiences,
  updateExperience,
  type ExperienceInput,
} from "../../../../services/supabase/experiencesService";
import type { ExperienceRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface ExperienceFormState {
  company: string;
  role: string;
  employment_type: string;
  location: string;

  start_date: string;
  end_date: string;
  is_current: boolean;

  description: string;
  highlights: string;
  tools: string;

  order_index: string;
  is_published: boolean;
}

const emptyFormState: ExperienceFormState = {
  company: "",
  role: "",
  employment_type: "",
  location: "",

  start_date: "",
  end_date: "",
  is_current: false,

  description: "",
  highlights: "",
  tools: "",

  order_index: "1",
  is_published: true,
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function textToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToText(value: string[] | null | undefined) {
  return value?.join("\n") ?? "";
}

function mapExperienceToForm(experience: ExperienceRow): ExperienceFormState {
  return {
    company: experience.company,
    role: experience.role,
    employment_type: experience.employment_type ?? "",
    location: experience.location ?? "",

    start_date: experience.start_date,
    end_date: experience.end_date ?? "",
    is_current: experience.is_current,

    description: experience.description ?? "",
    highlights: arrayToText(experience.highlights),
    tools: arrayToText(experience.tools),

    order_index: String(experience.order_index),
    is_published: experience.is_published,
  };
}

function mapFormToInput(formState: ExperienceFormState): ExperienceInput {
  return {
    company: formState.company.trim(),
    role: formState.role.trim(),
    employment_type: emptyToNull(formState.employment_type),
    location: emptyToNull(formState.location),

    start_date: formState.start_date,
    end_date: formState.is_current ? null : emptyToNull(formState.end_date),
    is_current: formState.is_current,

    description: emptyToNull(formState.description),
    highlights: textToArray(formState.highlights),
    tools: textToArray(formState.tools),

    order_index: Number(formState.order_index) || 0,
    is_published: formState.is_published,
  };
}

export function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<ExperienceRow[]>([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(
    null
  );

  const [formState, setFormState] =
    useState<ExperienceFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedExperience = experiences.find(
    (experience) => experience.id === selectedExperienceId
  );

  async function loadExperiences() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getAdminExperiences();

      setExperiences(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as experiências.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadExperiences();
  }, []);

  function updateField(
    field: keyof ExperienceFormState,
    value: string | boolean
  ) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleCreateNew() {
    setSelectedExperienceId(null);
    setFormState({
      ...emptyFormState,
      order_index: String(experiences.length + 1),
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSelectExperience(experience: ExperienceRow) {
    setSelectedExperienceId(experience.id);
    setFormState(mapExperienceToForm(experience));
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

      if (selectedExperience) {
        await updateExperience(selectedExperience.id, input);
        setSuccessMessage("Experiência atualizada com sucesso.");
      } else {
        const createdExperience = await createExperience(input);
        setSelectedExperienceId(createdExperience.id);
        setSuccessMessage("Experiência criada com sucesso.");
      }

      await loadExperiences();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a experiência.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedExperience) {
      return;
    }

    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir "${selectedExperience.role}" em "${selectedExperience.company}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await deleteExperience(selectedExperience.id);

      setSelectedExperienceId(null);
      setFormState(emptyFormState);
      setSuccessMessage("Experiência excluída com sucesso.");

      await loadExperiences();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a experiência.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Experiências"
        description="Gerencie sua trajetória profissional exibida no portfólio."
      >
        <LoadingState
          title="Carregando experiências"
          description="Buscando experiências cadastradas no CMS."
        />
      </AdminShell>
    );
  }

  if (errorMessage && experiences.length === 0) {
    return (
      <AdminShell
        title="Experiências"
        description="Gerencie sua trajetória profissional exibida no portfólio."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar as experiências."
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
      title="Experiências"
      description="Crie, edite, oculte ou remova experiências profissionais."
    >
      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Experiências cadastradas</p>
              <h2>{experiences.length} registros</h2>
            </div>

            <button type="button" onClick={handleCreateNew}>
              Nova experiência
            </button>
          </div>

          <div className={styles.experienceList}>
            {experiences.map((experience) => (
              <button
                key={experience.id}
                type="button"
                className={
                  experience.id === selectedExperienceId
                    ? `${styles.experienceItem} ${styles.activeExperienceItem}`
                    : styles.experienceItem
                }
                onClick={() => handleSelectExperience(experience)}
              >
                <div>
                  <span>{experience.role}</span>
                  <small>{experience.company}</small>
                </div>

                <div className={styles.itemBadges}>
                  {experience.is_current && (
                    <Badge variant="success" size="sm">
                      Atual
                    </Badge>
                  )}

                  {!experience.is_published && (
                    <Badge variant="warning" size="sm">
                      Oculta
                    </Badge>
                  )}

                  <Badge variant="default" size="sm">
                    #{experience.order_index}
                  </Badge>
                </div>
              </button>
            ))}

            {experiences.length === 0 && (
              <div className={styles.emptyList}>
                Nenhuma experiência cadastrada ainda.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>{selectedExperience ? "Editando" : "Nova experiência"}</p>
              <h2>{selectedExperience?.role ?? "Cadastrar experiência"}</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Empresa</span>
                <input
                  type="text"
                  value={formState.company}
                  onChange={(event) =>
                    updateField("company", event.target.value)
                  }
                  placeholder="Manserv / Cliente Embraer"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Cargo</span>
                <input
                  type="text"
                  value={formState.role}
                  onChange={(event) => updateField("role", event.target.value)}
                  placeholder="Planner de Manutenção"
                  required
                />
              </label>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Tipo de vínculo</span>
                <input
                  type="text"
                  value={formState.employment_type}
                  onChange={(event) =>
                    updateField("employment_type", event.target.value)
                  }
                  placeholder="CLT, Projeto próprio, Freelancer..."
                />
              </label>

              <label className={styles.field}>
                <span>Local</span>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="Jacareí - SP"
                />
              </label>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Data de início</span>
                <input
                  type="date"
                  value={formState.start_date}
                  onChange={(event) =>
                    updateField("start_date", event.target.value)
                  }
                  required
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
                placeholder="Resumo da experiência..."
              />
            </label>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Destaques</span>
                <textarea
                  value={formState.highlights}
                  rows={6}
                  onChange={(event) =>
                    updateField("highlights", event.target.value)
                  }
                  placeholder={"Um destaque por linha\nEx: Planejamento de manutenção\nEx: Controle de indicadores"}
                />
              </label>

              <label className={styles.field}>
                <span>Ferramentas</span>
                <textarea
                  value={formState.tools}
                  rows={6}
                  onChange={(event) => updateField("tools", event.target.value)}
                  placeholder={"Uma ferramenta por linha\nEx: Excel\nEx: Power BI\nEx: SAP"}
                />
              </label>
            </div>

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
                <span>Experiência atual</span>
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
              {selectedExperience && (
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
                  : selectedExperience
                    ? "Salvar alterações"
                    : "Criar experiência"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
