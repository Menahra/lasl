/** biome-ignore-all lint/security/noSecrets: no secrets in test */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import {
  useGetCurrentUser,
  usePostLogin,
  usePostLogout,
} from "@/src/shared/hooks/useAuthentication.ts";
import {
  AuthenticationProvider,
  useAuthenticationContext,
} from "@/src/shared/hooks/useAuthenticationContext.tsx";

vi.mock("@/src/shared/hooks/useAuthentication.ts", () => ({
  useGetCurrentUser: vi.fn(),
  usePostLogin: vi.fn(),
  usePostLogout: vi.fn(),
}));

// biome-ignore lint/style/useComponentExportOnlyModules: ok here in test
const Consumer = () => {
  const ctx = useAuthenticationContext();

  return (
    <>
      <div data-testid="user">{JSON.stringify(ctx.user)}</div>
      <div data-testid="isLoading">{String(ctx.isLoading)}</div>
      <div data-testid="isAuthenticated">{String(ctx.isAuthenticated)}</div>
      <button type="button" onClick={() => ctx.login("email", "password")}>
        login
      </button>
      <button type="button" onClick={() => ctx.logout()}>
        logout
      </button>
    </>
  );
};

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();

  (useGetCurrentUser as Mock).mockReturnValue({
    data: undefined,
    isLoading: false,
  });

  (usePostLogin as Mock).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue({}),
  });

  (usePostLogout as Mock).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue({}),
  });
});

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: okay here
describe("AuthenticationProvider", () => {
  it("throws when useAuthenticationContext is used without provider", () => {
    expect(() => render(<Consumer />)).toThrowError(
      // biome-ignore lint/performance/useTopLevelRegex: ok in test
      /must be used within AuthenticationProvider/i,
    );
  });

  it("provides default unauthenticated state", () => {
    render(
      <AuthenticationProvider>
        <Consumer />
      </AuthenticationProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent("");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
  });

  it("sets authenticated state when user is returned", () => {
    (useGetCurrentUser as Mock).mockReturnValue({
      data: { id: "123", email: "test@example.com" },
      isLoading: false,
    });

    render(
      <AuthenticationProvider>
        <Consumer />
      </AuthenticationProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent("123");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");
  });

  it("exposes loading state from useGetCurrentUser()", () => {
    (useGetCurrentUser as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(
      <AuthenticationProvider>
        <Consumer />
      </AuthenticationProvider>,
    );

    expect(screen.getByTestId("isLoading")).toHaveTextContent("true");
  });

  it("login() calls loginMutation.mutateAsync with passed credentials", () => {
    const mutateAsyncMock = vi.fn().mockResolvedValue({});
    (usePostLogin as Mock).mockReturnValue({ mutateAsync: mutateAsyncMock });

    render(
      <AuthenticationProvider>
        <Consumer />
      </AuthenticationProvider>,
    );

    fireEvent.click(screen.getByText("login"));

    expect(mutateAsyncMock).toHaveBeenCalledWith(["email", "password"]);
  });

  it("logout() calls logoutMutation.mutateAsync()", () => {
    const mutateAsyncMock = vi.fn().mockResolvedValue({});
    (usePostLogout as Mock).mockReturnValue({ mutateAsync: mutateAsyncMock });

    render(
      <AuthenticationProvider>
        <Consumer />
      </AuthenticationProvider>,
    );

    fireEvent.click(screen.getByText("logout"));

    expect(mutateAsyncMock).toHaveBeenCalled();
  });
});
