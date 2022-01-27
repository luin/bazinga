import { useLayoutEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import SunIcon from "../svg/sun.svg";
import MoonIcon from "../svg/moon.svg";

const DarkmodeToggleButton = () => {
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", "light");

  useLayoutEffect(() => {
    if (darkMode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => {
        setDarkMode(darkMode === "dark" ? "light" : "dark");
      }}
    >
      {darkMode === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default DarkmodeToggleButton;
