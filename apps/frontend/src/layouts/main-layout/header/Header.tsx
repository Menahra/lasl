import { useLingui } from "@lingui/react/macro";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { DonateButton } from "@/src/layouts/main-layout/header/DonateButton.tsx";
import { GitHubButton } from "@/src/layouts/main-layout/header/GitHubButton.tsx";
import { InputField } from "@/src/shared/components/input-field/InputField.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";

export const Header = () => {
  const { t: linguiTranslator } = useLingui();
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="ApplicationHeader">
      Logo placeholder
      <div className="ApplicationHeaderActions">
        <InputField
          label={linguiTranslator`Search in all pages`}
          icon={<MagnifyingGlassIcon />}
          value={searchValue}
          onInputValueChange={setSearchValue}
          placeholder={linguiTranslator`Search...`}
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
