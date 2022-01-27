import Link from "next/link";
import styles from "./logo.module.scss";

interface LogoProps {
  link?: boolean;
  onClick?: () => void;
}

const Logo = ({ link = false, onClick }: LogoProps) => {
  const content = (
    <div onClick={onClick} className={styles.container}>
      BAZINGA<span>.</span>TOOLS
    </div>
  );

  return link ? (
    <Link href="/" passHref>
      <a className={styles.link}>{content}</a>
    </Link>
  ) : (
    content
  );
};

export default Logo;
