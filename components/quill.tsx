import dynamic from "next/dynamic";

const Quill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => null,
});

export default Quill;
