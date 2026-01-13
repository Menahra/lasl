import { describe, expect, it } from "vitest";
import { UserModel } from "@/src/model/user.model.ts";
import { serializeUser } from "@/src/serializer/user.serializer.ts";
import { mockUserDataWithSettings } from "@/test/__mocks__/user.mock.ts";

describe("serializeUser", () => {
  it("should serialize all expected fields", () => {
    const user = new UserModel(mockUserDataWithSettings);
    const serialized = serializeUser(user);

    expect(serialized).toEqual({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      settings: {
        contentLanguage: mockUserDataWithSettings.settings.contentLanguage,
        darkMode: mockUserDataWithSettings.settings.darkMode,
        uiLanguage: mockUserDataWithSettings.settings.uiLanguage,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it("should omit createdAt/updatedAt if undefined", () => {
    const user = new UserModel(mockUserDataWithSettings);
    const serialized = serializeUser(user);

    expect(serialized.createdAt).toBeUndefined();
    expect(serialized.updatedAt).toBeUndefined();

    expect(serialized).toMatchObject({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      settings: mockUserDataWithSettings.settings,
    });
  });

  it("should not include sensitive fields", () => {
    const user = new UserModel(mockUserDataWithSettings);
    const serialized = serializeUser(user);

    expect(serialized).not.toHaveProperty("password");
    expect(serialized).not.toHaveProperty("verificationCode");
    expect(serialized).not.toHaveProperty("passwordResetCode");
    expect(serialized).not.toHaveProperty("verified");
    expect(serialized).not.toHaveProperty("validatePassword");
  });
});
