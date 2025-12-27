import { Trans } from "@lingui/react/macro";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { ROUTE_SIGN_UP } from "@/src/app/routes/register.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import "./RegisterSuccessPage.css";

export const RegisterSuccessPage = () => {
  return (
    <div className="RegisterSuccessPage">
      <div className="RegisterSuccessPageContainer">
        <div className="RegisterSuccessPageIconContainer">
          <EnvelopeClosedIcon />
        </div>
        <h3 className="RegisterSuccessPageTitle">
          <Trans>Check Your Email</Trans>
        </h3>
        <p className="RegisterSuccessPageText">
          <Trans>
            We've sent a verification link to your email address. Please click
            the link to verify your account.
          </Trans>
        </p>
        <p className="RegisterSuccessPageSpamHint">
          <Trans>
            Didn't receive the email? Check your spam folder or try signing up
            again.
          </Trans>
        </p>
        <TanstackRouterLink to={ROUTE_SIGN_UP}>
          <Button fullWidth={true} align="center" variant="primary">
            <Trans>Back to Login</Trans>
          </Button>
        </TanstackRouterLink>
      </div>
    </div>
  );
};
