import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import Modal from "react-modal";
import OutsideClickHandler from "react-outside-click-handler";
import SettingIcon from "../svg/setting.svg";
import { ToolPageSettings, ToolPageSettingSchema } from "../utils/ToolPage";
import Button from "./button";
import styles from "./tool-setting-button.module.scss";
import ToolSettingPanel from "./tool-setting-panel";

interface SettingModalProps<T extends ToolPageSettings> {
  settings: T;
  settingSchema: ToolPageSettingSchema<T>;
  updateSetting: <K extends keyof T>(id: K, value: T[K]) => void;
}

Modal.setAppElement("[data-reactroot]");

const ToolSettingButton = <T extends ToolPageSettings>({
  settings,
  settingSchema,
  updateSetting,
}: SettingModalProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  useHotkeys(
    "ctrl+k, cmd+k",
    () => {
      setIsOpen(!isOpen);
    },
    { enableOnContentEditable: true, enableOnTags: ["INPUT", "TEXTAREA"] },
    [isOpen]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.body.addEventListener("keydown", listener);
    return () => {
      document.body.removeEventListener("keydown", listener);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className={styles.container}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setIsOpen(false);
        }}
      >
        <Button
          className={isOpen ? styles.buttonisOpen : undefined}
          icon={<SettingIcon />}
          variant="tertiary"
          size="small"
          onClick={() => setIsOpen(!isOpen)}
        >
          Settings
        </Button>
        {isOpen && (
          <div className={styles.overlay} onClick={() => setIsOpen(false)}>
            <div
              className={styles.dropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <ToolSettingPanel
                settings={settings}
                settingSchema={settingSchema}
                updateSetting={updateSetting}
              />
            </div>
          </div>
        )}
      </OutsideClickHandler>
    </div>
  );
};

export default ToolSettingButton;
