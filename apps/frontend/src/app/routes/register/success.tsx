import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { RegisterSuccessPage } from "@/src/app/pages/register/register-success-page/RegisterSuccessPage.tsx";

export const ROUTE_SIGN_UP_SUCCESS = authRoutes.registerSuccess;

export const Route = createFileRoute(ROUTE_SIGN_UP_SUCCESS)({
  component: RegisterSuccessPage,
});
