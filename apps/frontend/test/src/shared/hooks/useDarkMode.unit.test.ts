import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useDarkMode } from "@/src/shared/hooks/useDarkMode.ts";
import { mockMatchMedia } from "@/test/__mocks__/matchMediaMock.ts";

describe("useDarkMode", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("if current theme is set to light returns false as dark mode being applied", () => {
    mockMatchMedia({
      "(prefers-color-scheme: dark)": false,
    });

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDarkMode).toEqual(false);
  });

  it("if current theme is set to dark returns true as dark mode being applied", () => {
    mockMatchMedia({
      "(prefers-color-scheme: dark)": true,
    });

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDarkMode).toEqual(true);
  });

  it("updates the dark mode setting after calling the function for it", () => {
    mockMatchMedia({
      "(prefers-color-scheme: dark)": false,
    });

    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.updateDarkModeSetting());
    expect(result.current.isDarkMode).toEqual(true);

    act(() => result.current.updateDarkModeSetting());
    expect(result.current.isDarkMode).toEqual(false);
  });
});
