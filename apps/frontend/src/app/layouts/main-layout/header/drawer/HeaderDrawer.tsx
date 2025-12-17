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
import { Button } from "@/src/shared/components/button/Button.tsx";
import { InputField } from "@/src/shared/components/input-field/InputField.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import "./styles.css";
import { ExternalLink } from "@/src/shared/components/external-link/ExternalLink.tsx";
import {
  DONATE_PROJECT_LINK,
  GITHUB_PROJECT_LINK,
} from "@/src/shared/constants.ts";

type HeaderDrawerProps = {
  searchValue: string;
  setSearchValue: (newValue: string) => void;
};

export const HeaderDrawer = ({
  searchValue,
  setSearchValue,
}: HeaderDrawerProps) => {
  const { t: linguiTranslator } = useLingui();

  return (
    <DialogRoot>
      <DialogTrigger asChild={true}>
        <button
          type="button"
          className="MainLayoutHeaderDrawerTrigger"
          aria-label={linguiTranslator`Open menu`}
        >
          <HamburgerMenuIcon />
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="MainLayoutHeaderDrawerOverlay" />
        <DialogContent className="MainLayoutHeaderDrawerContent">
          <div className="MainLayoutHeaderDrawerHeader">
            <DialogTitle asChild={true}>
              <h2>{linguiTranslator`Menu`}</h2>
            </DialogTitle>
            <DialogClose asChild={true}>
              <button
                className="MainLayoutHeaderDrawerHeaderCloseButton"
                type="button"
                aria-label={linguiTranslator`Close menu`}
              >
                <Cross2Icon />
              </button>
            </DialogClose>
          </div>
          <div>
            <InputField
              label={linguiTranslator`Search in all pages`}
              showLabel={false}
              icon={<MagnifyingGlassIcon />}
              value={searchValue}
              onInputValueChange={setSearchValue}
              placeholder={linguiTranslator`Search...`}
            />
          </div>
          <div className="MainLayoutHeaderDrawerContentActions">
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
            <h4>Theme</h4>
            <LightDarkModeButton />
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
};
