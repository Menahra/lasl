import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "@/src/shared/constants.ts";

export const tokenManager = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_NAME),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_NAME),
  setAccessToken: (accessTokenValue: string) =>
    localStorage.setItem(ACCESS_TOKEN_NAME, accessTokenValue),
  setRefreshToken: (refreshTokenValue: string) =>
    localStorage.setItem(REFRESH_TOKEN_NAME, refreshTokenValue),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    localStorage.removeItem(REFRESH_TOKEN_NAME);
  },
};
