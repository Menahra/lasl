import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type User, userApi } from "@/src/api/userApi.ts";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
