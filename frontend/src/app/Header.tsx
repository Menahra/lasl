import { useTranslation } from "react-i18next";
import { InputField } from "../shared/components/input-field/InputField";
import "./styles.scss";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export const Header = () => {
	const { t } = useTranslation();
	const [searchValue, setSearchValue] = useState("");

	return (
		<header className="applicationHeader">
			Logo placeholder
			<div className="applicationHeaderActions">
				<InputField
					label={t("header.search_description")}
					icon={<MagnifyingGlassIcon />}
					value={searchValue}
					onInputValueChange={setSearchValue}
				/>
				<div className="apllicationHeaderActionsButtons">
					<span>Donate</span>
					<span>Dark mode</span>
					<span>Github</span>
				</div>
			</div>
		</header>
	);
};
