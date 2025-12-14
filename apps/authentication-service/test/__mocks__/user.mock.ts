/** biome-ignore-all lint/security/noSecrets: just mock data */
import { DEFAULT_LOCALE } from "@lasl/app-contracts/locales";

export const mockUserData = {
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  password: "securePassword123",
};

export const mockUserDataWithSettings = {
  ...mockUserData,
  settings: {
    darkMode: false,
    uiLanguage: DEFAULT_LOCALE,
    contentLanguage: DEFAULT_LOCALE,
  },
};

export const mockUserInputData = {
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  password: "securePassword123",
  passwordConfirmation: "securePassword123",
};
