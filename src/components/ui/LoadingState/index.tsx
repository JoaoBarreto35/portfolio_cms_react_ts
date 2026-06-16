import styles from "./styles.module.css";

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = "Carregando conteúdo",
  description = "Buscando as informações mais recentes do portfólio.",
}: LoadingStateProps) {
  return (
    <section className={styles.loadingState} aria-live="polite" aria-busy="true">
      <div className={styles.spinner} />

      <div className={styles.text}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
