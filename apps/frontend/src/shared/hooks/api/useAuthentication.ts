import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/src/api/authApi.ts";
import { useAuthToken } from "@/src/shared/hooks/api/useAuthToken.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

// biome-ignore lint/style/noMagicNumbers: the constant combines them
const FIVE_MINUTES = 5 * 60 * 1000;

export const authKeys = {
  all: ["auth"] as const,
  token: () => [...authKeys.all, "token"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const useGetCurrentUser = () => {
  const { data: token } = useAuthToken();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getCurrentUser,
    enabled: Boolean(token),
    staleTime: FIVE_MINUTES,
    retry: false,
  });
};

export const usePostLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginBody: Parameters<typeof authApi.createSession>[0]) =>
      authApi.createSession(loginBody),
    onSuccess: async (accessToken) => {
      accessTokenManager.setAccessToken(accessToken);
      queryClient.setQueryData(authKeys.token(), accessToken);
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
    onError: () => {
      accessTokenManager.clearAccessToken();
    },
  });
};

export const usePostLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      accessTokenManager.clearAccessToken();
      queryClient.setQueryData(authKeys.token(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const usePostResendVerificationMail = () => {
  return useMutation({
    mutationFn: authApi.resendVerificationMail,
  });
};

export const usePostForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
};

export const usePostResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSettled: () => {
      accessTokenManager.clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const usePostRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.postRefreshToken,
    onError: () => {
      accessTokenManager.clearAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};
