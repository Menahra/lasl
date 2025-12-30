import type { createSessionSchema } from "@lasl/app-contracts/schemas/session";
import type {
  resetPasswordParamsSchema,
  userPasswordWithConfirmationAndRefinementSchema,
} from "@lasl/app-contracts/schemas/user";
import type {
  CreateSessionSuccessResponse,
  ForgotPasswordSuccessResponse,
  GetCurrentAuthenticatedUserSuccessResponse,
  LogoutSuccessResponse,
  RefreshSessionSuccessResponse,
  ResetPasswordSuccessResponse,
} from "@lasl/authentication-service";
import axios from "axios";
import type { z } from "zod";
import { AUTH_API_BASE_URL } from "@/src/api/apiClient.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

export const authApi = {
  createSession: async (
    sessionParameters: z.infer<typeof createSessionSchema>,
  ) => {
    try {
      const response = await axios.post<CreateSessionSuccessResponse>(
        `${AUTH_API_BASE_URL}/sessions`,
        sessionParameters,
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
    const { data } = await axios.post<LogoutSuccessResponse>(
      `${AUTH_API_BASE_URL}/sessions/logout`,
      {},
      { withCredentials: true },
    );

    return data;
  },

  forgotPassword: async (
    email: GetCurrentAuthenticatedUserSuccessResponse["email"],
  ) => {
    const { data } = await axios.post<ForgotPasswordSuccessResponse>(
      `${AUTH_API_BASE_URL}/users/forgotpassword`,
      { email },
      { withCredentials: true },
    );

    return data;
  },

  resetPassword: async (
    input: z.infer<typeof resetPasswordParamsSchema> &
      z.infer<typeof userPasswordWithConfirmationAndRefinementSchema>,
  ) => {
    const { id, passwordResetCode, ...body } = input;
    const { data } = await axios.post<ResetPasswordSuccessResponse>(
      `${AUTH_API_BASE_URL}/users/resetpassword/${id}/${passwordResetCode}`,
      { body },
      { withCredentials: true },
    );

    return data;
  },

  getCurrentUser: async () => {
    const { data } =
      await axios.post<GetCurrentAuthenticatedUserSuccessResponse>(
        `${AUTH_API_BASE_URL}/users/me`,
        {},
        { withCredentials: true },
      );

    return data;
  },
};
