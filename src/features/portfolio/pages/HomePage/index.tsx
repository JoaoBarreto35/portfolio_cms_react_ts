import { Link } from "react-router-dom";

import { ButtonLink } from "../../../../components/ui/ButtonLink";
import { SectionHeader } from "../../../../components/ui/SectionHeader";
import { Badge } from "../../../../components/ui/Badge";
import { ProjectCard } from "../../components/ProjectCard";

import styles from "./styles.module.css";

const portfolioAreas = [
  {
    title: "Web",
    description: "Sistemas, SaaS, dashboards, interfaces modernas e aplicações com banco de dados.",
    href: "/web",
  },
  {
    title: "Dados",
    description: "Dashboards, indicadores, análises e visualização de informações para tomada de decisão.",
    href: "/data-analytics",
  },
  {
    title: "Automação",
    description: "Fluxos, integrações, planilhas inteligentes, webhooks e processos automatizados.",
    href: "/automation",
  },
  {
    title: "Games",
    description: "Jogos, experimentos interativos, lógica, criatividade e experiências visuais.",
    href: "/game",
  },
];

const featuredProjects = [
  {
    title: "Manutix",
    slug: "manutix",
    description:
      "Sistema CMMS para gestão de chamados, ordens de serviço, ativos, planejamento, execução e validação.",
    category: "Web",
    status: "Em evolução",
    technologies: ["React", "TypeScript", "Supabase", "PostgreSQL"],
    coverImageUrl: null,
  },
  {
    title: "Cidade em Foco",
    slug: "cidade-em-foco",
    description:
      "Aplicação comunitária para registrar ocorrências urbanas com foto, localização, mapa e painel de indicadores.",
    category: "Web",
    status: "Publicado",
    technologies: ["React", "TypeScript", "Supabase", "Leaflet"],
    coverImageUrl: null,
  },
  {
    title: "Dopamine Focus",
    slug: "dopamine-focus",
    description:
      "Aplicativo de foco e produtividade com gamificação, tarefas, sessões de concentração e evolução do usuário.",
    category: "Web",
    status: "MVP",
    technologies: ["React", "TypeScript", "Supabase", "Gamificação"],
    coverImageUrl: null,
  },
];
const skillGroups = [
  {
    title: "Frontend",
    description: "Interfaces modernas, responsivas e organizadas.",
    skills: ["React", "TypeScript", "Vite", "CSS Modules", "React Router"],
  },
  {
    title: "Backend & Banco",
    description: "Estruturação de dados, autenticação e regras de negócio.",
    skills: ["Supabase", "PostgreSQL", "RLS", "RPC", "Auth"],
  },
  {
    title: "Dados & BI",
    description: "Indicadores, dashboards e análise para decisão.",
    skills: ["Power BI", "SQL", "Excel", "Python", "Dashboards"],
  },
  {
    title: "Automação",
    description: "Redução de processos manuais com fluxos e integrações.",
    skills: ["Power Automate", "APIs", "Webhooks", "Planilhas", "Integrações"],
  },
];

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portfolio CMS pessoal</p>

        <h1>
          João Barreto — sistemas, dados e automações para resolver problemas reais.
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
        <div className={styles.statusCard}>
          <strong>React + TypeScript</strong>
          <span>Base moderna para evoluir com segurança.</span>
        </div>

        <div className={styles.statusCard}>
          <strong>Supabase CMS</strong>
          <span>Futuramente todo conteúdo virá do banco.</span>
        </div>

        <div className={styles.statusCard}>
          <strong>Rotas por área</strong>
          <span>Web, Dados, Automação e Games com identidade própria.</span>
        </div>
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
    </div>
  );
}