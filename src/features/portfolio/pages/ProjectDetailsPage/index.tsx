import { useParams } from "react-router-dom";

export function ProjectDetailsPage() {
    const { projectSlug } = useParams();

    return (
        <section>
            <p> Detalhes do Projeto</p>

            <h1>{projectSlug}</h1>

            
        </section>
    );
}