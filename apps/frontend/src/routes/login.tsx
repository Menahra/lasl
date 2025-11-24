import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/src/pages/login-page/LoginPage.tsx";

export const ROUTE_LOGIN = "/login";

export const Route = createFileRoute(ROUTE_LOGIN)({
  component: LoginPage,
});
