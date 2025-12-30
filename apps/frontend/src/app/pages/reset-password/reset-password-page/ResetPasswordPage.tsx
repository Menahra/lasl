import { ResetPasswordForm } from "@/src/app/pages/reset-password/reset-password-page/ResetPasswordForm.tsx";
import { BrandLogo } from "@/src/shared/components/brand-logo/BrandLogo.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { PROJECT_INFORMATION } from "@/src/shared/constants.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./ResetPasswordPage.css";

export const ResetPasswordPage = () => {
  const { isLoading } = useI18nContext();

  return (
    <div className="ResetPasswordPage">
      <div className="ResetPasswordPageHeaderOptionsWrapper">
        <Skeleton loading={isLoading} width={180} height={30}>
          <LanguageSelect />
        </Skeleton>
        <Skeleton loading={isLoading} width={30} height={30}>
          <LightDarkModeButton />
        </Skeleton>
      </div>
      <main className="ResetPasswordPageMain">
        <div className="ResetPasswordPageProjectLogoTitleWrapper">
          <BrandLogo variant="auth" />
          <h1 className="ResetPasswordPageProjectTitle">
            {PROJECT_INFORMATION.name}
          </h1>
          <p>{PROJECT_INFORMATION.subtitle}</p>
        </div>
        <ResetPasswordForm />
      </main>
    </div>
  );
};
