import { jsonParseLinter } from "@codemirror/lang-json";
import { Diagnostic } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";

const jsonLinter =
  () =>
  (view: EditorView): Diagnostic[] =>
    view.state.doc.toString().trim() ? jsonParseLinter()(view) : [];

export default jsonLinter;
