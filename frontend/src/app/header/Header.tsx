import { useTranslation } from "react-i18next";
import { InputField } from "../../shared/components/input-field/InputField";
import "./styles.scss";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { LightDarkModeButton } from "./LightDarkModeButton";
import { GitHubButton } from "./GitHubButton";
import { DonateButton } from "./DonateButton";

export const Header = () => {
	const { t } = useTranslation();
	const [searchValue, setSearchValue] = useState("");

	return (
		<header className="ApplicationHeader">
			Logo placeholder
			<div className="ApplicationHeaderActions">
				<InputField
					label={t("header.search_description")}
					icon={<MagnifyingGlassIcon />}
					value={searchValue}
					onInputValueChange={setSearchValue}
					placeholder={t("header.search_placeholder")}
				/>
				<div className="ApplicationHeaderActionsButtons">
					<GitHubButton />
					<DonateButton />
					<LightDarkModeButton />
				</div>
			</div>
		</header>
	);
};
