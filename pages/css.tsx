import { foldGutter } from "@codemirror/fold";
import { css } from "@codemirror/lang-css";
import CleanCSS from "clean-css";
import { useRef } from "react";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";

const extensions = [css(), foldGutter()];

const CSSPage: ToolPage<{
  cleanupCharsets: boolean;
  optimizeFontWeight: boolean;
  optimizeBorderRadius: boolean;
  optimizeFont: boolean;
  optimizeOutline: boolean;
  removeEmpty: boolean;
  removeQuotes: boolean;
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
            accept=".css"
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
            if (api) {
              const cleanCSS = new CleanCSS({ format: "beautify" });
              // @ts-expect-error
              if (cleanCSS.options?.format) {
                // @ts-expect-error
                cleanCSS.options.format.semicolonAfterLastProperty = true;
              }
              // @ts-expect-error
              Object.assign(cleanCSS.options?.level[1], { ...settings });
              var output = cleanCSS.minify(api.getValue());
              setValue(output.styles);
            }
          }}
        >
          Format
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const api = ref.current;
            if (api) {
              const cleanCSS = new CleanCSS();
              // @ts-expect-error
              Object.assign(cleanCSS.options?.level[1], { ...settings });
              var output = cleanCSS.minify(api.getValue());
              setValue(output.styles);
            }
          }}
        >
          Minify
        </Button>
      </ButtonGroup>
    </>
  );
};

CSSPage.settingSchema = {
  optimizeBorderRadius: {
    title: "Optimize border-radius",
    type: "boolean",
    defaultValue: true,
  },
  optimizeOutline: {
    title: "Optimize outline",
    type: "boolean",
    defaultValue: true,
  },
  optimizeFont: {
    title: "Optimize font",
    type: "boolean",
    defaultValue: true,
  },
  optimizeFontWeight: {
    title: "Optimize font-weight",
    type: "boolean",
    defaultValue: true,
  },
  removeEmpty: {
    title: "Remove Empty Rules",
    type: "boolean",
    defaultValue: true,
  },
  cleanupCharsets: {
    title: "Cleanup Charsets",
    type: "boolean",
    defaultValue: true,
  },
  removeQuotes: {
    title: "Remove Unnecessary Quotes",
    type: "boolean",
    defaultValue: true,
  },
};

export default CSSPage;
