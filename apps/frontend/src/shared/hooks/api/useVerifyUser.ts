import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/src/api/userApi.ts";

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: ({
      id,
      verificationCode,
    }: {
      id: Parameters<typeof userApi.verifyUser>[0];
      verificationCode: Parameters<typeof userApi.verifyUser>[1];
    }) => userApi.verifyUser(id, verificationCode),
  });
};
