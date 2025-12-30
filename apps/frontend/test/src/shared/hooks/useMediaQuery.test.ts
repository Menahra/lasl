import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "@/src/shared/hooks/useMediaQuery.ts";
import { mockMatchMedia } from "@/test/__mocks__/matchMediaMock.ts";

describe("useMatchMedia", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial match state", () => {
    mockMatchMedia({
      "(min-width: 1024px)": true,
    });

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(result.current).toBe(true);
  });

  it("updates when media query changes", () => {
    const media = mockMatchMedia({
      "(min-width: 1024px)": false,
    });

    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(result.current).toBe(false);

    act(() => {
      media.setQuery("(min-width: 1024px)", true);
    });

    expect(result.current).toBe(true);
  });

  it("re-evaluates when query changes", () => {
    mockMatchMedia({
      "(min-width: 1024px)": true,
      "(min-width: 600px)": false,
    });

    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: "(min-width: 1024px)" } },
    );

    expect(result.current).toBe(true);

    rerender({ query: "(min-width: 600px)" });

    expect(result.current).toBe(false);
  });
});
