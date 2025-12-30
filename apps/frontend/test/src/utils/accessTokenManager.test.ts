import { beforeEach, describe, expect, it, vi } from "vitest";
import { ACCESS_TOKEN_NAME } from "@/src/shared/constants.ts";
import { accessTokenManager } from "@/src/utils/accessTokenManager.ts";

describe("accessTokenManager", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("getAccessToken returns value from localStorage", () => {
    const spy = vi.spyOn(localStorage, "getItem");
    localStorage.setItem(ACCESS_TOKEN_NAME, "my-token");

    const token = accessTokenManager.getAccessToken();

    expect(spy).toHaveBeenCalledWith(ACCESS_TOKEN_NAME);
    expect(token).toBe("my-token");
  });

  it("setAccessToken stores value in localStorage", () => {
    const spy = vi.spyOn(localStorage, "setItem");

    accessTokenManager.setAccessToken("new-token");

    expect(spy).toHaveBeenCalledWith(ACCESS_TOKEN_NAME, "new-token");
    expect(localStorage.getItem(ACCESS_TOKEN_NAME)).toBe("new-token");
  });

  it("clearAccessToken removes value from localStorage", () => {
    const spy = vi.spyOn(localStorage, "removeItem");

    localStorage.setItem(ACCESS_TOKEN_NAME, "some-token");
    accessTokenManager.clearAccessToken();

    expect(spy).toHaveBeenCalledWith(ACCESS_TOKEN_NAME);
    expect(localStorage.getItem(ACCESS_TOKEN_NAME)).toBeNull();
  });
});
