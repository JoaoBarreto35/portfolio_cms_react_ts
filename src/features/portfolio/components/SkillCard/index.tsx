import { Badge } from "../../../../components/ui/Badge";

import styles from "./styles.module.css";

interface SkillCardProps {
  title: string;
  description: string;
  skills: string[];
}

export function SkillCard({ title, description, skills }: SkillCardProps) {
  return (
    <article className={styles.card}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className={styles.skillList}>
        {skills.map((skill) => (
          <Badge key={skill} size="sm">
            {skill}
          </Badge>
        ))}
      </div>
    </article>
  );
}