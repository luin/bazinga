import dynamic from "next/dynamic";
import { ReactNode } from "react";

const NoSSR = ({ children }: { children: ReactNode }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSSR), { ssr: false });
