import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  createPortfolioPageHighlight,
  deletePortfolioPageHighlight,
  getPortfolioPageHighlightsByPageId,
  updatePortfolioPageHighlight,
  type PortfolioPageHighlightInput,
} from "../../../../services/supabase/portfolioPageHighlightsService";
import { getAdminPortfolioPages } from "../../../../services/supabase/portfolioPagesService";
import type {
  PortfolioPageHighlightRow,
  PortfolioPageRow,
} from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface HighlightFormState {
  label: string;
  description: string;

  icon_name: string;
  color: string;

  order_index: string;
  is_visible: boolean;
}

const emptyFormState: HighlightFormState = {
  label: "",
  description: "",

  icon_name: "",
  color: "#3b82f6",

  order_index: "1",
  is_visible: true,
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function mapHighlightToForm(
  highlight: PortfolioPageHighlightRow
): HighlightFormState {
  return {
    label: highlight.label,
    description: highlight.description ?? "",

    icon_name: highlight.icon_name ?? "",
    color: highlight.color,

    order_index: String(highlight.order_index),
    is_visible: highlight.is_visible,
  };
}

function mapFormToInput(
  pageId: string,
  formState: HighlightFormState
): PortfolioPageHighlightInput {
  return {
    page_id: pageId,

    label: formState.label.trim(),
    description: emptyToNull(formState.description),

    icon_name: emptyToNull(formState.icon_name),
    color: formState.color,

    order_index: Number(formState.order_index) || 0,
    is_visible: formState.is_visible,
  };
}

export function AdminPortfolioPageHighlightsPage() {
  const { pageSlug } = useParams();

  const [portfolioPage, setPortfolioPage] = useState<PortfolioPageRow | null>(
    null
  );

  const [highlights, setHighlights] = useState<PortfolioPageHighlightRow[]>([]);

  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(
    null
  );

  const [formState, setFormState] =
    useState<HighlightFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedHighlight = highlights.find(
    (highlight) => highlight.id === selectedHighlightId
  );

  async function loadHighlights(pageId: string) {
    const highlightsData = await getPortfolioPageHighlightsByPageId(pageId);
    setHighlights(highlightsData);
  }

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

        const pagesData = await getAdminPortfolioPages();

        if (!isMounted) {
          return;
        }

        const currentPage = pagesData.find((page) => page.slug === pageSlug);

        setPortfolioPage(currentPage ?? null);

        if (!currentPage) {
          return;
        }

        const highlightsData = await getPortfolioPageHighlightsByPageId(
          currentPage.id
        );

        if (!isMounted) {
          return;
        }

        setHighlights(highlightsData);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os destaques da vitrine.";

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

  function updateField(field: keyof HighlightFormState, value: string | boolean) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleCreateNew() {
    setSelectedHighlightId(null);
    setFormState({
      ...emptyFormState,
      order_index: String(highlights.length + 1),
    });
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSelectHighlight(highlight: PortfolioPageHighlightRow) {
    setSelectedHighlightId(highlight.id);
    setFormState(mapHighlightToForm(highlight));
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!portfolioPage) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const input = mapFormToInput(portfolioPage.id, formState);

      if (selectedHighlight) {
        await updatePortfolioPageHighlight(selectedHighlight.id, input);
        setSuccessMessage("Destaque atualizado com sucesso.");
      } else {
        const createdHighlight = await createPortfolioPageHighlight(input);
        setSelectedHighlightId(createdHighlight.id);
        setSuccessMessage("Destaque criado com sucesso.");
      }

      await loadHighlights(portfolioPage.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o destaque.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!portfolioPage || !selectedHighlight) {
      return;
    }

    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir o destaque "${selectedHighlight.label}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await deletePortfolioPageHighlight(selectedHighlight.id);

      setSelectedHighlightId(null);
      setFormState(emptyFormState);
      setSuccessMessage("Destaque excluído com sucesso.");

      await loadHighlights(portfolioPage.id);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o destaque.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Destaques da vitrine"
        description="Gerencie os cards de destaque das páginas públicas."
      >
        <LoadingState
          title="Carregando destaques"
          description="Buscando vitrine e destaques cadastrados."
        />
      </AdminShell>
    );
  }

  if (errorMessage && !portfolioPage) {
    return (
      <AdminShell
        title="Destaques da vitrine"
        description="Gerencie os cards de destaque das páginas públicas."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar os destaques."
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
        title="Destaques da vitrine"
        description="Gerencie os cards de destaque das páginas públicas."
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
      title="Destaques da vitrine"
      description={`Gerencie os destaques exibidos em "/${portfolioPage.slug}".`}
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

          <Link to={`/admin/pages/${portfolioPage.slug}/projects`}>
            Projetos
          </Link>

          <Link to="/admin/pages">Voltar para vitrines</Link>
        </div>
      </div>

      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Destaques cadastrados</p>
              <h2>{highlights.length} destaques</h2>
            </div>

            <button type="button" onClick={handleCreateNew}>
              Novo destaque
            </button>
          </div>

          <div className={styles.highlightList}>
            {highlights.map((highlight) => (
              <button
                key={highlight.id}
                type="button"
                className={
                  highlight.id === selectedHighlightId
                    ? `${styles.highlightItem} ${styles.activeHighlightItem}`
                    : styles.highlightItem
                }
                onClick={() => handleSelectHighlight(highlight)}
              >
                <div>
                  <span>{highlight.label}</span>
                  <small>{highlight.description ?? "Sem descrição"}</small>
                </div>

                <div className={styles.itemBadges}>
                  {!highlight.is_visible && (
                    <Badge variant="warning" size="sm">
                      Oculto
                    </Badge>
                  )}

                  <Badge variant="default" size="sm">
                    #{highlight.order_index}
                  </Badge>
                </div>
              </button>
            ))}

            {highlights.length === 0 && (
              <div className={styles.emptyList}>
                Nenhum destaque cadastrado para esta vitrine.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>{selectedHighlight ? "Editando" : "Novo destaque"}</p>
              <h2>{selectedHighlight?.label ?? "Cadastrar destaque"}</h2>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Rótulo</span>
              <input
                type="text"
                value={formState.label}
                onChange={(event) => updateField("label", event.target.value)}
                placeholder="React + TypeScript"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Descrição</span>
              <textarea
                value={formState.description}
                rows={4}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Texto curto explicando esse destaque."
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
                  placeholder="Code, Database, Zap..."
                />
              </label>

              <label className={styles.field}>
                <span>Cor</span>
                <input
                  type="color"
                  value={formState.color}
                  onChange={(event) => updateField("color", event.target.value)}
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
                  checked={formState.is_visible}
                  onChange={(event) =>
                    updateField("is_visible", event.target.checked)
                  }
                />
                <span>Visível na vitrine</span>
              </label>
            </div>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <div className={styles.actions}>
              {selectedHighlight && (
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
                  : selectedHighlight
                    ? "Salvar alterações"
                    : "Criar destaque"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}

