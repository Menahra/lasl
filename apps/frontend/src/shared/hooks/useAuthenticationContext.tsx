import type { GetCurrentAuthenticatedUserSuccessResponse } from "@lasl/authentication-service";
import { createContext, type PropsWithChildren, useContext } from "react";
import type { authApi } from "@/src/api/authApi.ts";
import {
  useGetCurrentUser,
  usePostLogin,
  usePostLogout,
} from "@/src/shared/hooks/api/useAuthentication.ts";

type AuthenticationProviderContext = {
  user: GetCurrentAuthenticatedUserSuccessResponse | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    ...credentials: Parameters<(typeof authApi)["createSession"]>
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthenticationContext = createContext<
  AuthenticationProviderContext | undefined
>(undefined);

export const AuthenticationProvider = (props: PropsWithChildren) => {
  const { data, isLoading } = useGetCurrentUser();
  const user = data?.data;

  const loginMutation = usePostLogin();
  const logoutMutation = usePostLogout();

  const login = async (
    ...credentials: Parameters<(typeof authApi)["createSession"]>
  ) => {
    await loginMutation.mutateAsync(credentials);
  };
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};

// biome-ignore lint/style/useComponentExportOnlyModules: okay in context definition
export const useAuthenticationContext = () => {
  const authenticationContext = useContext(AuthenticationContext);
  if (!authenticationContext) {
    throw new Error(
      // biome-ignore lint/security/noSecrets: just error description
      "useAuthenticationContext must be used within AuthenticationProvider",
    );
  }

  return authenticationContext;
};
