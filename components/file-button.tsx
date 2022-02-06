import { useRef } from "react";
import { toast } from "react-toast";
import Button, { ButtonProps } from "./button";
import styles from "./file-button.module.scss";

interface FileButtonProps extends ButtonProps {
  accept?: string;
  onRead?: (content: string) => void;
  onReadBinary?: (content: ArrayBuffer) => void;
}

const FileButton = ({
  children,
  accept,
  onRead,
  onReadBinary,
  ...props
}: FileButtonProps) => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <div className={styles.container}>
      <Button {...props} asLabel>
        {children}
        <input
          ref={ref}
          type="file"
          accept={accept}
          onChange={(e) => {
            const reader = new FileReader();

            reader.addEventListener("load", function (e) {
              const result = e.target?.result;
              if (typeof result === "string") {
                onRead?.(result);
              } else if (result) {
                onReadBinary?.(result);
              }
            });
            reader.addEventListener("error", (e) => {
              const message =
                e.target?.error?.message ?? "Failed to read the selected file.";
              toast.error(message);
            });
            const file = e.target.files?.[0];
            if (file) {
              if (onRead) reader.readAsBinaryString(file);
              if (onReadBinary) reader.readAsArrayBuffer(file);
            }
          }}
        ></input>
      </Button>
    </div>
  );
};

export default FileButton;
