// biome-ignore lint/performance/noNamespaceImport: needed here
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// @ts-expect-error since we do not use vitest globals we need to extend expect
expect.extend(matchers);

// clear environment after each test case
afterEach(() => {
  cleanup();
});
