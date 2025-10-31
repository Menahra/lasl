/** biome-ignore-all lint/correctness/noProcessGlobal: ok in test */
/** biome-ignore-all lint/style/noMagicNumbers: acceptable in tests */
import { describe, expect, it } from "vitest";
import {
  ENVIRONMENT,
  getEnvironmentConfig,
} from "@/src/config/environment.config.ts";

describe("Environment Config", () => {
  it("should parse defaults when env variables are missing", () => {
    const config = getEnvironmentConfig();
    expect(config[ENVIRONMENT.port]).toBe(3000);
    expect(config[ENVIRONMENT.applicationHostPort]).toBe(8080);
  });

  it("should throw if authentication service url is missing", () => {
    const original = process.env[ENVIRONMENT.authenticationServiceUrl];
    delete process.env[ENVIRONMENT.authenticationServiceUrl];
    expect(() => getEnvironmentConfig()).toThrow();
    process.env[ENVIRONMENT.authenticationServiceUrl] = original;
  });

  it("should parse overridden environment variables correctly", () => {
    process.env[ENVIRONMENT.port] = "4000";
    process.env[ENVIRONMENT.authenticationServiceUrl] = "http://auth:3000";
    const config = getEnvironmentConfig();
    expect(config[ENVIRONMENT.port]).toBe(4000);
    expect(config[ENVIRONMENT.authenticationServiceUrl]).toBe(
      "http://auth:3000",
    );
  });
});
