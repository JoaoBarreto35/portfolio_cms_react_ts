import type { PortfolioAreaSlug } from "../../../../types/portfolio";
import { ProjectCard } from "../../components/ProjectCard";
import { EmptyState } from "../../../../components/ui/EmptyState";

import {
  projects,
  portfolioAreaContents,
} from "../../data/mockPortfolioData";

import styles from "./styles.module.css";

interface PortfolioAreaPageProps {
  areaSlug: PortfolioAreaSlug;
}

export function PortfolioAreaPage({ areaSlug }: PortfolioAreaPageProps) {
  const content = portfolioAreaContents[areaSlug];

  const areaProjects = projects.filter((project) =>
    project.areaSlugs.includes(areaSlug),
  );

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

      <section className={styles.projects}>
        <div className={styles.sectionHeader}>
          <p>Projetos da área</p>
          <h2>Projetos vinculados a esta vitrine.</h2>
          <span>
            Nesta fase, os dados ainda são mockados. Depois essa relação virá
            do Supabase.
          </span>
        </div>

        {areaProjects.length > 0 ? (
          <div className={styles.projectGrid}>
            {areaProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                slug={project.slug}
                description={project.description}
                category={project.category}
                status={project.status}
                technologies={project.technologies}
                coverImageUrl={project.coverImageUrl}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="Nenhum projeto cadastrado ainda"
            title="Esta vitrine já está pronta para receber projetos."
            description="Em breve vamos cadastrar projetos específicos para esta área. Depois, essa lista será alimentada diretamente pelo Supabase."
          />
        )}
      </section>
    </div>
  );
}
