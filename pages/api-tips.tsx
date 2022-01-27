import Link from "next/link";
import ToolPage from "../utils/ToolPage";

const APIPage: ToolPage = () => (
  <>
    <h2>Tool List</h2>
    <p>
      Bazinga.tools provides an endpoint to list all available tools, including
      their names and paths.
    </p>
    <p>
      <code>
        <Link href="/tools.json">https://bazinga.tools/tools.json</Link>
      </code>
    </p>
    <h2>Toggle Panels</h2>
    <p>
      Sometimes, especially on narror screens, it might be useful to hide some
      UI elements. You can pass <code>?sidebar=off</code>,{" "}
      <code>?footer=off</code> or <code>?line-numbers=off</code> to hide
      sidebar, footer or editor line numbers. For example:
    </p>
    <p>
      <code>
        <Link href="/json?sidebar=off">
          https://bazinga.tools/json?sidebar=off
        </Link>
      </code>
    </p>
    <p>
      <code>
        <Link href="/json?sidebar=off&amp;footer=off">
          https://bazinga.tools/json?sidebar=off&amp;footer=off
        </Link>
      </code>
    </p>
    <p>
      <code>
        <Link href="/json?sidebar=off&amp;line-numbers=off">
          https://bazinga.tools/json?sidebar=off&amp;line-numbers=off
        </Link>
      </code>
    </p>
    <h2>Tips</h2>
    <p>
      1. All editors are resizable, and the size preference will be persisted.
    </p>
    <p>
      2. Press <code>/</code> to focus on the tool search input. Press{" "}
      <code>Enter</code> to select the first tool.
    </p>
    <p>
      3. Press <code>⌘/CTRL + k</code> to open the setting dropdown if
      available.
    </p>
  </>
);

export default APIPage;
