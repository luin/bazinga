import { foldGutter } from "@codemirror/fold";
import { html } from "@codemirror/lang-html";
import { html_beautify } from "js-beautify";
import { useRef } from "react";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";

const extensions = [html(), foldGutter()];

const HTMLPage: ToolPage<{
  indent: string;
  "wrap-line-length": number;
}> = ({ settings }) => {
  const ref = useRef<EditorRef | null>(null);
  const [value, setValue] = useEditorValue("");

  return (
    <>
      <Row>
        <Editor
          sizeAutoSaveId="input"
          autoFocus
          value={value}
          extensions={extensions}
          ref={ref}
        />
      </Row>
      <ButtonGroup
        meta={
          <FileButton
            accept=".html,.htm,.xml"
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
            setValue(
              html_beautify(api.getValue(), {
                indent_char: " ",
                indent_size: settings.indent === "  " ? 2 : 4,
                indent_with_tabs: settings.indent === "\t",
                wrap_line_length: settings["wrap-line-length"],
              })
            );
          }}
        >
          Format
        </Button>
      </ButtonGroup>
    </>
  );
};

HTMLPage.settingSchema = {
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
  "wrap-line-length": {
    title: "Wrap Line",
    type: "number",
    defaultValue: 0,
    options: [
      { label: "Never", value: 0 },
      { label: "40 Characters", value: 40 },
      { label: "70 Characters", value: 70 },
      { label: "80 Characters", value: 80 },
      { label: "110 Characters", value: 110 },
      { label: "120 Characters", value: 120 },
      { label: "160 Characters", value: 160 },
    ],
  },
};

export default HTMLPage;
