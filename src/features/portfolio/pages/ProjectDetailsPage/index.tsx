import { useParams } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { getProjectStatusBadgeVariant } from "../../utils/getProjectStatusBadgeVariant";
import { ButtonLink } from "../../../../components/ui/ButtonLink";
import { EmptyState } from "../../../../components/ui/EmptyState";

import { projectDetailsBySlug } from "../../data/mockPortfolioData";

import styles from "./styles.module.css";

export function ProjectDetailsPage() {
  const { projectSlug } = useParams();

  const project = projectSlug ? projectDetailsBySlug[projectSlug] : null;

  if (!project) {
    return (
      <EmptyState
        eyebrow="Projeto não encontrado"
        title="Esse projeto ainda não existe no portfólio."
        description="O projeto pode não ter sido cadastrado ainda ou o endereço pode estar incorreto."
        action={{
          label: "Voltar para a Home",
          to: "/",
          variant: "secondary",
        }}
      />
    );
  }
  

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Detalhe do projeto</p>

        <div className={styles.heroContent}>
          <div>
            <h1>{project.title}</h1>
            <p className={styles.subtitle}>{project.subtitle}</p>
          </div>

          <Badge variant={getProjectStatusBadgeVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
      </section>

      <section className={styles.metaGrid} aria-label="Informações do projeto">
        <div className={styles.metaCard}>
          <span>Categoria</span>
          <strong>{project.category}</strong>
        </div>

        <div className={styles.metaCard}>
          <span>Ano</span>
          <strong>{project.year}</strong>
        </div>

        <div className={styles.metaCard}>
          <span>Papel</span>
          <strong>{project.role}</strong>
        </div>
      </section>

      <section className={styles.preview}>
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={`Preview do projeto ${project.title}`}
            className={styles.coverImage}
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>Preview do projeto</span>
          </div>
        )}
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.contentCard}>
          <p>Problema</p>
          <h2>O contexto do projeto</h2>
          <span>{project.problem}</span>
        </article>

        <article className={styles.contentCard}>
          <p>Solução</p>
          <h2>Como foi resolvido</h2>
          <span>{project.solution}</span>
        </article>

        <article className={styles.contentCard}>
          <p>Impacto</p>
          <h2>O que o projeto demonstra</h2>
          <span>{project.impact}</span>
        </article>
      </section>

      <section className={styles.technologies}>
        <p>Tecnologias</p>

        <div className={styles.techList}>
          {project.technologies.map((technology) => (
            <Badge key={technology} variant="primary">
              {technology}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
