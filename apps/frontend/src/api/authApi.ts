import type {
  CreateSessionSuccessResponse,
  GetCurrentAuthenticatedUserSuccessResponse,
  LogoutSuccessResponse,
  RefreshSessionSuccessResponse,
} from "@lasl/authentication-service";
import axios from "axios";
import { AUTH_API_BASE_URL } from "@/src/api/apiClient.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

export const authApi = {
  createSession: async (email: string, password: string) => {
    try {
      const response = await axios.post<CreateSessionSuccessResponse>(
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
      const response = await axios.post<RefreshSessionSuccessResponse>(
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
    return await axios.post<LogoutSuccessResponse>(
      `${AUTH_API_BASE_URL}/sessions/logout`,
      {},
      { withCredentials: true },
    );
  },

  getCurrentUser: async () => {
    return await axios.post<GetCurrentAuthenticatedUserSuccessResponse>(
      `${AUTH_API_BASE_URL}/users/me`,
      {},
      { withCredentials: true },
    );
  },
};
