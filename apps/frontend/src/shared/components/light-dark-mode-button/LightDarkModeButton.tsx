import { useLingui } from "@lingui/react/macro";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  IconButton,
  type IconButtonProps,
} from "@/src/shared/components/icon-button/IconButton.tsx";
import { useDarkMode } from "@/src/shared/hooks/useDarkMode.ts";

type LightDarkModeButtonProps = Pick<IconButtonProps, "className">;

export const LightDarkModeButton = (props: LightDarkModeButtonProps) => {
  const { t } = useLingui();
  const { isDarkMode, updateDarkModeSetting } = useDarkMode();

  const lightDarkModeButtonProps = {
    onClick: updateDarkModeSetting,
    ...(isDarkMode
      ? {
          icon: <MoonIcon />,
          description: t`Switch to light mode`,
          title: t`Switch to light mode`,
        }
      : {
          icon: <SunIcon />,
          description: t`Switch to dark mode`,
          title: t`Switch to dark mode`,
        }),
  };

  return <IconButton {...lightDarkModeButtonProps} {...props} />;
};
