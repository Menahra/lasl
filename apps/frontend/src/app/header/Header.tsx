import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { InputField } from "@/src/shared/components/input-field/InputField.tsx";
import { DonateButton } from "./DonateButton.tsx";
import { GitHubButton } from "./GitHubButton.tsx";
import { LightDarkModeButton } from "./LightDarkModeButton.tsx";

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
