import type { PortfolioAreaSlug } from "../../../../types/portfolio";
import { portfolioAreaContents } from "../../data/mockPortfolioData";

import styles from "./styles.module.css";

interface PortfolioAreaPageProps {
  areaSlug: PortfolioAreaSlug;
}

export function PortfolioAreaPage({ areaSlug }: PortfolioAreaPageProps) {
  const content = portfolioAreaContents[areaSlug];

  return (
    <div className={`${styles.page} ${styles[areaSlug]}`}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>

        <h1>{content.title}</h1>

        <p className={styles.description}>{content.description}</p>

        <div className={styles.highlights}>
          {content.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
      </section>

      <section className={styles.placeholder}>
        <p>Próxima etapa desta área</p>

        <h2>Projetos filtrados por área</h2>

        <span>
          Futuramente esta seção vai buscar no Supabase apenas os projetos
          vinculados a esta vitrine.
        </span>
      </section>
    </div>
  );
}
