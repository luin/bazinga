import { ChangeEvent, useCallback, useState } from "react";
import Button from "../components/button";
import Row from "../components/row";
import ButtonGroup from "../components/button-group";
import styles from "./color-converter.module.scss";

const hex2Rgb = (hex: string): string => {
  const hex3RegExp = new RegExp("^#[a-f\\d]{3}$", "gi");
  const hex6RegExp = new RegExp("^#[a-f\\d]{6}$", "gi");
  if (hex3RegExp.test(hex) || hex6RegExp.test(hex)) {
    hex = hex.slice(1);
    if (hex.length === 3) {
      hex = hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2);
    }
    const int = parseInt(hex, 16);
    const red = int >> 16;
    const green = (int >> 8) & 255;
    const blue = int & 255;
    return `rgb(${red}, ${green}, ${blue})`;
  }
  throw new TypeError("Expected a valid hex string");
};

const Hex2Rgb = () => {
  const [hex, setHex] = useState<string>("#ffffff");
  const [rgb, setRgb] = useState<string>("rgb(255, 255, 255)");

  const convertHex2Rgb = useCallback(() => {
    try {
      setRgb(hex.startsWith('#') ? hex2Rgb(hex) : hex2Rgb(`#${hex}`));
    } catch (e) {
      alert("Please enter 3 or 6 digits color code.");
    }
  }, [hex]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setHex(event.target.value);
  }, []);

  return (
    <>
      <h2 className={styles.title}>Hex to RGB</h2>
      <Row>
        <div className={styles.field}>
          <label>Hex</label>
          <input
            name="hex"
            type="text"
            minLength={3}
            maxLength={7}
            value={hex}
            onChange={handleChange}
						spellCheck={false}
          />
        </div>
        <div className={styles.field}>
          <label>RGB</label>
          <input name="rgb" value={rgb} type="text" readOnly />
        </div>
      </Row>
      <Row>
        <div className={styles.preview} style={{ backgroundColor: rgb }}></div>
      </Row>
      <ButtonGroup>
        <Button onClick={convertHex2Rgb}>Convert</Button>
      </ButtonGroup>
    </>
  );
};

export default Hex2Rgb;
