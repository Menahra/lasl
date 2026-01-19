import { createFileRoute } from "@tanstack/react-router";
import { RegisterVerifyPage } from "@/src/app/pages/register/register-verify-page/RegisterVerifyPage.tsx";

// biome-ignore lint/security/noSecrets: route name, not a secret
export const Route = createFileRoute("/_auth/register/verify/$id/$verificationCode/")(
  {
    component: RegisterVerifyPage,
  },
);
