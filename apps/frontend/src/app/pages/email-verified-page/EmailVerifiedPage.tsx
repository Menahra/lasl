import { Trans } from "@lingui/react/macro";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./EmailVerifiedPage.css";

export const EmailVerifiedPage = () => {
  const { navigate } = useRouter();
  const { isLoading } = useI18nContext();

  useEffect(() => {
    const autoRedirectTimer = 7000;
    const timer = setTimeout(() => {
      navigate({ to: ROUTE_HOME });
    }, autoRedirectTimer);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="EmailVerifiedPage">
      <div className="EmailVerifiedPageContainer">
        <div className="EmailVerifiedPageIconContainer">
          <CheckCircledIcon />
        </div>
        <h3 className="EmailVerifiedPageTitle">
          <Skeleton loading={isLoading} width={220} height={26}>
            <Trans>Email Verified!</Trans>
          </Skeleton>
        </h3>
        <p className="EmailVerifiedPageText">
          <Skeleton loading={isLoading} width={300} height={20}>
            <Trans>Your email has been successfully verified.</Trans>
          </Skeleton>
        </p>
        <p className="EmailVerifiedPageRedirectHint">
          <Skeleton loading={isLoading} width={330} height={18}>
            <Trans>Redirecting you to the app in a few seconds...</Trans>
          </Skeleton>
        </p>
        <Skeleton loading={isLoading} width="100%" height={40}>
          <TanstackRouterLink to={ROUTE_HOME}>
            <Button fullWidth={true} align="center" variant="primary">
              <Trans>Continue to App</Trans>
            </Button>
          </TanstackRouterLink>
        </Skeleton>
      </div>
    </div>
  );
};
