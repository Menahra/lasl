import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/src/app/pages/reset-password/reset-password-page/ResetPasswordPage.tsx";

export const Route = createFileRoute(
  "/_auth/reset-password/$id/$passwordResetCode/",
)({
  component: ResetPasswordPage,
});
