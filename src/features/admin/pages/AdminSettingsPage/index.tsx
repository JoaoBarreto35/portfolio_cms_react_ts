
import { FormEvent, useEffect, useState } from "react";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import {
  getActiveSiteSettings,
  updateSiteSettings,
  type UpdateSiteSettingsInput,
} from "../../../../services/supabase/siteSettingsService";
import type { SiteSettingsRow } from "../../../../types/database";
import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

interface SettingsFormState {
  name: string;
  headline: string;
  subtitle: string;
  bio: string;

  email: string;
  phone: string;
  city: string;

  github_url: string;
  linkedin_url: string;
  whatsapp_url: string;
  resume_url: string;

  profile_image_url: string;

  primary_color: string;
  secondary_color: string;
  accent_color: string;
}

const emptyFormState: SettingsFormState = {
  name: "",
  headline: "",
  subtitle: "",
  bio: "",

  email: "",
  phone: "",
  city: "",

  github_url: "",
  linkedin_url: "",
  whatsapp_url: "",
  resume_url: "",

  profile_image_url: "",

  primary_color: "#3b82f6",
  secondary_color: "#22c55e",
  accent_color: "#a855f7",
};

function mapSettingsToForm(settings: SiteSettingsRow): SettingsFormState {
  return {
    name: settings.name,
    headline: settings.headline,
    subtitle: settings.subtitle ?? "",
    bio: settings.bio ?? "",

    email: settings.email ?? "",
    phone: settings.phone ?? "",
    city: settings.city ?? "",

    github_url: settings.github_url ?? "",
    linkedin_url: settings.linkedin_url ?? "",
    whatsapp_url: settings.whatsapp_url ?? "",
    resume_url: settings.resume_url ?? "",

    profile_image_url: settings.profile_image_url ?? "",

    primary_color: settings.primary_color,
    secondary_color: settings.secondary_color,
    accent_color: settings.accent_color,
  };
}

function emptyToNull(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function mapFormToUpdateInput(formState: SettingsFormState): UpdateSiteSettingsInput {
  return {
    name: formState.name.trim(),
    headline: formState.headline.trim(),
    subtitle: emptyToNull(formState.subtitle),
    bio: emptyToNull(formState.bio),

    email: emptyToNull(formState.email),
    phone: emptyToNull(formState.phone),
    city: emptyToNull(formState.city),

    github_url: emptyToNull(formState.github_url),
    linkedin_url: emptyToNull(formState.linkedin_url),
    whatsapp_url: emptyToNull(formState.whatsapp_url),
    resume_url: emptyToNull(formState.resume_url),

    profile_image_url: emptyToNull(formState.profile_image_url),

    primary_color: formState.primary_color,
    secondary_color: formState.secondary_color,
    accent_color: formState.accent_color,
  };
}

export function AdminSettingsPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsRow | null>(null);
  const [formState, setFormState] = useState<SettingsFormState>(emptyFormState);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getActiveSiteSettings();

        if (!isMounted) {
          return;
        }

        setSiteSettings(data);

        if (data) {
          setFormState(mapSettingsToForm(data));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as configurações.";

        setErrorMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateField(field: keyof SettingsFormState, value: string) {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!siteSettings) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      const updatedSettings = await updateSiteSettings(
        siteSettings.id,
        mapFormToUpdateInput(formState)
      );

      setSiteSettings(updatedSettings);
      setFormState(mapSettingsToForm(updatedSettings));
      setSuccessMessage("Configurações salvas com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as configurações.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell
        title="Configurações"
        description="Editar as informações principais do portfólio."
      >
        <LoadingState
          title="Carregando configurações"
          description="Buscando os dados principais do site."
        />
      </AdminShell>
    );
  }

  if (!siteSettings) {
    return (
      <AdminShell
        title="Configurações"
        description="Editar as informações principais do portfólio."
      >
        <ErrorState
          eyebrow="Configurações não encontradas"
          title="Nenhuma configuração ativa foi localizada."
          description="Confira se o seed de site_settings foi executado no Supabase."
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
      title="Configurações"
      description="Edite os textos, contatos e identidade visual principal do portfólio."
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p>Identidade</p>
            <h2>Informações principais</h2>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span>Nome</span>
              <input
                type="text"
                value={formState.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Headline</span>
              <input
                type="text"
                value={formState.headline}
                onChange={(event) => updateField("headline", event.target.value)}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Subtítulo</span>
              <input
                type="text"
                value={formState.subtitle}
                onChange={(event) => updateField("subtitle", event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Cidade</span>
              <input
                type="text"
                value={formState.city}
                onChange={(event) => updateField("city", event.target.value)}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Bio</span>
            <textarea
              value={formState.bio}
              rows={5}
              onChange={(event) => updateField("bio", event.target.value)}
            />
          </label>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p>Contato</p>
            <h2>Links e canais principais</h2>
          </div>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span>E-mail</span>
              <input
                type="email"
                value={formState.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>Telefone</span>
              <input
                type="text"
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>GitHub</span>
              <input
                type="url"
                value={formState.github_url}
                onChange={(event) => updateField("github_url", event.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>LinkedIn</span>
              <input
                type="url"
                value={formState.linkedin_url}
                onChange={(event) =>
                  updateField("linkedin_url", event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>WhatsApp</span>
              <input
                type="url"
                value={formState.whatsapp_url}
                onChange={(event) =>
                  updateField("whatsapp_url", event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>Currículo</span>
              <input
                type="url"
                value={formState.resume_url}
                onChange={(event) => updateField("resume_url", event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p>Visual</p>
            <h2>Imagem e cores</h2>
          </div>

          <label className={styles.field}>
            <span>URL da foto de perfil</span>
            <input
              type="url"
              value={formState.profile_image_url}
              onChange={(event) =>
                updateField("profile_image_url", event.target.value)
              }
            />
          </label>

          <div className={styles.colorGrid}>
            <label className={styles.field}>
              <span>Cor primária</span>
              <input
                type="color"
                value={formState.primary_color}
                onChange={(event) =>
                  updateField("primary_color", event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>Cor secundária</span>
              <input
                type="color"
                value={formState.secondary_color}
                onChange={(event) =>
                  updateField("secondary_color", event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>Cor de destaque</span>
              <input
                type="color"
                value={formState.accent_color}
                onChange={(event) =>
                  updateField("accent_color", event.target.value)
                }
              />
            </label>
          </div>
        </section>

        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.actions}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar configurações"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
