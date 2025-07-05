import { Suspense } from "react";
import "../styles/_global.scss";
import { Header } from "./header/Header";

export const App = () => {
	return (
		<Suspense fallback="is loading">
			<Header />
			<main>
				This is the main content, which needs to be put in a separate div to
				ensure proper scrolling Furthermore we need to add here proper support
				for mobile phones somehow
			</main>
		</Suspense>
	);
};
