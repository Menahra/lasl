import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchemaBase } from "@lasl/app-contracts/schemas/user";
import { Trans, useLingui } from "@lingui/react/macro";
import { type NavigateOptions, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ROUTE_RESEND_VERIFICATION_MAIL_SENT } from "@/src/app/routes/_auth/resend-verification-mail/sent.tsx";
import {
  type AuthFormSystemError,
  getAuthFormErrorType,
} from "@/src/shared/authApiErrors.ts";
import {
  AuthFormErrorCallout,
  type AuthFromErrorCalloutProps,
} from "@/src/shared/components/auth-form-error-callout/AuthFormErrorCallout.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { usePostResendVerificationMail } from "@/src/shared/hooks/api/useAuthentication.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./ResendVerificationMailForm.css";

const resendVerificationMailSchema = createUserSchemaBase.pick({ email: true });
type ResendVerificationMailFormValues = z.infer<
  typeof resendVerificationMailSchema
>;

export const ResendVerificationMailForm = () => {
  const [resendVerificationMailError, setResendVerificationMailError] =
    useState<{
      type: AuthFormSystemError;
      wait?: AuthFromErrorCalloutProps["retryAfter"];
    }>({ type: "none" });
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const { navigate } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationMailFormValues>({
    resolver: zodResolver(resendVerificationMailSchema),
    mode: "onSubmit",
  });
  const translateFormFieldError = useTranslateFormFieldError(userErrorMessages);
  const resendVerificationMailMutation = usePostResendVerificationMail();

  const onSubmit = async (data: ResendVerificationMailFormValues) => {
    setResendVerificationMailError({ type: "none" });

    try {
      await resendVerificationMailMutation.mutateAsync(data.email);
      navigate({
        to: ROUTE_RESEND_VERIFICATION_MAIL_SENT,
        state: { email: data.email },
      } as NavigateOptions);
    } catch (error) {
      setResendVerificationMailError(getAuthFormErrorType(error));
    }
  };

  return (
    <div className="ResendVerificationMailForm">
      <AuthFormErrorCallout
        error={resendVerificationMailError.type}
        retryAfter={resendVerificationMailError.wait}
        onClose={() => setResendVerificationMailError({ type: "none" })}
      />

      <form
        className="ResendVerificationMailFormWrapper"
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
      >
        <FormInputField
          key="email"
          id="email"
          type="email"
          label={linguiTranslator`Email`}
          placeholder={linguiTranslator`Enter your email`}
          loading={isLoading}
          {...register("email")}
          error={translateFormFieldError(errors.email)}
        />
        <Skeleton loading={isLoading} height={48} width="100%">
          <Button
            variant="primary"
            type="submit"
            align="center"
            loading={resendVerificationMailMutation.isPending}
          >
            <Trans>Resend verification Email</Trans>
          </Button>
        </Skeleton>
      </form>
    </div>
  );
};
