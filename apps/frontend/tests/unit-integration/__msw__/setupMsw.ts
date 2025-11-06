import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import { mockAuthenticationHandlers } from "@/tests/unit-integration/__msw__/authHandlers.ts";

export const server = setupServer(...mockAuthenticationHandlers);

export const setupMockServiceWorker = () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};
