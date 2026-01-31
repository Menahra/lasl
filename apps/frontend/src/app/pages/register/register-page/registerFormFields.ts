import type { createUserSchemaBase } from "@lasl/app-contracts/schemas/user";
import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import type { z } from "zod";

export type RegisterFormField<T> = {
  name: keyof T;
  type: "text" | "email" | "password";
  label: MessageDescriptor;
  placeholder: MessageDescriptor;
};

export type RegisterFormValues = z.infer<typeof createUserSchemaBase>;

export const getRegisterFormFields =
  (): RegisterFormField<RegisterFormValues>[] => [
    {
      name: "firstName",
      type: "text",
      label: msg`First Name`,
      placeholder: msg`Enter your first name`,
    },
    {
      name: "lastName",
      type: "text",
      label: msg`Last Name`,
      placeholder: msg`Enter your last name`,
    },
    {
      name: "email",
      type: "email",
      label: msg`Email`,
      placeholder: msg`student@example.com`,
    },
    {
      name: "password",
      type: "password",
      label: msg`Password`,
      placeholder: msg`Enter your password`,
    },
    {
      name: "passwordConfirmation",
      type: "password",
      label: msg`Confirm Password`,
      placeholder: msg`Confirm your password`,
    },
  ];
