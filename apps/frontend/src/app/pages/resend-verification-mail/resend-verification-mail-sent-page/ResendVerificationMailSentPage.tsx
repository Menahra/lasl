import { Trans, useLingui } from "@lingui/react/macro";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import {
  Link as TanstackRouterLink,
  useRouterState,
} from "@tanstack/react-router";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { ROUTE_RESEND_VERIFICATION_MAIL } from "@/src/app/routes/resend-verification-mail/index.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./ResendVerificationMailSentPage.css";

export const ResendVerificationMailSentPage = () => {
  const { isLoading } = useI18nContext();

  const { location } = useRouterState();
  const { t: linguiTranslator } = useLingui();
  const locationState = location.state as { email?: string } | undefined;
  const userEmail =
    locationState?.email ?? linguiTranslator`your email address`;

  return (
    <div className="ResendVerificationMailSentPage">
      <div className="ResendVerificationMailSentPageContainer">
        <div className="ResendVerificationMailSentPageIconContainer">
          <EnvelopeClosedIcon />
        </div>
        <h3 className="ResendVerificationMailSentPageTitle">
          <Skeleton loading={isLoading} width={260} height={26}>
            <Trans>Check Your Email</Trans>
          </Skeleton>
        </h3>
        <p className="ResendVerificationMailSentPageText">
          <Skeleton loading={isLoading} width={300} height={20}>
            <Trans>
              We've sent a new verification link to {userEmail}. Please click
              the link in the mail to verify your account.
            </Trans>
          </Skeleton>
        </p>
        <p className="ResendVerificationMailSentPageSpamHint">
          <Skeleton loading={isLoading} width={330} height={18}>
            <Trans>
              Didn't receive the email? Check your spam folder or try again.
            </Trans>
          </Skeleton>
        </p>
        <Skeleton loading={isLoading} width="100%" height={40}>
          <TanstackRouterLink to={ROUTE_LOGIN}>
            <Button fullWidth={true} align="center" variant="primary">
              <Trans>Back to Login</Trans>
            </Button>
          </TanstackRouterLink>
        </Skeleton>
        <Skeleton loading={isLoading} width="100%" height={40}>
          <TanstackRouterLink to={ROUTE_RESEND_VERIFICATION_MAIL}>
            <Button fullWidth={true} align="center" variant="secondary">
              <Trans>Send to a different email</Trans>
            </Button>
          </TanstackRouterLink>
        </Skeleton>
      </div>
    </div>
  );
};
