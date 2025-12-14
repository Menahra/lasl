import type { FastifyBaseLogger } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as jwtUtil from "@/src/util/jwt.util.ts";
import {
  mockPrivateKeyBase64,
  mockPublicKeyBase64,
} from "@/test/__mocks__/jwt.mock.ts";
import {
  JWT_ACCESS_PRIVATE_KEY_NAME,
  JWT_ACCESS_PUBLIC_KEY_NAME,
} from "@/src/constants/jwt.constants.ts";

const mockedEnvironmentConfig = {
  // biome-ignore-start lint/style/useNamingConvention: ok in test
  JWT_ACCESS_PRIVATE_KEY: "",
  JWT_ACCESS_PUBLIC_KEY: "",
  JWT_REFRESH_PRIVATE_KEY: "",
  JWT_REFRESH_PUBLIC_KEY: "",
  // biome-ignore-end lint/style/useNamingConvention: ok in test
};

vi.mock("@/src/config/environment.ts", () => ({
  getEnvironmentConfig: () => {
    return mockedEnvironmentConfig;
  },
}));

const mockLogger: FastifyBaseLogger = {
  level: "debug",
  silent: vi.fn(),
  fatal: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
  child: vi.fn(() => mockLogger),
};

describe("JWT Utility", () => {
  const payload = { userId: "123" };

  beforeEach(() => {
    mockedEnvironmentConfig.JWT_ACCESS_PRIVATE_KEY = mockPrivateKeyBase64;
    mockedEnvironmentConfig.JWT_ACCESS_PUBLIC_KEY = mockPublicKeyBase64;
    mockedEnvironmentConfig.JWT_REFRESH_PRIVATE_KEY = mockPrivateKeyBase64;
    mockedEnvironmentConfig.JWT_REFRESH_PUBLIC_KEY = mockPublicKeyBase64;
    vi.clearAllMocks();
  });

  it("signs with a valid key", () => {
    const token = jwtUtil.signJsonWebToken(
      payload,
      JWT_ACCESS_PRIVATE_KEY_NAME,
      { expiresIn: "1h" },
      mockLogger,
    );

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  const malformedKeys = [
    "",
    "not-base64",
    Buffer.from("invalid").toString("base64"),
    Buffer.from("-----BEGIN JUNK-----\n123\n-----END JUNK-----").toString(
      "base64",
    ),
  ];

  it.each(malformedKeys)(
    "signing with malformed key '%s' should throw",
    (badKey) => {
      mockedEnvironmentConfig.JWT_ACCESS_PRIVATE_KEY = badKey;

      expect(() =>
        jwtUtil.signJsonWebToken(
          payload,
          JWT_ACCESS_PRIVATE_KEY_NAME,
          { expiresIn: "1h" },
          mockLogger,
        ),
      ).toThrowError();

      expect(mockLogger.error).toHaveBeenCalled();
    },
  );

  it("verifies a valid JWT and returns payload", () => {
    const token = jwtUtil.signJsonWebToken(
      payload,
      JWT_ACCESS_PRIVATE_KEY_NAME,
      { expiresIn: "1h" },
      mockLogger,
    ) as string;

    const result = jwtUtil.verifyJsonWebToken<{ userId: string }>(
      token,
      JWT_ACCESS_PUBLIC_KEY_NAME,
      mockLogger,
    );

    expect(result).toBeDefined();
    expect(result.userId).toBe("123");
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it("throws an error for an invalid token and logs an error", () => {
    const invalidToken = "this.is.not.valid";

    expect(() =>
      jwtUtil.verifyJsonWebToken(
        invalidToken,
        JWT_ACCESS_PUBLIC_KEY_NAME,
        mockLogger,
      ),
    ).toThrowError();
    expect(mockLogger.error).toHaveBeenCalledOnce();
  });

  it("throws if token is signed with a different key", () => {
    // Sign with a different key (simulating attacker or misconfig)
    const otherPrivateKey =
      "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2xDc2hSa1R1ZDNoRHgKVmFQQVBaTXBtSTZSY1NjVzNyaE9PbTBHODZQNHJuL3hKR3hJU21yaDhKNlloQVcyU3YvY09Sb0ptWVN6NTVKeQo5d3ZoWUpTNEpERUhlUkVXbnQvb0VNdXRkdjdSdTVYellzQTgyck43WXRydTc0S3FJWHJYNlBJaXdjOFRaU0QvCnQ2Z3cxVjgrQ0tpZUlvU2RvM2NpcHAwbkdBUzZjaSs5QmlkckRkWUZYRWxkRzc3NmtlU3hyVHFscGJqL3d1WUUKMFdXUksvSWZCTk1rSk1lNnJLUG8vODI5dFlXeWNwbFVvUzN1aFU2RnFZVkZPTkVOcG05WGw5NlR4cndCTHdhbApYcmVzV2JEdnlUclRpdzZ4WVhqbVlCcnBKUnVLcW1POFRURldDWVhtK3p3ZlN5dE8zY09yODc4MUlQeFdQeDdUCjdjRTFKUUNkQWdNQkFBRUNnZ0VBRkd5NXJyS0JCTC83SzhxejZiSVZHTVE2L0kvYXpROUNFdGhUTHRXUEdOTUwKblYyckV1VTJ4Z0JmdURNNmU3MWJYYmNwWEQvRjl2ZTFIWW9xUzdtR25pVklkZ3JMRFJnYlVKNW5mbStvQ0crbApGb3BGalNKcHJON21oa1JZME5JMDRDeUJic0M2YmtXSktHeGpvYXQrVG5DRzRZOFhCMlUzOUs5VzZvUWo3YWpKCnQxcDNaZTIzT2NkTkFGMEp0bmJadWdmOGtHWEpDWnJBSHNROGw0djJkTTFLc2RXc09TVHdHKzROZ3dpcHMwSkkKd1NLNmk2WWM1VFRtUEptQ1FtUkVzR25VNmlQZHpRTWR3TUdEQ21zUGsySXlGSHpJa0lrWWU4MUtOdGluUTIrUwpkSU1tTzYrbm42Z2FDdUF3YjdmR093UkxDUnlSNFZneUdRQnVwSkI3Z1FLQmdRRG5udXN6Q0F1dlI4bGZJVkkxCjh6Ykl6TzhoWVV6RWlzb0N5RE96QjY1eUZHU2RaMU9mOGNvQlBsOEhqTzI0WDRrYnU0cWJVZkZNR2ZaeUFkUmoKYlZxTC90ZUtuRjFZaExQREk4bE1STTZ4RHdWblZiV2hPQiszMStsMm9iYWJ3QmlXdW5Fbmp1cDFNZDFZS0dsUwpDa0ZVNzVGb1VzTXdMTjd4ZEJtMkIybzRYUUtCZ1FDMmFlSitrODJEY2JtR1ZBYjAyZkwxR3VaUzlESUYwaE8xCndLTVZZdnI3bXpaNGRiMHdlSGlLYmZUMUQzV0o3K2w1Y3lvZTh2ckwyaW9PditlVXlOTGloVEZaTVBHckM3U3oKckVnTCtRekdjdkgxUm1sZDF1THZhVmZwNDZGZ2ZpUjNhek4ramRvYWw4MXRjVE9HeTAzSzNMQnRXRlZtMkFSYgovUGdGcDdCbFFRS0JnQ1hySFdRZ1dCRmM5am1Oc2ZERkhWM29OdW5IRFJOTUNXQkZPRG1CODJ3WHJKVWNPbE4vCitPc1ZNK2QvaWRkYVJJNzJ0KzFQaitvK2dkc09NNkFIWWdCek93UWxMeDd6c3A0cXVLUzB5d1d2aU5udTdTbzAKanZUQTh5YUp1T1Jzb1ZuanNleWc5Lzh4cDZQc0VibnRsZDU2emRvL1dsY0RzWWZqMHVXNjl3ZTlBb0dCQUkwZgpVZGozWkJHREZETDJJd09lOGpYcC83TEJ0VW1IZ3pRanVvZTdNYzBpQVh3a0twK3JOQ1owZHdSNFYwakYwT3ppCnlmMXpvYy9BRXJXaWhmazNmTjgraURVbWhuRDc5MnJocUVPTEEvVXJ6RUVqbmpTNUlJeDBCVTJ2aTVQcFF6RVkKUUpoeUNnQjAzTHNFendaRGx3V1F3dlYxVjJ6ZlJsQWNYNDJRZEFtQkFvR0FLTnRsMStrYVBzdEZnZkpkQjlaMQpvb2FTZ0xRSGtLM1RBZk9RZmxabmNnVWswN21FcStBRXhNc3VxZ2c5V01Yend6TXFXT2RFOHNiaWg1cWxqRndiCm5DaG0zMEp1UjlYY2ljZEUrVGMrS3JPL1Q3RkRZRjlsS1Mwd1IwZTkwelBLazQwUmJ5S25hUUtSMEhyMEVET1AKMVhwVEtaRG1jcXk2bGpVcWlRZ2JKd289Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K";
    mockedEnvironmentConfig.JWT_ACCESS_PRIVATE_KEY = otherPrivateKey;
    const forgedToken = jwtUtil.signJsonWebToken(
      payload,
      JWT_ACCESS_PRIVATE_KEY_NAME,
      { expiresIn: "1h" },
      mockLogger,
    );

    // Now verify with original (wrong) public key
    mockedEnvironmentConfig.JWT_ACCESS_PUBLIC_KEY = mockPublicKeyBase64;

    expect(() =>
      jwtUtil.verifyJsonWebToken(
        forgedToken,
        JWT_ACCESS_PUBLIC_KEY_NAME,
        mockLogger,
      ),
    ).toThrowError();
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
