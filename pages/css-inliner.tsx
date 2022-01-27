import { foldGutter } from "@codemirror/fold";
import { html } from "@codemirror/lang-html";
import juice from "juice";
import { useRef } from "react";
import Button from "../components/button";
import FileSaver from "file-saver";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";

const extensions = [html(), foldGutter()];

const CSSInlinerPage: ToolPage<{
  applyStyleTags: boolean;
  preserveMediaQueries: boolean;
  preserveFontFaces: boolean;
  inlinePseudoElements: boolean;
  preserveImportant: boolean;
}> = ({ settings }) => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue("");

  return (
    <>
      <Row>
        Inline CSS properties into the <code>style</code> attribute. This is
        especially useful for HTML emails.
      </Row>
      <Row>
        <Editor
          sizeAutoSaveId="input"
          autoFocus
          extensions={extensions}
          ref={ref}
        />
      </Row>
      <ButtonGroup
        meta={
          <FileButton
            accept=".html,.htm"
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
              const insert = juice(api.getValue(), {
                ...settings,
                removeStyleTags: true,
              });
              setResult(insert);
            } catch (err) {}
          }}
        >
          Inline
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
                    type: "text/html;charset=utf-8",
                  });
                  FileSaver.saveAs(blob, "inlined.html");
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

CSSInlinerPage.settingSchema = {
  applyStyleTags: {
    title: "Support <style/> Tag",
    type: "boolean",
    defaultValue: true,
  },
  preserveMediaQueries: {
    title: "Preserve Media Queries",
    type: "boolean",
    defaultValue: true,
  },
  preserveFontFaces: {
    title: "Preserve Font Faces",
    type: "boolean",
    defaultValue: true,
  },
  inlinePseudoElements: {
    title: "Inline Pseudo Elements",
    type: "boolean",
    defaultValue: false,
  },
  preserveImportant: {
    title: "Preserves !important in Values",
    type: "boolean",
    defaultValue: false,
  },
};

export default CSSInlinerPage;
