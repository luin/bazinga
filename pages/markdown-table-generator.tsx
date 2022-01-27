import { markdownTable } from "markdown-table";
import { useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import Editor from "../components/editor";
import Quill from "../components/quill";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";
import styles from "./markdown-table-generator.module.scss";
import ColumnAppendIcon from "../svg/column-append.svg";
import ColumnPrependIcon from "../svg/column-prepend.svg";
import RowAppendIcon from "../svg/row-append.svg";
import RowPrependIcon from "../svg/row-prepend.svg";
import RowRemoveIcon from "../svg/row-remove.svg";
import ColumnRemoveIcon from "../svg/column-remove.svg";
import "react-quill/dist/quill.snow.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type Op = { insert: string; attributes?: Record<string, unknown> };
type Data = ({ ops: Op[] } | null)[][];

const isEmpty = (ops: { ops: Op[] } | null | undefined) => {
  if (!ops) return true;
  return (
    ops.ops
      .map(({ insert }) => insert)
      .join("")
      .trim().length === 0
  );
};

type Settings = {
  ignoreEmptyCells: boolean;
  padding: boolean;
  alignDelimiters: boolean;
};

const generateTable = (data: Data, settings: Settings) => {
  let cloned: typeof data = JSON.parse(JSON.stringify(data));
  let maxRow = cloned.length - 1;
  if (settings.ignoreEmptyCells) {
    for (; maxRow >= 0; maxRow -= 1) {
      if (cloned[maxRow].length > 0 && !cloned[maxRow].every(isEmpty)) {
        break;
      }
    }
  }
  let maxColumn = -1;
  for (let i = 0; i <= maxRow; i += 1) {
    let j = cloned[i].length - 1;
    if (settings.ignoreEmptyCells) {
      for (; j >= 0; j -= 1) {
        if (!isEmpty(cloned[i][j])) {
          break;
        }
      }
      maxColumn = Math.max(maxColumn, j);
    }
  }

  if (maxColumn < 0) maxColumn = Math.max(...cloned.map((row) => row.length));
  if (maxRow < 0) maxRow = cloned.length - 1;

  cloned = cloned.slice(0, maxRow + 1);
  let pureTable = cloned.map((items) => {
    return items.slice(0, maxColumn + 1).map((item) => {
      return item
        ? item.ops
            .map(({ insert }) => insert)
            .join("")
            .replace(/\n$/, "")
            .replace(/\n/g, "<br/>")
        : "";
    });
  });

  return markdownTable(pureTable, {
    padding: settings.padding,
    alignDelimiters: settings.alignDelimiters,
  });
};

const MarkdownTableGenerator: ToolPage<Settings> = ({ settings }) => {
  const [data, setData] = useImmer<Data>([[null, null, null], [], []]);
  const [result, setResult] = useEditorValue();
  const lastActiveRow = useRef(0);
  const lastActiveColumn = useRef(0);

  const rows = data.length;
  const columns = Math.max(...data.map((row) => row.length));

  useEffect(() => {
    setResult(generateTable(data, settings));
  }, [data, setResult, settings]);

  return (
    <>
      <Row>
        <div className={styles.toolbar}>
          <div className={styles.toolbarGroup}>
            <Tippy content="Prepend a column">
              <button
                onClick={() => {
                  setData((draft) => {
                    draft.forEach((row) => {
                      row.splice(lastActiveColumn.current, 0, null);
                    });
                  });
                }}
              >
                <ColumnPrependIcon />
              </button>
            </Tippy>
            <Tippy content="Append a column">
              <button
                onClick={() => {
                  setData((draft) => {
                    draft.forEach((row) => {
                      row.splice(lastActiveColumn.current + 1, 0, null);
                    });
                  });
                }}
              >
                <ColumnAppendIcon />
              </button>
            </Tippy>
            <Tippy content="Delete column">
              <button
                onClick={() => {
                  setData((draft) => {
                    draft.forEach((row) => {
                      row.splice(lastActiveColumn.current, 1);
                    });
                  });
                }}
              >
                <ColumnRemoveIcon />
              </button>
            </Tippy>
          </div>
          <div className={styles.toolbarGroup}>
            <Tippy content="Prepend a row">
              <button
                onClick={() => {
                  setData((draft) => {
                    draft.splice(lastActiveRow.current, 0, []);
                  });
                }}
              >
                <RowPrependIcon />
              </button>
            </Tippy>
            <Tippy content="Append a row">
              <button
                onClick={() => {
                  setData((draft) => {
                    draft.splice(lastActiveRow.current + 1, 0, []);
                  });
                }}
              >
                <RowAppendIcon />
              </button>
            </Tippy>
            <Tippy content="Delete row">
              <button
                onClick={() => {
                  setData((draft) => {
                    draft.splice(lastActiveRow.current, 1);
                  });
                }}
              >
                <RowRemoveIcon />
              </button>
            </Tippy>
          </div>
        </div>
        <table className={styles.table}>
          <tbody>
            {new Array(rows).fill(0).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {new Array(columns).fill(0).map((_, columnIndex) => (
                  <td
                    data-row-index={rowIndex}
                    data-column-index={columnIndex}
                    key={columnIndex}
                    onFocus={() => {
                      lastActiveColumn.current = columnIndex;
                      lastActiveRow.current = rowIndex;
                    }}
                  >
                    <Quill
                      // @ts-expect-error
                      value={data[rowIndex][columnIndex]}
                      modules={{ toolbar: false }}
                      onChange={(_v, _d, source, editor) => {
                        if (source !== "user") return;
                        const cellContents = editor.getContents();
                        setData((draft) => {
                          // @ts-expect-error
                          draft[rowIndex][columnIndex] = cellContents;
                        });
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Row>
      {result.value && (
        <Row title="Result">
          <Editor sizeAutoSaveId="output" editable={false} value={result} />
        </Row>
      )}
    </>
  );
};

MarkdownTableGenerator.settingSchema = {
  ignoreEmptyCells: {
    title: "Ignore Trailing Empty Cells",
    type: "boolean",
    defaultValue: false,
  },
  alignDelimiters: {
    title: "Align Delimiters",
    type: "boolean",
    defaultValue: true,
  },
  padding: {
    title: "Add Paddings",
    type: "boolean",
    defaultValue: true,
  },
};

export default MarkdownTableGenerator;
