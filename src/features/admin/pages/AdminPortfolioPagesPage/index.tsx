import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  getAdminPortfolioPages,
  updatePortfolioPage,
  type PortfolioPageInput,
} from "../../../../services/supabase/portfolioPagesService";
import type { PortfolioPageRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface PortfolioPageFormState {
  eyebrow: string;
  title: string;
  description: string;
  order_index: string;
  is_active: boolean;
}

const emptyFormState: PortfolioPageFormState = {
  eyebrow: "",
  title: "",
  description: "",
  order_index: "1",
  is_active: true,
};

function mapPortfolioPageToForm(
  portfolioPage: PortfolioPageRow
): PortfolioPageFormState {
  return {
    eyebrow: portfolioPage.eyebrow,
    title: portfolioPage.title,
    description: portfolioPage.description,
    order_index: String(portfolioPage.order_index),
    is_active: portfolioPage.is_active,
  };
}

function mapFormToInput(
  formState: PortfolioPageFormState
): PortfolioPageInput {
  return {
    eyebrow: formState.eyebrow.trim(),
    title: formState.title.trim(),
    description: formState.description.trim(),
    order_index: Number(formState.order_index) || 0,
    is_active: formState.is_active,
  };
}

export function AdminPortfolioPagesPage() {
  const [portfolioPages, setPortfolioPages] = useState<PortfolioPageRow[]>([]);
  const [selectedPortfolioPageId, setSelectedPortfolioPageId] = useState<
    string | null
  >(null);

  const [formState, setFormState] =
    useState<PortfolioPageFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedPortfolioPage = portfolioPages.find(
    (portfolioPage) => portfolioPage.id === selectedPortfolioPageId
  );

  async function loadPortfolioPages() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getAdminPortfolioPages();

      setPortfolioPages(data);

      if (data.length > 0 && !selectedPortfolioPageId) {
        setSelectedPortfolioPageId(data[0].id);
        setFormState(mapPortfolioPageToForm(data[0]));
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar as vitrines.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPortfolioPages();
  }, []);

  function updateField(
    field: keyof PortfolioPageFormState,
    value: string | boolean
  ) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleSelectPortfolioPage(portfolioPage: PortfolioPageRow) {
    setSelectedPortfolioPageId(portfolioPage.id);
    setFormState(mapPortfolioPageToForm(portfolioPage));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPortfolioPage) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const updatedPortfolioPage = await updatePortfolioPage(
        selectedPortfolioPage.id,
        mapFormToInput(formState)
      );

      setPortfolioPages((currentPortfolioPages) =>
        currentPortfolioPages.map((portfolioPage) =>
          portfolioPage.id === updatedPortfolioPage.id
            ? updatedPortfolioPage
            : portfolioPage
        )
      );

      setFormState(mapPortfolioPageToForm(updatedPortfolioPage));
      setSuccessMessage("Vitrine atualizada com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a vitrine.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Vitrines"
        description="Gerencie os textos das páginas públicas por área."
      >
        <LoadingState
          title="Carregando vitrines"
          description="Buscando páginas cadastradas no CMS."
        />
      </AdminShell>
    );
  }

  if (errorMessage && portfolioPages.length === 0) {
    return (
      <AdminShell
        title="Vitrines"
        description="Gerencie os textos das páginas públicas por área."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar as vitrines."
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
      title="Vitrines"
      description="Edite os textos das páginas Web, Dados, Automação e Games."
    >
      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Páginas públicas</p>
              <h2>{portfolioPages.length} vitrines</h2>
            </div>
          </div>

          <div className={styles.pageList}>
            {portfolioPages.map((portfolioPage) => (
              <button
                key={portfolioPage.id}
                type="button"
                className={
                  portfolioPage.id === selectedPortfolioPageId
                    ? `${styles.pageItem} ${styles.activePageItem}`
                    : styles.pageItem
                }
                onClick={() => handleSelectPortfolioPage(portfolioPage)}
              >
                <div>
                  <span>{portfolioPage.title}</span>
                  <small>/{portfolioPage.slug}</small>
                </div>

                {portfolioPage.is_active ? (
                  <Badge variant="success" size="sm">
                    Ativa
                  </Badge>
                ) : (
                  <Badge variant="warning" size="sm">
                    Oculta
                  </Badge>
                )}
              </button>
            ))}

            {portfolioPages.length === 0 && (
              <div className={styles.emptyList}>
                Nenhuma vitrine cadastrada ainda.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          {selectedPortfolioPage ? (
            <>
              <div className={styles.formHeader}>
                <div>
                  <p>Editando vitrine</p>
                  <h2>{selectedPortfolioPage.title}</h2>
                  <span>
                    Slug fixo: <strong>/{selectedPortfolioPage.slug}</strong>
                  </span>
                </div>

                <div className={styles.formHeaderActions}>
                  {selectedPortfolioPage.slug !== "home" && (
                    <Link to={`/${selectedPortfolioPage.slug}`} target="_blank">
                      Ver página
                    </Link>
                  )}

                  <Link to={`/admin/pages/${selectedPortfolioPage.slug}/projects`}>
                    Projetos da vitrine
                  </Link>
                </div>
              </div>

              <div className={styles.warningBox}>
                O slug não será editado por aqui para não quebrar as rotas
                públicas do portfólio.
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span>Eyebrow</span>
                  <input
                    type="text"
                    value={formState.eyebrow}
                    onChange={(event) =>
                      updateField("eyebrow", event.target.value)
                    }
                    placeholder="Desenvolvimento Web"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Título</span>
                  <input
                    type="text"
                    value={formState.title}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span>Descrição</span>
                  <textarea
                    value={formState.description}
                    rows={6}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    required
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
                      checked={formState.is_active}
                      onChange={(event) =>
                        updateField("is_active", event.target.checked)
                      }
                    />
                    <span>Página ativa</span>
                  </label>
                </div>

                {errorMessage && (
                  <div className={styles.errorMessage}>{errorMessage}</div>
                )}

                {successMessage && (
                  <div className={styles.successMessage}>
                    {successMessage}
                  </div>
                )}

                <div className={styles.actions}>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar vitrine"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className={styles.emptyList}>
              Selecione uma vitrine para editar.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}