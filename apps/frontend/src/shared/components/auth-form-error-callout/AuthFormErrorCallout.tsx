import { Plural, Trans } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { ROUTE_LOGIN } from "@/src/app/routes/_auth/login.tsx";
import type { AuthFormSystemError } from "@/src/shared/authApiErrors.ts";
import { Callout } from "@/src/shared/components/callout/Callout.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";

export type AuthFromErrorCalloutProps = {
  error: AuthFormSystemError;
  retryAfter?: number | undefined;
  onClose: () => void;
  overrideMessages?: Partial<Record<AuthFormSystemError, ReactNode>>;
};

export const AuthFormErrorCallout = ({
  error,
  retryAfter,
  onClose,
  overrideMessages,
}: AuthFromErrorCalloutProps) => {
  const { isLoading } = useI18nContext();
  if (error === "none") {
    return null;
  }

  const defaultMessages: Record<AuthFormSystemError, React.ReactNode> = {
    none: null,
    "rate-limited": (
      <Trans>
        Too many attempts. Please wait{" "}
        <Plural value={retryAfter ?? 0} one="# second" other="# seconds" />.
      </Trans>
    ),
    unverified: <Trans>Please verify your email first</Trans>,
    duplicate: (
      <Trans>
        This email is already registered.{" "}
        <TextLink to={ROUTE_LOGIN} variant="primary">
          Sign in instead
        </TextLink>
      </Trans>
    ),
    "invalid-link": <Trans>This link is invalid or has expired.</Trans>,
    forbidden: <Trans>You do not have permission to access this.</Trans>,
    unknown: <Trans>An unexpected error occurred. Please try again.</Trans>,
  };

  const messageContent = overrideMessages?.[error] ?? defaultMessages[error];

  return (
    <Skeleton loading={isLoading} width="100%" height={34}>
      <Callout severity="error" variant="outlined" onClose={onClose}>
        {messageContent}
      </Callout>
    </Skeleton>
  );
};
