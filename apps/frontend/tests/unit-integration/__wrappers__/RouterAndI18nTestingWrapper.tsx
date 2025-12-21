import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { screen } from "@testing-library/react";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { renderWithI18n } from "@/tests/unit-integration/__wrappers__/I18nTestingWrapper.tsx";

type RenderOptions = {
  pathPattern: string;
  initialEntry?: string;
};

export async function renderWithRouterAndI18n(
  Component: React.ComponentType,
  { pathPattern, initialEntry = pathPattern }: RenderOptions,
) {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <div data-testid="root-layout" />
        <Outlet />
      </>
    ),
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: ROUTE_HOME,
    component: () => <div>Index</div>,
  });

  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: pathPattern,
    component: () => <Component />,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, testRoute]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
    defaultPendingMinMs: 0,
  });

  const tree = <RouterProvider router={router} />;

  // Render and wait for the route to resolve and the component to mount
  const renderResult = renderWithI18n(tree);
  await screen.findByTestId("root-layout");

  return { router, renderResult };
}
