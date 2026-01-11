import { ACCESS_TOKEN_NAME } from "@lasl/app-contracts/api/auth";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_BASE_URL, AUTH_API_URL, apiClient } from "@/src/api/apiClient.ts";
import * as authApi from "@/src/api/authApi.ts";
import { mockPostRefreshNewAccessToken } from "@/test/__msw__/authMocks.ts";
import { server, setupMockServiceWorker } from "@/test/__msw__/setupMsw.ts";

setupMockServiceWorker();

describe("apiClient integration with cookie-based refresh token", () => {
  const postRefreshTokenSpy = vi.spyOn(authApi.authApi, "postRefreshToken");

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(ACCESS_TOKEN_NAME, "valid-token");
  });

  it("attaches Authorization header when access token is present", async () => {
    server.use(
      http.get(`${API_BASE_URL}/protected`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth?.includes("valid-token")) {
          return HttpResponse.json({ data: "secure data" });
        }
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
    );

    const res = await apiClient.get("/protected");
    expect(res.data).toEqual({ data: "secure data" });
  });

  it("refreshes token on 401 and retries the original request", async () => {
    localStorage.setItem(ACCESS_TOKEN_NAME, "expired-token");

    server.use(
      http.get(`${API_BASE_URL}/protected`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth === `Bearer ${mockPostRefreshNewAccessToken}`) {
          return HttpResponse.json({ data: "retried success" });
        }
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),

      http.post(`${API_BASE_URL}${AUTH_API_URL}/sessions/refresh`, () => {
        return HttpResponse.json({
          accessToken: mockPostRefreshNewAccessToken,
        });
      }),
    );

    const res = await apiClient.get("/protected");
    expect(postRefreshTokenSpy).toHaveBeenCalled();
    expect(res.data).toEqual({ data: "retried success" });
  });

  it("redirects to login if the refresh request fails", async () => {
    localStorage.setItem(ACCESS_TOKEN_NAME, "expired-token");

    server.use(
      http.get(`${API_BASE_URL}/protected`, () => {
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
      http.post(`${API_BASE_URL}${AUTH_API_URL}/sessions/refresh`, () => {
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
    );

    await expect(apiClient.get("/protected")).rejects.toThrow();
    expect(window.location.href).toBe("http://localhost:3000/login");
  });

  it("handles multiple queued requests during token refresh", async () => {
    localStorage.setItem(ACCESS_TOKEN_NAME, "expired-token");

    server.use(
      http.get(`${API_BASE_URL}/protected`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth === `Bearer ${mockPostRefreshNewAccessToken}`) {
          return HttpResponse.json({ data: "retried" });
        }
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
      http.post(`${API_BASE_URL}${AUTH_API_URL}/sessions/refresh`, () => {
        return HttpResponse.json({
          accessToken: mockPostRefreshNewAccessToken,
        });
      }),
    );

    const [res1, res2] = await Promise.all([
      apiClient.get("/protected"),
      apiClient.get("/protected"),
    ]);

    expect(postRefreshTokenSpy).toHaveBeenCalledTimes(1);
    expect(res1.data).toEqual({ data: "retried" });
    expect(res2.data).toEqual({ data: "retried" });
  });
});
