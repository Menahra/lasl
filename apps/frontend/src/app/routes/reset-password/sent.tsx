import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordSentPage } from "@/src/app/pages/reset-password/reset-password-sent-page/ResetPasswordSentPage.tsx";

export const ROUTE_RESET_PASSWORD_SENT = "/forgot-password/sent";

export const Route = createFileRoute(ROUTE_RESET_PASSWORD_SENT)({
  component: ResetPasswordSentPage,
});
