import { useLingui } from "@lingui/react/macro";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  IconLink,
  type IconLinkProps,
} from "@/src/shared/components/icon-link/IconLink.tsx";
import { GITHUB_PROJECT_LINK } from "@/src/shared/constants.ts";

type GitHubButtonProps = Pick<IconLinkProps, "className">;

export const GitHubButton = ({
  className,
  ...gitHubLogoStyleProps
}: GitHubButtonProps) => {
  const { t: linguiTranslator } = useLingui();

  return (
    <IconLink
      {...(className ? { className } : {})}
      icon={
        <GitHubLogoIcon
          {...gitHubLogoStyleProps}
          className="MainLayoutHeaderActionButtonIcon"
        />
      }
      href={GITHUB_PROJECT_LINK}
      ariaLabel={linguiTranslator`Open the GitHub repository in a new browser tab.`}
      title={linguiTranslator`Open the GitHub repository in a new browser tab.`}
    />
  );
};
