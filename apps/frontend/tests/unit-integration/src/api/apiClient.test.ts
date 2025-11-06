/** biome-ignore-all lint/security/noSecrets: no secrets here in test */
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, apiClient } from "@/src/api/apiClient.ts";
// biome-ignore lint/performance/noNamespaceImport: needed for spy
import * as authApi from "@/src/api/authApi.ts";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "@/src/shared/constants.ts";
import { mockPostRefreshNewAccessToken } from "@/tests/unit-integration/__msw__/authHandlers.ts";
import {
  server,
  setupMockServiceWorker,
} from "@/tests/unit-integration/__msw__/setupMsw.ts";

setupMockServiceWorker();

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok in test
describe("apiClient integration", () => {
  const postRefreshTokenSpy = vi.spyOn(authApi, "postRefreshToken");
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem(ACCESS_TOKEN_NAME, "valid-token");
    localStorage.setItem(REFRESH_TOKEN_NAME, "refresh-token");
  });

  it("attaches Authorization header when access token is present", async () => {
    const res = await apiClient.get("/protected");

    expect(res.data).toEqual({ data: "secure data" });
  });

  it("refreshes token on 401 and retries the original request", async () => {
    localStorage.setItem(ACCESS_TOKEN_NAME, "expired-token");

    server.use(
      http.get(`${API_URL}/protected`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth === `Bearer ${mockPostRefreshNewAccessToken}`) {
          return HttpResponse.json({ data: "retried success" });
        }
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
    );

    const res = await apiClient.get("/protected");

    expect(postRefreshTokenSpy).toHaveBeenCalled();
    expect(res.data).toEqual({ data: "retried success" });
  });

  it("redirects to login if no refresh token exists", async () => {
    localStorage.setItem(ACCESS_TOKEN_NAME, "expired-token");
    localStorage.setItem(REFRESH_TOKEN_NAME, "");

    server.use(
      http.post(`${API_URL}/auth/refresh`, () => {
        return HttpResponse.json(
          {
            message: "error",
          },
          { status: 500 },
        );
      }),
    );

    await expect(apiClient.get("/protected")).rejects.toThrow();
    expect(window.location.href).toBe("http://localhost:3000/login");
  });

  it("handles multiple queued requests during token refresh", async () => {
    localStorage.setItem(ACCESS_TOKEN_NAME, "expired-token");

    server.use(
      http.get(`${API_URL}/protected`, ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth === "Bearer new-token") {
          return HttpResponse.json({ data: "retried" });
        }
        return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
      }),
    );

    // Make two simultaneous requests
    const [res1, res2] = await Promise.all([
      apiClient.get("/protected"),
      apiClient.get("/protected"),
    ]);

    expect(postRefreshTokenSpy).toHaveBeenCalledTimes(1);
    expect(res1.data).toEqual({ data: "retried" });
    expect(res2.data).toEqual({ data: "retried" });
  });
});
