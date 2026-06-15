import type {
    ContactLink,
    FeaturedProject,
    PortfolioAreaItem,
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