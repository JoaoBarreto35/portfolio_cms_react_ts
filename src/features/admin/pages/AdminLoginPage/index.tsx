import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonLink } from "../../../../components/ui/ButtonLink";
import { signInWithPassword } from "../../../../services/supabase/authService";

import styles from "./styles.module.css";

export function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await signInWithPassword({
        email,
        password,
      });

      navigate("/admin");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível entrar na central admin.";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.header}>
          <p>Central admin</p>
          <h1>Acessar CMS do portfólio</h1>
          <span>
            Entre com o usuário cadastrado no Supabase Auth para gerenciar o
            conteúdo do portfólio.
          </span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            <span>Senha</span>
            <input
              type="password"
              value={password}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.footer}>
          <ButtonLink to="/" variant="ghost">
            Voltar para o site
          </ButtonLink>

          <Link to="/admin" className={styles.adminPreviewLink}>
            Ver admin atual
          </Link>
        </div>
      </section>
    </div>
  );
}
