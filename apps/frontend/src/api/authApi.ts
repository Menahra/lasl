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
import type { z } from "zod";
import { AUTH_API_URL, apiClient } from "@/src/api/apiClient.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

export const authApi = {
  createSession: async (
    sessionParameters: z.infer<typeof createSessionSchema>,
  ) => {
    try {
      const response = await apiClient.post<CreateSessionSuccessResponse>(
        `${AUTH_API_URL}/sessions`,
        sessionParameters,
        { withCredentials: true },
      );
      const { accessToken } = response.data;

      return accessToken;
    } catch (error) {
      // need to set up proper logging for frontend
      console.error("An Error occured during login");
      throw error;
    }
  },

  postRefreshToken: async () => {
    try {
      const response = await apiClient.post<RefreshSessionSuccessResponse>(
        `${AUTH_API_URL}/sessions/refresh`,
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
    const { data } = await apiClient.post<LogoutSuccessResponse>(
      `${AUTH_API_URL}/sessions/logout`,
      {},
      { withCredentials: true },
    );

    return data;
  },

  forgotPassword: async (
    email: GetCurrentAuthenticatedUserSuccessResponse["email"],
  ) => {
    const { data } = await apiClient.post<ForgotPasswordSuccessResponse>(
      `${AUTH_API_URL}/users/forgotpassword`,
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
    const { data } = await apiClient.post<ResetPasswordSuccessResponse>(
      `${AUTH_API_URL}/users/resetpassword/${id}/${passwordResetCode}`,
      { ...body },
      { withCredentials: true },
    );

    return data;
  },

  getCurrentUser: async () => {
    const { data } =
      await apiClient.get<GetCurrentAuthenticatedUserSuccessResponse>(
        `${AUTH_API_URL}/users/me`,
      );

    return data;
  },
};
