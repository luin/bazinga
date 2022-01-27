import { useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ToolPageSettings, ToolPageSettingSchema } from "./ToolPage";
import ToolProvider from "./ToolProvider";

interface UseSettingsProps<T extends ToolPageSettings> {
  schema?: ToolPageSettingSchema<T>;
  settingKey?: string;
}

const useSettings = <T extends ToolPageSettings>({
  schema,
  settingKey,
}: UseSettingsProps<T>) => {
  const toolId = useContext(ToolProvider);
  const key = `bazinga-settings-${toolId}${settingKey ? `-${settingKey}` : ""}`;
  const [settings, setSettings] = useLocalStorage<{ [key: string]: unknown }>(
    key,
    {}
  );

  const validatedSettings = useMemo(() => {
    if (!schema) return undefined;
    const validated: { [key: string]: unknown } = {};
    Object.keys(settings).forEach((key) => {
      if (typeof settings[key] === schema[key]?.type) {
        validated[key] = settings[key];
      }
    });

    Object.keys(schema).forEach((key) => {
      if (!(key in validated)) {
        validated[key] = schema[key].defaultValue;
      }
    });
    return validated;
  }, [settings, schema]);

  const updateSetting = useCallback(
    <K extends keyof T>(id: K, value: T[K]) => {
      setSettings((currentSettings) => ({
        ...currentSettings,
        [id]: value,
      }));
    },
    [setSettings]
  );

  return [validatedSettings as T, updateSetting] as const;
};

export default useSettings;
