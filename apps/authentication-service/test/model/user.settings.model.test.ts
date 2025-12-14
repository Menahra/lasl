import { buildApp } from "@/src/app.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { mockUserData } from "@/test/__mocks__/user.mock.ts";
import { DEFAULT_LOCALE } from "@lasl/app-contracts/locales";
import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import mongoose from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok in test
describe("User Settings model", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  it("should have default settings when not provided", async () => {
    const user = new UserModel(mockUserData);
    const savedUser = await user.save();

    expect(savedUser.settings.darkMode).toBe(false);
    expect(savedUser.settings.uiLanguage).toBe(DEFAULT_LOCALE);
    expect(savedUser.settings.contentLanguage).toBe(DEFAULT_LOCALE);
  });

  it("should allow overriding settings at creation", async () => {
    const userData = {
      ...mockUserData,
      settings: {
        darkMode: true,
        uiLanguage: "de-DE",
        contentLanguage: "fr-FR",
      },
    };
    const user = new UserModel(userData);
    const savedUser = await user.save();

    expect(savedUser.settings.darkMode).toBe(true);
    expect(savedUser.settings.uiLanguage).toBe("de-DE");
    expect(savedUser.settings.contentLanguage).toBe("fr-FR");
  });

  it("should persist updated settings", async () => {
    const user = new UserModel(mockUserData);
    const savedUser = await user.save();

    savedUser.settings.darkMode = true;
    savedUser.settings.uiLanguage = "fr-FR";
    savedUser.settings.contentLanguage = "de-DE";
    const updatedUser = await savedUser.save();

    expect(updatedUser.settings.darkMode).toBe(true);
    expect(updatedUser.settings.uiLanguage).toBe("fr-FR");
    expect(updatedUser.settings.contentLanguage).toBe("de-DE");
  });

  it("should reject invalid enum values for ui language", async () => {
    const userData = {
      ...mockUserData,
      settings: {
        darkMode: true,
        uiLanguage: "invalid",
      },
    };
    const user = new UserModel(userData);

    await expect(user.save()).rejects.toThrow();
  });
  it("should reject invalid enum values for content language", async () => {
    const userData = {
      ...mockUserData,
      settings: {
        darkMode: true,
        contentLanguage: "invalid",
      },
    };
    const user = new UserModel(userData);

    await expect(user.save()).rejects.toThrow();
  });
});
