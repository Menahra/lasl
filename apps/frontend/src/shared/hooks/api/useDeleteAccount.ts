import type { DeleteUserInput } from "@lasl/app-contracts/schemas/user";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/src/api/authApi.ts";

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (data: DeleteUserInput) => authApi.deleteAccount(data),
  });
};
