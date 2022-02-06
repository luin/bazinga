import { closeBrackets } from "@codemirror/closebrackets";
import { json } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import FileSaver from "file-saver";
import jsYaml from "js-yaml";
import { useRef } from "react";
import { toast } from "react-toast";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import jsonLinter from "../utils/jsonLinter";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";

const extensions = [
  json(),
  closeBrackets(),
  linter(jsonLinter()),
  lintGutter(),
];

const YAMLToJSONPage: ToolPage = () => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue("");

  const handleConvert = (yamlString: string) => {
    let json: unknown;
    try {
      json = jsYaml.load(yamlString, { json: true });
    } catch (err) {
      toast.error("YAML is invalid");
      return;
    }
    setResult(JSON.stringify(json, null, 2));
  };

  return (
    <>
      <Row>
        <Editor ref={ref} sizeAutoSaveId="input" autoFocus />
      </Row>
      <ButtonGroup
        meta={
          <FileButton
            accept=".yaml,.yml"
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
      {result.value && (
        <>
          <Row title="Result">
            <Editor
              sizeAutoSaveId="output"
              extensions={extensions}
              editable={false}
              value={result}
            />
          </Row>
          <ButtonGroup>
            <Button
              variant="primary"
              onClick={() => {
                if (result.value) {
                  const blob = new Blob([result.value], {
                    type: "application/json;charset=utf-8",
                  });
                  FileSaver.saveAs(blob, "bazinga-json.json");
                }
              }}
            >
              Download
            </Button>
          </ButtonGroup>
        </>
      )}
    </>
  );
};

export default YAMLToJSONPage;
