import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/src/api/authApi.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

// biome-ignore lint/style/noMagicNumbers: the constant combines them
const FIVE_MINUTES = 5 * 60 * 1000;

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getCurrentUser,
    enabled: Boolean(accessTokenManager.getAccessToken()),
    staleTime: FIVE_MINUTES,
    retry: false,
  });
};

export const usePostLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginBody: Parameters<typeof authApi.createSession>[0]) =>
      authApi.createSession(loginBody),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};

export const usePostLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      accessTokenManager.clearAccessToken();

      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

export const usePostForgotPassword = () => {
  return useMutation({
    mutationFn: (params: Parameters<typeof authApi.forgotPassword>[0]) =>
      authApi.forgotPassword(params),
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
