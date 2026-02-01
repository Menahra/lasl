import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@lasl/app-contracts/schemas/user";
import { useLingui as useRuntimeLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getRegisterFormFields,
  type RegisterFormValues,
} from "@/src/app/pages/register/register-page/registerFormFields.ts";
import { ROUTE_SIGN_UP_SUCCESS } from "@/src/app/routes/_auth/register/success.tsx";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
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
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { useCreateUser } from "@/src/shared/hooks/api/useCreateUser.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./RegisterForm.css";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok here
export const RegisterForm = () => {
  const [registrationError, setRegistrationError] = useState<{
    type: AuthFormSystemError;
    wait?: AuthFromErrorCalloutProps["retryAfter"];
  }>({ type: "none" });
  const { isLoading } = useI18nContext();
  const { i18n } = useRuntimeLingui();
  const { navigate } = useRouter();
  const createUserMutation = useCreateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit",
  });
  const translateFormFieldError = useTranslateFormFieldError(userErrorMessages);

  const onSubmit = async (data: RegisterFormValues) => {
    setRegistrationError({ type: "none" });

    try {
      await createUserMutation.mutateAsync(data);
      navigate({ to: ROUTE_SIGN_UP_SUCCESS });
    } catch (error) {
      const errorDetail = getAuthFormErrorType(error);
      setRegistrationError({
        ...errorDetail,
        type:
          errorDetail.type === "unverified" ? "duplicate" : errorDetail.type,
      });
    }
  };

  return (
    <div className="RegisterForm">
      <AuthFormErrorCallout
        error={registrationError.type}
        retryAfter={registrationError.wait}
        onClose={() => setRegistrationError({ type: "none" })}
      />
      <form
        className="RegisterFormWrapper"
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
      >
        {getRegisterFormFields().map(({ name, label, placeholder, type }) => (
          <FormInputField
            key={name}
            id={name}
            type={type}
            label={i18n._(label)}
            placeholder={i18n._(placeholder)}
            loading={isLoading}
            {...register(name)}
            error={translateFormFieldError(errors[name])}
          />
        ))}

        <Skeleton loading={isLoading} height={16} width="100%">
          <p>
            <Trans>
              By signing up, you agree to our{" "}
              <TextLink to={ROUTE_TERMS_OF_SERVICE} variant="primary">
                <Trans>Terms of Service</Trans>
              </TextLink>{" "}
              and{" "}
              <TextLink to={ROUTE_PRIVACY_POLICY} variant="primary">
                <Trans>Privacy Policy</Trans>
              </TextLink>
              .
            </Trans>
          </p>
        </Skeleton>
        <Skeleton loading={isLoading} height={48} width="100%">
          <Button
            variant="primary"
            type="submit"
            align="center"
            loading={createUserMutation.isPending}
          >
            <Trans>Create Account</Trans>
          </Button>
        </Skeleton>
      </form>
    </div>
  );
};
