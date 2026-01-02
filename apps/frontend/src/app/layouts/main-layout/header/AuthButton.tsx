import { Trans } from "@lingui/react/macro";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import {
  Button,
  type ButtonProps,
} from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./AuthButton.css";

type AuthButtonProps = Omit<ButtonProps, "variant" | "startIcon" | "endIcon">;

export const AuthButton = (props: AuthButtonProps) => {
  const { user } = useAuthenticationContext();
  const { isLoading } = useI18nContext();

  if (!user) {
    return (
      <Skeleton loading={isLoading} width={90} height={38}>
        <TanstackRouterLink to={ROUTE_LOGIN} className="AuthButton">
          <Button {...props} startIcon={<EnterIcon />} variant="text">
            <Trans>Login</Trans>
          </Button>
        </TanstackRouterLink>
      </Skeleton>
    );
  }

  return (
    <Skeleton loading={isLoading} width={90} height={38}>
      <TanstackRouterLink to={ROUTE_HOME} className="AuthButton">
        <Button {...props} startIcon={<ExitIcon />} variant="text">
          <Trans>Logout</Trans>
        </Button>
      </TanstackRouterLink>
    </Skeleton>
  );
};
