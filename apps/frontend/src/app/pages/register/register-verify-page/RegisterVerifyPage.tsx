import { Trans } from "@lingui/react/macro";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink, useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import { useEffect } from "react";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { ROUTE_SIGN_UP } from "@/src/app/routes/register/index.tsx";
import { Route } from "@/src/app/routes/register/verify/$id/$verificationCode/index.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useVerifyUser } from "@/src/shared/hooks/api/useVerifyUser.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./RegisterVerifyPage.css";

const statusMap = {
  success: {
    icon: <CheckCircledIcon />,
    title: <Trans>Email Verified!</Trans>,
    message: <Trans>Your email has been successfully verified.</Trans>,
    showRedirectHint: true,
    button: (
      <TanstackRouterLink to={ROUTE_HOME}>
        <Button fullWidth={true} align="center" variant="primary">
          <Trans>Continue to App</Trans>
        </Button>
      </TanstackRouterLink>
    ),
    // biome-ignore lint/security/noSecrets: classname, no secret
    iconContainerClass: "RegisterVerifyPageIconContainerSuccess",
  },
  error: {
    icon: <CrossCircledIcon />,
    title: <Trans>Verification Failed!</Trans>,
    message: (
      <Trans>
        The verification link is invalid or has expired. Please try signing up
        again.
      </Trans>
    ),
    showRedirectHint: false,
    button: (
      <TanstackRouterLink to={ROUTE_SIGN_UP}>
        <Button fullWidth={true} align="center" variant="primary">
          <Trans>Try again</Trans>
        </Button>
      </TanstackRouterLink>
    ),
    // biome-ignore lint/security/noSecrets: classname, no secret
    iconContainerClass: "RegisterVerifyPageIconContainerFailure",
  },
};

export const RegisterVerifyPage = () => {
  const { navigate } = useRouter();
  const { isLoading: isLoadingI18n } = useI18nContext();
  const {
    mutateAsync,
    isPending: isPendingVerification,
    isSuccess,
  } = useVerifyUser();
  const { id, verificationCode } = Route.useParams();

  // why bleibt isPendingVerification auf true??
  const isLoading = isLoadingI18n || isPendingVerification;
  const currentStatus: "success" | "error" = isSuccess ? "success" : "error";

  useEffect(() => {
    mutateAsync({ id, verificationCode });
  }, [mutateAsync, id, verificationCode]);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const threeSeconds = 3000;
    const timeoutId = window.setTimeout(() => {
      navigate({ to: ROUTE_HOME });
    }, threeSeconds);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isSuccess, navigate]);

  return (
    <div className="RegisterVerifyPage">
      <div className="RegisterVerifyPageContainer">
        <div
          className={clsx(
            // biome-ignore lint/security/noSecrets: classname, no secret
            "RegisterVerifyPageIconContainer",
            statusMap[currentStatus].iconContainerClass,
          )}
        >
          <Skeleton loading={isLoading} width={64} height={64}>
            {statusMap[currentStatus].icon}
          </Skeleton>
        </div>

        <h3 className="RegisterVerifyPageTitle">
          <Skeleton loading={isLoading} width={220} height={26}>
            {statusMap[currentStatus].title}
          </Skeleton>
        </h3>

        <p className="RegisterVerifyPageText">
          <Skeleton loading={isLoading} width={300} height={20}>
            {statusMap[currentStatus].message}
          </Skeleton>
        </p>

        {statusMap[currentStatus].showRedirectHint && (
          <p className="RegisterVerifyPageRedirectHint" aria-live="polite">
            <Skeleton loading={isLoading} width={330} height={18}>
              <Trans>Redirecting you to the app in a few seconds...</Trans>
            </Skeleton>
          </p>
        )}

        <Skeleton loading={isLoading} width="100%" height={40}>
          {statusMap[currentStatus].button}
        </Skeleton>
      </div>
    </div>
  );
};
