import { useLingui } from "@lingui/react/macro";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import MarqaLogo from "@/assets/icons/marqa_logo.svg?react";
import { DonateButton } from "@/src/app/layouts/main-layout/header/DonateButton.tsx";
import { HeaderDrawer } from "@/src/app/layouts/main-layout/header/drawer/HeaderDrawer.tsx";
import { GitHubButton } from "@/src/app/layouts/main-layout/header/GitHubButton.tsx";
import { InputField } from "@/src/shared/components/input-field/InputField.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useIsDesktop } from "@/src/shared/hooks/useIsDesktop.ts";
import "./Header.css";

export const Header = () => {
  const { t: linguiTranslator } = useLingui();
  const { isLoading } = useI18nContext();
  const [searchValue, setSearchValue] = useState("");

  const isDesktop = useIsDesktop();

  return (
    <header className="MainLayoutHeader">
      <div className="MainLayoutHeaderLogoTitleWrapper">
        <MarqaLogo className="MainLayoutHeaderLogo" />
        <h1 className="MainLayoutHeaderProjectTitle">
          {PROJECT_INFORMATION.name}
        </h1>
      </div>
      {isDesktop ? (
        <>
          <Skeleton loading={isLoading} flexGrow={1} height={22}>
            <InputField
              label={linguiTranslator`Search in all pages`}
              showLabel={false}
              icon={<MagnifyingGlassIcon />}
              value={searchValue}
              onInputValueChange={setSearchValue}
              placeholder={linguiTranslator`Search...`}
            />
          </Skeleton>
          <div className="MainLayoutHeaderActionButtonsWrapper">
            <GitHubButton className="MainLayoutHeaderActionButton" />
            <DonateButton className="MainLayoutHeaderActionButton" />
            <div className="MainLayoutHeaderLightDarkModeLanguageWrapper">
              <LanguageSelect />
              <Skeleton loading={isLoading} height={32} width={32}>
                <LightDarkModeButton className="MainLayoutHeaderLightDarkModeButton" />
              </Skeleton>
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
