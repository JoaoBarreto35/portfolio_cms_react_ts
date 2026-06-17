import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../../../../services/supabase/authService";

import styles from "./styles.module.css";

interface AdminShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Configurações",
    href: "/admin/settings",
  },
  {
    label: "Contatos",
    href: "/admin/contact-links",
  },
  {
    label: "Projetos",
    href: "/admin/projects",
  },
  {
    label: "Experiências",
    href: "/admin/experiences",
  },
  {
    label: "Formações",
    href: "/admin/education",
  },
  {
    label: "Skills",
    href: "/admin/skills",
  },

];

function getNavLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive
    ? `${styles.navLink} ${styles.activeNavLink}`
    : styles.navLink;
}

export function AdminShell({ title, description, children }: AdminShellProps) {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login");
  }

  return (
    <div className={styles.adminShell}>
      <aside className={styles.sidebar}>
        <Link to="/admin" className={styles.brand}>
          <span>JB</span>

          <div>
            <strong>Portfolio CMS</strong>
            <small>Central admin</small>
          </div>
        </Link>

        <nav className={styles.nav} aria-label="Navegação admin">
          {adminLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/admin"}
              className={getNavLinkClassName}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.siteLink}>
            Ver site público
          </Link>

          <button
            type="button"
            className={styles.signOutButton}
            onClick={handleSignOut}
          >
            Sair
          </button>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p>Admin CMS</p>
            <h1>{title}</h1>
            {description && <span>{description}</span>}
          </div>
        </header>

        <main className={styles.main}>{children}</main>
      </section>
    </div>
  );
}
