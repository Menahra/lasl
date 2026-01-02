import { useLingui } from "@lingui/react/macro";
import {
  Close as DialogClose,
  Content as DialogContent,
  Overlay as DialogOverlay,
  Portal as DialogPortal,
  Root as DialogRoot,
  Title as DialogTitle,
  Trigger as DialogTrigger,
} from "@radix-ui/react-dialog";
import {
  ArrowTopRightIcon,
  Cross2Icon,
  GitHubLogoIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import KoFiLogo from "@/assets/icons/ko-fi.svg?react";
import { AuthButton } from "@/src/app/layouts/main-layout/header/AuthButton.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { ExternalLink } from "@/src/shared/components/external-link/ExternalLink.tsx";
import { InputField } from "@/src/shared/components/input-field/InputField.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import {
  DONATE_PROJECT_LINK,
  GITHUB_PROJECT_LINK,
} from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./HeaderDrawer.css";

type HeaderDrawerProps = {
  searchValue: string;
  setSearchValue: (newValue: string) => void;
};

export const HeaderDrawer = ({
  searchValue,
  setSearchValue,
}: HeaderDrawerProps) => {
  const { t: linguiTranslator } = useLingui();
  const { isLoading } = useI18nContext();

  return (
    <DialogRoot>
      <Skeleton loading={isLoading} width={24} height={24} margin="0 0 0 auto">
        <DialogTrigger asChild={true}>
          <button
            type="button"
            className="MainLayoutHeaderDrawerTrigger"
            aria-label={linguiTranslator`Open menu`}
          >
            <HamburgerMenuIcon />
          </button>
        </DialogTrigger>
      </Skeleton>
      <DialogPortal>
        <DialogOverlay className="MainLayoutHeaderDrawerOverlay" />
        <DialogContent className="MainLayoutHeaderDrawerContent">
          <div className="MainLayoutHeaderDrawerHeader">
            <Skeleton loading={isLoading} width={75} height={30}>
              <DialogTitle asChild={true}>
                <h2>{linguiTranslator`Menu`}</h2>
              </DialogTitle>
            </Skeleton>
            <Skeleton loading={isLoading} width={24} height={24}>
              <DialogClose asChild={true}>
                <button
                  className="MainLayoutHeaderDrawerHeaderCloseButton"
                  type="button"
                  aria-label={linguiTranslator`Close menu`}
                >
                  <Cross2Icon />
                </button>
              </DialogClose>
            </Skeleton>
          </div>
          <div>
            <Skeleton loading={isLoading} width="100%" height="100%">
              <InputField
                label={linguiTranslator`Search in all pages`}
                showLabel={false}
                icon={<MagnifyingGlassIcon />}
                value={searchValue}
                onInputValueChange={setSearchValue}
                placeholder={linguiTranslator`Search...`}
              />
            </Skeleton>
          </div>
          <div className="MainLayoutHeaderDrawerContentActions">
            <Skeleton loading={isLoading} width="100%" height={28}>
              <ExternalLink href={GITHUB_PROJECT_LINK}>
                <Button
                  startIcon={<GitHubLogoIcon />}
                  endIcon={<ArrowTopRightIcon />}
                  variant="text"
                  fullWidth={true}
                >
                  {linguiTranslator`View source code on GitHub`}
                </Button>
              </ExternalLink>
            </Skeleton>
            <Skeleton loading={isLoading} width="100%" height={28}>
              <ExternalLink href={DONATE_PROJECT_LINK}>
                <Button
                  startIcon={<KoFiLogo />}
                  endIcon={<ArrowTopRightIcon />}
                  variant="text"
                  fullWidth={true}
                >
                  {linguiTranslator`Support this project on Ko-Fi`}
                </Button>
              </ExternalLink>
            </Skeleton>
            <Skeleton loading={isLoading} width={190} height={22}>
              <h4>{linguiTranslator`Surface language`}</h4>
            </Skeleton>
            <Skeleton loading={isLoading} width="100%" height={28}>
              <LanguageSelect />
            </Skeleton>
            <Skeleton loading={isLoading} width={65} height={22}>
              <h4>{linguiTranslator`Theme`}</h4>
            </Skeleton>
            <Skeleton loading={isLoading} width="100%" height={28}>
              <LightDarkModeButton />
            </Skeleton>
            <AuthButton fullWidth={true} align="center" />
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
