import { useEffect, useState } from "react";

const LOCAL_STORAGE_DARKMODE_KEY = "dark-mode";
const HTML_DATA_THEME = "data-theme";
const DARKMODE_ON_VALUE = "dark";
const DARKMODE_OFF_VALUE = "light";

type DataThemeModeValue = typeof DARKMODE_OFF_VALUE | typeof DARKMODE_ON_VALUE;

const calculateInitialSetting = (): DataThemeModeValue => {
  const userDarkModeSetting = localStorage.getItem(
    LOCAL_STORAGE_DARKMODE_KEY,
  ) as DataThemeModeValue | null;
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
  const [themeMode, setThemeMode] = useState<DataThemeModeValue>(() =>
    calculateInitialSetting(),
  );
  useEffect(() => {
    document.documentElement.setAttribute(HTML_DATA_THEME, themeMode);
    localStorage.setItem(LOCAL_STORAGE_DARKMODE_KEY, themeMode);
  }, [themeMode]);

  const toggleDataTheme = () => {
    setThemeMode((currentThemeMode) =>
      currentThemeMode === DARKMODE_ON_VALUE
        ? DARKMODE_OFF_VALUE
        : DARKMODE_ON_VALUE,
    );
  };

  return {
    isDarkMode: themeMode === DARKMODE_ON_VALUE,
    updateDarkModeSetting: toggleDataTheme,
  };
};
