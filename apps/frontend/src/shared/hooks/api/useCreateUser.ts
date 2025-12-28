import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/src/api/userApi.ts";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
