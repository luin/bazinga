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
import ToolSettingPanel from "../components/tool-setting-panel";
import jsonLinter from "../utils/jsonLinter";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";
import useSettings from "../utils/useSettings";

const extensions = [
  json(),
  closeBrackets(),
  linter(jsonLinter()),
  lintGutter(),
];

const schema = {
  quotingType: {
    type: "string",
    defaultValue: "'",
    title: "Quoting Type",
    options: [
      { value: "'", label: "Single Quote" },
      { value: '"', label: "Double Quote" },
    ],
  },
  forceQuotes: {
    type: "boolean",
    defaultValue: false,
    title: "Force Quotes",
  },
  skipInvalid: {
    type: "boolean",
    defaultValue: false,
    title: "Skip Invalid Types",
  },
  lineWidth: {
    type: "number",
    defaultValue: 80,
    title: "Max Line Width",
  },
  noRefs: {
    type: "boolean",
    defaultValue: false,
    title: "No Refs",
    description: "Don't convert duplicate objects into references.",
  },
  noCompatMode: {
    type: "boolean",
    defaultValue: false,
    title: "Disable Compatibility Mode",
    description: "Don't try to be compatible with older YAML versions",
  },
} as const;

const JSONToYAMLPage: ToolPage = () => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue("");

  const [quickSettings, updateQuickSetting] = useSettings<{
    skipInvalid: boolean;
    lineWidth: number;
    noRefs: boolean;
    noCompatMode: boolean;
    quotingType: string;
    forceQuotes: boolean;
  }>({
    schema,
  });

  const handleConvert = (jsonString: string) => {
    let dumped: string;
    let json: unknown;
    try {
      json = JSON.parse(jsonString);
    } catch (err) {
      toast.error("JSON is invalid");
      return;
    }
    try {
      // @ts-expect-error
      dumped = jsYaml.dump(json, { ...quickSettings });
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Failed to convert to YAML"
      );
      return;
    }
    setResult(dumped);
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
      <Row variant="options">
        <ToolSettingPanel
          settings={quickSettings}
          settingSchema={schema}
          updateSetting={updateQuickSetting}
        />
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
            <Editor sizeAutoSaveId="output" editable={false} value={result} />
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

export default JSONToYAMLPage;
