import { useLingui } from "@lingui/react/macro";
import KoFiLogo from "@/assets/icons/ko-fi.svg?react";
import { IconLink } from "@/src/shared/components/icon-link/IconLink.tsx";

export const DonateButton = () => {
  const { t } = useLingui();

  return (
    <IconLink
      icon={<KoFiLogo />}
      href="https://ko-fi.com/zioui"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t`Visit Ko-Fi to support this project with a donation.`}
      title={t`Visit Ko-Fi to support this project with a donation.`}
    />
  );
};
