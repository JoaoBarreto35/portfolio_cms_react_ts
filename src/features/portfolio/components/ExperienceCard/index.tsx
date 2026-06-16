import { Badge } from "../../../../components/ui/Badge";

import styles from "./styles.module.css";

interface ExperienceCardProps {
  company: string;
  role: string;
  employmentType?: string | null;
  location?: string | null;
  description?: string | null;
  highlights: string[];
  tools: string[];
  isCurrent: boolean;
}

export function ExperienceCard({
  company,
  role,
  employmentType,
  location,
  description,
  highlights,
  tools,
  isCurrent,
}: ExperienceCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.company}>{company}</p>
          <h3>{role}</h3>
        </div>

        {isCurrent && <Badge variant="success">Atual</Badge>}
      </div>

      <div className={styles.meta}>
        {employmentType && <span>{employmentType}</span>}
        {location && <span>{location}</span>}
      </div>

      {description && <p className={styles.description}>{description}</p>}

      {highlights.length > 0 && (
        <ul className={styles.highlights}>
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}

      {tools.length > 0 && (
        <div className={styles.tools}>
          {tools.map((tool) => (
            <Badge key={tool} variant="default" size="sm">
              {tool}
            </Badge>
          ))}
        </div>
      )}
    </article>
  );
}
