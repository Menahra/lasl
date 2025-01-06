import { InputField } from "./components/input-field/InputField";
import "./styles/_global.scss";

export const App = () => (
	<InputField
		onInputValueChange={(newValue) => console.log(newValue)}
		placeholder="Test123"
		label="Hello is an حَرْفُ الْنَصْبٌ with four properties"
	/>
);
