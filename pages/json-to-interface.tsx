import { closeBrackets } from "@codemirror/closebrackets";
import { json } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import JSONToTS from "json-to-ts";
import { useRef } from "react";
import { toast } from "react-toast";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import jsonLinter from "../utils/jsonLinter";
import useEditorValue from "../utils/useEditorValue";

const extensions = [
  json(),
  closeBrackets(),
  linter(jsonLinter()),
  lintGutter(),
];

const JSONToInterfacePage = () => {
  const ref = useRef<EditorRef | null>(null);

  const [result, setResult] = useEditorValue("");

  const handleConvert = (jsonString: string) => {
    let json: unknown;
    try {
      json = JSON.parse(jsonString);
    } catch (err) {
      toast.error("JSON is invalid");
      return;
    }
    const interfaceArr = JSONToTS(json);
    const result = interfaceArr.reduce((acc, cur) => {
      return `${acc}\n${cur}\n`;
    }, "");
    setResult(result);
  };

  return (
    <>
      <Row>
        <Editor
          ref={ref}
          extensions={extensions}
          sizeAutoSaveId="input"
          autoFocus
        />
      </Row>
      <Row>
        <ButtonGroup
          meta={
            <FileButton
              accept=".json"
              onRead={(data) => {
                handleConvert(data);
              }}
            >
              Convert a File
            </FileButton>
          }
        >
          <Button
            variant="primary"
            onClick={() => {
              const api = ref.current;
              if (api) {
                handleConvert(api.getValue());
              }
            }}
          >
            Convert
          </Button>
        </ButtonGroup>
      </Row>
      {result.value && (
        <>
          <Row>
            <Editor
              sizeAutoSaveId="output"
              lineWrapping
              hideLineNumbers
              editable={false}
              value={result}
            />
          </Row>
        </>
      )}
    </>
  );
};

export default JSONToInterfacePage;
