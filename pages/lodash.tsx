import Playground from "javascript-playgrounds";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";

const convertToString = (value: any): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (!value) {
    return value === undefined ? "undefined" : "null";
  }
  if (Array.isArray(value)) {
    return `[\n${value.map(convertToString).join(", ")}\n]`;
  }
  if (typeof value === "function") {
    return "[Function]";
  }

  return JSON.stringify(value);
};

const LodashPlayground: ToolPage = () => (
  <Row>
    <Playground
      style={{ minHeight: 200, height: 1 }}
      code={`import _ from 'lodash'\n\nconsole.log(_.now())\n\n`}
      modules={["lodash"]}
    />
  </Row>
);

export default LodashPlayground;
