import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  type ErrorKeyMap,
  useTranslateFormFieldError,
} from "@/src/shared/hooks/useTranslateFormFieldError.ts";

vi.mock("@lingui/react", () => ({
  useLingui: (): { t: (msg: { id: string; message?: string }) => string } => ({
    t: (msg) => msg.id, // return id as translation
  }),
}));

describe("useTranslateFormFieldError", () => {
  const errorMap: ErrorKeyMap = {
    "errors.required": { id: "errors.required", message: "Required field" },
    "errors.invalid": { id: "errors.invalid", message: "Invalid value" },
  };

  it("translates a known error key", () => {
    const { result } = renderHook(() => useTranslateFormFieldError(errorMap));
    const translated = result.current({
      type: "required",
      message: "errors.required",
    });
    expect(translated).toBe("errors.required"); // returns id due to mock
  });

  it("returns undefined for undefined error", () => {
    const { result } = renderHook(() => useTranslateFormFieldError(errorMap));
    expect(result.current(undefined)).toBeUndefined();
  });

  it("falls back to raw message for unknown keys", () => {
    const { result } = renderHook(() => useTranslateFormFieldError(errorMap));
    const translated = result.current({
      type: "deps",
      message: "errors.unknown",
    });
    expect(translated).toBe("errors.unknown");
  });
});
