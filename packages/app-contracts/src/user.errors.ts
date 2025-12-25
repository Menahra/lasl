export const USER_ERRORS = {
  firstNameRequired: "errors.user.firstName.required",
  lastNameRequired: "errors.user.lastName.required",
  emailInvalid: "errors.user.email.invalid",
  passwordConfirmationRequired: "errors.user.passwordConfirmation.required",
  passwordRequired: "errors.user.password.required",
  passwordMinLength: "errors.user.password.minLength",
  passwordUppercase: "errors.user.password.uppercase",
  passwordLowercase: "errors.user.password.lowercase",
  passwordNumber: "errors.user.password.number",
  passwordMismatch: "errors.user.password.mismatch",
} as const;

export type UserErrorKey = (typeof USER_ERRORS)[keyof typeof USER_ERRORS];
