import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateSessionSchemaType,
  createSessionSchema,
} from "@lasl/app-contracts/schemas/session";
import { Trans, useLingui } from "@lingui/react/macro";
import { useRouter } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import { ROUTE_SIGN_UP } from "@/src/app/routes/register.tsx";
import { Button } from "@/src/shared/components/button/Button.tsx";
import { Callout } from "@/src/shared/components/callout/Callout.tsx";
import { FormInputField } from "@/src/shared/components/form-input-field/FormInputField.tsx";
import { Skeleton } from "@/src/shared/components/skeleton/Skeleton.tsx";
import { TextLink } from "@/src/shared/components/text-link/TextLink.tsx";
import { userErrorMessages } from "@/src/shared/formErrors.ts";
import { usePostLogin } from "@/src/shared/hooks/api/useAuthentication.ts";
import { useI18nContext } from "@/src/shared/hooks/useI18nContext.tsx";
import { useTranslateFormFieldError } from "@/src/shared/hooks/useTranslateFormFieldError.ts";
import "./LoginForm.css";

type LoginError = "none" | "unverified" | "unknown";

// biome-ignore lint/complexity/noExcessiveLinesPerFunction: ok here
export const LoginForm = () => {
  const [signInError, setSignInError] = useState<LoginError>("none");
  const { isLoading } = useI18nContext();
  const { t: linguiTranslator } = useLingui();
  const { navigate } = useRouter();
  const createSessionMutation = usePostLogin();
  const onSubmit = async (data: CreateSessionSchemaType) => {
    setSignInError("none");

    try {
      await createSessionMutation.mutateAsync(data);
      navigate({ to: ROUTE_HOME });
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === StatusCodes.CONFLICT
      ) {
        setSignInError("unverified");
      } else {
        setSignInError("unknown");
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSessionSchemaType>({
    resolver: zodResolver(createSessionSchema),
    mode: "onSubmit",
  });
  const translateFormFieldError = useTranslateFormFieldError(userErrorMessages);

  return (
    <div className="LoginFormCardWrapper">
      <div className="LoginFormCardHeader">
        <Skeleton
          loading={isLoading}
          width={180}
          height={35}
          margin="0 0 var(--space-sm) 0"
        >
          <h3 className="LoginFormCardTitle">
            <Trans>Welcome back</Trans>
          </h3>
        </Skeleton>
        <Skeleton loading={isLoading} width={220} height={22}>
          <p className="LoginFormCardSubTitle">
            <Trans>Sign in to enhance your learning</Trans>
          </p>
        </Skeleton>
      </div>
      {signInError !== "none" ? (
        <Skeleton loading={isLoading} width="100%" height={34}>
          <Callout
            severity="error"
            variant="outlined"
            onClose={() => setSignInError("none")}
          >
            {signInError === "unverified" ? (
              <Trans>Please verify your email first</Trans>
            ) : (
              <Trans>Invalid Email or password. Please try again</Trans>
            )}
          </Callout>
        </Skeleton>
      ) : undefined}
      <form onSubmit={handleSubmit(onSubmit)} className="LoginForm">
        <FormInputField
          {...register("email")}
          id="email"
          type="email"
          placeholder={linguiTranslator`student@example.com`}
          label={linguiTranslator`Email`}
          loading={isLoading}
          error={translateFormFieldError(errors.email)}
        />
        <FormInputField
          {...register("password")}
          id="password"
          type="password"
          placeholder={linguiTranslator`Enter your password`}
          label={linguiTranslator`Password`}
          loading={isLoading}
          error={translateFormFieldError(errors.password)}
        />
        <Skeleton loading={isLoading} width="100%" height={40}>
          <Button
            type="submit"
            align="center"
            loading={createSessionMutation.isPending}
          >
            <Trans>Sign In</Trans>
          </Button>
        </Skeleton>
      </form>
      <div className="LoginFormCardFooter">
        <Skeleton loading={isLoading} width={220} height={18}>
          <p>
            <Trans>Don't have an account yet?</Trans>
          </p>
          <TextLink to={ROUTE_SIGN_UP} variant="accent">
            <Trans>Sign Up</Trans>
          </TextLink>
        </Skeleton>
      </div>
    </div>
  );
};
