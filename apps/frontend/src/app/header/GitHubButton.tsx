import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { IconLink } from "@/src/shared/components/icon-link/IconLink.tsx";

export const GitHubButton = () => {
  const { t } = useTranslation();

  return (
    <IconLink
      icon={<GitHubLogoIcon />}
      href="https://github.com/Menahra/lasl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("header.visit_github_repository")}
      title={t("header.visit_github_repository")}
    />
  );
};
