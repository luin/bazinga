import { closeBrackets } from "@codemirror/closebrackets";
import { foldGutter } from "@codemirror/fold";
import { javascript } from "@codemirror/lang-javascript";
import Script from "next/script";
import parser from "prettier/parser-babel";
import { format } from "prettier/standalone";
import { useRef } from "react";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";

const extensions = [javascript(), closeBrackets(), foldGutter()];

const JSPage: ToolPage<{
  indent: string;
}> = ({ settings }) => {
  const ref = useRef<EditorRef | null>(null);
  const [value, setValue] = useEditorValue("");

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/terser/dist/bundle.min.js"></Script>
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
            accept=".js,.jsx,.ts,.tsx,.json"
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
              const insert = format(api.getValue(), {
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
                // @ts-expect-error
                window.Terser.minify(api.getValue(), { sourceMap: false }).then(
                  // @ts-expect-error
                  ({ code }) => {
                    if (code) {
                      setValue(code);
                    }
                  }
                );
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

JSPage.settingSchema = {
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
};

export default JSPage;
