import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => null,
});

export default Select;
