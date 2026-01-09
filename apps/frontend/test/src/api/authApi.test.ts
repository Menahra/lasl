import { beforeEach, describe, expect, it, vi } from "vitest";
import { authApi } from "@/src/api/authApi.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

// Mock the apiClient module
vi.mock("@/src/api/apiClient.ts", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  // biome-ignore-start lint/style/useNamingConvention: ok here
  API_BASE_URL: "http://localhost:3000",
  AUTH_API_URL: "/auth/api/v1",
  // biome-ignore-end lint/style/useNamingConvention: ok here
}));

import { apiClient } from "@/src/api/apiClient.ts";

vi.mock("@/src/utils/accessTokenManager.ts", () => ({
  accessTokenManager: {
    setAccessToken: vi.fn(),
    clearAccessToken: vi.fn(),
  },
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSession", () => {
    it("posts to /sessions, saves token, and returns it", async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { accessToken: "abc123" },
      });

      const result = await authApi.createSession({
        email: "test@example.com",
        password: "password",
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/api/v1/sessions",
        {
          email: "test@example.com",
          password: "password",
        },
        { withCredentials: true },
      );
      expect(accessTokenManager.setAccessToken).toHaveBeenCalledWith("abc123");
      expect(result).toBe("abc123");
    });

    it("clears token and throws on error", async () => {
      const error = new Error("fail");
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(
        authApi.createSession({ email: "x", password: "y" }),
      ).rejects.toThrow("fail");
      expect(accessTokenManager.clearAccessToken).toHaveBeenCalled();
    });
  });

  describe("postRefreshToken", () => {
    it("calls refresh endpoint and updates access token", async () => {
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { accessToken: "newToken" },
      });

      const token = await authApi.postRefreshToken();

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/api/v1/sessions/refresh",
        {},
        { withCredentials: true },
      );
      expect(accessTokenManager.setAccessToken).toHaveBeenCalledWith(
        "newToken",
      );
      expect(token).toBe("newToken");
    });

    it("clears access token on failure", async () => {
      const error = new Error("refresh failed");
      vi.mocked(apiClient.post).mockRejectedValue(error);

      await expect(authApi.postRefreshToken()).rejects.toThrow(
        "refresh failed",
      );
      expect(accessTokenManager.clearAccessToken).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("posts to logout endpoint", async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

      await authApi.logout();

      expect(apiClient.post).toHaveBeenCalledWith(
        "/auth/api/v1/sessions/logout",
        {},
        { withCredentials: true },
      );
    });
  });

  describe("getCurrentUser", () => {
    it("gets from /users/me and returns user data", async () => {
      const user = { id: 1, name: "Jane" };
      vi.mocked(apiClient.get).mockResolvedValue({
        data: user,
      });

      const result = await authApi.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith("/auth/api/v1/users/me");
      expect(result).toEqual(user);
    });
  });
});
