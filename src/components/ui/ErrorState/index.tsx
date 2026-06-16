import type { ReactNode } from "react";

import { ButtonLink } from "../ButtonLink";

import styles from "./styles.module.css";

type ErrorStateAlign = "left" | "center";

interface ErrorStateAction {
  label: string;
  to: string;
}

interface ErrorStateProps {
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  action?: ErrorStateAction;
  align?: ErrorStateAlign;
}

export function ErrorState({
  eyebrow = "Erro",
  title = "Não foi possível carregar este conteúdo.",
  description = "Tente novamente em alguns instantes ou volte para a página inicial.",
  action,
  align = "left",
}: ErrorStateProps) {
  return (
    <section className={`${styles.errorState} ${styles[align]}`} role="alert">
      <p className={styles.eyebrow}>{eyebrow}</p>

      <h2>{title}</h2>

      <div className={styles.description}>{description}</div>

      {action ? (
        <div className={styles.action}>
          <ButtonLink to={action.to} variant="secondary">
            {action.label}
          </ButtonLink>
        </div>
      ) : null}
    </section>
  );
}
