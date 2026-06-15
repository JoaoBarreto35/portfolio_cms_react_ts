import styles from "./styles.module.css";

interface StatusCardProps {
    title: string;
    description: string;
}

export function StatusCard({title, description}: StatusCardProps) {
    return (
        <article className={styles.card}>
            <strong>{title}</strong>
            <span>{description}</span>
        </article>
    )
}