import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/src/shared/components/icon-button/IconButton";
import { useDarkMode } from "@/src/shared/hooks/useDarkMode";

export const LightDarkModeButton = () => {
  const { t } = useTranslation();
  const { isDarkMode, updateDarkModeSetting } = useDarkMode();

  const lightDarkModeButtonProps = {
    onClick: updateDarkModeSetting,
    ...(isDarkMode
      ? {
          icon: <MoonIcon />,
          description: t("header.switch_to_lightmode"),
          title: t("header.switch_to_lightmode"),
        }
      : {
          icon: <SunIcon />,
          description: t("header.switch_to_darkmode"),
          title: t("header.switch_to_darkmode"),
        }),
  };

  return <IconButton {...lightDarkModeButtonProps} />;
};
