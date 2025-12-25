import {
  USER_ERRORS,
  type UserErrorKey,
} from "@lasl/app-contracts/errors/user";
import { USER_PASSWORD_MIN_LENGTH } from "@lasl/app-contracts/schemas/user";
import { type MacroMessageDescriptor, msg } from "@lingui/core/macro";

export const userErrorMessages: Record<UserErrorKey, MacroMessageDescriptor> = {
  [USER_ERRORS.emailInvalid]: msg`Please enter a valid email address`,
  [USER_ERRORS.firstNameRequired]: msg`First name is required`,
  [USER_ERRORS.lastNameRequired]: msg`Last name is required`,
  [USER_ERRORS.passwordConfirmationRequired]: msg`Password confirmation is required`,
  [USER_ERRORS.passwordLowercase]: msg`Password must contain at least one lowercase letter`,
  [USER_ERRORS.passwordMinLength]: msg`Password must be at least ${USER_PASSWORD_MIN_LENGTH} characters long`,
  [USER_ERRORS.passwordMismatch]: msg`Passwords do not match`,
  [USER_ERRORS.passwordNumber]: msg`Password must contain at least one number`,
  [USER_ERRORS.passwordRequired]: msg`Password is required`,
  [USER_ERRORS.passwordUppercase]: msg`Password must contain at least one uppercase letter`,
};
