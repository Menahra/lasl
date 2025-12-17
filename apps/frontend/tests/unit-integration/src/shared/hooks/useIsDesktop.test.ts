import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIsDesktop } from "@/src/shared/hooks/useIsDesktop.ts";
import { setupMatchMedia } from "@/tests/unit-integration/__mocks__/matchMediaMock.ts";

describe("useIsDesktop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true if the media query matches", () => {
    setupMatchMedia(true); // pretend viewport >= 768px

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });

  it("returns false if the media query does not match", () => {
    setupMatchMedia(false); // pretend viewport < 768px

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });

  it("updates when the viewport changes", () => {
    const media = setupMatchMedia(false);

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);

    act(() => {
      media.setMatches(true);
    });

    expect(result.current).toBe(true);
  });
});
