import { Link, type LinkProps } from "react-router-dom";

import styles from "./styles.module.css";

type ButtonLinkVariant = "primary" | "secondary" | "ghost";

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonLinkVariant;
}

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${styles.buttonLink} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}