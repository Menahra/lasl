import { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";

export type FormSystemError =
  | "none"
  | "unverified"
  | "duplicate"
  | "rate-limited"
  | "invalid-link"
  | "unknown";

export const getFormErrorType = (
  error: unknown,
): { type: FormSystemError; retryAfter?: number } => {
  if (!isAxiosError(error)) {
    return { type: "unknown" };
  }
  const status = error.response?.status;

  if (status === StatusCodes.TOO_MANY_REQUESTS) {
    const retryAfter = error.response?.headers["retry-after"];
    return {
      type: "rate-limited",
      retryAfter: retryAfter ? Number.parseInt(retryAfter, 10) : 60,
    };
  }

  if (status === StatusCodes.CONFLICT) {
    return { type: "unverified" };
  }
  if (status === StatusCodes.BAD_REQUEST || status === StatusCodes.GONE) {
    return { type: "invalid-link" };
  }

  return { type: "unknown" };
};
