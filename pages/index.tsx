import Image from "next/image";
import ToolPage from "../utils/ToolPage";
import styles from "./index.module.scss";
import CheckmarkIcon from "../svg/checkmark.svg";
import GitHubIcon from "../svg/github.svg";
import classNames from "classnames";

const Home: ToolPage = () => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span>Bazinga.tools!</span>
        </h1>
        <p className={styles.description}>
          The all-in-one toolbox for developers
        </p>
        <div className={styles.privacy}>
          <Image src="/images/lock.png" width={115} height={170} alt="" />
          <h2>Your privacy is guaranteed</h2>
          <p>Your data won&apos;t leave your browser.</p>
          <ul>
            <li>
              <span className={styles.img}>
                <CheckmarkIcon />
              </span>
              No cookies
            </li>
            <li>
              <span className={styles.img}>
                <CheckmarkIcon />
              </span>
              No logging
            </li>
            <li>
              <span className={styles.img}>
                <CheckmarkIcon />
              </span>
              No IP fingerprinting
            </li>
            <li>
              <span className={styles.img}>
                <CheckmarkIcon />
              </span>
              No exception reports
            </li>
            <li>
              <span className={styles.img}>
                <CheckmarkIcon />
              </span>
              No popups
            </li>
            <li>
              <span className={classNames(styles.img, styles.github)}>
                <GitHubIcon />
              </span>
              <a
                href="https://github.com/luin/bazinga"
                target="_blank"
                rel="noreferrer"
              >
                Fully open source
              </a>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Home;
