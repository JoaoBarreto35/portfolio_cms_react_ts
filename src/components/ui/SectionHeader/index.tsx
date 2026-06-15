import styles from "./styles.module.css";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div className={`${styles.sectionHeader} ${styles[align]}`}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}

      <h2>{title}</h2>

      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}