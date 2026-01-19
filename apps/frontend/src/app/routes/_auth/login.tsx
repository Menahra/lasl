import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/src/app/pages/login-page/LoginPage.tsx";
import { ROUTE_AUTH_PREFIX } from "@/src/app/routes/_auth.tsx";

export const ROUTE_LOGIN = authRoutes.login;

export const Route = createFileRoute(`${ROUTE_AUTH_PREFIX}${ROUTE_LOGIN}`)({
  component: LoginPage,
});
