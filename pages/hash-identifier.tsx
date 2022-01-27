import Editor, { EditorRef } from "../components/editor";
import Row from "../components/row";
import ToolPage from "../utils/ToolPage";
// @ts-expect-error
import HashIdentifier from "hash-identifier";
import useEditorValue from "../utils/useEditorValue";
import ButtonGroup from "../components/button-group";
import Button from "../components/button";
import { useRef } from "react";

const HashIdentifierPage: ToolPage = () => {
  const ref = useRef<EditorRef | null>(null);
  const [result, setResult] = useEditorValue("");

  return (
    <>
      <Row>Identifies the algorithm used to generate the supplied hash.</Row>
      <Row>
        <Editor
          sizeAutoSaveId="input"
          hideLineNumbers
          ref={ref}
          autoFocus
          placeholder="Hash"
        />
      </Row>
      <ButtonGroup>
        <Button
          variant="primary"
          onClick={() => {
            const api = ref.current;
            if (api) {
              let value = api.getValue().trim();
              const saltIndex = value.indexOf(":");
              if (saltIndex > -1) {
                value = value.slice(0, saltIndex);
              }
              const algorithms = HashIdentifier.checkAlgorithm(value);
              if (algorithms.length) {
                setResult(algorithms.join("\n"));
              } else {
                setResult("Unknown algorithm");
              }
            }
          }}
        >
          Detect
        </Button>
      </ButtonGroup>
      {result.value && (
        <Row title="Possible Algorithms">
          <Editor
            sizeAutoSaveId="output"
            hideLineNumbers
            editable={false}
            value={result}
          />
        </Row>
      )}
    </>
  );
};

export default HashIdentifierPage;
