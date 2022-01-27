import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import ToolProvider from "../utils/ToolProvider";
import useSettings from "../utils/useSettings";
import Layout from "../components/layout";
import "../components/react-resizable.css";
import tools from "../public/tools.json";
import "../styles/globals.css";
import { ToolPageSettings, ToolPageSettingSchema } from "../utils/ToolPage";

interface SettingProviderProps<T extends ToolPageSettings> {
  title: string;
  children: (
    settings: T,
    updateSetting: <K extends keyof T>(id: K, value: T[K]) => void
  ) => ReactElement;
  schema?: ToolPageSettingSchema<T>;
}

const SettingProvider = <T extends ToolPageSettings>({
  title,
  children,
  schema,
}: SettingProviderProps<T>) => {
  const [validatedSettings, updateSetting] = useSettings({
    settingKey: title,
    schema,
  });
  return children(validatedSettings, updateSetting);
};

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const tool = tools.flatMap(({ tools }) => {
    const matchedTool = tools.find(({ path }) => path === pathname);
    return matchedTool ? [matchedTool] : [];
  })[0];

  if (tool) {
    // @ts-expect-error
    const { settingSchema } = Component;

    return (
      <ToolProvider.Provider value={tool.path}>
        <SettingProvider title={tool.title} schema={settingSchema}>
          {(settings, updateSetting) => (
            <Layout
              title={tool.title}
              settings={settings}
              settingSchema={settingSchema}
              updateSetting={updateSetting}
            >
              <Component {...pageProps} settings={settings} />
            </Layout>
          )}
        </SettingProvider>
      </ToolProvider.Provider>
    );
  } else {
    return (
      <Layout title="" settings={{}} updateSetting={() => {}}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
