import { AdminShell } from "../../components/AdminShell";

import styles from "./styles.module.css";

const adminModules = [
  {
    title: "Configurações do site",
    description:
      "Editar nome, headline, bio, cidade, links principais, foto e cores globais.",
    href: "/admin/settings",
    status: "Próxima fase",
  },
  {
    title: "Projetos",
    description:
      "Criar, editar e publicar projetos, tecnologias, links e imagens.",
    href: "/admin/projects",
    status: "Em breve",
  },
  {
    title: "Vitrines",
    description:
      "Gerenciar páginas como Web, Dados, Automação e Games.",
    href: "/admin/pages",
    status: "Em breve",
  },
  {
    title: "Experiências",
    description:
      "Atualizar trajetória profissional, destaques, ferramentas e cargos.",
    href: "/admin/experiences",
    status: "Em breve",
  },
  {
    title: "Formações",
    description:
      "Gerenciar graduação, cursos, certificados e aprendizados.",
    href: "/admin/education",
    status: "Em breve",
  },
  {
    title: "Skills",
    description:
      "Organizar competências por grupo, nível, descrição e ordem.",
    href: "/admin/skills",
    status: "Em breve",
  },
];

export function AdminDashboardPage() {
  return (
    <AdminShell
      title="Dashboard"
      description="Central para gerenciar o conteúdo público do portfólio."
    >
      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <span>Status</span>
          <strong>CMS protegido</strong>
          <p>Login e validação por admin_users já estão ativos.</p>
        </article>

        <article className={styles.summaryCard}>
          <span>Conteúdo público</span>
          <strong>Supabase conectado</strong>
          <p>Home, vitrines e detalhes já usam dados do banco.</p>
        </article>

        <article className={styles.summaryCard}>
          <span>Próximo bloco</span>
          <strong>CRUD admin</strong>
          <p>Agora começamos as telas para editar conteúdo.</p>
        </article>
      </section>

      <section className={styles.modules}>
        <div className={styles.sectionHeader}>
          <p>Módulos do CMS</p>
          <h2>O que será editável pela central</h2>
        </div>

        <div className={styles.moduleGrid}>
          {adminModules.map((module) => (
            <article key={module.title} className={styles.moduleCard}>
              <div>
                <span>{module.status}</span>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>

              <a href={module.href}>Abrir módulo</a>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
