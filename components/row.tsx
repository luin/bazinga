import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./row.module.scss";
import HintIcon from "../svg/info.svg";

interface RowProps {
  title?: string;
  children: ReactNode;
  variant?: "regular" | "options" | "hint";
}

const Row = ({ title, variant = "regular", children }: RowProps) => (
  <div
    className={classNames(styles.container, styles[variant], {
      [styles.withTitle]: !!title,
    })}
  >
    {variant === "hint" && (
      <div className={styles.icon}>
        <HintIcon />
      </div>
    )}
    <div className={styles.content}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </div>
  </div>
);

export default Row;
