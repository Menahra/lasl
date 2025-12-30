import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/src/app/pages/reset-password/reset-password-page/ResetPasswordPage.tsx";

// biome-ignore lint/security/noSecrets: route name
export const Route = createFileRoute("/reset-password/$id/$passwordResetCode/")(
  {
    component: ResetPasswordPage,
  },
);
