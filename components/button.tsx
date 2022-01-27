import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./button.module.scss";

export interface ButtonProps {
  children: ReactNode;
  className?: string;
  asLabel?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium";
  icon?: ReactNode;
  onClick?: () => void;
}
const Button = ({
  children,
  className,
  asLabel = false,
  icon,
  size = "medium",
  variant = "secondary",
  onClick,
}: ButtonProps) => {
  const props = {
    onClick,
    className: classNames(
      className,
      styles.button,
      styles[variant],
      styles[size],
      {
        [styles.withIcon]: icon,
      }
    ),
    children: (
      <>
        {icon && <div className={styles.icon}>{icon}</div>}
        {children}
      </>
    ),
  };
  return asLabel ? <label {...props} /> : <button {...props} />;
};

export default Button;
