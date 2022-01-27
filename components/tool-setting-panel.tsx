import { Fragment } from "react";
import classNames from "classnames";
import {
  GroupedOption,
  SimpleOption,
  ToolPageSettings,
  ToolPageSettingSchema,
} from "../utils/ToolPage";
import Select from "./select";
import styles from "./tool-setting-panel.module.scss";

interface ToolSettingPanelProps<T extends ToolPageSettings> {
  settings: T;
  settingSchema: ToolPageSettingSchema<T>;
  updateSetting: <K extends keyof T>(id: K, value: T[K]) => void;
}

const findOption = <T,>(
  options: GroupedOption<T>[] | SimpleOption<T>[],
  value: T
): { label: string; value: T } | null => {
  if (!options.length) return null;
  if ("options" in options[0]) {
    for (const option of options) {
      // @ts-expect-error
      const find = findOption(option.options, value);
      if (find) return find;
    }
    return null;
  } else {
    // @ts-expect-error
    return options.find(({ value: optionValue }) => optionValue === value);
  }
};

const ToolSettingPanel = <T extends ToolPageSettings>({
  settings,
  settingSchema,
  updateSetting,
}: ToolSettingPanelProps<T>) => {
  return (
    <div className={styles.container}>
      {Object.entries(settingSchema).map(
        ([key, schema]: [
          string,
          ToolPageSettingSchema<ToolPageSettings>[string]
        ]) => {
          const id = `setting-${key}`;
          return (
            <Fragment key={key}>
              {schema.type === "boolean" && (
                <>
                  <div />
                  <div
                    className={classNames(
                      styles.settingValue,
                      styles.checkboxSettingValue
                    )}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={Boolean(settings[key])}
                      onChange={(e) => {
                        // @ts-expect-error
                        updateSetting(key, e.target.checked);
                      }}
                    />
                    <label htmlFor={id} className={styles.checkboxTitle}>
                      {schema.title}
                    </label>
                    {schema.description && (
                      <p className={styles.description}>{schema.description}</p>
                    )}
                  </div>
                </>
              )}
              {(schema.type === "string" || schema.type === "number") &&
                schema.options && (
                  <>
                    <label htmlFor={id} className={styles.settingTitle}>
                      {schema.title}
                    </label>
                    <Select
                      id={id}
                      className={styles.settingValue}
                      isSearchable={false}
                      options={schema.options}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: "none",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          padding: "4px",
                        }),
                      }}
                      value={findOption(
                        schema.options,
                        settings[key] ?? schema.defaultValue
                      )}
                      onChange={(value) => {
                        // @ts-expect-error
                        updateSetting(key, value.value);
                      }}
                    />
                  </>
                )}
              {schema.type === "string" && !schema.options && (
                <>
                  <label htmlFor={id} className={styles.settingTitle}>
                    {schema.title}
                  </label>
                  <div
                    className={classNames(
                      styles.settingValue,
                      styles.inputSettingValue
                    )}
                  >
                    <input
                      type="text"
                      id={id}
                      // @ts-expect-error
                      value={settings[key] ?? schema.defaultValue}
                      // @ts-expect-error
                      onChange={(e) => updateSetting(key, e.target.value)}
                    />
                    {schema.description && (
                      <p className={styles.description}>{schema.description}</p>
                    )}
                  </div>
                </>
              )}
            </Fragment>
          );
        }
      )}
    </div>
  );
};

export default ToolSettingPanel;
