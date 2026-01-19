import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const ROUTE_AUTH_PREFIX = "/_auth";

export const Route = createFileRoute(ROUTE_AUTH_PREFIX)({
  beforeLoad: ({ context }) => {
    if (context.auth.isLoading) {
      return;
    }

    if (context.auth.isAuthenticated) {
      throw redirect({
        to: authRoutes.home,
        replace: true,
      });
    }
  },
  component: () => <Outlet />,
});
