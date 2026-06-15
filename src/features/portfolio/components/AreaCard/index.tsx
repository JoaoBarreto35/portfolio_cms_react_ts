import { Link } from "react-router-dom";

import styles from "./styles.module.css";

interface AreaCardProps {
  title: string;
  description: string;
  href: string;
}

export function AreaCard({ title, description, href }: AreaCardProps) {
  return (
    <Link to={href} className={styles.card}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <span>Explorar área</span>
    </Link>
  );
}