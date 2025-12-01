import type { LinkComponentProps as TanstackRouterLinkComponentProps } from "@tanstack/react-router";
import { Link as TanstackRouterLink } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import "./styles.css";

const TextLinkVariants = {
  primary: "TextLink--primay",
  accent: "TextLink--accent",
};

type TextLinkProps = PropsWithChildren & {
  variant: keyof typeof TextLinkVariants;
} & Pick<TanstackRouterLinkComponentProps, "to">;

export const TextLink = ({ variant, to, children }: TextLinkProps) => {
  return (
    <TanstackRouterLink
      className={`TextLink ${TextLinkVariants[variant]}`}
      to={to}
    >
      {children}
    </TanstackRouterLink>
  );
};
