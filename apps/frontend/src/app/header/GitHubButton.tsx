import { useLingui } from "@lingui/react/macro";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { IconLink } from "@/src/shared/components/icon-link/IconLink.tsx";

export const GitHubButton = () => {
  const { t } = useLingui();

  return (
    <IconLink
      icon={<GitHubLogoIcon />}
      href="https://github.com/Menahra/lasl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t`Open the GitHub repository in a new browser tab.`}
      title={t`Open the GitHub repository in a new browser tab.`}
    />
  );
};
