import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@lasl/app-contracts/schemas/user";
import { Trans, useLingui } from "@lingui/react/macro";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./RegisterForm.css";

type RegisterFormValues = z.infer<typeof createUserSchema>;

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: <explanation>
export const RegisterForm = () => {
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit", // or "onBlur"
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log(data);
    // send to backend
  };

  return (
    <form
      className="RegisterFormWrapper"
      onSubmit={handleSubmit(onSubmit)}
      noValidate={true}
    >
      <FormInputField
        id="firstName"
        label={linguiTranslator`First Name`}
        placeholder={linguiTranslator`Enter your first name`}
        type="text"
        loading={isLoading}
        {...register("firstName")}
        error={errors.firstName}
      />
      <FormInputField
        id="lastName"
        label={linguiTranslator`Last Name`}
        placeholder={linguiTranslator`Enter your last name`}
        type="text"
        loading={isLoading}
        {...register("lastName")}
        error={errors.lastName}
      />
      <FormInputField
        id="email"
        label={linguiTranslator`Email`}
        placeholder="student@example.com"
        type="email"
        loading={isLoading}
        {...register("email")}
        error={errors.email}
      />
      <FormInputField
        id="password"
        label={linguiTranslator`Password`}
        placeholder={linguiTranslator`Enter your password`}
        type="password"
        loading={isLoading}
        {...register("password")}
        error={errors.password}
      />
      <FormInputField
        id="passwordConfirmation"
        label={linguiTranslator`Confirm Password`}
        placeholder={linguiTranslator`Confirm your password`}
        type="password"
        loading={isLoading}
        // biome-ignore lint/security/noSecrets: field name, no secret
        {...register("passwordConfirmation")}
        error={errors.passwordConfirmation}
      />
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
        <Button variant="primary" type="submit" align="center">
          <Trans>Create Account</Trans>
        </Button>
      </Skeleton>
    </form>
  );
};
