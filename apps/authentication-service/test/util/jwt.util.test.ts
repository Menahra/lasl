import type { FastifyBaseLogger } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
// biome-ignore lint/performance/noNamespaceImport: okay in test
import * as jwtUtil from "@/src/util/jwt.util.ts";

const mockedEnvironmentConfig = {
  jwtAccessPrivateKey: "",
  jwtAccessPublicKey: "",
  jwtRefreshPrivateKey: "",
  jwtRefreshPublicKey: "",
};

// ✅ This mock will be hoisted, but uses a runtime getter
vi.mock("@/src/config/environment.ts", () => ({
  // biome-ignore lint/style/useNamingConvention: ok for constants
  ENVIRONMENT: {
    jwtAccessPrivateKey: "jwtAccessPrivateKey",
    jwtAccessPublicKey: "jwtAccessPublicKey",
    jwtRefreshPrivateKey: "jwtRefreshPrivateKey",
    jwtRefreshPublicKey: "jwtRefreshPublicKey",
  },
  get environmentConfig() {
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

const validTestPrivateKeyBase64 =
  "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2QUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktZd2dnU2lBZ0VBQW9JQkFRRE9oV00vMVN5cXA3cy8KOFhJMngxazZRUDRQeHR6ZzdSQ1ZKTDE3L3pHcTBjVnVyWU9hd0gzOGE5a3d2U2MxNEgwWEhzU2xYMnpxU3JtWApnYml1bGxKOEt0TmZWTVFGQ0xEcUZCYjU5ZWZmYUJISldVb2R6R0EvdytERERPQVRtOXlvOU92MjJOdjRGd0k1CktYNk53UWo2WExGdEpmeEpCQ0I3L3FnMytLaGJ0VUVkZlgwVkdZU2VjcDF2eVJYZ2MvV1FqSzdkTEJqOTAveHYKU3NQSVRiTDNjVktPSFNHSUJkWCs0UDM3T1c2UzJqeWlWWDl0WUpaZXYxc05mK0Q0bkVxNW1rTVdVYWNGTlVybwpMOFZWWVFxc09oMUJTUmJrU2ZQUFI3TTcvSHN5Zk5YRUtkS0MrWXZ3TWt0aktWUVFoeXQ1Q1VtSFMvU2ttOHhoCnl4RGtVbVkvQWdNQkFBRUNnZ0VBWW1SVGVreCthTm5iME9XZ0JEQXF0eUhTeVVKMTVtV2JvbXJzS2VEVjBXdjYKczdYUVB4RFpsVUx1cVpWYzBvTGZKZjQvTXdqSk04Q2hObWtUeTM0TDAyTjE2L1BQSmhUVGNOcGNiZjkxMXM3Vwp0b2FuVkpZVC94MDcvc0dxR2oyR1BpcmVKdTkvc1cySTNpSUNUTmY4aG9kVjhzb0hyZVBjOUNaS0Q4eVVyWWZNCjRBWityTDVpRWdvSUZJcHFOczZoMEMvZ1JTb0FhUjBFQjVYQUF3dGl3eDZRcHpCMlR4SFhlVHhVbVNqekFZRU8KcFNyODlZVWNVRjFIL2NWMEhGZ2JZbG5QRDY5bHAwYXJrdjZLSHZEYUNiaUQrbnBtL3h0Yjl2RHM4SCtLSG05NQpGQkhKbGlnVlVjdnVmazlPUDllY1NXNzA5cXRsbitIMlpEbmxqSVNYeVFLQmdRRG9XcHlhNFhRVmFRVks5Tk9pCis3VC8xTThiNW1QM1h4akNGdGJsS3FMa21QMWxrY1VGN2RyeVpJK1ZjTHhVd2Q2OEpIcWttREZEL3RCU0d0Wm0KZG84UnQxVU9uU0lyZlo1Ri9sbUhhQUZ1ZmhPNDcwekpUWkk5eUc4WUR5bE1CbFhRMno1bDJOUEtOcWU5cSszMwpBQ09iT0Y1TG4zZjc4ck1IQ1BxbWdvd0lhUUtCZ1FEamljUC9QcHlpWlRqVTNoNzlwWTNENDZuczlxeEdWNXNsCitYSG94Sk9BajVRSjdoYmZkRllaN3JwUzBuQXRqVFdaTmFsNnpHRHNOajdRNkZvdi9Ed1pMRFRXSSsvczhzMEYKMTdocHhYUDMzMmNXa3VDTXdldEpOVEVNbXFpRkluVFc1Sk5GcTc2eEpzMXhQaThub1ZiZjRuT25ZWWpQSzBnZwpaaHM2anVKa1p3S0JnRWg4UkJDNU5ycWJLYkNKa2lCdFA3anp6YXlaZ2lRZ3dadUMvb1U5ZU5XeHVKTmdGMFBUClFST1BOWS9jUEpTQWFwanRGR21XcFAvZVZXVFh4SHp3alk5c1R4ZWhBNURudm1GOWlMYUtSckFPbXQ1OW9NbkgKN2xCaDMrNTBoR0NZTlZ0VG1qS3hvdGlabGxqQWN4czBLdWQ0ZlVwQU5IRWY5S1BFTkZXUHNsbkpBb0dBWG56awpMa2VDNWhFZ3M0ejEwNkQvS055T3dQK0NkTWVHZnhPQ0VRWW90cGRwQTJLaWp2S1JtcjAvRkl1YzE5MnU1MHVZCmNJMFVwcUswSFM2UDNTTmlsWlY4NzN3Rzh4KzBzZnR0OGtaenJQaFJwOWNnZG5ORTBLYk5FbzNhODBabXZLSTQKNGhLNjRuZlprbkFmUnRiQjY4RHZCQkFGcnZvclBvRUlSNTMwTjNzQ2dZQVlid1BNZTEwZjhxWWFQcU5aN2NkbAo5ZmRib20wcFRodE0yMjRSLytLQ1JWUHYxWEhRMEtXTzEzWVFZb21PbkcxODNlWGZjL2VVZVdGZmdJT2t4bGJCCmVhUDBqb21uRFJyd2RuVTcyZjlzVDR4WnZ6bmNWQVNjZFl6dWo2eHFRRmFIT2JybUNaUTA3NUVTRFNBaUczYXIKaVRBMEdiUDN5QkF0V1pjV3BnS1hrZz09Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K";
const validTestPublicKeyBase64 =
  "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF6b1ZqUDlVc3FxZTdQL0Z5TnNkWgpPa0QrRDhiYzRPMFFsU1M5ZS84eHF0SEZicTJEbXNCOS9HdlpNTDBuTmVCOUZ4N0VwVjlzNmtxNWw0RzRycFpTCmZDclRYMVRFQlFpdzZoUVcrZlhuMzJnUnlWbEtIY3hnUDhQZ3d3emdFNXZjcVBUcjl0amIrQmNDT1NsK2pjRUkKK2x5eGJTWDhTUVFnZS82b04vaW9XN1ZCSFgxOUZSbUVubktkYjhrVjRIUDFrSXl1M1N3WS9kUDhiMHJEeUUyeQo5M0ZTamgwaGlBWFYvdUQ5K3psdWt0bzhvbFYvYldDV1hyOWJEWC9nK0p4S3VacERGbEduQlRWSzZDL0ZWV0VLCnJEb2RRVWtXNUVuenowZXpPL3g3TW56VnhDblNndm1MOERKTFl5bFVFSWNyZVFsSmgwdjBwSnZNWWNzUTVGSm0KUHdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==";

describe("JWT Utility", () => {
  const payload = { userId: "123" };

  beforeEach(() => {
    mockedEnvironmentConfig.jwtAccessPrivateKey = validTestPrivateKeyBase64;
    mockedEnvironmentConfig.jwtAccessPublicKey = validTestPublicKeyBase64;
    mockedEnvironmentConfig.jwtRefreshPrivateKey = validTestPrivateKeyBase64;
    mockedEnvironmentConfig.jwtRefreshPublicKey = validTestPublicKeyBase64;
    vi.clearAllMocks();
  });

  it("signs with a valid key", () => {
    const token = jwtUtil.signJsonWebToken(
      payload,
      "jwtAccessPrivateKey",
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
    "signing with malformed key '%s' should return null",
    (badKey) => {
      mockedEnvironmentConfig.jwtAccessPrivateKey = badKey;

      const result = jwtUtil.signJsonWebToken(
        payload,
        "jwtAccessPrivateKey",
        { expiresIn: "1h" },
        mockLogger,
      );

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    },
  );

  it("verifies a valid JWT and returns payload", () => {
    const token = jwtUtil.signJsonWebToken(
      payload,
      "jwtAccessPrivateKey",
      { expiresIn: "1h" },
      mockLogger,
    ) as string;

    const result = jwtUtil.verifyJsonWebToken<{ userId: string }>(
      token,
      "jwtAccessPublicKey",
      mockLogger,
    );

    expect(result).toBeDefined();
    expect(result?.userId).toBe("123");
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it("returns null for an invalid token and logs an error", () => {
    const invalidToken = "this.is.not.valid";

    const result = jwtUtil.verifyJsonWebToken(
      invalidToken,
      "jwtAccessPublicKey",
      mockLogger,
    );

    expect(result).toBeNull();
    expect(mockLogger.error).toHaveBeenCalledOnce();
  });

  it("returns null if token is signed with a different key", () => {
    // Sign with a different key (simulating attacker or misconfig)
    const otherPrivateKey = validTestPrivateKeyBase64.replaceAll("0", "G");
    mockedEnvironmentConfig.jwtAccessPrivateKey = otherPrivateKey;
    const forgedToken = jwtUtil.signJsonWebToken(
      payload,
      "jwtAccessPrivateKey",
      { expiresIn: "1h" },
      mockLogger,
    ) as string;

    // Now verify with original (wrong) public key
    mockedEnvironmentConfig.jwtAccessPublicKey = validTestPublicKeyBase64;

    const result = jwtUtil.verifyJsonWebToken(
      forgedToken,
      "jwtAccessPublicKey",
      mockLogger,
    );

    expect(result).toBeNull();
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
