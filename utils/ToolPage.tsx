import { NextPage } from "next";

type TypeName<T> = T extends string
  ? "string"
  : T extends boolean
  ? "boolean"
  : "number";

export type SimpleOption<T> = { label: string; value: T };
export type GroupedOption<T> = { label: string; options: SimpleOption<T>[] };

type SettingSchema<T extends string | number | boolean> = T extends boolean
  ? {
      title: string;
      type: TypeName<T>;
      defaultValue: T;
      description?: string;
    }
  : {
      title: string;
      type: TypeName<T>;
      defaultValue: T;
      options?: readonly SimpleOption<T>[] | readonly GroupedOption<T>[];
      description?: string;
    };

export type ToolPageSettings = { [id: string]: string | number | boolean };
export type ToolPageSettingSchema<T extends ToolPageSettings> = {
  [K in keyof T]: SettingSchema<T[K]>;
};

type ToolPage<T extends ToolPageSettings = {}> = NextPage<
  { settings: T },
  void
> & {
  settingSchema?: ToolPageSettingSchema<T>;
};

export default ToolPage;
