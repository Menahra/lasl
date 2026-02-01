import { AxiosError, type AxiosHeaders, type AxiosResponse } from "axios";
import { StatusCodes } from "http-status-codes";
import { describe, expect, it } from "vitest";
import { getAuthFormErrorType } from "@/src/shared/authApiErrors.ts";

describe("getFormErrorType", () => {
  const createAxiosError = (status: number, headers = {}) => {
    const response = {
      status,
      data: {},
      statusText: "Error",
      headers: headers as AxiosHeaders,
      config: { headers: {} as AxiosHeaders },
    } as AxiosResponse;

    return new AxiosError(
      "Request failed",
      "ERR_BAD_RESPONSE",
      undefined,
      undefined,
      response,
    );
  };

  it("returns 'unknown' if error is not an Axios error", () => {
    expect(getAuthFormErrorType(new Error("Normal error"))).toEqual({
      type: "unknown",
    });
  });

  it("returns 'rate-limited' with retryAfter from headers", () => {
    const error = createAxiosError(StatusCodes.TOO_MANY_REQUESTS, {
      "retry-after": "120",
    });
    expect(getAuthFormErrorType(error)).toEqual({
      type: "rate-limited",
      retryAfter: 120,
    });
  });

  it("returns 'rate-limited' with default 60s if header is missing", () => {
    const error = createAxiosError(StatusCodes.TOO_MANY_REQUESTS);
    expect(getAuthFormErrorType(error)).toEqual({
      type: "rate-limited",
      retryAfter: 60,
    });
  });

  it("returns 'unverified' for CONFLICT status", () => {
    const error = createAxiosError(StatusCodes.CONFLICT);
    expect(getAuthFormErrorType(error)).toEqual({ type: "unverified" });
  });

  it("returns 'invalid-link' for BAD_REQUEST or GONE", () => {
    expect(
      getAuthFormErrorType(createAxiosError(StatusCodes.BAD_REQUEST)),
    ).toEqual({ type: "invalid-link" });
    expect(getAuthFormErrorType(createAxiosError(StatusCodes.GONE))).toEqual({
      type: "invalid-link",
    });
  });
});
