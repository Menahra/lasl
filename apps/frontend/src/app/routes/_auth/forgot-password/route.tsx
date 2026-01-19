import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ROUTE_AUTH_PREFIX } from "@/src/app/routes/_auth.tsx";

export const Route = createFileRoute(
  `${ROUTE_AUTH_PREFIX}${authRoutes.forgotPassword}`,
)({
  component: () => <Outlet />,
});
