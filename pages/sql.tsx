import { foldGutter } from "@codemirror/fold";
import { sql } from "@codemirror/lang-sql";
import { useRef } from "react";
import { format } from "sql-formatter";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import ToolSettingPanel from "../components/tool-setting-panel";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";
import useSettings from "../utils/useSettings";

const extensions = [sql(), foldGutter()];

const options = [
  { value: "sql", label: "Standard" },
  { value: "redshift", label: "AWS Redshift" },
  { value: "db2", label: "DB2" },
  { value: "mariadb", label: "MariaDB" },
  { value: "mysql", label: "MySQL" },
  { value: "n1ql", label: "N1QL" },
  { value: "plsql", label: "PL/SQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "spark", label: "Spark" },
  { value: "tsql", label: "Transact-SQL" },
];

const schema = {
  dialect: {
    type: "string",
    defaultValue: options[0].value,
    title: "Dialect",
    options,
  },
} as const;

const SQL: ToolPage<{ indent: string; uppercase: boolean }> = ({
  settings,
}) => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue();
  const [quickSettings, updateQuickSetting] = useSettings({ schema });

  return (
    <>
      <Row>
        <Editor sizeAutoSaveId="input" ref={ref} extensions={extensions} />
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
            accept=".sql"
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
              const insert = format(api.getValue(), {
                // @ts-expect-error
                language: quickSettings.dialect,
                indent: settings.indent,
                uppercase: settings.uppercase,
              });
              setResult(insert);
            }
          }}
        >
          Format
        </Button>
      </ButtonGroup>
      {result.value && (
        <Row title="Result">
          <Editor
            sizeAutoSaveId="output"
            value={result}
            extensions={extensions}
          />
        </Row>
      )}
    </>
  );
};

SQL.settingSchema = {
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
  uppercase: {
    title: "Uppercase Keywords",
    type: "boolean",
    defaultValue: false,
  },
};

export default SQL;
