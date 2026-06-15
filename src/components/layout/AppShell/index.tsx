import type { ReactNode } from "react";

import styles from "./styles.module.css";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}>
          João Barreto
        </a>

        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#web">Web</a>
          <a href="#dados">Dados</a>
          <a href="#automacao">Automação</a>
          <a href="#games">Games</a>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} João Barreto.</span>
        <span>Portfólio CMS em construção.</span>
      </footer>
    </div>
  );
}