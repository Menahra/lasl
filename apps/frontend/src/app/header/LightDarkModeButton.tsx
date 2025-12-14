import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/src/shared/components/icon-button/IconButton.tsx";
import { useDarkMode } from "@/src/shared/hooks/useDarkMode.ts";

export const LightDarkModeButton = () => {
  const { t } = useTranslation();
  const { isDarkMode, updateDarkModeSetting } = useDarkMode();

  const lightDarkModeButtonProps = {
    onClick: updateDarkModeSetting,
    ...(isDarkMode
      ? {
          icon: <MoonIcon />,
          description: t("header.switch_to_light_mode"),
          title: t("header.switch_to_light_mode"),
        }
      : {
          icon: <SunIcon />,
          description: t("header.switch_to_dark_mode"),
          title: t("header.switch_to_dark_mode"),
        }),
  };

  return <IconButton {...lightDarkModeButtonProps} />;
};
