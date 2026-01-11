import { ACCESS_TOKEN_NAME } from "@lasl/app-contracts/api/auth";

export const accessTokenManager = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_NAME),
  setAccessToken: (accessTokenValue: string) =>
    localStorage.setItem(ACCESS_TOKEN_NAME, accessTokenValue),
  clearAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
  },
};
