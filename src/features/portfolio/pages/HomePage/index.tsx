import { ButtonLink } from "../../../../components/ui/ButtonLink";
import { SectionHeader } from "../../../../components/ui/SectionHeader";
import { ProjectCard } from "../../components/ProjectCard";
import { StatusCard } from "../../components/StatusCard";
import { AreaCard } from "../../components/AreaCard";
import { SkillCard } from "../../components/SkillCard";
import { ContactCard } from "../../components/ContactCard";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import {
  contactLinks,
  projects,
  portfolioAreas,
  portfolioStatusItems,
  skillGroups,
} from "../../data/mockPortfolioData";


import styles from "./styles.module.css";

export function HomePage() {

  const { siteSettings, isLoading, errorMessage } = useSiteSettings();

  const heroName = siteSettings?.name ?? "João Barreto";
  const heroHeadline =
    siteSettings?.headline ?? "Desenvolvedor Full Stack & Analista de Dados";

  const heroSubtitle =
    siteSettings?.subtitle ??
    "Sistemas, dashboards e automações para resolver problemas reais.";

  const heroBio =
    siteSettings?.bio ??
    "Crio aplicações web, dashboards, automações e projetos digitais com foco em organização, clareza e utilidade prática.";

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{heroName}</p>

        <h1>
          {heroHeadline}
        </h1>

        <p className={styles.description}>
        {heroSubtitle}
        </p>

        {/* <p className={styles.heroBio}>{heroBio}</p> */}

        <div className={styles.actions}>
          <ButtonLink to="/web">Ver projetos web</ButtonLink>

          <ButtonLink to="/admin" variant="secondary">
            Acessar central
          </ButtonLink>

          <div className={styles.dataStatus}>
  {isLoading && <span>Carregando dados do portfólio...</span>}

  {!isLoading && errorMessage && (
    <span>Usando dados locais enquanto o Supabase não responde.</span>
  )}

  {!isLoading && !errorMessage && siteSettings && (
    <span>Conteúdo carregado do Supabase.</span>
  )}
</div>
        </div>
      </section>

      <section className={styles.statusGrid} aria-label="Resumo do projeto">
        {portfolioStatusItems.map((item) => (
          <StatusCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </section>

      <section className={styles.featuredProjects}>
        <SectionHeader
          eyebrow="Projetos em destaque"
          title="Projetos que mostram aplicação real de tecnologia."
          description="Nesta primeira versão, os projetos ainda estão mockados. Depois eles serão carregados diretamente do Supabase."
        />

        <div className={styles.projectGrid}>
          {featuredProjects.map((project) => (
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

        <div className={styles.featuredActions}>
          <ButtonLink to="/web" variant="secondary">
            Ver todos os projetos web
          </ButtonLink>
        </div>
      </section>

      <section className={styles.skills}>
        <SectionHeader
          eyebrow="Habilidades"
          title="Tecnologias e competências que conectam desenvolvimento, dados e operação."
          description="Essa seção também será dinâmica futuramente, permitindo cadastrar novas habilidades pela central administrativa."
        />

        <div className={styles.skillGrid}>
          {skillGroups.map((group) => (
            <SkillCard
              key={group.title}
              title={group.title}
              description={group.description}
              skills={group.skills}
            />
          ))}
        </div>

      </section>

      <section className={styles.areas} aria-label="Áreas do portfólio">
        <SectionHeader
          eyebrow="Áreas principais"
          title="Um portfólio geral, com vitrines específicas."
        />

        <div className={styles.areaGrid}>
          {portfolioAreas.map((area) => (
            <AreaCard
              key={area.href}
              title={area.title}
              description={area.description}
              href={area.href}
            />
          ))}
        </div>
      </section>

      <section className={styles.contact}>
        <SectionHeader
          eyebrow="Contato"
          title="Vamos conversar sobre projetos, dados, automações ou oportunidades."
          description="Esta seção futuramente será alimentada pelas configurações gerais do portfólio no Supabase."
        />
        <div className={styles.contactGrid}>
          {contactLinks.map((contact) => (
            <ContactCard
              key={contact.label}
              label={contact.label}
              description={contact.description}
              href={contact.href}
            />
          ))}
        </div>

      </section>
    </div>
  );
}