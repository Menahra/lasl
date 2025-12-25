import type { createUserSchema } from "@lasl/app-contracts/schemas/user";
import type { z } from "zod";

export type RegisterFormField<T> = {
  name: keyof T;
  type: "text" | "email" | "password";
  labelId: string; // lingui message id
} & (
  | {
      placeholderId: string; // lingui message id
      defaultPlaceholder?: never;
    }
  | {
      placeholderId?: never;
      defaultPlaceholder: string;
    }
);

export type RegisterFormValues = z.infer<typeof createUserSchema>;

export const registerFormFields: RegisterFormField<RegisterFormValues>[] = [
  {
    name: "firstName",
    type: "text",
    labelId: "First Name",
    placeholderId: "Enter your first name",
  },
  {
    name: "lastName",
    type: "text",
    labelId: "Last Name",
    placeholderId: "Enter your last name",
  },
  {
    name: "email",
    type: "email",
    labelId: "Email",
    defaultPlaceholder: "student@example.com",
  },
  {
    name: "password",
    type: "password",
    labelId: "Password",
    placeholderId: "Enter your password",
  },
  {
    // biome-ignore lint/security/noSecrets: field name, not a secret
    name: "passwordConfirmation",
    type: "password",
    labelId: "Confirm Password",
    placeholderId: "Confirm your password",
  },
];
