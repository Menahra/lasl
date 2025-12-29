import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowLeftIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import {
  Link as TanstackRouterLink,
  useRouterState,
} from "@tanstack/react-router";
import { ROUTE_FORGOT_PASSWORD } from "@/src/app/routes/forgot-password/index.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { LanguageSelect } from "@/src/shared/components/language-select/LanguageSelect.tsx";
import { LightDarkModeButton } from "@/src/shared/components/light-dark-mode-button/LightDarkModeButton.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./ForgotPasswordSentPage.css";

export const ForgotPasswordSentPage = () => {
  const { isLoading } = useI18nContext();
  const { location } = useRouterState();
  const { t: linguiTranslator } = useLingui();
  const locationState = location.state as { email?: string } | undefined;
  const userEmail = locationState?.email ?? linguiTranslator`your email`;

  return (
    <div className="ForgotPasswordSentPage">
      <div className="ForgotPasswordSentPageHeaderOptionsWrapper">
        <Skeleton loading={isLoading} width={180} height={30}>
          <LanguageSelect />
        </Skeleton>
        <Skeleton loading={isLoading} width={30} height={30}>
          <LightDarkModeButton />
        </Skeleton>
      </div>
      <main className="ForgotPasswordSentPageMain">
        <div className="ForgotPasswordSentPageLogoTitleWrapper">
          <div className="ForgotPasswordSentPageLogo">
            <EnvelopeClosedIcon />
          </div>
          <h1 className="ForgotPasswordSentPageTitle">
            <Trans>Check your email</Trans>
          </h1>
          <p className="ForgotPasswordSentPageDescription">
            <Trans>
              If an account exists for {userEmail}, we have sent password reset
              instructions.
            </Trans>
          </p>
        </div>
        <div className="ForgotPasswordSentPageCard">
          <p className="ForgotPasswordSentPageSpamHint">
            <Trans>
              Didn't receive the email? Check your spam folder or try again with
              a different email address.
            </Trans>
          </p>
          <div className="ForgotPasswordSentPageButtons">
            <TanstackRouterLink to={ROUTE_FORGOT_PASSWORD}>
              <Button fullWidth={true} variant="secondary" align="center">
                <Trans>Try another email</Trans>
              </Button>
            </TanstackRouterLink>
            <TanstackRouterLink to={ROUTE_LOGIN}>
              <Button
                fullWidth={true}
                variant="text"
                align="center"
                startIcon={<ArrowLeftIcon />}
              >
                <Trans>Back to sign in</Trans>
              </Button>
            </TanstackRouterLink>
          </div>
        </div>
      </main>
    </div>
  );
};
