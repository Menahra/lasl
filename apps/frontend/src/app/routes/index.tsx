import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/src/app/pages/landing-page/LandingPage.tsx";

export const ROUTE_HOME = "/";

export const Route = createFileRoute(ROUTE_HOME)({
  component: LandingPage,
});
