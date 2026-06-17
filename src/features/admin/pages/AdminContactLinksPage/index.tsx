import { FormEvent, useEffect, useState } from "react";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  createContactLink,
  deleteContactLink,
  getAdminContactLinks,
  updateContactLink,
  type ContactLinkInput,
} from "../../../../services/supabase/contactLinksService";
import type { ContactLinkRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface ContactLinkFormState {
  label: string;
  description: string;
  href: string;
  contact_type: string;
  icon_name: string;
  color: string;
  order_index: string;
  is_published: boolean;
}

const emptyFormState: ContactLinkFormState = {
  label: "",
  description: "",
  href: "",
  contact_type: "external",
  icon_name: "",
  color: "#3b82f6",
  order_index: "1",
  is_published: true,
};

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function mapContactLinkToForm(contactLink: ContactLinkRow): ContactLinkFormState {
  return {
    label: contactLink.label,
    description: contactLink.description ?? "",
    href: contactLink.href,
    contact_type: contactLink.contact_type,
    icon_name: contactLink.icon_name ?? "",
    color: contactLink.color,
    order_index: String(contactLink.order_index),
    is_published: contactLink.is_published,
  };
}

function mapFormToInput(formState: ContactLinkFormState): ContactLinkInput {
  return {
    label: formState.label.trim(),
    description: emptyToNull(formState.description),
    href: formState.href.trim(),
    contact_type: formState.contact_type.trim() || "external",
    icon_name: emptyToNull(formState.icon_name),
    color: formState.color,
    order_index: Number(formState.order_index) || 0,
    is_published: formState.is_published,
  };
}

export function AdminContactLinksPage() {
  const [contactLinks, setContactLinks] = useState<ContactLinkRow[]>([]);
  const [selectedContactLinkId, setSelectedContactLinkId] = useState<
    string | null
  >(null);

  const [formState, setFormState] =
    useState<ContactLinkFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedContactLink = contactLinks.find(
    (contactLink) => contactLink.id === selectedContactLinkId
  );

  async function loadContactLinks() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getAdminContactLinks();

      setContactLinks(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os contatos.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadContactLinks();
  }, []);

  function updateField(field: keyof ContactLinkFormState, value: string | boolean) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  function handleCreateNew() {
    setSelectedContactLinkId(null);
    setFormState(emptyFormState);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSelectContactLink(contactLink: ContactLinkRow) {
    setSelectedContactLinkId(contactLink.id);
    setFormState(mapContactLinkToForm(contactLink));
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

      if (selectedContactLink) {
        await updateContactLink(selectedContactLink.id, input);
        setSuccessMessage("Link atualizado com sucesso.");
      } else {
        const createdContactLink = await createContactLink(input);
        setSelectedContactLinkId(createdContactLink.id);
        setSuccessMessage("Link criado com sucesso.");
      }

      await loadContactLinks();
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
    if (!selectedContactLink) {
      return;
    }

    const shouldDelete = window.confirm(
      `Tem certeza que deseja excluir o link "${selectedContactLink.label}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      await deleteContactLink(selectedContactLink.id);

      setSelectedContactLinkId(null);
      setFormState(emptyFormState);
      setSuccessMessage("Link excluído com sucesso.");

      await loadContactLinks();
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
        title="Contatos"
        description="Gerencie os links de contato exibidos no portfólio."
      >
        <LoadingState
          title="Carregando contatos"
          description="Buscando os links cadastrados no CMS."
        />
      </AdminShell>
    );
  }

  if (errorMessage && contactLinks.length === 0) {
    return (
      <AdminShell
        title="Contatos"
        description="Gerencie os links de contato exibidos no portfólio."
      >
        <ErrorState
          eyebrow="Erro ao carregar"
          title="Não foi possível carregar os contatos."
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
      title="Contatos"
      description="Crie, edite, oculte ou remova links exibidos na seção de contato."
    >
      <div className={styles.layout}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>Links cadastrados</p>
              <h2>Contatos</h2>
            </div>

            <button type="button" onClick={handleCreateNew}>
              Novo link
            </button>
          </div>

          <div className={styles.contactList}>
            {contactLinks.map((contactLink) => (
              <button
                key={contactLink.id}
                type="button"
                className={
                  contactLink.id === selectedContactLinkId
                    ? `${styles.contactItem} ${styles.activeContactItem}`
                    : styles.contactItem
                }
                onClick={() => handleSelectContactLink(contactLink)}
              >
                <span>{contactLink.label}</span>
                <small>{contactLink.href}</small>

                {!contactLink.is_published && (
                  <strong className={styles.draftBadge}>Oculto</strong>
                )}
              </button>
            ))}

            {contactLinks.length === 0 && (
              <div className={styles.emptyList}>
                Nenhum link cadastrado ainda.
              </div>
            )}
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p>{selectedContactLink ? "Editando" : "Novo contato"}</p>
              <h2>{selectedContactLink?.label ?? "Cadastrar link"}</h2>
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
                  placeholder="GitHub"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Tipo</span>
                <input
                  type="text"
                  value={formState.contact_type}
                  onChange={(event) =>
                    updateField("contact_type", event.target.value)
                  }
                  placeholder="github, email, linkedin..."
                  required
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>URL / href</span>
              <input
                type="text"
                value={formState.href}
                onChange={(event) => updateField("href", event.target.value)}
                placeholder="https://github.com/..."
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
                placeholder="Descrição curta que aparece no card de contato."
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
                  placeholder="Github, Mail, Linkedin..."
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

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Cor</span>
                <input
                  type="color"
                  value={formState.color}
                  onChange={(event) => updateField("color", event.target.value)}
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
            </div>

            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            <div className={styles.actions}>
              {selectedContactLink && (
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
                  : selectedContactLink
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
