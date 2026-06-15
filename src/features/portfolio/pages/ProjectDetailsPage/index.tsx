import styles from "./styles.module.css";

interface MockProject {
  title: string;
  subtitle: string;
  category: string;
  year: string;
  status: string;
  role: string;
  technologies: string[];
  problem: string;
  solution: string;
  impact: string;
}

const mockProject: MockProject = {
  title: "Manutix",
  subtitle:
    "Sistema CMMS para gestão de ordens de serviço, ativos, planejamento, execução e validação.",
  category: "Desenvolvimento Web",
  year: "2026",
  status: "Em evolução",
  role: "Full Stack Developer",
  technologies: ["React", "TypeScript", "Supabase", "PostgreSQL", "CSS Modules"],
  problem:
    "Processos de manutenção costumam ficar espalhados em planilhas, mensagens e controles manuais, dificultando o acompanhamento das ordens de serviço.",
  solution:
    "Criação de uma plataforma com cadastro de ativos, chamados, ordens de serviço, kanban operacional, subtarefas, execução técnica e validação.",
  impact:
    "O projeto demonstra domínio de regras de negócio reais, autenticação, banco relacional, permissões, fluxos operacionais e experiência de usuário.",
};

export function ProjectDetailsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Detalhe do projeto</p>

        <div className={styles.heroContent}>
          <div>
            <h1>{mockProject.title}</h1>
            <p className={styles.subtitle}>{mockProject.subtitle}</p>
          </div>

          <div className={styles.statusPill}>{mockProject.status}</div>
        </div>
      </section>

      <section className={styles.metaGrid} aria-label="Informações do projeto">
        <div className={styles.metaCard}>
          <span>Categoria</span>
          <strong>{mockProject.category}</strong>
        </div>

        <div className={styles.metaCard}>
          <span>Ano</span>
          <strong>{mockProject.year}</strong>
        </div>

        <div className={styles.metaCard}>
          <span>Papel</span>
          <strong>{mockProject.role}</strong>
        </div>
      </section>

      <section className={styles.preview}>
        <div className={styles.imagePlaceholder}>
          <span>Preview do projeto</span>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <article className={styles.contentCard}>
          <p>Problema</p>
          <h2>O contexto do projeto</h2>
          <span>{mockProject.problem}</span>
        </article>

        <article className={styles.contentCard}>
          <p>Solução</p>
          <h2>Como foi resolvido</h2>
          <span>{mockProject.solution}</span>
        </article>

        <article className={styles.contentCard}>
          <p>Impacto</p>
          <h2>O que o projeto demonstra</h2>
          <span>{mockProject.impact}</span>
        </article>
      </section>

      <section className={styles.technologies}>
        <p>Tecnologias</p>

        <div className={styles.techList}>
          {mockProject.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>
    </div>
  );
}