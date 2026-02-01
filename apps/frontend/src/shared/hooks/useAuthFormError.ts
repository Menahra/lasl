import { useCallback, useEffect, useState } from "react";
import type { AuthFormSystemError } from "@/src/shared/authApiErrors.ts";

const ONE_SECOND = 1000;

export const useAuthFormError = (
  initialErrorType: AuthFormSystemError = "none",
) => {
  const [authFormErrorState, setAuthFormErrorState] = useState<{
    type: AuthFormSystemError;
    retryAfter?: number | undefined;
  }>({ type: initialErrorType });

  const setAuthFormError = useCallback(
    (type: AuthFormSystemError, retryAfter?: number) => {
      setAuthFormErrorState({ type, retryAfter });
    },
    [],
  );

  const clearError = useCallback(() => {
    setAuthFormErrorState({ type: "none" });
  }, []);

  useEffect(() => {
    if (
      authFormErrorState.type !== "rate-limited" ||
      !authFormErrorState.retryAfter
    ) {
      return;
    }

    if (authFormErrorState.retryAfter <= 0) {
      clearError();
      return;
    }

    const timer = setInterval(() => {
      setAuthFormErrorState((prev) => ({
        ...prev,
        retryAfter: prev.retryAfter ? prev.retryAfter - 1 : 0,
      }));
    }, ONE_SECOND);

    return () => clearInterval(timer);
  }, [authFormErrorState.type, authFormErrorState.retryAfter, clearError]);

  return {
    errorType: authFormErrorState.type,
    retryAfter: authFormErrorState.retryAfter,
    setAuthFormError,
    clearError,
    isRateLimited:
      authFormErrorState.type === "rate-limited" &&
      (authFormErrorState.retryAfter ?? 0) > 0,
  };
};
