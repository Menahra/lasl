import { Trans, useLingui } from "@lingui/react/macro";
import type { FormEvent } from "react";
import { ROUTE_SIGN_UP } from "@/src/routes/register.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./styles.css";
import { Button } from "@/src/shared/components/button/Button.tsx";

export const LoginForm = () => {
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="LoginFormCardWrapper">
      <div className="LoginFormCardHeader">
        <Skeleton
          loading={isLoading}
          width={180}
          height={35}
          margin="0 0 var(--space-sm) 0"
        >
          <h3 className="LoginFormCardTitle">
            <Trans>Welcome back</Trans>
          </h3>
        </Skeleton>
        <Skeleton loading={isLoading} width={220} height={22}>
          <p className="LoginFormCardSubTitle">
            <Trans>Sign in to enhance your learning</Trans>
          </p>
        </Skeleton>
      </div>
      <form onSubmit={handleFormSubmit} className="LoginForm">
        <FormInputField
          id="email"
          type="email"
          placeholder="student@example.com"
          label={linguiTranslator`Email`}
          loading={isLoading}
        />
        <FormInputField
          id="password"
          type="password"
          placeholder={linguiTranslator`Enter your password`}
          label={linguiTranslator`Password`}
          loading={isLoading}
        />
        <Skeleton loading={isLoading} width="100%" height={40}>
          <Button type="submit">
            <Trans>Sign In</Trans>
          </Button>
        </Skeleton>
      </form>
      <div className="LoginFormCardFooter">
        <Skeleton loading={isLoading} width={220} height={18}>
          <p>
            <Trans>Don't have an account yet?</Trans>
          </p>
          <TextLink to={ROUTE_SIGN_UP} variant="accent">
            <Trans>Sign Up</Trans>
          </TextLink>
        </Skeleton>
      </div>
    </div>
  );
};
