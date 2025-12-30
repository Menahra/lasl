import { vi } from "vitest";

type Listener = () => void;

class MockMediaQueryList {
  matches: boolean;
  listeners = new Set<Listener>();

  constructor(matches: boolean) {
    this.matches = matches;
  }

  addEventListener(_: "change", listener: Listener) {
    this.listeners.add(listener);
  }

  removeEventListener(_: "change", listener: Listener) {
    this.listeners.delete(listener);
  }

  setMatches(value: boolean) {
    this.matches = value;
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const mockMatchMedia = (initial: Record<string, boolean>) => {
  const queries = new Map<string, MockMediaQueryList>();

  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => {
    if (!queries.has(query)) {
      queries.set(query, new MockMediaQueryList(Boolean(initial[query])));
    }
    return queries.get(query) as unknown as MediaQueryList;
  });

  return {
    setQuery(query: string, matches: boolean) {
      queries.get(query)?.setMatches(matches);
    },
  };
};
