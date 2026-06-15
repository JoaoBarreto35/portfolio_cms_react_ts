import type {
  ContactLink,
  FeaturedProject,
  PortfolioAreaItem,
  StatusItem,
  PortfolioAreaContent,
  SkillGroup,
} from "../../../types/portfolio";

export const portfolioAreas: PortfolioAreaItem[] = [
  {
    title: "Web",
    description:
      "Sistemas, SaaS, dashboards, interfaces modernas e aplicações com banco de dados.",
    href: "/web",
  },
  {
    title: "Dados",
    description:
      "Dashboards, indicadores, análises e visualização de informações para tomada de decisão.",
    href: "/data-analytics",
  },
  {
    title: "Automação",
    description:
      "Fluxos, integrações, planilhas inteligentes, webhooks e processos automatizados.",
    href: "/automation",
  },
  {
    title: "Games",
    description:
      "Jogos, experimentos interativos, lógica, criatividade e experiências visuais.",
    href: "/game",
  },
];

export const featuredProjects: FeaturedProject[] = [
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

export const skillGroups: SkillGroup[] = [
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

export const contactLinks: ContactLink[] = [
  {
    label: "GitHub",
    description: "Veja meus repositórios, projetos e evolução técnica.",
    href: "https://github.com/JoaoBarreto35",
  },
  {
    label: "LinkedIn",
    description: "Conecte-se comigo profissionalmente.",
    href: "https://www.linkedin.com",
  },
  {
    label: "E-mail",
    description: "Entre em contato para projetos, oportunidades ou networking.",
    href: "mailto:contato@joaobarreto.com",
  },
];

export const portfolioStatusItems: StatusItem[] = [
  {
    title: "React + TypeScript",
    description: "Base moderna para evoluir com segurança.",
  },
  {
    title: "Supabase CMS",
    description: "Futuramente todo conteúdo virá do banco.",
  },
  {
    title: "Rotas por área",
    description: "Web, Dados, Automação e Games com identidade própria.",
  },
];

export const portfolioAreaContents: Record<PortfolioAreaContent["slug"], PortfolioAreaContent> = {
  web: {
    slug: "web",
    eyebrow: "Desenvolvimento Web",
    title: "Sistemas web com cara de produto real.",
    description:
      "Projetos com React, TypeScript, Supabase, dashboards, autenticação, banco de dados, regras de negócio e interfaces modernas.",
    highlights: ["React + TypeScript", "Supabase", "SaaS e dashboards"],
  },
  "data-analytics": {
    slug: "data-analytics",
    eyebrow: "Dados & Analytics",
    title: "Dashboards e análises para transformar dados em decisão.",
    description:
      "Projetos voltados para indicadores, relatórios, Power BI, SQL, automações de dados e visualização de informações relevantes.",
    highlights: ["Power BI", "SQL e Python", "Indicadores e insights"],
  },
  automation: {
    slug: "automation",
    eyebrow: "Automação",
    title: "Processos manuais transformados em fluxos inteligentes.",
    description:
      "Automações com planilhas, APIs, webhooks, integrações, Power Automate e soluções para reduzir retrabalho operacional.",
    highlights: ["APIs e webhooks", "Power Automate", "Planilhas inteligentes"],
  },
  game: {
    slug: "game",
    eyebrow: "Games & Experimentos",
    title: "Interações criativas, jogos e experiências visuais.",
    description:
      "Projetos voltados para lógica, jogabilidade, criatividade, protótipos interativos e experimentos visuais para aprendizado e portfólio.",
    highlights: ["Game logic", "Experimentos", "Interatividade"],
  },
};

