import { useLingui } from "@lingui/react/macro";
import KoFiLogo from "@/assets/icons/ko-fi.svg?react";
import {
  IconLink,
  type IconLinkProps,
} from "@/src/shared/components/icon-link/IconLink.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { DONATE_PROJECT_LINK } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";

type DonateButtonProps = Pick<IconLinkProps, "className">;

export const DonateButton = ({
  className,
  ...donateButtonLogoProps
}: DonateButtonProps) => {
  const { t: linguiTranslator } = useLingui();
  const { isLoading } = useI18nContext();

  return (
    <Skeleton loading={isLoading} width={22} height={22}>
      <IconLink
        {...(className ? { className } : {})}
        icon={
          <KoFiLogo
            {...donateButtonLogoProps}
            className="MainLayoutHeaderActionButtonIcon"
          />
        }
        href={DONATE_PROJECT_LINK}
        aria-label={linguiTranslator`Visit Ko-Fi to support this project with a donation.`}
        title={linguiTranslator`Visit Ko-Fi to support this project with a donation.`}
      />
    </Skeleton>
  );
};
