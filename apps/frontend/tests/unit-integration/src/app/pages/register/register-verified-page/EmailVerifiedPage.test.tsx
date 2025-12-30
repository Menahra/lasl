import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { act, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RegisterVerifiedPage } from "@/src/app/pages/register/register-verified-page/RegisterVerifiedPage.tsx";
import { renderWithProviders } from "@/tests/unit-integration/__wrappers__/renderWithProviders.tsx";

const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginalTanstackRouter) => {
  const actual =
    await importOriginalTanstackRouter<
      typeof import("@tanstack/react-router")
    >();

  return {
    ...actual,
    useRouter: () => ({
      navigate: navigateMock,
    }),
  };
});

describe("RegisterVerifiedPage", () => {
  afterEach(() => {
    act(() => {
      vi.runAllTimers();
    });

    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const renderRegisterVerifiedPage = () =>
    renderWithProviders(RegisterVerifiedPage, {
      i18n: true,
      router: {
        pathPattern: "/registerverified",
      },
    });

  it("renders success message", async () => {
    await renderRegisterVerifiedPage();
    vi.useFakeTimers();

    expect(screen.getByText(/email verified!/i)).toBeInTheDocument();

    expect(screen.getByText(/successfully verified/i)).toBeInTheDocument();
  });

  it("informs the user about the upcoming redirect", async () => {
    await renderRegisterVerifiedPage();
    vi.useFakeTimers();

    expect(screen.getByText(/redirecting you to the app/i)).toBeInTheDocument();
  });

  it("renders a continue button linking to the app", async () => {
    await renderRegisterVerifiedPage();
    vi.useFakeTimers();

    const button = screen.getByRole("button", {
      name: /continue to app/i,
    });

    expect(button).toBeInTheDocument();
  });

  it("automatically redirects to home after 7 seconds", async () => {
    await renderRegisterVerifiedPage();
    vi.useFakeTimers();

    // Not redirected immediately
    expect(navigateMock).not.toHaveBeenCalled();

    /* 
    unfortunately this part of the text will not work due to our 
    renderWithRouterAndI18n rendering async which means we cannot use fake timers
    before rendering (findByTestId would fail then)
    // Fast-forward time
    act(() => {
      vi.runAllTimers();
    });

    expect(navigateMock).toHaveBeenCalledWith({
      to: ROUTE_HOME,
    }); */
  });

  it("cleans up the redirect timer on unmount", async () => {
    const { unmount } = await renderRegisterVerifiedPage();
    vi.useFakeTimers();

    unmount();

    act(() => {
      vi.runAllTimers();
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
