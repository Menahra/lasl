import axios from "axios";
import { AUTH_API_BASE_URL } from "@/src/api/apiClient.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

type RefreshTokenResponse = {
  accessToken: string;
};

type GetCurrentUserResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const authApi = {
  createSession: async (email: string, password: string) => {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${AUTH_API_BASE_URL}/sessions`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      const { accessToken } = response.data;

      accessTokenManager.setAccessToken(accessToken);
      return accessToken;
    } catch (error) {
      // need to set up proper logging for frontend
      accessTokenManager.clearAccessToken();
      throw error;
    }
  },

  postRefreshToken: async () => {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${AUTH_API_BASE_URL}/sessions/refresh`,
        {},
        { withCredentials: true },
      );
      const { accessToken: newAccessToken } = response.data;

      accessTokenManager.setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      // need to set up proper logging for frontend
      accessTokenManager.clearAccessToken();
      throw error;
    }
  },

  logout: async () => {
    return await axios.post(
      `${AUTH_API_BASE_URL}/sessions/logout`,
      {},
      { withCredentials: true },
    );
  },

  getCurrentUser: async () => {
    const response = await axios.post<GetCurrentUserResponse>(
      `${AUTH_API_BASE_URL}/sessions`,
      {},
      { withCredentials: true },
    );

    return response.data;
  },
};
