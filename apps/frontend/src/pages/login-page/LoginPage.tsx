import { Trans } from "@lingui/react/macro";
import MarqaLogo from "@/assets/icons/marqa_logo.svg?react";
import { LoginForm } from "@/src/components/login-form/LoginForm.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/routes/terms.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { PROJECT_NAME, PROJECT_SUBTITLE } from "@/src/shared/constants.ts";
import "./styles.css";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";

export const LoginPage = () => {
  const { isLoading } = useI18nContext();

  return (
    <div className="LoginPage">
      <div className="LoginPageHeaderOptionsWrapper">
        <Skeleton loading={isLoading} width={180} height={30}>
          <LanguageSelect />
        </Skeleton>
        <Skeleton loading={isLoading} width={30} height={30}>
          <LightDarkModeButton />
        </Skeleton>
      </div>
      <main className="LoginPageMain">
        <div className="LoginPageProjectLogoTitleWrapper">
          <MarqaLogo className="LoginPageLogo" />
          <h1 className="LoginPageProjectTitle">{PROJECT_NAME}</h1>
          <p>{PROJECT_SUBTITLE}</p>
        </div>
        <LoginForm />
        <Skeleton loading={isLoading} width={480} height={18}>
          <p>
            <Trans>
              By continuing, you agree to our{" "}
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
      </main>
    </div>
  );
};

// Sign up page
// Terms of Service und Privacy Policy Page
// Landing page

// e2e tests:
// login testen mit fehlender mail, falscher mail, fehlendem pw, falschem pw, richtige mail aber falsches pw, richtiges pw aber falsche mail, beides korrekt weiterleitung checken
// checken ob sign up richtig redirected, sign up durch testen mit ähnlichen validierungen
// checken ob terms of service und privacy policy links gehen und back navigation etc
