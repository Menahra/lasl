import { useLingui } from "@lingui/react/macro";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import MarqaLogo from "@/assets/icons/marqa_logo.svg?react";
import { DonateButton } from "@/src/layouts/main-layout/header/DonateButton.tsx";
import { GitHubButton } from "@/src/layouts/main-layout/header/GitHubButton.tsx";
import { InputField } from "@/src/shared/components/input-field/InputField.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { PROJECT_NAME } from "@/src/shared/constants.ts";
import "./styles.css";
import { HeaderDrawer } from "@/src/layouts/main-layout/header/drawer/HeaderDrawer.tsx";
import { useIsDesktop } from "@/src/shared/hooks/useIsDesktop.ts";

export const Header = () => {
  const { t: linguiTranslator } = useLingui();
  const [searchValue, setSearchValue] = useState("");

  const isDesktop = useIsDesktop();

  return (
    <header className="MainLayoutHeader">
      <div className="MainLayoutHeaderLogoTitleWrapper">
        <MarqaLogo className="MainLayoutHeaderLogo" />
        <h1 className="MainLayoutHeaderProjectTitle">{PROJECT_NAME}</h1>
      </div>
      {isDesktop ? (
        <>
          <InputField
            label={linguiTranslator`Search in all pages`}
            showLabel={false}
            icon={<MagnifyingGlassIcon />}
            value={searchValue}
            onInputValueChange={setSearchValue}
            placeholder={linguiTranslator`Search...`}
          />
          <div className="MainLayoutHeaderActionButtonsWrapper">
            <GitHubButton className="MainLayoutHeaderActionButton" />
            <DonateButton className="MainLayoutHeaderActionButton" />
            <div className="MainLayoutHeaderLightDarkModeLanguageWrapper">
              <LanguageSelect />
              <LightDarkModeButton className="MainLayoutHeaderLightDarkModeButton" />
            </div>
          </div>
        </>
      ) : (
        <HeaderDrawer
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      )}
    </header>
  );
};
