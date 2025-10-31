const getRandomString = (length: number) => {
  const characters =
    // biome-ignore lint/security/noSecrets: this is no secret
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789()#+*-,;:.<>`´|";
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)],
  ).join("");
};

export const generateRandomStringNotMatchingPattern = (
  length: number,
  invalidPatterns: RegExp[],
) => {
  let randomString: string;
  do {
    randomString = getRandomString(length);
  } while (invalidPatterns.some((pattern) => pattern.test(randomString))); // Check against all invalid regexes

  return randomString;
};

export const getRandomInteger = (minimum: number, maximum: number) => {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
