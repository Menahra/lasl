import { Trans, useLingui } from "@lingui/react/macro";
import type { FormEvent } from "react";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./styles.css";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";

export const RegisterForm = () => {
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const handleRegisterFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className="RegisterFormWrapper" onSubmit={handleRegisterFormSubmit}>
      <FormInputField
        id="firstname"
        label={linguiTranslator`First Name`}
        placeholder={linguiTranslator`Enter your first name`}
        type="text"
        loading={isLoading}
      />
      <FormInputField
        id="lastname"
        label={linguiTranslator`Last Name`}
        placeholder={linguiTranslator`Enter your last name`}
        type="text"
        loading={isLoading}
      />
      <FormInputField
        id="email"
        label={linguiTranslator`Email`}
        placeholder="student@example.com"
        type="email"
        loading={isLoading}
      />
      <FormInputField
        id="password"
        label={linguiTranslator`Password`}
        placeholder={linguiTranslator`Enter your password`}
        type="password"
        loading={isLoading}
      />
      <FormInputField
        id="passwordConfirmation"
        label={linguiTranslator`Confirm Password`}
        placeholder={linguiTranslator`Confirm your password`}
        type="password"
        loading={isLoading}
      />
      <Skeleton loading={isLoading} height={16} width="100%">
        <p>
          <Trans>
            By signing up, you agree to our{" "}
            <TextLink to={ROUTE_TERMS_OF_SERVICE} variant="primary">
              <Trans>Terms of Service</Trans>
            </TextLink>{" "}
            and{" "}
            <TextLink to="/privacypolicy" variant="primary">
              <Trans>Privacy Policy</Trans>
            </TextLink>
            .
          </Trans>
        </p>
      </Skeleton>
      <Button variant="primary" type="submit">
        <Trans>Create Account</Trans>
      </Button>
    </form>
  );
};
