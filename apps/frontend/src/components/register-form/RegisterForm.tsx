import { Trans, useLingui } from "@lingui/react/macro";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import "./styles.css";
import type { FormEvent } from "react";

export const RegisterForm = () => {
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
      />
      <FormInputField
        id="lastname"
        label={linguiTranslator`Last Name`}
        placeholder={linguiTranslator`Enter your last name`}
        type="text"
      />
      <FormInputField
        id="email"
        label={linguiTranslator`Email`}
        placeholder="student@example.com"
        type="email"
      />
      <FormInputField
        id="password"
        label={linguiTranslator`Password`}
        placeholder={linguiTranslator`Enter your password`}
        type="password"
      />
      <FormInputField
        id="passwordConfirmation"
        label={linguiTranslator`Confirm Password`}
        placeholder={linguiTranslator`Confirm your password`}
        type="password"
      />
      <p>
        <Trans>
          By signing up, you agree to our{" "}
          <TextLink to="/termsofservice" variant="primary">
            <Trans>Terms of Service</Trans>
          </TextLink>{" "}
          and{" "}
          <TextLink to="/privacypolicy" variant="primary">
            <Trans>Privacy Policy</Trans>
          </TextLink>
          .
        </Trans>
      </p>
      <button className="RegisterFormSubmitButton" type="submit">
        <Trans>Create Account</Trans>
      </button>
    </form>
  );
};
