import type { GetCurrentAuthenticatedUserSuccessResponse } from "@lasl/authentication-service";
import axios from "axios";
import { AUTH_API_BASE_URL } from "@/src/api/apiClient.ts";

type User = GetCurrentAuthenticatedUserSuccessResponse;

export const userApi = {
  updateUser: async (idOfUser: User["id"], userToUpdate: Partial<User>) => {
    const response = await axios.patch(
      `${AUTH_API_BASE_URL}/users/${idOfUser}`,
      userToUpdate,
    );

    return response.data;
  },
};
