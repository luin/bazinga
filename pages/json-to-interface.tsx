import { useRef, useState } from "react";
import Editor, { EditorRef } from "../components/editor";
import Row from "../components/row";
import { json } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { closeBrackets } from "@codemirror/closebrackets";
import jsonLinter from "../utils/jsonLinter";
import Button from "../components/button";
import { toast } from "react-toast";
import JSONToTS from "json-to-ts";
import useEditorValue from "../utils/useEditorValue";
import ButtonGroup from "../components/button-group";
import FileButton from "../components/file-button";

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
