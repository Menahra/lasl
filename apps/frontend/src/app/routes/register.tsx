import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/src/app/pages/register-page/RegisterPage.tsx";

export const ROUTE_SIGN_UP = "/register";

export const Route = createFileRoute(ROUTE_SIGN_UP)({
  component: RegisterPage,
});
