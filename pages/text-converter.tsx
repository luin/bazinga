import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";
import inflection from "inflection";
import { useRef } from "react";
import FileButton from "../components/file-button";
type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

const TextConverter: ToolPage = () => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue();

  const handleConvert =
    (method: KeysMatching<typeof inflection, (value: string) => string>) =>
    () => {
      const api = ref.current;
      if (api) {
        setResult(inflection[method](api.getValue()));
      }
    };

  return (
    <>
      <Row>
        <Editor sizeAutoSaveId="input" ref={ref} hideLineNumbers />
      </Row>
      <ButtonGroup
        meta={
          <FileButton
            accept="text/plain"
            variant="tertiary"
            onRead={(content) => ref.current?.setValue(content)}
          >
            Load from File
          </FileButton>
        }
      >
        <Button onClick={handleConvert("capitalize")}>
          {inflection.capitalize("capitalize")}
        </Button>
        <Button onClick={handleConvert("titleize")}>
          {inflection.titleize("Titleize")}
        </Button>
        <Button onClick={handleConvert("dasherize")}>
          {inflection.dasherize("Dasherize")}
        </Button>
        <Button
          onClick={() => {
            const api = ref.current;
            if (api) {
              setResult(api.getValue().toUpperCase());
            }
          }}
        >
          UPPER CASE
        </Button>
        <Button
          onClick={() => {
            const api = ref.current;
            if (api) {
              setResult(api.getValue().toLowerCase());
            }
          }}
        >
          lower case
        </Button>
      </ButtonGroup>
      {result.value && (
        <Row title="Result">
          <Editor sizeAutoSaveId="output" hideLineNumbers value={result} />
        </Row>
      )}
    </>
  );
};

export default TextConverter;
