import type { createUserSchema } from "@lasl/app-contracts/schemas/user";
import type { GetCurrentAuthenticatedUserSuccessResponse } from "@lasl/authentication-service";
import axios from "axios";
import type { z } from "zod";
import { AUTH_API_BASE_URL } from "@/src/api/apiClient.ts";

type User = GetCurrentAuthenticatedUserSuccessResponse;

export const userApi = {
  createUser: async (userToCreate: z.infer<typeof createUserSchema>) => {
    return await axios.post<User>(`${AUTH_API_BASE_URL}/users`, userToCreate);
  },
  updateUser: async (idOfUser: User["id"], userToUpdate: Partial<User>) => {
    return await axios.patch<User>(
      `${AUTH_API_BASE_URL}/users/${idOfUser}`,
      userToUpdate,
    );
  },
};
