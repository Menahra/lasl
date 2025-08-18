import { describe, expect, it } from "vitest";
import { getApiVersionPathPrefix } from "@/src/util/api.path.util.ts";

describe("api path util", () => {
  it("should return version 1 api string if we pass 1 as param", () => {
    const result = getApiVersionPathPrefix(1);
    expect(result).toEqual("/api/v1");
  });
});
