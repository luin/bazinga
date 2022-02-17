import ToolPage from "../utils/ToolPage";
import Rgb2Hex  from '../components/rgb-hex';
import Hex2Rgb from '../components/hex-rgb';
import styles from "../components/color-converter.module.scss";

const ColorConvertor: ToolPage = () => {
  return (
    <>
      <Rgb2Hex />
      <div className={styles.separator}></div>
      <Hex2Rgb />
    </>
  );
};

export default ColorConvertor;
