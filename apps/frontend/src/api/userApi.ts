import type { createUserSchema } from "@lasl/app-contracts/schemas/user";
import type { GetCurrentAuthenticatedUserSuccessResponse } from "@lasl/authentication-service";
import type { z } from "zod";
import { AUTH_API_URL, apiClient } from "@/src/api/apiClient.ts";

export type User = GetCurrentAuthenticatedUserSuccessResponse;

export const userApi = {
  createUser: async (userToCreate: z.infer<typeof createUserSchema>) => {
    const { data } = await apiClient.post<User>(
      `${AUTH_API_URL}/users`,
      userToCreate,
    );

    return data;
  },
  verifyUser: async (idOfUser: User["id"], verificationCode: string) => {
    const { data } = await apiClient.get(
      `${AUTH_API_URL}/users/verify/${idOfUser}/${verificationCode}`,
    );

    return data;
  },
  updateUser: async (idOfUser: User["id"], userToUpdate: Partial<User>) => {
    const { data } = await apiClient.patch<User>(
      `${AUTH_API_URL}/users/${idOfUser}`,
      userToUpdate,
    );

    return data;
  },
};
