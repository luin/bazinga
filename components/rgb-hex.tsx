import { ChangeEvent, useCallback, useState } from "react";
import Button from "../components/button";
import Row from "../components/row";
import ButtonGroup from "../components/button-group";
import styles from "./color-converter.module.scss";

const numberInputProps = {
  type: "number",
  min: 0,
  max: 255,
};

const rgb2Hex = (red: number, green: number, blue: number): string => {
  return '#' + (red << 16 | green << 8 | blue | 1 << 24).toString(16).slice(1);
}

const Rgb2Hex = () => {
  const [red, setRed] = useState<string | number>(255);
  const [green, setGreen] = useState<string | number>(255);
  const [blue, setBlue] = useState<string | number>(255);
  const [hex, setHex] = useState<string>('#ffffff');

  const convertRgb2Hex = useCallback(() => {
    const hex = rgb2Hex(Number(red), Number(green), Number(blue));
    setHex(hex);
  }, [red, green, blue]);

  const getInputHandler =
    (setter: (val: string | number) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(event?.target.value);
      const int = (isNaN(val) || val < 0) ? 0 : (val > 255 ? 255 : val);
      setter(`${int}`);
    };

  return (
    <>
      <h2 className={styles.title}>RGB to Hex</h2>
      <Row>
        <div className={styles.field}>
          <label>Red</label>
          <input
            {...numberInputProps}
            name="red"
            value={red}
            onChange={getInputHandler(setRed)}
          />
        </div>
        <div className={styles.field}>
          <label>Green</label>
          <input
            {...numberInputProps}
            name="green"
            value={green}
            onChange={getInputHandler(setGreen)}
          />
        </div>
        <div className={styles.field}>
          <label>Blue</label>
          <input
            {...numberInputProps}
            name="blue"
            value={blue}
            onChange={getInputHandler(setBlue)}
          />
        </div>
        <div className={styles.field}>
          <label>Hex</label>
          <input
            name="hex"
            value={hex}
            type="text"
            readOnly
          />
        </div>
      </Row>
      <Row>
        <div className={styles.preview} style={{backgroundColor: hex}}></div>
      </Row>
      <ButtonGroup>
        <Button onClick={convertRgb2Hex}>Convert</Button>
      </ButtonGroup>
    </>
  );
};

export default Rgb2Hex;
