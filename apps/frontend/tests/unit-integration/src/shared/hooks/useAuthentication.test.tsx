import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { authApi } from "@/src/api/authApi.ts";
import {
  authKeys,
  useGetCurrentUser,
  usePostLogin,
  usePostLogout,
  usePostRefreshToken,
} from "@/src/shared/hooks/useAuthentication.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

vi.mock("@/src/api/authApi", () => ({
  authApi: {
    createSession: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
    postRefreshToken: vi.fn(),
  },
}));

vi.mock("@/src/utils/accessTokenManager", () => ({
  accessTokenManager: {
    getAccessToken: vi.fn(),
    clearAccessToken: vi.fn(),
  },
}));

const createTanstackQueryWrapper = () => {
  const tanstackQueryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={tanstackQueryClient}>
      {children}
    </QueryClientProvider>
  );
  return { wrapper, tanstackQueryClient };
};

describe("useAuth hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useLogin calls createSession and invalidates user query", async () => {
    (authApi.createSession as Mock).mockResolvedValue({ accessToken: "abc" });
    const { wrapper, tanstackQueryClient } = createTanstackQueryWrapper();
    const invalidateQueries = vi.spyOn(
      tanstackQueryClient,
      "invalidateQueries",
    );

    const { result } = renderHook(() => usePostLogin(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(["test@example.com", "secret"]);
    });

    expect(authApi.createSession).toHaveBeenCalledWith(
      "test@example.com",
      "secret",
    );
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: authKeys.user(),
    });
  });

  it("useLogout calls logout, clears token, and removes auth queries", async () => {
    const { wrapper, tanstackQueryClient } = createTanstackQueryWrapper();
    const removeQueries = vi.spyOn(tanstackQueryClient, "removeQueries");
    (authApi.logout as Mock).mockResolvedValue({});

    const { result } = renderHook(() => usePostLogout(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(authApi.logout).toHaveBeenCalled();
    expect(accessTokenManager.clearAccessToken).toHaveBeenCalled();
    expect(removeQueries).toHaveBeenCalledWith({ queryKey: authKeys.all });
  });

  it("useRefreshToken clears access token and removes queries on error", async () => {
    const { wrapper, tanstackQueryClient } = createTanstackQueryWrapper();
    const removeQueries = vi.spyOn(tanstackQueryClient, "removeQueries");
    (authApi.postRefreshToken as Mock).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => usePostRefreshToken(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow("fail");
    });

    expect(accessTokenManager.clearAccessToken).toHaveBeenCalled();
    expect(removeQueries).toHaveBeenCalledWith({ queryKey: authKeys.all });
  });

  it("useCurrentUser runs only when token exists", async () => {
    (accessTokenManager.getAccessToken as Mock).mockReturnValue("token");
    (authApi.getCurrentUser as Mock).mockResolvedValue({ id: 1, name: "Jane" });

    const { wrapper } = createTanstackQueryWrapper();
    const { result } = renderHook(() => useGetCurrentUser(), { wrapper });

    // Wait for query to settle
    await result.current.refetch();

    expect(authApi.getCurrentUser).toHaveBeenCalled();
  });

  it("useCurrentUser is disabled when token missing", () => {
    (accessTokenManager.getAccessToken as Mock).mockReturnValue(null);

    const { wrapper } = createTanstackQueryWrapper();
    renderHook(() => useGetCurrentUser(), { wrapper });

    expect(authApi.getCurrentUser).not.toHaveBeenCalled();
  });
});
