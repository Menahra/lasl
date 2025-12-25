import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@lasl/app-contracts/schemas/user";
import { type _t, Trans, useLingui } from "@lingui/react/macro";
import { useForm } from "react-hook-form";
import {
  type RegisterFormField,
  type RegisterFormValues,
  registerFormFields,
} from "@/src/app/pages/register-page/registerFormFields.ts";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./RegisterForm.css";

const resolvePlaceholder = (
  field: RegisterFormField<RegisterFormValues>,
  t: typeof _t,
): string => {
  // biome-ignore lint/security/noSecrets: just a field name
  if ("placeholderId" in field) {
    return t({ id: field.placeholderId });
  }

  return field.defaultPlaceholder;
};

export const RegisterForm = () => {
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createUserSchema),
    mode: "onSubmit",
  });
  const translateFormFieldError = useTranslateFormFieldError(userErrorMessages);

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
      {registerFormFields.map((field) => (
        <FormInputField
          key={String(field.name)}
          id={String(field.name)}
          type={field.type}
          label={linguiTranslator({ id: field.labelId })}
          placeholder={resolvePlaceholder(field, linguiTranslator)}
          loading={isLoading}
          {...register(field.name)}
          error={translateFormFieldError(errors[field.name])}
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
          loading={isSubmitting}
        >
          <Trans>Create Account</Trans>
        </Button>
      </Skeleton>
    </form>
  );
};
