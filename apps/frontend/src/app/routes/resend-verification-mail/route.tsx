import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(authRoutes.resendVerificationMail)({
  component: () => <Outlet />,
});
