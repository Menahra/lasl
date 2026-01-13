type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export const removeUndefinedDeep = <T>(value: T): DeepPartial<T> => {
  if (Array.isArray(value)) {
    return value
      .map(removeUndefinedDeep)
      .filter((v) => v !== undefined) as DeepPartial<T>;
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined) {
        result[key] = removeUndefinedDeep(val);
      }
    }

    return result as DeepPartial<T>;
  }

  return value as DeepPartial<T>;
};
