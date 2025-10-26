import {
  setupFastifyTestEnvironment,
  teardownFastifyTestEnvironment,
} from "@lasl/test-utils-fastify/setup-utils";
import argon2 from "argon2";
import mongoose from "mongoose";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { buildApp } from "@/src/app.ts";
import { UserModel } from "@/src/model/user.model.ts";
import { mockUserData } from "../__mocks__/user.mock.ts";

vi.mock("nanoid", () => ({
  nanoid: () =>
    [...new Array(30)].map(() => Math.random().toString(36)[2]).join(""),
}));

describe("User Model", () => {
  beforeAll(async () => {
    await setupFastifyTestEnvironment({ buildApp, useMongo: true });
  });

  afterAll(async () => {
    await teardownFastifyTestEnvironment();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  describe("User model creation", () => {
    it("should create and save a user successfully", async () => {
      const user = new UserModel(mockUserData);
      await user.save();

      const found = await UserModel.findOne({
        email: mockUserData.email,
      }).lean();

      expect(found).toBeTruthy();
      expect(found?.email).toBe(mockUserData.email);
      expect(found?.firstName).toBe(mockUserData.firstName);
      expect(found?.password).not.toBe(mockUserData.password); // Password should be hashed
      expect(found?.verified).toBe(false); // default
      expect(found?.verificationCode).toBeDefined();
    });

    it.each(["email", "firstName", "lastName", "password"])(
      "should require %s field",
      async (fieldName) => {
        const userData = {
          ...mockUserData,
          [fieldName]: undefined,
        };

        const user = new UserModel(userData);

        await expect(user.save()).rejects.toThrow();
      },
    );
  });

  describe("Email Validation", () => {
    it("should convert email to lowercase", async () => {
      const userData = {
        ...mockUserData,
        email: mockUserData.email.toUpperCase(),
      };

      const user = new UserModel(userData);
      const savedUser = await user.save();

      expect(savedUser.email).toBe(mockUserData.email.toLowerCase());
    });

    it("should enforce unique email constraint", async () => {
      const user1 = new UserModel(mockUserData);
      await user1.save();
      await UserModel.createIndexes();

      const user2 = new UserModel({
        ...mockUserData,
        firstName: "Jane",
      });

      // biome-ignore lint/performance/useTopLevelRegex: okay in test
      await expect(user2.save()).rejects.toThrow(/duplicate key error/);
    });
  });

  describe("Password hashing", () => {
    it("should hash the password when saving a new user", async () => {
      const user = new UserModel(mockUserData);
      await user.save();

      // Find the user in the database
      const savedUser = await UserModel.findById(user._id);
      expect(savedUser).toBeDefined();

      if (savedUser) {
        // Expect the saved password to be different from the original mock password
        expect(savedUser.password).not.toBe(mockUserData.password);
        // Verify that the saved password is a valid argon2 hash of the original password
        const isPasswordCorrect = await argon2.verify(
          savedUser.password,
          mockUserData.password,
        );
        expect(isPasswordCorrect).toBe(true);
      }
    });

    it("should not rehash password if not modified", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();
      const originalHashedPassword = savedUser.password;

      // Update non-password field
      savedUser.firstName = "Johnny";
      const updatedUser = await savedUser.save();

      expect(updatedUser.password).toBe(originalHashedPassword);
    });

    it("should rehash password when password is modified", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();
      const originalHashedPassword = savedUser.password;

      // Update password
      savedUser.password = "newPassword456";
      const updatedUser = await savedUser.save();

      expect(updatedUser.password).not.toBe(originalHashedPassword);

      // Verify new password
      const isValid = await argon2.verify(
        updatedUser.password,
        "newPassword456",
      );
      expect(isValid).toBe(true);
    });
  });

  describe("Default Values", () => {
    it("should generate verificationCode by default", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();

      expect(savedUser.verificationCode).toBeDefined();
      expect(typeof savedUser.verificationCode).toBe("string");
      expect(savedUser.verificationCode.length).toBeGreaterThan(0);
    });

    it("should set verified to false by default", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();

      expect(savedUser.verified).toBe(false);
    });

    it("should set passwordResetCode to null by default", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();

      expect(savedUser.passwordResetCode).toBeNull();
    });

    it("should generate unique verificationCodes for different users", async () => {
      const user1Data = {
        email: "test1@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
      };

      const user2Data = {
        email: "test2@example.com",
        firstName: "Jane",
        lastName: "Smith",
        password: "password456",
      };

      const user1 = new UserModel(user1Data);
      const user2 = new UserModel(user2Data);

      const savedUser1 = await user1.save();
      const savedUser2 = await user2.save();

      expect(savedUser1.verificationCode).not.toBe(savedUser2.verificationCode);
    });
  });

  describe("Timestamps", () => {
    it("should have createdAt and updatedAt timestamps", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();

      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
      expect(savedUser.createdAt).toBeInstanceOf(Date);
      expect(savedUser.updatedAt).toBeInstanceOf(Date);
    });

    it("should update updatedAt when document is modified", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();
      const originalUpdatedAt = savedUser.updatedAt;

      // Wait a moment to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 1));

      savedUser.firstName = "Johnny";
      const updatedUser = await savedUser.save();

      expect(updatedUser.updatedAt?.getTime()).toBeGreaterThan(
        originalUpdatedAt?.getTime() ?? 0,
      );
    });
  });

  describe("Field Updates", () => {
    it("should allow updating verified status", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();

      expect(savedUser.verified).toBe(false);

      savedUser.verified = true;
      const updatedUser = await savedUser.save();

      expect(updatedUser.verified).toBe(true);
    });

    it("should allow setting passwordResetCode", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();

      expect(savedUser.passwordResetCode).toBeNull();

      savedUser.passwordResetCode = "reset123";
      const updatedUser = await savedUser.save();

      expect(updatedUser.passwordResetCode).toBe("reset123");
    });
  });

  describe("validating password", () => {
    it("should validate a correct password", async () => {
      const plainPassword = "SecurePass123";

      const user = new UserModel({
        ...mockUserData,
        password: plainPassword,
      });

      await user.save();

      const foundUser = await UserModel.findOne({ email: "test@example.com" });

      expect(foundUser).toBeTruthy();

      // biome-ignore lint/style/noNonNullAssertion: we checked above that it is not null
      const isValid = await foundUser!.validatePassword(plainPassword);
      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const plainPassword = "SecurePass123";

      const user = new UserModel({
        ...mockUserData,
        password: plainPassword,
      });

      await user.save();

      const foundUser = await UserModel.findOne({ email: "test@example.com" });

      expect(foundUser).toBeTruthy();

      // biome-ignore lint/style/noNonNullAssertion: we checked above that it is not null
      const isValid = await foundUser!.validatePassword("WrongPassword456");
      expect(isValid).toBe(false);
    });
  });

  describe("getJsonWebTokenPayload", () => {
    it("should only include email, id, firstName and lastName of the user", async () => {
      const user = new UserModel(mockUserData);
      const savedUser = await user.save();

      const jsonWebTokenPayload = savedUser.getJsonWebTokenPayload();
      const expectedKeys = ["id", "email", "firstName", "lastName"];
      const actualKeys = Object.keys(jsonWebTokenPayload);

      expect(actualKeys.sort()).toEqual(expectedKeys.sort());
    });
  });
});
