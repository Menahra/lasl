import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/src/app/pages/forgot-password/forgot-password-page/ForgotPasswordPage.tsx";

export const ROUTE_FORGOT_PASSWORD = "/forgot-password";

export const Route = createFileRoute(ROUTE_FORGOT_PASSWORD)({
  component: ForgotPasswordPage,
});
