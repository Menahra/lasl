import { type RenderResult, render, screen } from "@testing-library/react";
import type { ComponentType, ReactNode } from "react";
import { TestQueryProvider } from "@/tests/unit-integration/__wrappers__//TestQueryProvider.tsx";
import { TestI18nProvider } from "@/tests/unit-integration/__wrappers__/TestI18nProvider.tsx";
import {
  ROOT_LAYOUT_TESTID,
  TestRouterProvider,
} from "@/tests/unit-integration/__wrappers__/TestRouterProvider.tsx";

type RenderOptions = {
  query?: boolean;
  i18n?: boolean;
  router?: {
    pathPattern: string;
    initialEntry?: string;
  };
};

export const renderWithProviders = async (
  Component: ComponentType,
  options: RenderOptions = {},
): Promise<RenderResult> => {
  const { query, i18n, router } = options;

  let tree: ReactNode = <Component />;

  if (router) {
    tree = <TestRouterProvider {...router}>{tree}</TestRouterProvider>;
  }

  if (query) {
    tree = <TestQueryProvider>{tree}</TestQueryProvider>;
  }

  if (i18n) {
    tree = <TestI18nProvider>{tree}</TestI18nProvider>;
  }

  const renderResult = render(tree);

  if (router) {
    await screen.findByTestId(ROOT_LAYOUT_TESTID);
  }

  return renderResult;
};
