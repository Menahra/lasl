import { useLingui } from "@lingui/react/macro";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  IconLink,
  type IconLinkProps,
} from "@/src/shared/components/icon-link/IconLink.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { GITHUB_PROJECT_LINK } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";

type GitHubButtonProps = Pick<IconLinkProps, "className">;

export const GitHubButton = ({
  className,
  ...gitHubLogoStyleProps
}: GitHubButtonProps) => {
  const { t: linguiTranslator } = useLingui();
  const { isLoading } = useI18nContext();

  return (
    <Skeleton loading={isLoading} width={22} height={22}>
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
    </Skeleton>
  );
};
