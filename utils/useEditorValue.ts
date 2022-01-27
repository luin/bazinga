import { useCallback, useState } from "react";

const useEditorValue = (initialValue?: string) => {
  const [value, setValue] = useState<string | null>(
    typeof initialValue === "string" ? initialValue : null
  );
  const [epoch, setEpoch] = useState(0);

  return [
    { value, epoch },
    useCallback((newValue: string) => {
      setValue(newValue);
      setEpoch((current) => current + 1);
    }, []),
  ] as const;
};

export default useEditorValue;
