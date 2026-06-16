import { ButtonLink } from "../../../../components/ui/ButtonLink";
import { SectionHeader } from "../../../../components/ui/SectionHeader";
import { ProjectCard } from "../../components/ProjectCard";
import { StatusCard } from "../../components/StatusCard";
import { AreaCard } from "../../components/AreaCard";
import { SkillCard } from "../../components/SkillCard";
import { ContactCard } from "../../components/ContactCard";
import { useSiteSettings } from "../../hooks/useSiteSettings";
import { usePortfolioStats } from "../../hooks/usePortfolioStats";
import { useContactLinks } from "../../hooks/useContactLinks";
import { useSkills } from "../../hooks/useSkills";
import {
  contactLinks,
  projects,
  portfolioAreas,
  portfolioStatusItems,
  skillGroups,
} from "../../data/mockPortfolioData";


import styles from "./styles.module.css";

export function HomePage() {

  const {
    siteSettings,
    isLoading: isLoadingSiteSettings,
    errorMessage: siteSettingsErrorMessage,
  } = useSiteSettings();

  const {
    portfolioStats,
    isLoading: isLoadingPortfolioStats,
    errorMessage: portfolioStatsErrorMessage,
  } = usePortfolioStats();

  const statusItems =
    portfolioStats.length > 0
      ? portfolioStats.map((stat) => ({
        label: stat.label,
        value: stat.value,
        description: stat.description ?? "",
      }))
      : portfolioStatusItems;



  const heroName = siteSettings?.name ?? "João Barreto";
  const heroHeadline =
    siteSettings?.headline ?? "Desenvolvedor Full Stack & Analista de Dados";

  const heroSubtitle =
    siteSettings?.subtitle ??
    "Sistemas, dashboards e automações para resolver problemas reais.";

  const heroBio =
    siteSettings?.bio ??
    "Crio aplicações web, dashboards, automações e projetos digitais com foco em organização, clareza e utilidade prática.";


  const {
    contactLinks: supabaseContactLinks,
    isLoading: isLoadingContactLinks,
    errorMessage: contactLinksErrorMessage,
  } = useContactLinks();

  const homeContactLinks =
    supabaseContactLinks.length > 0
      ? supabaseContactLinks.map((contactLink) => ({
        label: contactLink.label,
        description: contactLink.description ?? "",
        href: contactLink.href,
      }))
      : contactLinks;

  const {
    skills: supabaseSkills,
    isLoading: isLoadingSkills,
    errorMessage: skillsErrorMessage,
  } = useSkills();

  interface HomeSkillGroup {
    title: string;
    description: string;
    skills: string[];
  }

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
            {isLoadingSiteSettings && <span>Carregando dados do portfólio...</span>}

            {!isLoadingSiteSettings && siteSettingsErrorMessage && (
              <span>Usando dados locais enquanto o Supabase não responde.</span>
            )}

            {!isLoadingSiteSettings && !siteSettingsErrorMessage && siteSettings && (
              <span>Conteúdo carregado do Supabase.</span>
            )}

          </div>
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
        {isLoadingPortfolioStats && (
          <p className={styles.helperText}>Carregando destaques...</p>
        )}

        {!isLoadingPortfolioStats && portfolioStatsErrorMessage && (
          <p className={styles.helperText}>
            Destaques locais em uso enquanto o Supabase não responde.
          </p>
        )}
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
          description="Algumas das principais habilidades que desenvolvi durante meus estudos ou durante minha expriência em projetos desenvolvidos."
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