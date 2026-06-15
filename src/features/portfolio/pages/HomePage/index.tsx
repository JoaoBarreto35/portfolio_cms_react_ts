import { Link } from "react-router-dom";
import { ButtonLink } from "../../../../components/ui/ButtonLink"
import { SectionHeader } from "../../../../components/ui/SectionHeader"

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
          <ButtonLink to="/web" className={styles.primaryAction}>
            Ver projetos web
          </ButtonLink>

          <ButtonLink to="/admin" className={styles.secondaryAction}>
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

      <section className={styles.areas} aria-label="Áreas do portfólio">
        <SectionHeader
          eyebrow = "Áreas principais"
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