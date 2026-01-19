import { zodResolver } from "@hookform/resolvers/zod";
import { userPasswordWithConfirmationAndRefinementSchema } from "@lasl/app-contracts/schemas/user";
import { Trans, useLingui } from "@lingui/react/macro";
import { useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Route } from "@/src/app/routes/_auth/reset-password/$id/$passwordResetCode/index.tsx";
import { ROUTE_RESET_PASSWORD_SENT } from "@/src/app/routes/_auth/reset-password/sent.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Callout } from "@/src/shared/components/callout/Callout.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { usePostResetPassword } from "@/src/shared/hooks/api/useAuthentication.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./ResetPasswordForm.css";

type ResetFormError = "none" | "internal" | "other";

type ResetPasswordSchema = z.infer<
  typeof userPasswordWithConfirmationAndRefinementSchema
>;

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok here
export const ResetPasswordForm = () => {
  const [resetError, setResetError] = useState<ResetFormError>("none");
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const { navigate } = useRouter();
  const translateFormFieldError = useTranslateFormFieldError(userErrorMessages);
  const resetPasswordMutation = usePostResetPassword();

  const { id, passwordResetCode } = Route.useParams();

  const onSubmit = async (data: ResetPasswordSchema) => {
    setResetError("none");
    try {
      await resetPasswordMutation.mutateAsync({
        id,
        passwordResetCode,
        ...data,
      });
      navigate({
        to: ROUTE_RESET_PASSWORD_SENT,
      });
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === StatusCodes.INTERNAL_SERVER_ERROR
      ) {
        setResetError("internal");
      } else {
        setResetError("other");
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(userPasswordWithConfirmationAndRefinementSchema),
    mode: "onSubmit",
  });

  return (
    <div className="ResetPasswordFormCardWrapper">
      {resetError !== "none" ? (
        <Skeleton loading={isLoading} width="100%" height={34}>
          <Callout
            severity="error"
            variant="outlined"
            onClose={() => setResetError("none")}
          >
            {resetError === "internal" ? (
              <Trans>An unexpected error occurred. Please try again.</Trans>
            ) : (
              <Trans>This password reset link is invalid or has expired.</Trans>
            )}
          </Callout>
        </Skeleton>
      ) : undefined}
      <div className="ResetPasswordFormCardHeader">
        <Skeleton
          loading={isLoading}
          width={180}
          height={35}
          margin="0 0 var(--space-sm) 0"
        >
          <h3 className="ResetPasswordFormCardTitle">
            <Trans>Set new password</Trans>
          </h3>
        </Skeleton>
        <Skeleton loading={isLoading} width={270} height={22}>
          <p className="ResetPasswordFormCardSubTitle">
            <Trans>Choose a strong password for your account</Trans>
          </p>
        </Skeleton>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="ResetPasswordForm"
        noValidate={true}
      >
        <FormInputField
          {...register("password")}
          id="password"
          type="password"
          placeholder={linguiTranslator`Enter your password`}
          label={linguiTranslator`Password`}
          loading={isLoading}
          error={translateFormFieldError(errors.password)}
        />
        <FormInputField
          // biome-ignore lint/security/noSecrets: field name
          {...register("passwordConfirmation")}
          id="passwordConfirmation"
          type="password"
          placeholder={linguiTranslator`Confirm your password`}
          label={linguiTranslator`Confirm Password`}
          loading={isLoading}
          error={translateFormFieldError(errors.passwordConfirmation)}
        />
        <Skeleton loading={isLoading} width="100%" height={40}>
          <Button
            type="submit"
            align="center"
            loading={resetPasswordMutation.isPending}
          >
            <Trans>Reset password</Trans>
          </Button>
        </Skeleton>
      </form>
    </div>
  );
};
