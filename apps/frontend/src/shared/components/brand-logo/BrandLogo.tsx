import { useLingui } from "@lingui/react/macro";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import clsx from "clsx";
import MarqaLogo from "@/assets/icons/marqa_logo.svg?react";
import { ROUTE_HOME } from "@/src/app/routes/index.tsx";
import "./BrandLogo.css";

const BrandLogoVariants = {
  header: "BrandLogo--header",
  footer: "BrandLogo--footer",
  auth: "BrandLogo--auth",
} as const;

type BrandLogoProps = {
  variant: keyof typeof BrandLogoVariants;
};

export const BrandLogo = ({ variant = "auth" }: BrandLogoProps) => {
  const { t: linguiTranslator } = useLingui();
  return (
    <TanstackRouterLink
      to={ROUTE_HOME}
      className={clsx("BrandLogo", BrandLogoVariants[variant])}
      aria-label={linguiTranslator`Go to homepage`}
    >
      <MarqaLogo />
    </TanstackRouterLink>
  );
};
