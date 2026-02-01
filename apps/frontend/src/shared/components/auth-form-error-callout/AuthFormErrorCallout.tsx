import { Plural, Trans } from "@lingui/react/macro";
import { ROUTE_LOGIN } from "@/src/app/routes/_auth/login.tsx";
import type { FormSystemError } from "@/src/shared/authApiErrors.ts";
import { Callout } from "@/src/shared/components/callout/Callout.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";

export type AuthFromErrorCalloutProps = {
  error: FormSystemError;
  retryAfter?: number | undefined;
  onClose: () => void;
};

export const FormErrorCallout = ({
  error,
  retryAfter,
  onClose,
}: AuthFromErrorCalloutProps) => {
  const { isLoading } = useI18nContext();
  if (error === "none") {
    return null;
  }

  return (
    <Skeleton loading={isLoading} width="100%" height={34}>
      <Callout severity="error" variant="outlined" onClose={onClose}>
        {error === "rate-limited" && (
          <Trans>
            Too many attempts. Please wait{" "}
            <Plural value={retryAfter ?? 0} one="# second" other="# seconds" />.
          </Trans>
        )}
        {error === "unverified" && (
          <Trans>Please verify your email first</Trans>
        )}
        {error === "duplicate" && (
          <Trans>
            Email already registered.{" "}
            <TextLink to={ROUTE_LOGIN} variant="primary">
              Sign in
            </TextLink>
          </Trans>
        )}
        {error === "invalid-link" && (
          <Trans>This link is invalid or has expired.</Trans>
        )}
        {error === "unknown" && (
          <Trans>An unexpected error occurred. Please try again.</Trans>
        )}
      </Callout>
    </Skeleton>
  );
};
