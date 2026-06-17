import { useParams } from "react-router-dom";
import { Badge } from "../../../../components/ui/Badge";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { ErrorState } from "../../../../components/ui/ErrorState";
import { LoadingState } from "../../../../components/ui/LoadingState";
import { getProjectStatusBadgeVariant } from "../../utils/getProjectStatusBadgeVariant";
import { useProjectDetails } from "../../hooks/useProjectDetails";
import { projectDetailsBySlug } from "../../data/mockPortfolioData";

import styles from "./styles.module.css";

export function ProjectDetailsPage() {
  const { projectSlug } = useParams();

  const {
    projectDetails: supabaseProjectDetails,
    isLoading,
    errorMessage,
  } = useProjectDetails(projectSlug);

  const localProject = projectSlug ? projectDetailsBySlug[projectSlug] : null;

  const project = supabaseProjectDetails
    ? {
        title: supabaseProjectDetails.title,
        slug: supabaseProjectDetails.slug,
        subtitle:
          supabaseProjectDetails.subtitle ??
          supabaseProjectDetails.short_description,
        category: supabaseProjectDetails.category,
        year: supabaseProjectDetails.project_year
          ? String(supabaseProjectDetails.project_year)
          : "Em evolução",
        status: supabaseProjectDetails.status,
        role: supabaseProjectDetails.role ?? "Desenvolvedor",
        technologies: supabaseProjectDetails.technologies,
        problem:
          supabaseProjectDetails.problem ?? "Problema ainda não detalhado.",
        solution:
          supabaseProjectDetails.solution ?? "Solução ainda não detalhada.",
        impact: supabaseProjectDetails.impact ?? "Impacto ainda não detalhado.",
        coverImageUrl: supabaseProjectDetails.cover_image_url,
        links: supabaseProjectDetails.links,
        images: supabaseProjectDetails.images,
      }
    : localProject
      ? {
          ...localProject,
          links: [],
          images: [],
        }
      : null;

  if (!projectSlug) {
    return (
      <EmptyState
        eyebrow="Projeto não informado"
        title="Nenhum projeto foi selecionado."
        description="Volte para a Home ou acesse uma das vitrines para escolher um projeto."
        action={{
          label: "Voltar para a Home",
          to: "/",
          variant: "secondary",
        }}
      />
    );
  }

  if (isLoading && !project) {
    return (
      <LoadingState
        title="Carregando projeto"
        description="Buscando os detalhes do projeto no portfólio."
      />
    );
  }

  if (errorMessage && !project) {
    return (
      <ErrorState
        eyebrow="Erro ao carregar"
        title="Não foi possível carregar esse projeto."
        description="Tente novamente em instantes ou volte para a Home."
        action={{
          label: "Voltar para a Home",
          to: "/",
        }}
      />
    );
  }

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

      {project.technologies.length > 0 && (
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
      )}

      {project.links.length > 0 && (
        <section className={styles.linksSection}>
          <h2>Links do projeto</h2>

          <div className={styles.projectLinks}>
            {project.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={link.url.startsWith("http") ? "noreferrer" : undefined}
                className={styles.projectLink}
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      )}

      {project.images.length > 0 && (
        <section className={styles.gallerySection}>
          <h2>Galeria</h2>

          <div className={styles.galleryGrid}>
            {project.images.map((image) => (
              <figure key={image.id} className={styles.galleryItem}>
                <img
                  src={image.image_url}
                  alt={image.alt_text ?? `Imagem do projeto ${project.title}`}
                />

                {image.caption && <figcaption>{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

