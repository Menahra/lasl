import { describe, expect, it } from "vitest";
import { removeUndefinedDeep } from "@/src/util/object.util.ts";

describe("removeUndefinedDeep", () => {
  it("removes top-level undefined properties", () => {
    const input = {
      firstName: undefined,
      lastName: "Doe",
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      lastName: "Doe",
    });
  });

  it("removes nested undefined properties", () => {
    const input = {
      settings: {
        darkMode: true,
        locale: undefined,
      },
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      settings: {
        darkMode: true,
      },
    });
  });

  it("does not overwrite existing nested values when used as an update", () => {
    const model = {
      firstName: "John",
      lastName: "Doe",
      settings: {
        darkMode: false,
        locale: "en",
      },
    };

    const update = {
      firstName: undefined,
      settings: {
        darkMode: true,
        locale: undefined,
      },
    };

    const cleanedUpdate = removeUndefinedDeep(update);

    const merged = {
      ...model,
      ...cleanedUpdate,
      settings: {
        ...model.settings,
        ...cleanedUpdate.settings,
      },
    };

    expect(merged).toEqual({
      firstName: "John",
      lastName: "Doe",
      settings: {
        darkMode: true,
        locale: "en",
      },
    });
  });

  it("handles arrays correctly", () => {
    const input = {
      tags: ["a", undefined, "b"],
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      tags: ["a", "b"],
    });
  });

  it("handles deeply nested objects", () => {
    const input = {
      a: {
        b: {
          c: undefined,
          d: 1,
        },
      },
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({
      a: {
        b: {
          d: 1,
        },
      },
    });
  });

  it("returns primitives unchanged", () => {
    expect(removeUndefinedDeep("test")).toBe("test");
    expect(removeUndefinedDeep(123)).toBe(123);
    expect(removeUndefinedDeep(null)).toBeNull();
    expect(removeUndefinedDeep(false)).toBe(false);
  });

  it("returns empty object if all properties are undefined", () => {
    const input = {
      a: undefined,
      b: undefined,
    };

    const result = removeUndefinedDeep(input);

    expect(result).toEqual({});
  });
});
