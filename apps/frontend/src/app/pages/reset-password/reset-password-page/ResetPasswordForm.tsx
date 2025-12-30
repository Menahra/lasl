import { zodResolver } from "@hookform/resolvers/zod";
import { userPasswordWithConfirmationAndRefinementSchema } from "@lasl/app-contracts/schemas/user";
import { Trans, useLingui } from "@lingui/react/macro";
import { type NavigateOptions, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ROUTE_FORGOT_PASSWORD_SENT } from "@/src/app/routes/forgot-password/sent.tsx";
import { Route } from "@/src/app/routes/reset-password/$id/$passwordResetCode/index.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { usePostResetPassword } from "@/src/shared/hooks/api/useAuthentication.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./ResetPasswordForm.css";

type ResetPasswordSchema = z.infer<
  typeof userPasswordWithConfirmationAndRefinementSchema
>;

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok here
export const ResetPasswordForm = () => {
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const { navigate } = useRouter();
  const translateFormFieldError = useTranslateFormFieldError(userErrorMessages);
  const resetPasswordMutation = usePostResetPassword();

  const { id, passwordResetCode } = Route.useParams();

  const onSubmit = async (data: ResetPasswordSchema) => {
    await resetPasswordMutation.mutateAsync({ id, passwordResetCode, ...data });
    navigate({
      to: ROUTE_FORGOT_PASSWORD_SENT,
      state: { email: data.email },
    } as NavigateOptions);
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
