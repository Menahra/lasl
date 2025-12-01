import { Trans, useLingui } from "@lingui/react/macro";
import type { FormEvent } from "react";
import { ROUTE_SIGN_UP } from "@/src/routes/register.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import "./styles.css";

export const LoginForm = () => {
  const { t: linguiTranslator } = useLingui();
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="LoginFormCardWrapper">
      <div className="LoginFormCardHeader">
        <h3 className="LoginFormCardTitle">
          <Trans>Welcome back</Trans>
        </h3>
        <p className="LoginFormCardSubTitle">
          <Trans>Sign in to enhance your learning</Trans>
        </p>
      </div>
      <form onSubmit={handleFormSubmit} className="LoginForm">
        <FormInputField
          id="email"
          type="email"
          placeholder="student@example.com"
          label={linguiTranslator`Email`}
        />
        <FormInputField
          id="password"
          type="password"
          placeholder={linguiTranslator`Enter your password`}
          label={linguiTranslator`Password`}
        />
        <button className="LoginFormSubmitButton" type="submit">
          <Trans>Sign In</Trans>
        </button>
      </form>
      <div className="LoginFormCardFooter">
        <p>
          <Trans>Don't have an account yet?</Trans>
        </p>
        <TextLink to={ROUTE_SIGN_UP} variant="accent">
          <Trans>Sign Up</Trans>
        </TextLink>
      </div>
    </div>
  );
};
