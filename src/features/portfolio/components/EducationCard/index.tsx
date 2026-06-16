import { Badge } from "../../../../components/ui/Badge";

import styles from "./styles.module.css";

interface EducationCardProps {
  title: string;
  institution: string;
  educationType: string;
  description?: string | null;
  certificateUrl?: string | null;
  isCurrent: boolean;
}

export function EducationCard({
  title,
  institution,
  educationType,
  description,
  certificateUrl,
  isCurrent,
}: EducationCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.type}>{educationType}</p>
          <h3>{title}</h3>
          <span>{institution}</span>
        </div>

        {isCurrent && <Badge variant="success">Em andamento</Badge>}
      </div>

      {description && <p className={styles.description}>{description}</p>}

      {certificateUrl && (
        <a
          href={certificateUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.certificateLink}
        >
          Ver certificado
        </a>
      )}
    </article>
  );
}
