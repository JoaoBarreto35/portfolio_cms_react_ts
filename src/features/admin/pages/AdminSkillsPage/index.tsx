import { FormEvent, useEffect, useMemo, useState } from "react";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  createSkill,
  deleteSkill,
  getAdminSkills,
  updateSkill,
  type SkillInput,
} from "../../../../services/supabase/skillsService";
import type { SkillRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface SkillFormState {
  name: string;
  slug: string;
  group_name: string;
  description: string;

  level_label: string;
  level_value: string;

  icon_name: string;
  color: string;

  order_index: string;
  is_published: boolean;
}

const emptyFormState: SkillFormState = {
  name: "",
  slug: "",
  group_name: "Frontend",
  description: "",

  level_label: "",
  level_value: "",

  icon_name: "",
  color: "#3b82f6",

  order_index: "1",
  is_published: true,
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function createSlugFromName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function mapSkillToForm(skill: SkillRow): SkillFormState {
  return {
    name: skill.name,
    slug: skill.slug,
    group_name: skill.group_name,
    description: skill.description ?? "",

    level_label: skill.level_label ?? "",
    level_value:
      typeof skill.level_value === "number" ? String(skill.level_value) : "",

    icon_name: skill.icon_name ?? "",
    color: skill.color,

    order_index: String(skill.order_index),
    is_published: skill.is_published,
  };
}

function mapFormToInput(formState: SkillFormState): SkillInput {
  const levelValue = Number(formState.level_value);

  return {
    name: formState.name.trim(),
    slug: formState.slug.trim(),
    group_name: formState.group_name.trim() || "Outras",
    description: emptyToNull(formState.description),

    level_label: emptyToNull(formState.level_label),
    level_value:
      formState.level_value.trim().length > 0 && !Number.isNaN(levelValue)
        ? levelValue
        : null,

    icon_name: emptyToNull(formState.icon_name),
    color: formState.color,

    order_index: Number(formState.order_index) || 0,
    is_published: formState.is_published,
  };
}

export function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const [formState, setFormState] = useState<SkillFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId);

  const groupedSkills = useMemo(() => {
    return skills.reduce<Record<string, SkillRow[]>>((accumulator, skill) => {
      const groupName = skill.group_name || "Outras";

      if (!accumulator[groupName]) {
        accumulator[groupName] = [];
      }

      accumulator[groupName].push(skill);

      return accumulator;
    }, {});
  }, [skills]);

  async function loadSkills() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getAdminSkills();

      setSkills(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as skills.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  function updateField(field: keyof SkillFormState, value: string | boolean) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleNameChange(name: string) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      name,
      slug:
        !selectedSkill && currentFormState.slug.trim().length === 0
          ? createSlugFromName(name)
          : currentFormState.slug,
    }));
  }

  function handleCreateNew() {
    setSelectedSkillId(null);
    setFormState({
      ...emptyFormState,
      order_index: String(skills.length + 1),
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSelectSkill(skill: SkillRow) {
    setSelectedSkillId(skill.id);
    setFormState(mapSkillToForm(skill));
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

      if (selectedSkill) {
        await updateSkill(selectedSkill.id, input);
        setSuccessMessage("Skill atualizada com sucesso.");
      } else {
        const createdSkill = await createSkill(input);
        setSelectedSkillId(createdSkill.id);
        setSuccessMessage("Skill criada com sucesso.");
      }

      await loadSkills();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a skill.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!selectedSkill) {
      return;
    }

    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir a skill "${selectedSkill.name}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await deleteSkill(selectedSkill.id);

      setSelectedSkillId(null);
      setFormState(emptyFormState);
      setSuccessMessage("Skill excluída com sucesso.");

      await loadSkills();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a skill.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Skills"
        description="Gerencie competências, tecnologias e níveis exibidos no portfólio."
      >
        <LoadingState
          title="Carregando skills"
          description="Buscando competências cadastradas no CMS."
        />
      </AdminShell>
    );
  }

  if (errorMessage && skills.length === 0) {
    return (
      <AdminShell
        title="Skills"
        description="Gerencie competências, tecnologias e níveis exibidos no portfólio."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar as skills."
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
      title="Skills"
      description="Crie, edite, oculte ou remova competências exibidas na Home."
    >
      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Skills cadastradas</p>
              <h2>{skills.length} registros</h2>
            </div>

            <button type="button" onClick={handleCreateNew}>
              Nova skill
            </button>
          </div>

          <div className={styles.skillGroups}>
            {Object.entries(groupedSkills).map(([groupName, groupSkills]) => (
              <article key={groupName} className={styles.skillGroup}>
                <h3>{groupName}</h3>

                <div className={styles.skillList}>
                  {groupSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      className={
                        skill.id === selectedSkillId
                          ? `${styles.skillItem} ${styles.activeSkillItem}`
                          : styles.skillItem
                      }
                      onClick={() => handleSelectSkill(skill)}
                    >
                      <div>
                        <span>{skill.name}</span>
                        <small>{skill.slug}</small>
                      </div>

                      <div className={styles.itemBadges}>
                        {skill.level_label && (
                          <Badge variant="primary" size="sm">
                            {skill.level_label}
                          </Badge>
                        )}

                        {!skill.is_published && (
                          <Badge variant="warning" size="sm">
                            Oculta
                          </Badge>
                        )}

                        <Badge variant="default" size="sm">
                          #{skill.order_index}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </article>
            ))}

            {skills.length === 0 && (
              <div className={styles.emptyList}>
                Nenhuma skill cadastrada ainda.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>{selectedSkill ? "Editando" : "Nova skill"}</p>
              <h2>{selectedSkill?.name ?? "Cadastrar skill"}</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Nome</span>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="React"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Slug</span>
                <input
                  type="text"
                  value={formState.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="react"
                  required
                />
              </label>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Grupo</span>
                <input
                  type="text"
                  value={formState.group_name}
                  onChange={(event) =>
                    updateField("group_name", event.target.value)
                  }
                  placeholder="Frontend"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Ícone</span>
                <input
                  type="text"
                  value={formState.icon_name}
                  onChange={(event) =>
                    updateField("icon_name", event.target.value)
                  }
                  placeholder="Code, Database, Chart..."
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Descrição</span>
              <textarea
                value={formState.description}
                rows={4}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Resumo curto sobre como essa skill aparece nos projetos."
              />
            </label>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Nível textual</span>
                <input
                  type="text"
                  value={formState.level_label}
                  onChange={(event) =>
                    updateField("level_label", event.target.value)
                  }
                  placeholder="Avançado, Intermediário..."
                />
              </label>

              <label className={styles.field}>
                <span>Nível numérico</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formState.level_value}
                  onChange={(event) =>
                    updateField("level_value", event.target.value)
                  }
                  placeholder="85"
                />
              </label>
            </div>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Cor</span>
                <input
                  type="color"
                  value={formState.color}
                  onChange={(event) => updateField("color", event.target.value)}
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
                checked={formState.is_published}
                onChange={(event) =>
                  updateField("is_published", event.target.checked)
                }
              />
              <span>Publicado no site</span>
            </label>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <div className={styles.actions}>
              {selectedSkill && (
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
                  : selectedSkill
                    ? "Salvar alterações"
                    : "Criar skill"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
