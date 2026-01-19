import { Trans } from "@lingui/react/macro";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import {
  Link as TanstackRouterLink,
  useNavigate,
} from "@tanstack/react-router";
import { ROUTE_LOGIN } from "@/src/app/routes/_auth/login.tsx";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import {
  Button,
  type ButtonProps,
} from "@/src/shared/components/button/Button.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { usePostLogout } from "@/src/shared/hooks/api/useAuthentication.ts";
import { useAuthenticationContext } from "@/src/shared/hooks/useAuthenticationContext.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import "./AuthButton.css";

type AuthButtonProps = Omit<ButtonProps, "variant" | "startIcon" | "endIcon">;

export const AuthButton = (props: AuthButtonProps) => {
  const { user } = useAuthenticationContext();
  const { isLoading } = useI18nContext();
  const navigate = useNavigate();
  const { isPending, mutateAsync } = usePostLogout();

  const onLogoutClick = async () => {
    try {
      await mutateAsync();
      navigate({ to: ROUTE_HOME });
    } catch (_error) {
      console.error("An error occured during logout");
    }
  };

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
      <span className="AuthButton">
        <Button
          {...props}
          startIcon={<ExitIcon />}
          variant="text"
          loading={isPending}
          onClick={onLogoutClick}
        >
          <Trans>Logout</Trans>
        </Button>
      </span>
    </Skeleton>
  );
};
