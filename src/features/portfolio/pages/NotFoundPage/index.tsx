import { ButtonLink } from "../../../../components/ui/ButtonLink"
import styles from "./styles.module.css";

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Erro 404</p>

        <h1>Página não encontrada.</h1>

        <p className={styles.description}>
          Essa rota ainda não existe no portfólio ou pode ter sido movida.
          Volte para a página inicial ou explore uma das vitrines principais.
        </p>

        <div className={styles.actions}>
          <ButtonLink to="/" className={styles.primaryAction}>
            Voltar para a Home
          </ButtonLink>

          <ButtonLink to="/web" className={styles.secondaryAction}>
            Ver projetos web
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}