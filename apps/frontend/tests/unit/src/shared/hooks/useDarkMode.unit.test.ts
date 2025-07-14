import { useDarkMode } from "@/src/shared/hooks/useDarkMode";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

describe("useDarkMode", () => {
  it("if current theme is set to light returns false as dark mode being applied", () => {
    vi.stubGlobal("matchMedia", (query: string) => {
      if (query === "(prefers-color-scheme: dark)") {
        return {
          matches: false, // simulate light mode
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };
    });

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDarkMode).toEqual(false);
  });

  it("if current theme is set to dark returns true as dark mode being applied", () => {
    vi.stubGlobal("matchMedia", (query: string) => {
      if (query === "(prefers-color-scheme: dark)") {
        return {
          matches: true, // simulate dark mode
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };
    });

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.isDarkMode).toEqual(true);
  });

  it("updates the dark mode setting after calling the function for it", async () => {
    vi.stubGlobal("matchMedia", (query: string) => {
      if (query === "(prefers-color-scheme: dark)") {
        return {
          matches: false, // simulate dark mode
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        };
      }
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };
    });

    const { result } = renderHook(() => useDarkMode());
    act(() => result.current.updateDarkModeSetting());
    await waitFor(() => expect(result.current.isDarkMode).toEqual(true));

    act(() => result.current.updateDarkModeSetting());
    await waitFor(() => expect(result.current.isDarkMode).toEqual(false));
  });
});
