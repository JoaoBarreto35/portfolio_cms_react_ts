import type { ReactNode } from "react";

import { ButtonLink } from "../ButtonLink";

import styles from "./styles.module.css";

type EmptyStateAlign = "left" | "center";
type EmptyStateActionVariant = "primary" | "secondary" | "ghost";

interface EmptyStateAction {
  label: string;
  to: string;
  variant?: EmptyStateActionVariant;
}

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  action?: EmptyStateAction;
  align?: EmptyStateAlign;
}

export function EmptyState({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: EmptyStateProps) {
  return (
    <section className={`${styles.emptyState} ${styles[align]}`}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}

      <h2>{title}</h2>

      <div className={styles.description}>{description}</div>

      {action ? (
        <div className={styles.action}>
          <ButtonLink to={action.to} variant={action.variant ?? "secondary"}>
            {action.label}
          </ButtonLink>
        </div>
      ) : null}
    </section>
  );
}
