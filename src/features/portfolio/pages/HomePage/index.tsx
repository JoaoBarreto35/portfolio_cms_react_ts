import { Link } from "react-router-dom";

import { Badge } from "../../../../components/ui/Badge";
import { ButtonLink } from "../../../../components/ui/ButtonLink";
import { SectionHeader } from "../../../../components/ui/SectionHeader";
import {
  contactLinks,
  featuredProjects,
  portfolioAreas,
  portfolioStatusItems,
  skillGroups,
} from "../../data/mockPortfolioData";
import { ProjectCard } from "../../components/ProjectCard";
import { StatusCard } from "../../components/StatusCard";


import styles from "./styles.module.css";

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portfolio CMS pessoal</p>

        <h1>
          João Barreto <br></br>
          Transformo seus problemas em soluções digitais.
        </h1>

        <p className={styles.description}>
          Este portfólio está sendo reconstruído como uma plataforma editável,
          onde projetos, experiências, cursos, tecnologias, imagens e páginas
          específicas poderão ser gerenciados por uma central administrativa.
        </p>

        <div className={styles.actions}>
          <ButtonLink to="/web">Ver projetos web</ButtonLink>

          <ButtonLink to="/admin" variant="secondary">
            Acessar central
          </ButtonLink>
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
            <article key={group.title} className={styles.skillCard}>
              <div>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>

              <div className={styles.skillList}>
                {group.skills.map((skill) => (
                  <Badge key={skill} size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </article>
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
            <Link key={area.href} to={area.href} className={styles.areaCard}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <span>Explorar área</span>
            </Link>
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
            <a
              key={contact.label}
              href={contact.href}
              className={styles.contactCard}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
            >
              <strong>{contact.label}</strong>
              <span>{contact.description}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}