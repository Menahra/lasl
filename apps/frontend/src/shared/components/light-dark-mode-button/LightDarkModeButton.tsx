import { useLingui } from "@lingui/react/macro";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import {
  IconButton,
  type IconButtonProps,
} from "@/src/shared/components/icon-button/IconButton.tsx";
import { useDarkMode } from "@/src/shared/hooks/useDarkMode.ts";
import "./styles.css";

type LightDarkModeButtonProps = Pick<IconButtonProps, "className">;

export const LightDarkModeButton = ({
  className,
}: LightDarkModeButtonProps) => {
  const { t: linguiTranslator } = useLingui();
  const { isDarkMode, updateDarkModeSetting } = useDarkMode();

  const lightDarkModeButtonProps = {
    onClick: updateDarkModeSetting,
    ...(isDarkMode
      ? {
          icon: <MoonIcon />,
          description: linguiTranslator`Switch to light mode`,
          title: linguiTranslator`Switch to light mode`,
        }
      : {
          icon: <SunIcon />,
          description: linguiTranslator`Switch to dark mode`,
          title: linguiTranslator`Switch to dark mode`,
        }),
  };

  return (
    <IconButton
      {...lightDarkModeButtonProps}
      // biome-ignore lint/security/noSecrets: classname and not a secret
      className={clsx("LightDarkModeButton", className)}
    />
  );
};
