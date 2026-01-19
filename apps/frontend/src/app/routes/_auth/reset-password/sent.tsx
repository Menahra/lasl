import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordSentPage } from "@/src/app/pages/reset-password/reset-password-sent-page/ResetPasswordSentPage.tsx";
import { ROUTE_AUTH_PREFIX } from "@/src/app/routes/_auth.tsx";

export const ROUTE_RESET_PASSWORD_SENT = authRoutes.resetPasswordSent;

export const Route = createFileRoute(
  `${ROUTE_AUTH_PREFIX}${ROUTE_RESET_PASSWORD_SENT}`,
)({
  component: ResetPasswordSentPage,
});
