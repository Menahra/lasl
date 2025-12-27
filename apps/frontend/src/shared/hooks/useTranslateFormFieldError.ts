import type { MacroMessageDescriptor } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import type { FieldError } from "react-hook-form";

export type ErrorKeyMap = Record<string, MacroMessageDescriptor>;

export const useTranslateFormFieldError = <T extends ErrorKeyMap>(
  errorMap: T,
) => {
  const { i18n } = useLingui();

  return (error?: FieldError): string | undefined => {
    if (!error?.message) {
      return undefined;
    }

    const messageDescriptor = errorMap[error.message as keyof T];

    return messageDescriptor ? i18n._(messageDescriptor) : error.message;
  };
};
