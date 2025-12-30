import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";

export const Route = createFileRoute("/reset-password/")({
  component: () => <Navigate to={ROUTE_LOGIN} replace={true} />,
});
