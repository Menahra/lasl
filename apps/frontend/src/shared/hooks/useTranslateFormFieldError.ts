import type { MacroMessageDescriptor } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import type { FieldError } from "react-hook-form";

export type ErrorKeyMap = Record<string, MacroMessageDescriptor>;

export const useTranslateFormFieldError = <T extends ErrorKeyMap>(
  errorMap: T,
) => {
  const { t: linguiTranslator } = useLingui();

  return (error?: FieldError): string | undefined => {
    if (!error?.message) {
      return undefined;
    }

    const messageDescriptor = errorMap[error.message as keyof T];

    return messageDescriptor
      ? linguiTranslator(messageDescriptor)
      : error.message;
  };
};
