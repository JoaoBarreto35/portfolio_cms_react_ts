import type {
  ContactLink,
  ProjectSummary,
  PortfolioAreaItem,
  StatusItem,
  ProjectDetails,
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

export const projects: ProjectSummary[] = [
  {
    title: "Manutix",
    slug: "manutix",
    description:
      "Sistema CMMS para gestão de chamados, ordens de serviço, ativos, planejamento, execução e validação.",
    category: "Web",
    status: "Em evolução",
    technologies: ["React", "TypeScript", "Supabase", "PostgreSQL"],
    coverImageUrl: null,
    areaSlugs: ["web"],
    featured: true,
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
    areaSlugs: ["web"],
    featured: true,
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
    areaSlugs: ["web"],
    featured: true,
  },
  {
    title: "Dashboard de Produtividade",
    slug: "dashboard-produtividade",
    description:
      "Dashboard analítico para acompanhar produtividade, indicadores operacionais e evolução de resultados.",
    category: "Dados",
    status: "Conceito",
    technologies: ["Power BI", "SQL", "Excel", "Indicadores"],
    coverImageUrl: null,
    areaSlugs: ["data-analytics"],
    featured: false,
  },
  {
    title: "Monitoramento IoT",
    slug: "monitoramento-iot",
    description:
      "Projeto de visualização e acompanhamento de dados operacionais com foco em indicadores e monitoramento.",
    category: "Dados",
    status: "Estudo",
    technologies: ["Power BI", "IoT", "Dashboards", "Análise de dados"],
    coverImageUrl: null,
    areaSlugs: ["data-analytics", "automation"],
    featured: false,
  },
  {
    title: "Automação de Planilhas",
    slug: "automacao-planilhas",
    description:
      "Fluxo para transformar atualização manual de planilhas em um processo mais rápido, padronizado e confiável.",
    category: "Automação",
    status: "Conceito",
    technologies: ["Excel", "JavaScript", "HTML", "CSS", "Automação"],
    coverImageUrl: null,
    areaSlugs: ["automation"],
    featured: false,
  },
  {
    title: "Escape the Hollow",
    slug: "escape-the-hollow",
    description:
      "Jogo experimental com foco em lógica, exploração, ambientação e interação para aprendizado prático.",
    category: "Games",
    status: "Publicado",
    technologies: ["JavaScript", "Game Logic", "HTML", "CSS"],
    coverImageUrl: null,
    areaSlugs: ["game"],
    featured: false,
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

export const projectDetailsBySlug: Record<string, ProjectDetails> = {
  manutix: {
    title: "Manutix",
    slug: "manutix",
    subtitle:
      "Sistema CMMS para gestão de chamados, ordens de serviço, ativos, planejamento, execução e validação.",
    category: "Desenvolvimento Web",
    year: "2026",
    status: "Em evolução",
    role: "Full Stack Developer",
    technologies: ["React", "TypeScript", "Supabase", "PostgreSQL", "CSS Modules"],
    coverImageUrl: null,
    problem:
      "Processos de manutenção costumam ficar espalhados em planilhas, mensagens e controles manuais, dificultando o acompanhamento das ordens de serviço.",
    solution:
      "Criação de uma plataforma com cadastro de ativos, chamados, ordens de serviço, kanban operacional, subtarefas, execução técnica e validação.",
    impact:
      "O projeto demonstra domínio de regras de negócio reais, autenticação, banco relacional, permissões, fluxos operacionais e experiência de usuário.",
  },

  "cidade-em-foco": {
    title: "Cidade em Foco",
    slug: "cidade-em-foco",
    subtitle:
      "Aplicação comunitária para registrar ocorrências urbanas com foto, localização, mapa e painel de indicadores.",
    category: "Desenvolvimento Web",
    year: "2026",
    status: "Publicado",
    role: "Full Stack Developer",
    technologies: ["React", "TypeScript", "Supabase", "Leaflet", "CSS Modules"],
    coverImageUrl: null,
    problem:
      "Problemas urbanos como focos de dengue, lixo acumulado, entulho, mato alto e esgoto a céu aberto muitas vezes não são registrados de forma clara e acompanhável pela comunidade.",
    solution:
      "Desenvolvimento de um web app com cadastro de ocorrências, foto obrigatória, localização em mapa, lista pública, painel de indicadores e fluxo colaborativo de resolução.",
    impact:
      "O projeto mostra capacidade de criar uma solução com utilidade social, regras de validação, dados geográficos, moderação e visualização de informações para tomada de decisão.",
  },

  "dopamine-focus": {
    title: "Dopamine Focus",
    slug: "dopamine-focus",
    subtitle:
      "Aplicativo de foco e produtividade com gamificação, tarefas, sessões de concentração e evolução do usuário.",
    category: "Desenvolvimento Web",
    year: "2026",
    status: "MVP",
    role: "Full Stack Developer",
    technologies: ["React", "TypeScript", "Supabase", "Gamificação", "CSS Modules"],
    coverImageUrl: null,
    problem:
      "Muitas pessoas têm dificuldade em manter foco, organizar tarefas e sustentar uma rotina produtiva sem estímulos visuais e progressão clara.",
    solution:
      "Criação de uma aplicação com tarefas, sessões de foco, evolução por XP, níveis, streaks e conquistas para tornar o processo de produtividade mais motivador.",
    impact:
      "O projeto demonstra aplicação de gamificação em um problema real, combinando experiência do usuário, lógica de progresso, banco de dados e acompanhamento de comportamento.",
  },
  "dashboard-produtividade": {
    title: "Dashboard de Produtividade",
    slug: "dashboard-produtividade",
    subtitle:
      "Dashboard analítico para acompanhar produtividade, indicadores operacionais e evolução de resultados.",
    category: "Dados & Analytics",
    year: "2026",
    status: "Conceito",
    role: "Data Analyst",
    technologies: ["Power BI", "SQL", "Excel", "Indicadores"],
    coverImageUrl: null,
    problem:
      "Indicadores operacionais espalhados em controles diferentes dificultam a leitura rápida de produtividade, evolução e pontos de atenção.",
    solution:
      "Estruturação de um dashboard com visão consolidada, KPIs principais, filtros e leitura visual dos dados para apoiar decisões.",
    impact:
      "O projeto demonstra capacidade de transformar dados brutos em informação clara, visual e útil para acompanhamento de performance.",
  },
  
  "monitoramento-iot": {
    title: "Monitoramento IoT",
    slug: "monitoramento-iot",
    subtitle:
      "Projeto de visualização e acompanhamento de dados operacionais com foco em indicadores e monitoramento.",
    category: "Dados & Automação",
    year: "2026",
    status: "Estudo",
    role: "Data Analyst / Developer",
    technologies: ["Power BI", "IoT", "Dashboards", "Análise de dados"],
    coverImageUrl: null,
    problem:
      "Dados de monitoramento podem perder valor quando não são organizados em uma visualização clara, dificultando a identificação de padrões e anomalias.",
    solution:
      "Criação de uma proposta de painel para leitura de dados operacionais, com foco em indicadores, acompanhamento e interpretação visual.",
    impact:
      "O projeto mostra a conexão entre tecnologia, dados e operação, aproximando análise visual de problemas práticos do ambiente real.",
  },
  
  "automacao-planilhas": {
    title: "Automação de Planilhas",
    slug: "automacao-planilhas",
    subtitle:
      "Fluxo para transformar atualização manual de planilhas em um processo mais rápido, padronizado e confiável.",
    category: "Automação",
    year: "2026",
    status: "Conceito",
    role: "Automation Developer",
    technologies: ["Excel", "JavaScript", "HTML", "CSS", "Automação"],
    coverImageUrl: null,
    problem:
      "Atualizações manuais em planilhas consomem tempo, aumentam risco de erro e tornam o processo dependente de repetição operacional.",
    solution:
      "Criação de uma interface simples para receber arquivos, processar dados e gerar uma planilha atualizada de forma padronizada.",
    impact:
      "O projeto demonstra pensamento de automação, redução de retrabalho e criação de ferramentas práticas para problemas do dia a dia.",
  },
  
  "escape-the-hollow": {
    title: "Escape the Hollow",
    slug: "escape-the-hollow",
    subtitle:
      "Jogo experimental com foco em lógica, exploração, ambientação e interação para aprendizado prático.",
    category: "Games & Experimentos",
    year: "2026",
    status: "Publicado",
    role: "Game Developer",
    technologies: ["JavaScript", "Game Logic", "HTML", "CSS"],
    coverImageUrl: null,
    problem:
      "Projetos de portfólio também precisam demonstrar criatividade, lógica e domínio de interação, não apenas telas estáticas.",
    solution:
      "Desenvolvimento de um jogo experimental com mecânicas simples, ambientação e estrutura interativa para treinar lógica e experiência do usuário.",
    impact:
      "O projeto mostra versatilidade, criatividade e capacidade de aplicar programação em experiências mais lúdicas e interativas.",
  },
  
};
