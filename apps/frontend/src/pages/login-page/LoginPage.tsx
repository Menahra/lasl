import { LoginForm } from "@/src/components/login-form/LoginForm.tsx";
import "./styles.css";
import { Trans } from "@lingui/react/macro";
import { Link } from "@tanstack/react-router";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";

export const LoginPage = () => {
  return (
    <div className="LoginPage">
      <div className="LoginPageLightDarkModeButtonWrapper">
        <LightDarkModeButton className="LoginPageLightDarkModeButton" />
      </div>
      <main className="LoginPageMain">
        Logo
        <div className="LoginPageProjectTitleWrapper">
          <h1 className="LoginPageProjectTitle">
            <Trans>Project Name</Trans>
          </h1>
          <p>
            <Trans>Subtitle</Trans>
          </p>
        </div>
        <LoginForm />
        <p>
          <Trans>
            By continuing, you agree to our{" "}
            <Link className="LoginPageFooterLink" to="/termsofservice">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link className="LoginPageFooterLink" to="/privacypolicy">
              Privacy Policy
            </Link>
          </Trans>
        </p>
      </main>
    </div>
  );
};

// Logo und Namen überlegen
// Translations einbauen
// Sign up page
// Terms of Service und Privacy Policy Page

// e2e tests:
// login testen mit fehlender mail, falscher mail, fehlendem pw, falschem pw, richtige mail aber falsches pw, richtiges pw aber falsche mail, beides korrekt weiterleitung checken
// checken ob sign up richtig redirected, sign up durch testen mit ähnlichen validierungen
// checken ob terms of service und privacy policy links gehen
