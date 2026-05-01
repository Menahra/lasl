import type { UpdatePasswordInput } from "@lasl/app-contracts/schemas/user";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/src/api/authApi.ts";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordInput) => authApi.updatePassword(data),
  });
};
