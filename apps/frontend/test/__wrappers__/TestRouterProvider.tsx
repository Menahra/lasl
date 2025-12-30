import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

type RouterOptions = PropsWithChildren<{
  pathPattern: string;
  initialEntry?: string;
}>;

// biome-ignore lint/style/useComponentExportOnlyModules: ok here
export const ROOT_LAYOUT_TESTID = "root-layout";

export const TestRouterProvider = ({
  children,
  pathPattern,
  initialEntry = pathPattern,
}: RouterOptions) => {
  const rootRoute = createRootRoute({
    component: () => (
      <>
        <div data-testid={ROOT_LAYOUT_TESTID} />
        <Outlet />
      </>
    ),
  });

  const route = createRoute({
    getParentRoute: () => rootRoute,
    path: initialEntry,
    component: () => <>{children}</>,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([route]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
    defaultPendingMinMs: 0,
  });

  return <RouterProvider router={router} />;
};
