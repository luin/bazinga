import { ReactNode } from "react";
import styles from "./button-group.module.scss";
import Row from "./row";

interface ButtonGroupProps {
  children: ReactNode;
  meta?: ReactNode;
}

const ButtonGroup = ({ children, meta }: ButtonGroupProps) => (
  <Row>
    <div className={styles.container}>
      {children}
      {meta && <div className={styles.meta}>{meta}</div>}
    </div>
  </Row>
);

export default ButtonGroup;
