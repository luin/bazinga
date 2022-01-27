import { closeBrackets } from "@codemirror/closebrackets";
import { json } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import json2csv from "json2csv";
import { useRef } from "react";
import { toast } from "react-toast";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import FileSaver from "file-saver";
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
  fields: {
    type: "string",
    defaultValue: "",
    title: "Fields",
    description: "Separate with commas. Leave empty to detect automatically.",
  },
  header: { type: "boolean", defaultValue: true, title: "Include Header" },
  includeEmptyRows: {
    type: "boolean",
    defaultValue: false,
    title: "Include Empty Rows",
  },
} as const;

const JSONToCSVPage: ToolPage<{ delimiter: string; eol: string }> = ({
  settings,
}) => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue("");

  const [quickSettings, updateQuickSetting] = useSettings<{
    header: boolean;
    includeEmptyRows: boolean;
    fields: string;
  }>({
    schema,
  });

  const handleConvert = (jsonString: string) => {
    let json: unknown;
    try {
      json = JSON.parse(jsonString);
    } catch (err) {
      toast.error("JSON is invalid");
      return;
    }
    const options = {
      ...settings,
      ...quickSettings,
      fields: quickSettings.fields
        ? quickSettings.fields.split(/,\s?/)
        : undefined,
    };
    // @ts-expect-error
    const csv = json2csv.parse(json, options);
    setResult(csv);
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
      {result.value && (
        <>
          <Row title="Result">
            <Editor
              sizeAutoSaveId="output"
              lineWrapping
              hideLineNumbers
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
                    type: "text/csv;charset=utf-8",
                  });
                  FileSaver.saveAs(blob, "bazinga-table.csv");
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

JSONToCSVPage.settingSchema = {
  delimiter: {
    title: "Delimiter",
    type: "string",
    defaultValue: ",",
    options: [
      { value: ",", label: "Comma (CSV)" },
      { value: "\t", label: "Tab (TSV)" },
      { value: ";", label: "Semi-colon (CSV French)" },
    ],
  },
  eol: {
    title: "EOL Char",
    type: "string",
    defaultValue: "\n",
    options: [
      { value: "\n", label: "\\n (Unix/macOS)" },
      { value: "\r\n", label: "\\r\\n (Windows)" },
    ],
  },
};

export default JSONToCSVPage;
