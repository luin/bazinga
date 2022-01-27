import styles from "./shortcut.module.scss";

interface ShortcutProps {
  char: string;
  modifier?: string;
}
const Shortcut = ({ char, modifier }: ShortcutProps) => {
  return (
    <div className={styles.container}>
      {modifier && <div className={styles.shortcut}>{modifier}</div>}
      <div className={styles.shortcut}>{char}</div>
    </div>
  );
};

export default Shortcut;
