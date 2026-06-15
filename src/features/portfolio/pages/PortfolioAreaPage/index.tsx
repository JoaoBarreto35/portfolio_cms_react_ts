import { useParams } from "react-router-dom";

const areaTitles: Record<string, string> = {
  web: "Desenvolvimento Web",
  "data-analytics": "Dados & Analytics",
  automation: "Automação",
  game: "Games & Experimentos",
};

export function PortfolioAreaPage() {
  const { areaSlug } = useParams();

  const title = areaSlug ? areaTitles[areaSlug] ?? "Área do portfólio" : "Área do portfólio";

  return (
    <section>
      <p>Vitrine específica</p>

      <h1>{title}</h1>

      <p>
        Esta rota será personalizada futuramente com textos, cores, habilidades
        e projetos vindos do Supabase.
      </p>
    </section>
  );
}