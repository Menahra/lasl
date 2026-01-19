import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/src/app/pages/register/register-page/RegisterPage.tsx";
import { ROUTE_AUTH_PREFIX } from "@/src/app/routes/_auth.tsx";

export const ROUTE_SIGN_UP = authRoutes.register;

export const Route = createFileRoute(`${ROUTE_AUTH_PREFIX}${ROUTE_SIGN_UP}`)({
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
  component: RegisterPage,
});
