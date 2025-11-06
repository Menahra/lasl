import axios from "axios";
import { API_URL } from "@/src/api/apiClient.ts";
import { tokenManager } from "@/src/utils/tokenManager.ts";

type PostRefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
const postRefreshToken = async () => {
  try {
    const response = await axios.post<PostRefreshTokenResponse>(
      `${API_URL}/auth/refresh`,
    );
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    tokenManager.setAccessToken(newAccessToken);
    tokenManager.setRefreshToken(newRefreshToken);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    // need to set up proper logging for frontend
    tokenManager.clearTokens();
    throw error;
  }
};

export { postRefreshToken };
