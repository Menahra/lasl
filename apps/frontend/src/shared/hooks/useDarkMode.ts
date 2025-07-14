import { useState } from "react";

const LOCAL_STORAGE_DARKMODE_KEY = "dark-mode";
const HTML_DATA_THEME = "data-theme";
const DARKMODE_ON_VALUE = "dark";
const DARKMODE_OFF_VALUE = "light";

type DarkModeValue = typeof DARKMODE_OFF_VALUE | typeof DARKMODE_ON_VALUE;

const calculateInitialSetting = (): DarkModeValue => {
  const userDarkModeSetting = localStorage.getItem(
    LOCAL_STORAGE_DARKMODE_KEY,
  ) as DarkModeValue | null;
  if (userDarkModeSetting !== null) {
    return userDarkModeSetting;
  }

  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
  if (systemSettingDark.matches) {
    return DARKMODE_ON_VALUE;
  }
  return DARKMODE_OFF_VALUE;
};

export const useDarkMode = () => {
  const initialDarkModeSetting = calculateInitialSetting();
  const htmlElement = document.querySelector("html");
  htmlElement?.setAttribute(HTML_DATA_THEME, initialDarkModeSetting);

  const [isDarkMode, setIsDarkMode] = useState<DarkModeValue>(
    initialDarkModeSetting,
  );

  const updateDarkModeSetting = () => {
    setIsDarkMode((currentDarkModeSetting) => {
      const newDarkModeValue =
        currentDarkModeSetting === DARKMODE_OFF_VALUE
          ? DARKMODE_ON_VALUE
          : DARKMODE_OFF_VALUE;
      htmlElement?.setAttribute(HTML_DATA_THEME, newDarkModeValue);
      localStorage.setItem(LOCAL_STORAGE_DARKMODE_KEY, newDarkModeValue);
      return newDarkModeValue;
    });
  };

  return {
    isDarkMode: isDarkMode === DARKMODE_ON_VALUE,
    updateDarkModeSetting,
  };
};
