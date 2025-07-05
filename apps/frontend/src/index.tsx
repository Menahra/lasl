import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

import "./app/i18n";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
