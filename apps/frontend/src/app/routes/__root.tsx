import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthenticationProviderContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";

export type RouterContext = {
  auth: AuthenticationProviderContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});
