import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordSentPage } from "@/src/app/pages/forgot-password/forgot-password-sent-page/ForgotPasswordSentPage.tsx";

export const ROUTE_FORGOT_PASSWORD_SENT = authRoutes.forgotPasswordSent;

export const Route = createFileRoute(ROUTE_FORGOT_PASSWORD_SENT)({
  component: ForgotPasswordSentPage,
});
