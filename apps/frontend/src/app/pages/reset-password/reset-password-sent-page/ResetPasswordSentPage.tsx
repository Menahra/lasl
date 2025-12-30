import { Trans } from "@lingui/react/macro";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./ResetPasswordSentPage.css";

export const ResetPasswordSentPage = () => {
  const { isLoading } = useI18nContext();

  return (
    <div className="ResetPasswordSentPage">
      <div className="ResetPasswordSentPageHeaderOptionsWrapper">
        <Skeleton loading={isLoading} width={180} height={30}>
          <LanguageSelect />
        </Skeleton>
        <Skeleton loading={isLoading} width={30} height={30}>
          <LightDarkModeButton />
        </Skeleton>
      </div>
      <main className="ResetPasswordSentPageMain">
        <div className="ResetPasswordSentPageLogoTitleWrapper">
          <div className="ResetPasswordSentPageLogo">
            <CheckCircledIcon />
          </div>
          <h1 className="ResetPasswordSentPageTitle">
            <Skeleton loading={isLoading} width={180} height={40}>
              <Trans>Password reset!</Trans>
            </Skeleton>
          </h1>
          <Skeleton loading={isLoading} width="100%" height={20}>
            <p className="ResetPasswordSentPageDescription">
              <Trans>Your password has been successfully updated.</Trans>
            </p>
          </Skeleton>
        </div>
        <div className="ResetPasswordSentPageCard">
          <Skeleton loading={isLoading} width={200} height={32}>
            <TanstackRouterLink to={ROUTE_LOGIN}>
              <Button fullWidth={true} variant="primary" align="center">
                <Trans>Sign in with new password</Trans>
              </Button>
            </TanstackRouterLink>
          </Skeleton>
        </div>
      </main>
    </div>
  );
};
