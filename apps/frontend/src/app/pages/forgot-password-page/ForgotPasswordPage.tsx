import { ForgotPasswordForm } from "@/src/app/pages/forgot-password-page/ForgotPasswordForm.tsx";
import { BrandLogo } from "@/src/shared/components/brand-logo/BrandLogo.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./ForgotPasswordPage.css";

export const ForgotPasswordPage = () => {
  const { isLoading } = useI18nContext();

  return (
    <div className="ForgotPasswordPage">
      <div className="ForgotPasswordPageHeaderOptionsWrapper">
        <Skeleton loading={isLoading} width={180} height={30}>
          <LanguageSelect />
        </Skeleton>
        <Skeleton loading={isLoading} width={30} height={30}>
          <LightDarkModeButton />
        </Skeleton>
      </div>
      <main className="ForgotPasswordPageMain">
        <div className="ForgotPasswordPageProjectLogoTitleWrapper">
          <BrandLogo variant="auth" />
          <h1 className="ForgotPasswordPageProjectTitle">
            {PROJECT_INFORMATION.name}
          </h1>
          <p>{PROJECT_INFORMATION.subtitle}</p>
        </div>
        <ForgotPasswordForm />
      </main>
    </div>
  );
};
