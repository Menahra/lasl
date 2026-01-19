import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/src/app/pages/reset-password/reset-password-page/ResetPasswordPage.tsx";

export const Route = createFileRoute(
  // biome-ignore lint/security/noSecrets: route name
  "/_auth/reset-password/$id/$passwordResetCode/",
)({
  component: ResetPasswordPage,
});
