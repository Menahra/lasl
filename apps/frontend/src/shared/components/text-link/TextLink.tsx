import type { LinkComponentProps as TanstackRouterLinkComponentProps } from "@tanstack/react-router";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import "./TextLink.css";
import clsx from "clsx";

const TextLinkVariants = {
  primary: "TextLink--primay",
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
