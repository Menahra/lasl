import { zodResolver } from "@hookform/resolvers/zod";
import { userEmailSchema } from "@lasl/app-contracts/schemas/user";
import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { usePostForgotPassword } from "@/src/shared/hooks/api/useAuthentication.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./ForgotPasswordForm.css";

const forgotPasswordSchema = z.object({
  email: userEmailSchema,
});
type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const translateFormFieldError = useTranslateFormFieldError(userErrorMessages);
  const forgotPasswordMutation = usePostForgotPassword();

  const onSubmit = async (data: ForgotPasswordSchema) => {
    await forgotPasswordMutation.mutateAsync(data.email);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onSubmit",
  });

  return (
    <div className="ForgotPasswordFormCardWrapper">
      <div className="ForgotPasswordFormCardHeader">
        <Skeleton
          loading={isLoading}
          width={180}
          height={35}
          margin="0 0 var(--space-sm) 0"
        >
          <h3 className="ForgotPasswordFormCardTitle">
            <Trans>Forgot password?</Trans>
          </h3>
        </Skeleton>
        <Skeleton loading={isLoading} width={330} height={22}>
          <p className="ForgotPasswordFormCardSubTitle">
            <Trans>
              Enter your email and we'll send you reset instructions
            </Trans>
          </p>
        </Skeleton>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="ForgotPasswordForm"
        noValidate={true}
      >
        <FormInputField
          {...register("email")}
          id="email"
          type="email"
          placeholder={linguiTranslator`student@example.com`}
          label={linguiTranslator`Email`}
          loading={isLoading}
          error={translateFormFieldError(errors.email)}
        />
        <Skeleton loading={isLoading} width="100%" height={40}>
          <Button
            type="submit"
            align="center"
            loading={forgotPasswordMutation.isPending}
          >
            <Trans>Send reset link</Trans>
          </Button>
        </Skeleton>
      </form>

      <div className="ForgotPasswordFormBackButton">
        <Skeleton loading={isLoading} width={150} height={26}>
          <Button align="center" variant="text" startIcon={<ArrowLeftIcon />}>
            <Trans>Back to sign in</Trans>
          </Button>
        </Skeleton>
      </div>
    </div>
  );
};
