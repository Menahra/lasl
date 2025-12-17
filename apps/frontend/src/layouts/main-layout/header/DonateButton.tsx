import { useLingui } from "@lingui/react/macro";
import KoFiLogo from "@/assets/icons/ko-fi.svg?react";
import {
  IconLink,
  type IconLinkProps,
} from "@/src/shared/components/icon-link/IconLink.tsx";
import { DONATE_PROJECT_LINK } from "@/src/shared/constants.ts";

type DonateButtonProps = Pick<IconLinkProps, "className">;

export const DonateButton = ({
  className,
  ...donateButtonLogoProps
}: DonateButtonProps) => {
  const { t: linguiTranslator } = useLingui();

  return (
    <IconLink
      {...(className ? { className } : {})}
      icon={
        <KoFiLogo
          {...donateButtonLogoProps}
          className="MainLayoutHeaderActionButtonIcon"
        />
      }
      href={DONATE_PROJECT_LINK}
      ariaLabel={linguiTranslator`Visit Ko-Fi to support this project with a donation.`}
      title={linguiTranslator`Visit Ko-Fi to support this project with a donation.`}
    />
  );
};
