import { useQuery } from "@tanstack/react-query";
import { authKeys } from "@/src/shared/hooks/api/useAuthentication.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

export const useAuthToken = () => {
  return useQuery({
    queryKey: authKeys.token(),
    queryFn: () => accessTokenManager.getAccessToken(),
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
};
