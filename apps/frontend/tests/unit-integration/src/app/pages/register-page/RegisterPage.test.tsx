import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RegisterPage } from "@/src/app/pages/register-page/RegisterPage.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { setI18nLoading } from "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

describe("RegisterPage", () => {
  afterEach(() => {
    setI18nLoading(false);
  });

  const renderRegisterPage = () =>
    renderWithRouterAndI18n(RegisterPage, { pathPattern: "/login" });

  it("renders language and theme controls", async () => {
    await renderRegisterPage();

    expect(screen.getByRole("combobox", { name: /Language/i }));
    expect(screen.getByRole("button", { name: /Switch to dark mode/i }));
  });

  it("renders project logo and name", async () => {
    await renderRegisterPage();

    expect(screen.getByText(PROJECT_INFORMATION.name)).toBeInTheDocument();
  });

  it("renders the register form", async () => {
    await renderRegisterPage();

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders legal disclaimer with links", async () => {
    await renderRegisterPage();

    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();

    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });

  it("hides content when loading", async () => {
    setI18nLoading(true);

    await renderRegisterPage();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
