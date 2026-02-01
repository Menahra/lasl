import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthFormError } from "@/src/shared/hooks/useAuthFormError.ts";

describe("useAuthFormError", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAuthFormError());

    expect(result.current.errorType).toBe("none");
    expect(result.current.isRateLimited).toBe(false);
  });

  it("should update state when setAuthFormError is called", () => {
    const { result } = renderHook(() => useAuthFormError());

    act(() => {
      result.current.setAuthFormError("duplicate");
    });

    expect(result.current.errorType).toBe("duplicate");
    expect(result.current.isRateLimited).toBe(false);
  });

  it("should start countdown and set isRateLimited to true when rate-limited", () => {
    const { result } = renderHook(() => useAuthFormError());

    act(() => {
      result.current.setAuthFormError("rate-limited", 60);
    });

    expect(result.current.errorType).toBe("rate-limited");
    expect(result.current.retryAfter).toBe(60);
    expect(result.current.isRateLimited).toBe(true);
  });

  it("should decrement retryAfter every second", () => {
    const { result } = renderHook(() => useAuthFormError());

    act(() => {
      result.current.setAuthFormError("rate-limited", 10);
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.retryAfter).toBe(7);
    expect(result.current.isRateLimited).toBe(true);
  });

  it("should clear error automatically when countdown reaches zero", () => {
    const { result } = renderHook(() => useAuthFormError());

    act(() => {
      result.current.setAuthFormError("rate-limited", 2);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.errorType).toBe("none");
    expect(result.current.retryAfter).toBeUndefined();
    expect(result.current.isRateLimited).toBe(false);
  });

  it("should clear error manually when clearError is called", () => {
    const { result } = renderHook(() => useAuthFormError());

    act(() => {
      result.current.setAuthFormError("invalid-link");
      result.current.clearError();
    });

    expect(result.current.errorType).toBe("none");
  });
});
