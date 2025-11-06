import { HttpResponse, http } from "msw";
import { API_URL } from "@/src/api/apiClient.ts";

export const mockAccessToken = "valid-token";
export const mockPostRefreshNewAccessToken = "new-token";
export const mockPostRefreshNewRefreshToken = "new-refresh-token";
export const mockAuthenticationHandlers = [
  // Simulate a protected endpoint
  http.get(`${API_URL}/protected`, ({ request }) => {
    // biome-ignore lint/security/noSecrets: no secret and we are in test setting
    const auth = request.headers.get("Authorization");
    if (auth === `Bearer ${mockAccessToken}`) {
      return HttpResponse.json({ data: "secure data" }, { status: 200 });
    }
    // biome-ignore lint/security/noSecrets: no secret and we are in test setting
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),

  // Token refresh endpoint
  http.post(`${API_URL}/auth/refresh`, () => {
    return HttpResponse.json(
      {
        accessToken: mockPostRefreshNewAccessToken,
        refreshToken: mockPostRefreshNewRefreshToken,
      },
      { status: 200 },
    );
  }),
];
