import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ROUTE_LOGIN } from "@/src/app/routes/_auth/login.tsx";

export const Route = createFileRoute("/_auth/reset-password/")({
  component: () => <Navigate to={ROUTE_LOGIN} replace={true} />,
});
