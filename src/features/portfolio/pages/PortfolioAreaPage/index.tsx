import styles from "./styles.module.css";

type PortfolioAreaSlug = "web" | "data-analytics" | "automation" | "game";

interface PortfolioAreaPageProps {
  areaSlug: PortfolioAreaSlug;
}

const areaContent: Record<
  PortfolioAreaSlug,
  {
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
  }
> = {
  web: {
    eyebrow: "Desenvolvimento Web",
    title: "Sistemas web com cara de produto real.",
    description:
      "Projetos com React, TypeScript, Supabase, dashboards, autenticação, banco de dados, regras de negócio e interfaces modernas.",
    highlights: ["React + TypeScript", "Supabase", "SaaS e dashboards"],
  },
  "data-analytics": {
    eyebrow: "Dados & Analytics",
    title: "Dashboards e análises para transformar dados em decisão.",
    description:
      "Projetos voltados para indicadores, relatórios, Power BI, SQL, automações de dados e visualização de informações relevantes.",
    highlights: ["Power BI", "SQL e Python", "Indicadores e insights"],
  },
  automation: {
    eyebrow: "Automação",
    title: "Processos manuais transformados em fluxos inteligentes.",
    description:
      "Automações com planilhas, APIs, webhooks, integrações, Power Automate e soluções para reduzir retrabalho operacional.",
    highlights: ["APIs e webhooks", "Power Automate", "Planilhas inteligentes"],
  },
  game: {
    eyebrow: "Games & Experimentos",
    title: "Interações criativas, jogos e experiências visuais.",
    description:
      "Projetos voltados para lógica, jogabilidade, criatividade, protótipos interativos e experimentos visuais para aprendizado e portfólio.",
    highlights: ["Game logic", "Experimentos", "Interatividade"],
  },
};

export function PortfolioAreaPage({ areaSlug }: PortfolioAreaPageProps) {
  const content = areaContent[areaSlug];

  return (
    <div className={`${styles.page} ${styles[areaSlug]}`}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>

        <h1>{content.title}</h1>

        <p className={styles.description}>{content.description}</p>

        <div className={styles.highlights}>
          {content.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
      </section>

      <section className={styles.placeholder}>
        <p>Próxima etapa desta área</p>

        <h2>Projetos filtrados por área</h2>

        <span>
          Futuramente esta seção vai buscar no Supabase apenas os projetos
          vinculados a esta vitrine.
        </span>
      </section>
    </div>
  );
}