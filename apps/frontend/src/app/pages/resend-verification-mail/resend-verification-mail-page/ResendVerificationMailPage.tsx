import { Trans } from "@lingui/react/macro";
import { ArrowLeftIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./ResendVerificationMailPage.css";
import { ResendVerificationMailForm } from "@/src/app/pages/resend-verification-mail/resend-verification-mail-page/ResendVerificationMailForm.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";

export const ResendVerificationMailPage = () => {
  const { isLoading } = useI18nContext();

  return (
    <div className="ResendVerificationMailPage">
      <div className="ResendVerificationMailPageContainer">
        <div className="ResendVerificationMailPageIconContainer">
          <EnvelopeClosedIcon />
        </div>
        <h3 className="ResendVerificationMailPageTitle">
          <Skeleton loading={isLoading} width={260} height={26}>
            <Trans>Resend Verification Email</Trans>
          </Skeleton>
        </h3>
        <p className="ResendVerificationMailPageText">
          <Skeleton loading={isLoading} width={300} height={20}>
            <Trans>
              Enter your email address and we'll send you a new verification
              link.
            </Trans>
          </Skeleton>
        </p>
        <ResendVerificationMailForm />
        <Skeleton loading={isLoading} width="100%" height={40}>
          <TanstackRouterLink to={ROUTE_LOGIN}>
            <Button
              fullWidth={true}
              align="center"
              variant="secondary"
              startIcon={<ArrowLeftIcon />}
            >
              <Trans>Back to Login</Trans>
            </Button>
          </TanstackRouterLink>
        </Skeleton>
      </div>
    </div>
  );
};
