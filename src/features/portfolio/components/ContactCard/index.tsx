import styles from "./styles.module.css";

interface ContactCardProps {
  label: string;
  description: string;
  href: string;
}

export function ContactCard({ label, description, href }: ContactCardProps) {
  const isExternalLink = href.startsWith("http");

  return (
    <a
      href={href}
      className={styles.card}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noreferrer" : undefined}
    >
      <strong>{label}</strong>
      <span>{description}</span>
    </a>
  );
}