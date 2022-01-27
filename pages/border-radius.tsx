import kebabCase from "lodash.kebabcase";
import {
  ChangeEvent,
  FocusEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import styles from "./border-radius.module.scss";

const px = (value: number | "") => (value ? `${value}px` : "0");

const handleFocus: FocusEventHandler = (e) => {
  if (e.target instanceof HTMLInputElement) {
    e.target.select();
  }
};

const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
};

const BorderRadius: ToolPage = () => {
  const [topLeftRadius, setTopLeftRadius] = useState<"" | number>(0);
  const [bottomLeftRadius, setBottomLeftRadius] = useState<"" | number>(0);
  const [topRightRadius, setTopRightRadius] = useState<"" | number>(0);
  const [bottomRightRadius, setBottomRightRadius] = useState<"" | number>(0);
  const [text, setText] = useState("");

  const editedRef = useRef(false);

  const [borderRadiusStyles, setBorderRadiusStyles] = useState({});

  useEffect(() => {
    if (
      topLeftRadius === bottomLeftRadius &&
      topLeftRadius === topRightRadius &&
      topLeftRadius === bottomRightRadius
    ) {
      setBorderRadiusStyles({
        borderRadius: `${px(topLeftRadius)}`,
      });
    } else if (
      topLeftRadius === bottomRightRadius &&
      topRightRadius === bottomLeftRadius
    ) {
      setBorderRadiusStyles({
        borderRadius: `${px(topLeftRadius)} ${px(topRightRadius)}`,
      });
    } else if (topRightRadius === bottomLeftRadius) {
      setBorderRadiusStyles({
        borderRadius: `${px(topLeftRadius)} ${px(topRightRadius)} ${px(
          bottomRightRadius
        )}`,
      });
    } else {
      setBorderRadiusStyles({
        borderRadius: `${px(topLeftRadius)} ${px(topRightRadius)} ${px(
          bottomRightRadius
        )} ${px(bottomLeftRadius)}`,
      });
    }
  }, [topLeftRadius, bottomLeftRadius, topRightRadius, bottomRightRadius]);

  useEffect(() => {
    const results = Object.keys(borderRadiusStyles).map((property) => {
      // @ts-expect-error
      const style = borderRadiusStyles[property];
      return `${kebabCase(property)}: ${style};`;
    });

    setText(results.join("\n"));
  }, [borderRadiusStyles]);

  const inputProps = {
    onFocus: handleFocus,
    onKeyPress: handleKeyPress,
    onBlur: () => {
      editedRef.current = true;
    },
    type: "number",
  };

  const getChangeHandler =
    (setter: (value: number | "") => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      const int = isNaN(value) ? "" : value;
      if (!editedRef.current) {
        setTopLeftRadius(int);
        setTopRightRadius(int);
        setBottomLeftRadius(int);
        setBottomRightRadius(int);
      } else {
        setter(int);
      }
    };

  return (
    <>
      <Row>
        <code className={styles.box} style={borderRadiusStyles}>
          <input
            {...inputProps}
            value={topLeftRadius}
            onChange={getChangeHandler(setTopLeftRadius)}
            className={styles.topLeft}
          />
          <input
            {...inputProps}
            value={topRightRadius}
            onChange={getChangeHandler(setTopRightRadius)}
            className={styles.topRight}
          />
          <input
            {...inputProps}
            value={bottomRightRadius}
            onChange={getChangeHandler(setBottomRightRadius)}
            className={styles.bottomRight}
          />
          <input
            {...inputProps}
            value={bottomLeftRadius}
            onChange={getChangeHandler(setBottomLeftRadius)}
            className={styles.bottomLeft}
          />
          {text}
        </code>
      </Row>
      <Row variant="hint">
        Almost all browsers don&apos;t need prefixes for{" "}
        <code>border-radius</code> such as <code>--webkit</code>.{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://caniuse.com/?search=border-radius"
        >
          Learn more
        </a>
        .
      </Row>
    </>
  );
};

export default BorderRadius;
