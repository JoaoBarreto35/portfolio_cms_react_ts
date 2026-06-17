import { ButtonLink } from "../../../../components/ui/ButtonLink";
import { SectionHeader } from "../../../../components/ui/SectionHeader";
import { ProjectCard } from "../../components/ProjectCard";
import { StatusCard } from "../../components/StatusCard";
import { AreaCard } from "../../components/AreaCard";
import { SkillCard } from "../../components/SkillCard";
import { ContactCard } from "../../components/ContactCard";
import { ExperienceCard } from "../../components/ExperienceCard";
import { EducationCard } from "../../components/EducationCard";

import { useSiteSettings } from "../../hooks/useSiteSettings";
import { usePortfolioStats } from "../../hooks/usePortfolioStats";
import { useContactLinks } from "../../hooks/useContactLinks";
import { useSkills } from "../../hooks/useSkills";
import { useFeaturedProjects } from "../../hooks/useFeaturedProjects";
import { usePortfolioPages } from "../../hooks/usePortfolioPages";
import { useExperiences } from "../../hooks/useExperiences";
import { useEducation } from "../../hooks/useEducation";

import {
  contactLinks,
  projects,
  portfolioAreas,
  portfolioStatusItems,
  skillGroups,
} from "../../data/mockPortfolioData";

import styles from "./styles.module.css";

interface HomeSkillGroup {
  title: string;
  description: string;
  skills: string[];
}

export function HomePage() {
  const { siteSettings } = useSiteSettings();
  const { portfolioStats } = usePortfolioStats();
  const { contactLinks: supabaseContactLinks } = useContactLinks();
  const { skills: supabaseSkills } = useSkills();
  const { featuredProjects: supabaseFeaturedProjects } = useFeaturedProjects();
  const { portfolioPages } = usePortfolioPages();
  const { experiences } = useExperiences();
  const { educationItems } = useEducation();

  const heroName = siteSettings?.name ?? "João Barreto";

  const heroHeadline =
    siteSettings?.headline ?? "Desenvolvedor Full Stack & Analista de Dados";

  const heroSubtitle =
    siteSettings?.subtitle ??
    "Sistemas, dashboards e automações para resolver problemas reais.";

  const heroBio =
    siteSettings?.bio ??
    "Crio aplicações web, dashboards, automações e projetos digitais com foco em organização, clareza e utilidade prática.";

  const statusItems =
    portfolioStats.length > 0
      ? portfolioStats.map((stat) => ({
          label: stat.label,
          value: stat.value,
          description: stat.description ?? "",
        }))
      : portfolioStatusItems;

  const homePortfolioAreas =
    portfolioPages.length > 0
      ? portfolioPages.map((page) => ({
          title: page.title,
          description: page.description ?? page.subtitle ?? "",
          href: `/${page.slug}`,
        }))
      : portfolioAreas;

  const homeContactLinks =
    supabaseContactLinks.length > 0
      ? supabaseContactLinks.map((contactLink) => ({
          label: contactLink.label,
          description: contactLink.description ?? "",
          href: contactLink.href,
        }))
      : contactLinks;

  const homeSkillGroups =
    supabaseSkills.length > 0
      ? Object.values(
          supabaseSkills.reduce<Record<string, HomeSkillGroup>>(
            (accumulator, skill) => {
              const groupName = skill.group_name;

              if (!accumulator[groupName]) {
                accumulator[groupName] = {
                  title: groupName,
                  description: `Competências relacionadas a ${groupName.toLowerCase()}.`,
                  skills: [],
                };
              }

              accumulator[groupName].skills.push(skill.name);

              return accumulator;
            },
            {}
          )
        )
      : skillGroups;

  const localFeaturedProjects = projects.filter((project) => project.featured);

  const homeFeaturedProjects =
    supabaseFeaturedProjects.length > 0
      ? supabaseFeaturedProjects.map((project) => ({
          title: project.title,
          slug: project.slug,
          description: project.short_description,
          category: project.category,
          status: project.status,
          technologies: project.technologies,
          coverImageUrl: project.cover_image_url,
        }))
      : localFeaturedProjects;

  const shouldShowExperiencesSection = experiences.length > 0;
  const shouldShowEducationSection = educationItems.length > 0;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{heroName}</p>

        <h1>{heroHeadline}</h1>

        <p className={styles.description}>{heroSubtitle}</p>

        <p className={styles.heroBio}>{heroBio}</p>

        <div className={styles.actions}>
          <ButtonLink to="/web">Ver projetos web</ButtonLink>

          <ButtonLink to="/admin" variant="secondary">
            Acessar central
          </ButtonLink>
        </div>
      </section>

      <section className={styles.statusGrid}>
        {statusItems.map((item) => (
          <StatusCard
            key={item.label}
            label={item.label}
            value={item.value}
            description={item.description}
          />
        ))}
      </section>

      <section className={styles.featuredProjects}>
        <SectionHeader
          eyebrow="Projetos em destaque"
          title="Projetos que mostram aplicação real de tecnologia."
          description="Confira meus atuais projetos em destaque, garanto que não irá se decepcionar."
        />

        <div className={styles.projectGrid}>
          {homeFeaturedProjects.map((project) => (
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

      {shouldShowExperiencesSection && (
        <section className={styles.experiences}>
          <SectionHeader
            eyebrow="Trajetória"
            title="Experiência prática conectada à tecnologia"
            description="Uma combinação de vivência operacional, análise de dados, planejamento e desenvolvimento de soluções digitais."
          />

          <div className={styles.experienceGrid}>
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                company={experience.company}
                role={experience.role}
                employmentType={experience.employment_type}
                location={experience.location}
                description={experience.description}
                highlights={experience.highlights}
                tools={experience.tools}
                isCurrent={experience.is_current}
              />
            ))}
          </div>
        </section>
      )}

      {shouldShowEducationSection && (
        <section className={styles.education}>
          <SectionHeader
            eyebrow="Formação"
            title="Base acadêmica e aprendizado contínuo"
            description="Cursos, formação técnica e graduação conectados ao desenvolvimento de software, dados e processos."
          />

          <div className={styles.educationGrid}>
            {educationItems.map((educationItem) => (
              <EducationCard
                key={educationItem.id}
                title={educationItem.title}
                institution={educationItem.institution}
                educationType={educationItem.education_type}
                description={educationItem.description}
                certificateUrl={educationItem.certificate_url}
                isCurrent={educationItem.is_current}
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.skills}>
        <SectionHeader
          eyebrow="Habilidades"
          title="Tecnologias e competências que conectam desenvolvimento, dados e operação."
          description="Algumas das principais habilidades que desenvolvi durante meus estudos ou durante minha experiência em projetos desenvolvidos."
        />

        <div className={styles.skillGrid}>
          {homeSkillGroups.map((skillGroup) => (
            <SkillCard
              key={skillGroup.title}
              title={skillGroup.title}
              description={skillGroup.description}
              skills={skillGroup.skills}
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
          {homePortfolioAreas.map((area) => (
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
          description="Aqui estão alguns links onde poderá me encontrar."
        />

        <div className={styles.contactGrid}>
          {homeContactLinks.map((contactLink) => (
            <ContactCard
              key={contactLink.href}
              label={contactLink.label}
              description={contactLink.description}
              href={contactLink.href}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
