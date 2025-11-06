import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { postRefreshToken } from "@/src/api/authApi.ts";
import { ROUTE_LOGIN } from "@/src/routes/routePaths.ts";
import { AUTHENTICATION_TYPE } from "@/src/shared/constants.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

// biome-ignore lint/complexity/useLiteralKeys: needed for typescript
const API_URL = import.meta.env["VITE_API_URL"];

const apiClient = axios.create({
  // biome-ignore lint/style/useNamingConvention: naming from axios
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = accessTokenManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `${AUTHENTICATION_TYPE} ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for token refresh
let isRefreshing = false;
let requestQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const resolveRequestQueue = (error: unknown, token: string | null = null) => {
  for (const promise of requestQueue) {
    if (error || token === null) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  }
  requestQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== StatusCodes.UNAUTHORIZED ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        requestQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `${AUTHENTICATION_TYPE} ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newAccessToken = await postRefreshToken();

      apiClient.defaults.headers.common.Authorization = `${AUTHENTICATION_TYPE} ${newAccessToken}`;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `${AUTHENTICATION_TYPE} ${newAccessToken}`;
      }

      resolveRequestQueue(null, newAccessToken);
      return apiClient(originalRequest);
    } catch (refreshError: unknown) {
      resolveRequestQueue(refreshError);
      window.location.href = ROUTE_LOGIN;
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export { API_URL, apiClient };
