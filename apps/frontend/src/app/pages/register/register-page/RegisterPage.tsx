import { Trans } from "@lingui/react/macro";
import { RegisterForm } from "@/src/app/pages/register/register-page/RegisterForm.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { BrandLogo } from "@/src/shared/components/brand-logo/BrandLogo.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./RegisterPage.css";

export const RegisterPage = () => {
  const { isLoading } = useI18nContext();
  return (
    <div className="RegisterPage">
      <div className="RegisterPageHeaderOptionsWrapper">
        <Skeleton loading={isLoading} height={30} width={180}>
          <LanguageSelect />
        </Skeleton>
        <Skeleton loading={isLoading} height={30} width={30}>
          <LightDarkModeButton />
        </Skeleton>
      </div>
      <main className="RegisterPageMain">
        <BrandLogo variant="auth" />
        <div className="RegisterPageProjectTitleWrapper">
          <h1 className="RegisterPageProjectTitle">
            {PROJECT_INFORMATION.name}
          </h1>
          <Skeleton loading={isLoading} height={22} width={120}>
            <p>
              <Trans>Create your Account</Trans>
            </p>
          </Skeleton>
        </div>
        <RegisterForm />
        <Skeleton loading={isLoading} height={15} width="100%">
          <p className="RegisterPageFooter">
            <Trans>
              Already have an Account?{" "}
              <TextLink to={ROUTE_LOGIN} variant="primary">
                <Trans>Sign In</Trans>
              </TextLink>
            </Trans>
          </p>
        </Skeleton>
      </main>
    </div>
  );
};
