import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/src/app/pages/login-page/LoginPage.tsx";

export const ROUTE_LOGIN = authRoutes.login;

export const Route = createFileRoute(ROUTE_LOGIN)({
  component: LoginPage,
});
