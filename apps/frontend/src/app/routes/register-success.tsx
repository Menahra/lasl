import { createFileRoute } from "@tanstack/react-router";
import { RegisterSuccessPage } from "@/src/app/pages/register-success-page/RegisterSuccessPage.tsx";

export const ROUTE_SIGN_UP_SUCCESS = "/register-success";

export const Route = createFileRoute(ROUTE_SIGN_UP_SUCCESS)({
  component: RegisterSuccessPage,
});
