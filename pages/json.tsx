import { closeBrackets } from "@codemirror/closebrackets";
import { foldGutter } from "@codemirror/fold";
import { json } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import parser from "prettier/parser-babel";
import { format } from "prettier/standalone";
import { useRef } from "react";
import jsonLinter from "../utils/jsonLinter";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";

const extensions = [
  json(),
  closeBrackets(),
  linter(jsonLinter()),
  lintGutter(),
  foldGutter(),
];

const JSONPage: ToolPage<{
  indent: string;
  backslash: string;
}> = ({ settings }) => {
  const ref = useRef<EditorRef | null>(null);
  const [value, setValue] = useEditorValue("");

  return (
    <>
      <Row>
        <Editor
          autoFocus
          sizeAutoSaveId="input"
          value={value}
          extensions={extensions}
          ref={ref}
        />
      </Row>
      <ButtonGroup
        meta={
          <FileButton
            accept=".json,.txt,.js,application/json"
            variant="tertiary"
            onRead={(content) => ref.current?.setValue(content)}
          >
            Load from File
          </FileButton>
        }
      >
        <Button
          variant="primary"
          onClick={() => {
            const api = ref.current;
            if (!api) return;
            try {
              let content = api.getValue()
              if (settings.backslash === 'unescape') {
                content = content.replaceAll('\\"', '"').replaceAll('\\\\', `\\`)
              }

              const insert = format(content, {
                parser: "json",
                useTabs: settings.indent === "\t",
                tabWidth: settings.indent === "  " ? 2 : 4,
                plugins: [parser],
              });
              setValue(insert.trim());
            } catch (err) {}
          }}
        >
          Format
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const api = ref.current;
            if (api) {
              try {
                setValue(JSON.stringify(JSON.parse(api.getValue())));
              } catch (err) {}
            }
          }}
        >
          Minify
        </Button>
      </ButtonGroup>
    </>
  );
};

JSONPage.settingSchema = {
  indent: {
    title: "Indent",
    type: "string",
    defaultValue: "  ",
    options: [
      { label: "2 Spaces", value: "  " },
      { label: "4 Spaces", value: "    " },
      { label: "Tab", value: "\t" },
    ],
  },
  backslash: {
    title: "Backslash",
    type: "string",
    defaultValue: "",
    options: [
      { label: "None", value: ""},
      { label: "Unescape", value: 'unescape' },
    ],
  },
};

export default JSONPage;
