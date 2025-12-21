import { Trans } from "@lingui/react/macro";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { ROUTE_LOGIN } from "@/src/app/routes/login.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";
import "./AuthButton.css";

export const AuthButton = () => {
  const { user } = useAuthenticationContext();

  if (!user) {
    return (
      <TanstackRouterLink to={ROUTE_LOGIN} className="AuthButton">
        <Button startIcon={<EnterIcon />} variant="text">
          <Trans>Login</Trans>
        </Button>
      </TanstackRouterLink>
    );
  }

  return (
    <TanstackRouterLink to={ROUTE_HOME} className="AuthButton">
      <Button startIcon={<ExitIcon />} variant="text">
        <Trans>Logout</Trans>
      </Button>
    </TanstackRouterLink>
  );
};
