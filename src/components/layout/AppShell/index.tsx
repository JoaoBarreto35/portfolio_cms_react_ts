import { NavLink, Outlet } from "react-router-dom";
import { useContactLinks } from "../../../features/portfolio/hooks/useContactLinks";
import { usePortfolioPages } from "../../../features/portfolio/hooks/usePortfolioPages";
import { useSiteSettings } from "../../../features/portfolio/hooks/useSiteSettings";

import styles from "./styles.module.css";

interface AppShellLink {
  label: string;
  href: string;
}

const fallbackNavLinks: AppShellLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Web",
    href: "/web",
  },
  {
    label: "Dados",
    href: "/data-analytics",
  },
  {
    label: "Automação",
    href: "/automation",
  },
  {
    label: "Games",
    href: "/game",
  },
];

const fallbackContactLinks: AppShellLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/JoaoBarreto35",
  },
  {
    label: "E-mail",
    href: "mailto:contato@joaobarreto.com",
  },
];

function getNavLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive
    ? `${styles.navLink} ${styles.activeNavLink}`
    : styles.navLink;
}

function isExternalLink(href: string) {
  return href.startsWith("http");
}

export function AppShell() {
  const { siteSettings } = useSiteSettings();
  const { portfolioPages } = usePortfolioPages();
  const { contactLinks } = useContactLinks();

  const displayName = siteSettings?.name ?? "João Barreto";
  const headline =
    siteSettings?.headline ?? "Desenvolvedor Full Stack & Analista de Dados";

  const dynamicAreaLinks = portfolioPages.map((page) => ({
    label: page.title,
    href: `/${page.slug}`,
  }));

  const navLinks =
    dynamicAreaLinks.length > 0
      ? [
          {
            label: "Home",
            href: "/",
          },
          ...dynamicAreaLinks,
        ]
      : fallbackNavLinks;

  const footerLinks =
    contactLinks.length > 0
      ? contactLinks.slice(0, 4).map((contactLink) => ({
          label: contactLink.label,
          href: contactLink.href,
        }))
      : fallbackContactLinks;

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand} aria-label="Ir para a Home">
          <span className={styles.brandMark}>JB</span>

          <span className={styles.brandText}>
            <strong>{displayName}</strong>
            <small>{headline}</small>
          </span>
        </NavLink>

        <nav className={styles.nav} aria-label="Navegação principal">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={getNavLinkClassName}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div>
          <strong>{displayName}</strong>
          <p>{headline}</p>
        </div>

        <div className={styles.footerLinks}>
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={isExternalLink(link.href) ? "_blank" : undefined}
              rel={isExternalLink(link.href) ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
