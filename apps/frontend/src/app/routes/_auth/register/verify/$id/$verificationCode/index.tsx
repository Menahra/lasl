import { createFileRoute } from "@tanstack/react-router";
import { RegisterVerifyPage } from "@/src/app/pages/register/register-verify-page/RegisterVerifyPage.tsx";

export const Route = createFileRoute(
  // biome-ignore lint/security/noSecrets: route name, not a secret
  "/_auth/register/verify/$id/$verificationCode/",
)({
  component: RegisterVerifyPage,
});
