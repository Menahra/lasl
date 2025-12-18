import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useIsDesktop } from "@/src/shared/hooks/useIsDesktop.ts";
import { mockMatchMedia } from "@/tests/unit-integration/__mocks__/matchMediaMock.ts";

describe("useIsDesktop", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true if the media query matches", () => {
    mockMatchMedia({ "(min-width: 768px)": true });

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });

  it("returns false if the media query does not match", () => {
    mockMatchMedia({ "(min-width: 768px)": false });

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);
  });

  it("updates when the viewport changes", () => {
    const media = mockMatchMedia({ "(min-width: 768px)": false });

    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(false);

    act(() => {
      media.setQuery("(min-width: 768px)", true);
    });

    expect(result.current).toBe(true);
  });
});
