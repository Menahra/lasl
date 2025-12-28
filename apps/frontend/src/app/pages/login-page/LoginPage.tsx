import { Trans } from "@lingui/react/macro";
import { LoginForm } from "@/src/app/pages/login-page/LoginForm.tsx";
import { ROUTE_PRIVACY_POLICY } from "@/src/app/routes/privacy.tsx";
import { ROUTE_TERMS_OF_SERVICE } from "@/src/app/routes/terms.tsx";
import { BrandLogo } from "@/src/shared/components/brand-logo/BrandLogo.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./LoginPage.css";

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
          <BrandLogo variant="auth" />
          <h1 className="LoginPageProjectTitle">{PROJECT_INFORMATION.name}</h1>
          <p>{PROJECT_INFORMATION.subtitle}</p>
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
              <TextLink to={ROUTE_PRIVACY_POLICY} variant="primary">
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
