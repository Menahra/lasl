import { vi } from "vitest";

export const setupMatchMedia = (matches = false) => {
  let currentMatches = matches;
  const listeners = new Set<(e: MediaQueryListEvent) => void>();

  const mql: MediaQueryList = {
    matches: currentMatches,
    media: "",
    onchange: null,
    addEventListener: (
      _event: string,
      listener: (ev: MediaQueryListEvent) => void,
    ) => {
      listeners.add(listener);
    },
    removeEventListener: (
      _event: string,
      listener: (ev: MediaQueryListEvent) => void,
    ) => {
      listeners.delete(listener);
    },
    dispatchEvent: (event) => {
      for (const listener of listeners) {
        listener(event as MediaQueryListEvent);
      }
      return true;
    },
  } as MediaQueryList;

  vi.spyOn(window, "matchMedia").mockImplementation(() => mql);

  return {
    setMatches(value: boolean) {
      currentMatches = value;
      // @ts-expect-error ok in test
      mql.matches = value;
      mql.dispatchEvent(new Event("change") as MediaQueryListEvent);
    },
  };
};
