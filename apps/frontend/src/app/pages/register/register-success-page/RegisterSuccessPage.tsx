import { Trans } from "@lingui/react/macro";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { ROUTE_SIGN_UP } from "@/src/app/routes/register/index.tsx";
import { ROUTE_RESEND_VERIFICATION_MAIL } from "@/src/app/routes/resend-verification-mail/index.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./RegisterSuccessPage.css";

export const RegisterSuccessPage = () => {
  const { isLoading } = useI18nContext();

  return (
    <div className="RegisterSuccessPage">
      <div className="RegisterSuccessPageContainer">
        <div className="RegisterSuccessPageIconContainer">
          <EnvelopeClosedIcon />
        </div>
        <h3 className="RegisterSuccessPageTitle">
          <Skeleton loading={isLoading} width={260} height={26}>
            <Trans>Check Your Email</Trans>
          </Skeleton>
        </h3>
        <p className="RegisterSuccessPageText">
          <Skeleton loading={isLoading} width={300} height={20}>
            <Trans>
              We've sent a verification link to your email address. Please click
              the link to verify your account.
            </Trans>
          </Skeleton>
        </p>
        <p className="RegisterSuccessPageSpamHint">
          <Skeleton loading={isLoading} width={330} height={18}>
            <Trans>
              Didn't receive the email? Check your spam folder or try signing up
              again.
            </Trans>
          </Skeleton>
        </p>
        <Skeleton loading={isLoading} width="100%" height={40}>
          <TanstackRouterLink to={ROUTE_SIGN_UP}>
            <Button fullWidth={true} align="center" variant="primary">
              <Trans>Back to Registration</Trans>
            </Button>
          </TanstackRouterLink>
        </Skeleton>
        <Skeleton loading={isLoading} width="100%" height={40}>
          <TanstackRouterLink to={ROUTE_RESEND_VERIFICATION_MAIL}>
            <Button fullWidth={true} align="center" variant="secondary">
              <Trans>Resend verification Email</Trans>
            </Button>
          </TanstackRouterLink>
        </Skeleton>
      </div>
    </div>
  );
};
