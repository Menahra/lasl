import { HttpResponse, http } from "msw";
import { API_BASE_URL, AUTH_API_URL } from "@/src/api/apiClient.ts";

export const mockAccessToken = "valid-token";
export const mockPostRefreshNewAccessToken = "new-token";
export const mockPostRefreshNewRefreshToken = "new-refresh-token";
export const mockAuthenticationHandlers = [
  // Simulate a protected endpoint
  http.get(`${API_BASE_URL}/${AUTH_API_URL}/protected`, ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (auth === `Bearer ${mockAccessToken}`) {
      return HttpResponse.json({ data: "secure data" }, { status: 200 });
    }

    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),

  // Token refresh endpoint
  http.post(`${API_BASE_URL}/${AUTH_API_URL}/sessions/refresh`, () => {
    return HttpResponse.json(
      {
        accessToken: mockPostRefreshNewAccessToken,
        refreshToken: mockPostRefreshNewRefreshToken,
      },
      { status: 200 },
    );
  }),
];
