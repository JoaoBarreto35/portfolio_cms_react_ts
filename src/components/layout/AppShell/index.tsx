import { Link, Outlet } from "react-router-dom";

import styles from "./styles.module.css";

export function AppShell() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          João Barreto
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <Link to="/web">Web</Link>
          <Link to="/data-analytics">Dados</Link>
          <Link to="/automation">Automação</Link>
          <Link to="/game">Games</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} João Barreto.</span>
        <span>Portfólio CMS em construção.</span>
      </footer>
    </div>
  );
}