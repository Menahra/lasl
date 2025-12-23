import axios from "axios";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { AUTH_API_BASE_URL } from "@/src/api/apiClient.ts";
import { authApi } from "@/src/api/authApi.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

vi.mock("axios", () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    post: vi.fn(),
    get: vi.fn(),
  };

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      post: vi.fn(), // only needed if your code uses axios.post directly
    },
  };
});
vi.mock("@/src/utils/accessTokenManager.ts", () => ({
  accessTokenManager: {
    setAccessToken: vi.fn(),
    clearAccessToken: vi.fn(),
  },
}));

const mockAxiosPost = axios.post as Mock;

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSession", () => {
    it("posts to /sessions, saves token, and returns it", async () => {
      mockAxiosPost.mockResolvedValue({
        data: { accessToken: "abc123" },
      });

      const result = await authApi.createSession(
        "test@example.com",
        "password",
      );

      expect(mockAxiosPost).toHaveBeenCalledWith(
        `${AUTH_API_BASE_URL}/sessions`,
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
      mockAxiosPost.mockRejectedValue(error);

      await expect(authApi.createSession("x", "y")).rejects.toThrow("fail");

      expect(accessTokenManager.clearAccessToken).toHaveBeenCalled();
    });
  });

  describe("postRefreshToken", () => {
    it("calls refresh endpoint and updates access token", async () => {
      mockAxiosPost.mockResolvedValue({
        data: { accessToken: "newToken" },
      });

      const token = await authApi.postRefreshToken();

      expect(mockAxiosPost).toHaveBeenCalledWith(
        `${AUTH_API_BASE_URL}/sessions/refresh`,
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
      mockAxiosPost.mockRejectedValue(error);

      await expect(authApi.postRefreshToken()).rejects.toThrow(
        "refresh failed",
      );

      expect(accessTokenManager.clearAccessToken).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("posts to logout endpoint", async () => {
      mockAxiosPost.mockResolvedValue({ data: {} });

      await authApi.logout();

      expect(mockAxiosPost).toHaveBeenCalledWith(
        `${AUTH_API_BASE_URL}/sessions/logout`,
        {},
        { withCredentials: true },
      );
    });
  });

  describe("getCurrentUser", () => {
    it("posts to /users/me and returns user data", async () => {
      const user = { id: 1, name: "Jane" };

      mockAxiosPost.mockResolvedValue({
        data: user,
      });

      const result = await authApi.getCurrentUser();

      expect(mockAxiosPost).toHaveBeenCalledWith(
        `${AUTH_API_BASE_URL}/users/me`,
        {},
        { withCredentials: true },
      );

      expect(result).toEqual(user);
    });
  });
});
