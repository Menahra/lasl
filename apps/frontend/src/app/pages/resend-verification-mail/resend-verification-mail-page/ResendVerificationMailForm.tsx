import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@lasl/app-contracts/schemas/user";
import { Trans, useLingui } from "@lingui/react/macro";
import { type NavigateOptions, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ROUTE_RESEND_VERIFICATION_MAIL_SENT } from "@/src/app/routes/resend-verification-mail/sent.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Callout } from "@/src/shared/components/callout/Callout.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { usePostResendVerificationMail } from "@/src/shared/hooks/api/useAuthentication.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./ResendVerificationMailForm.css";

const resendVerificationMailSchema = createUserSchema.pick({ email: true });
type ResendVerificationMailFormValues = z.infer<
  typeof resendVerificationMailSchema
>;

export const ResendVerificationMailForm = () => {
  const [resendVerificationMailError, setResendVerificationMailError] =
    useState(false);
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
    setResendVerificationMailError(false);

    try {
      await resendVerificationMailMutation.mutateAsync(data.email);
      navigate({
        to: ROUTE_RESEND_VERIFICATION_MAIL_SENT,
        state: { email: data.email },
      } as NavigateOptions);
    } catch (_error) {
      setResendVerificationMailError(true);
    }
  };

  return (
    <div className="ResendVerificationMailForm">
      {resendVerificationMailError ? (
        <Skeleton loading={isLoading} width="100%" height={34}>
          <Callout
            severity="error"
            variant="outlined"
            onClose={() => setResendVerificationMailError(false)}
          >
            <Trans>An unexpected error occurred. Please try again.</Trans>
          </Callout>
        </Skeleton>
      ) : undefined}

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
