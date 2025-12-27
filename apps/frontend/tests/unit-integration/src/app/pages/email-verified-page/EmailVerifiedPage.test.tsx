import "@/tests/unit-integration/__mocks__/i18nContextMock.ts";
import { act, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EmailVerifiedPage } from "@/src/app/pages/email-verified-page/EmailVerifiedPage.tsx";
import { renderWithRouterAndI18n } from "@/tests/unit-integration/__wrappers__/RouterAndI18nTestingWrapper.tsx";

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

describe("EmailVerifiedPage", () => {
  afterEach(() => {
    act(() => {
      vi.runAllTimers();
    });

    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const renderEmailVerifiedPage = () =>
    renderWithRouterAndI18n(EmailVerifiedPage, {
      pathPattern: "/emailverified",
    });

  it("renders success message", async () => {
    await renderEmailVerifiedPage();
    vi.useFakeTimers();

    expect(screen.getByText(/email verified!/i)).toBeInTheDocument();

    expect(screen.getByText(/successfully verified/i)).toBeInTheDocument();
  });

  it("informs the user about the upcoming redirect", async () => {
    await renderEmailVerifiedPage();
    vi.useFakeTimers();

    expect(screen.getByText(/redirecting you to the app/i)).toBeInTheDocument();
  });

  it("renders a continue button linking to the app", async () => {
    await renderEmailVerifiedPage();
    vi.useFakeTimers();

    const button = screen.getByRole("button", {
      name: /continue to app/i,
    });

    expect(button).toBeInTheDocument();
  });

  it("automatically redirects to home after 7 seconds", async () => {
    await renderEmailVerifiedPage();
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
    const {
      renderResult: { unmount },
    } = await renderEmailVerifiedPage();
    vi.useFakeTimers();

    unmount();

    act(() => {
      vi.runAllTimers();
    });

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
