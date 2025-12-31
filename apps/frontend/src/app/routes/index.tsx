import { authRoutes } from "@lasl/app-contracts/routes/auth";
import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/src/app/pages/landing-page/LandingPage.tsx";

export const ROUTE_HOME = authRoutes.home;

export const Route = createFileRoute(ROUTE_HOME)({
  component: LandingPage,
});
