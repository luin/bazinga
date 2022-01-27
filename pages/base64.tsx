import FileSaver from "file-saver";
import iconv from "iconv-lite";
import { fromUint8Array, toUint8Array } from "js-base64";
import { useRef, useState } from "react";
import Button from "../components/button";
import ButtonGroup from "../components/button-group";
import Editor, { EditorRef } from "../components/editor";
import FileButton from "../components/file-button";
import Row from "../components/row";
import ToolSettingPanel from "../components/tool-setting-panel";
import ToolPage from "../utils/ToolPage";
import useEditorValue from "../utils/useEditorValue";
import useSettings from "../utils/useSettings";

const options = [
  {
    label: "Popular",
    options: [
      { value: "utf8", label: "UTF-8" },
      { value: "hex", label: "HEX" },
      { value: "ascii", label: "ASCII" },
      { value: "cesu8", label: "CESU-8" },
      { value: "ucs2", label: "UCS-2" },
      { value: "ISO-8859-1", label: "ISO-8859-1" },
      { value: "ISO-8859-16", label: "ISO-8859-16" },
      { value: "1252", label: "Windows-1252" },
    ],
  },
  {
    label: "Unicode",
    options: [
      { value: "UTF7", label: "UTF-7" },
      { value: "UTF7-IMAP", label: "UTF7-IMAP" },
      { value: "UTF-16BE", label: "UTF-16BE" },
      { value: "UTF-16", label: "UTF-16" },
      { value: "UTF-32", label: "UTF-32" },
      { value: "UTF-32LE", label: "UTF-32LE" },
      { value: "UTF-32BE", label: "UTF-32BE" },
    ],
  },
  {
    label: "Multi-byte",
    options: [
      { value: "1254", label: "Windows-1254" },
      { value: "GB2312", label: "GB2312" },
      { value: "GBK", label: "GBK" },
      { value: "GB18030", label: "GB18030" },
      { value: "Windows936", label: "Windows936" },
      { value: "EUC-CN", label: "EUC-CN" },
      { value: "Shift_JIS", label: "Shift_JIS" },
      { value: "Windows-31j", label: "Windows-31j" },
      { value: "Windows932", label: "Windows932" },
      { value: "EUC-JP", label: "EUC-JP" },
      { value: "KS_C_5601", label: "KS_C_5601" },
      { value: "Windows949", label: "Windows949" },
      { value: "EUC-KR", label: "EUC-KR" },
      { value: "Big5", label: "Big5" },
      { value: "Big5-HKSCS", label: "Big5-HKSCS" },
      { value: "Windows950", label: "Windows950" },
    ],
  },
];

const schema = {
  encoding: {
    title: "Encoding",
    type: "string",
    defaultValue: options[0].options[0].value,
    options,
  },
} as const;

const Base64: ToolPage = () => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue("");
  const [originalResult, setOriginalResult] = useState<Uint8Array | null>(null);

  const [quickSettings, updateQuickSetting] = useSettings<{
    encoding: string;
  }>({
    schema,
  });

  return (
    <>
      <Row>
        <Editor ref={ref} sizeAutoSaveId="input" autoFocus />
      </Row>
      <Row variant="options">
        <ToolSettingPanel
          settings={quickSettings}
          settingSchema={schema}
          updateSetting={updateQuickSetting}
        />
      </Row>
      <ButtonGroup>
        <Button
          variant="primary"
          onClick={() => {
            const api = ref.current;
            if (api) {
              const buf = iconv.encode(api.getValue(), quickSettings.encoding);
              setResult(fromUint8Array(buf));
              setOriginalResult(null);
            }
          }}
        >
          Encode
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            const api = ref.current;
            if (api) {
              const buf = toUint8Array(api.getValue());
              // @ts-expect-error
              setResult(iconv.decode(buf, quickSettings.encoding));
              setOriginalResult(buf);
            }
          }}
        >
          Decode
        </Button>
      </ButtonGroup>
      <hr />
      <ButtonGroup>
        <FileButton
          onReadBinary={(data) => {
            const api = ref.current;
            if (api) {
              // @ts-expect-error
              setResult(fromUint8Array(data));
              setOriginalResult(null);
            }
          }}
        >
          Encode File
        </FileButton>
        <FileButton
          onRead={(data) => {
            const buf = toUint8Array(data);
            // @ts-expect-error
            setResult(iconv.decode(buf, quickSettings.encoding));
            setOriginalResult(buf);
          }}
        >
          Decode File
        </FileButton>
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
          {originalResult && (
            <ButtonGroup>
              <Button
                variant="primary"
                onClick={() => {
                  if (originalResult) {
                    const filename = prompt("Enter a filename:", "output.txt");
                    if (filename) {
                      const blob = new Blob([originalResult]);
                      FileSaver.saveAs(blob, filename);
                    }
                  }
                }}
              >
                Download
              </Button>
            </ButtonGroup>
          )}
        </>
      )}
    </>
  );
};

export default Base64;
