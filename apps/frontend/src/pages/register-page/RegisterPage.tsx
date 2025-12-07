import { Trans } from "@lingui/react/macro";
import MarqaLogo from "@/assets/icons/marqa_logo.svg?react";
import { RegisterForm } from "@/src/components/register-form/RegisterForm.tsx";
import { ROUTE_LOGIN } from "@/src/routes/login.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { PROJECT_NAME } from "@/src/shared/constants.ts";
import "./styles.css";

export const RegisterPage = () => {
  return (
    <div className="RegisterPage">
      <div className="RegisterPageHeaderOptionsWrapper">
        <LanguageSelect />
        <LightDarkModeButton />
      </div>
      <main className="RegisterPageMain">
        <MarqaLogo className="RegisterPageLogo" />
        <div className="RegisterPageProjectTitleWrapper">
          <h1 className="RegisterPageProjectTitle">{PROJECT_NAME}</h1>
          <p>
            <Trans>Create your Account</Trans>
          </p>
        </div>
        <RegisterForm />
        <p className="RegisterPageFooter">
          <Trans>
            Already have an Account?{" "}
            <TextLink to={ROUTE_LOGIN} variant="primary">
              <Trans>Sign In</Trans>
            </TextLink>
          </Trans>
        </p>
      </main>
    </div>
  );
};
