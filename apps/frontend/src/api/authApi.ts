import axios from "axios";
import { API_URL } from "@/src/api/apiClient.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

type PostRefreshTokenResponse = {
  accessToken: string;
};
const postRefreshToken = async () => {
  try {
    const response = await axios.post<PostRefreshTokenResponse>(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const { accessToken: newAccessToken } = response.data;

    accessTokenManager.setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    // need to set up proper logging for frontend
    accessTokenManager.clearAccessToken();
    throw error;
  }
};

export { postRefreshToken };
