import { defaultKeymap } from "@codemirror/commands";
import { lineNumbers } from "@codemirror/gutter";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { history, historyKeymap } from "@codemirror/history";
import { Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import NoSSR from "./no-ssr";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { Resizable } from "react-resizable";
import {
  forwardRef,
  MutableRefObject,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import styles from "./editor.module.scss";
import { useRouter } from "next/router";
import ToolProvider from "../utils/ToolProvider";

const isMobile =
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 600px)").matches;

export interface EditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
}

interface EditorProps {
  sizeAutoSaveId: string;
  autoFocus?: boolean;
  editable?: boolean;
  hideLineNumbers?: boolean;
  lineWrapping?: boolean;
  value?: { value: string | null; epoch: number };
  defaultHeight?: number;
  extensions?: Extension[];
  placeholder?: string;
}

const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      sizeAutoSaveId,
      autoFocus = false,
      editable = true,
      hideLineNumbers = false,
      lineWrapping = false,
      value = { value: "", epoch: 0 },
      defaultHeight = 300,
      extensions,
      placeholder,
    },
    ref
  ) => {
    const { query } = useRouter();
    const toolId = useContext(ToolProvider);
    const [savedHeight, setSavedHeight] = useLocalStorage(
      `input-size-${toolId}-${sizeAutoSaveId}`,
      defaultHeight
    );
    const [height, setHeight] = useState(savedHeight);
    const [darkMode] = useLocalStorage("darkMode", "light");
    const editorRef: MutableRefObject<ReactCodeMirrorRef> = useRef({});

    useImperativeHandle(ref, () => ({
      getValue: () => {
        const view = editorRef.current.view;
        if (!view) return "";
        const state = view.state;
        return state.doc.toString();
      },
      setValue: (value) => {
        const view = editorRef.current.view;
        if (!view) return;
        view.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: value,
          },
        });
      },
    }));

    useEffect(() => {
      if (value.value) {
        const { view } = editorRef.current;
        view?.dispatch({
          changes: {
            from: 0,
            to: view.state.doc.length,
            insert: value.value || "",
          },
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value.epoch]);

    return (
      <Resizable
        axis="y"
        height={height}
        width={0}
        onResize={(_event, { size }) => {
          setHeight(size.height);
          setSavedHeight(size.height);
        }}
      >
        <div
          className={styles.container}
          style={{ height, userSelect: "contain" }}
          onBeforeInput={
            editable
              ? undefined
              : (e) => {
                  e.preventDefault();
                }
          }
        >
          <CodeMirror
            editable
            ref={editorRef}
            autoCapitalize="off"
            autoCorrect="off"
            theme={darkMode === "dark" ? "dark" : "light"}
            autoFocus={autoFocus && !isMobile}
            value={value.value || undefined}
            basicSetup={false}
            height="1px"
            placeholder={placeholder}
            extensions={[
              ...(hideLineNumbers || query["line-numbers"] === "off"
                ? []
                : [lineNumbers()]),
              ...(lineWrapping ? [EditorView.lineWrapping] : []),
              history(),
              keymap.of([...defaultKeymap, ...historyKeymap]),
              defaultHighlightStyle,
              ...(extensions || []),
            ]}
          />
        </div>
      </Resizable>
    );
  }
);

Editor.displayName = "Editor";

const EditorWrapper = forwardRef<EditorRef, EditorProps>((props, ref) => {
  return (
    <NoSSR>
      <Editor {...props} ref={ref} />
    </NoSSR>
  );
});

EditorWrapper.displayName = "EditorWrapper";

export default EditorWrapper;
