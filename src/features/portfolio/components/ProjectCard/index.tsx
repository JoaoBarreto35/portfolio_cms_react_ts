import { Link } from "react-router-dom";

import { Badge } from "../../../../components/ui/Badge";
import { getProjectStatusBadgeVariant } from "../../utils/getProjectStatusBadgeVariant";


import styles from "./styles.module.css";

interface ProjectCardProps {
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  technologies: string[];
  coverImageUrl?: string | null;
}

export function ProjectCard({
  title,
  slug,
  description,
  category,
  status,
  technologies,
  coverImageUrl,
}: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <Link to={`/project/${slug}`} className={styles.imageWrapper}>
        {coverImageUrl ? (
          <img src={coverImageUrl} alt={`Preview do projeto ${title}`} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{title}</span>
          </div>
        )}
      </Link>

      <div className={styles.content}>
        <div className={styles.meta}>
          <Badge variant="primary" size="sm">
            {category}
          </Badge>

          <Badge variant={getProjectStatusBadgeVariant(status)} size="sm">
            {status}
          </Badge>
        </div>

        <div className={styles.text}>
          <h3>
            <Link to={`/project/${slug}`}>{title}</Link>
          </h3>

          <p>{description}</p>
        </div>

        <div className={styles.techList}>
          {technologies.slice(0, 4).map((technology) => (
            <Badge key={technology} size="sm">
              {technology}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}