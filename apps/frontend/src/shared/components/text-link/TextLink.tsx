import type { LinkComponentProps as TanstackRouterLinkComponentProps } from "@tanstack/react-router";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import "./TextLink.css";

const TextLinkVariants = {
  primary: "TextLink--primary",
  accent: "TextLink--accent",
};

type TextLinkProps = PropsWithChildren & {
  className?: string;
  variant: keyof typeof TextLinkVariants;
} & Pick<TanstackRouterLinkComponentProps, "to">;

export const TextLink = ({
  className,
  variant,
  to,
  children,
}: TextLinkProps) => {
  return (
    <TanstackRouterLink
      className={clsx("TextLink", TextLinkVariants[variant], className)}
      to={to}
    >
      {children}
    </TanstackRouterLink>
  );
};
